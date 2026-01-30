import { StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { createOpenAIConfig } from '@/lib/ai-gateway';
import { streamWorkersAI, WORKERS_AI_MODELS } from '@/lib/cloudflare-workers-ai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type AIProvider = 'openai' | 'workers-ai';

/**
 * Hybrid Chat API Route
 * Supports both OpenAI (via AI Gateway) and Cloudflare Workers AI
 * Provider can be specified in request or environment variable
 */
export async function POST(req: Request) {
  try {
    const { messages, provider: requestProvider } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', {
        status: 400,
      });
    }

    // Determine which provider to use
    const provider: AIProvider =
      requestProvider ||
      (process.env.AI_PROVIDER as AIProvider) ||
      'workers-ai'; // Default to Workers AI (free!)

    console.log(`🤖 Using AI Provider: ${provider}`);

    // Route to appropriate provider
    if (provider === 'workers-ai') {
      return await handleWorkersAI(messages);
    } else {
      return await handleOpenAI(messages);
    }
  } catch (error: any) {
    console.error('❌ Hybrid API Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Handle request using Cloudflare Workers AI
 */
async function handleWorkersAI(messages: any[]) {
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    return new Response(
      JSON.stringify({
        error: 'Cloudflare API token not configured',
        message: 'Please add CLOUDFLARE_API_TOKEN to environment variables',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const model = process.env.WORKERS_AI_MODEL || WORKERS_AI_MODELS.DEFAULT;
  console.log('🚀 Using Cloudflare Workers AI:', model);
  console.log('💰 Cost: FREE (10,000 neurons/day)');

  const stream = await streamWorkersAI(messages, model);

  return new StreamingTextResponse(stream, {
    headers: {
      'X-AI-Provider': 'Cloudflare-Workers-AI',
      'X-AI-Model': model,
      'X-Cost': 'FREE',
    },
  });
}

/**
 * Handle request using OpenAI via AI Gateway
 */
async function handleOpenAI(messages: any[]) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'OpenAI API key not configured',
        message: 'Please add OPENAI_API_KEY to environment variables',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const config = createOpenAIConfig();
  const openai = new OpenAI(config);

  console.log('🚀 Using OpenAI via AI Gateway:', config.baseURL);
  console.log('💰 Cost: Optimized via caching');

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    messages: messages,
    temperature: 0.7,
    max_tokens: 500,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        console.log('✅ Stream completed');
      } catch (error) {
        console.error('Stream error:', error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new StreamingTextResponse(stream, {
    headers: {
      'X-AI-Provider': 'OpenAI',
      'X-AI-Gateway': 'Cloudflare',
      'X-Gateway-Name': 'main-ai-gateway',
    },
  });
}
