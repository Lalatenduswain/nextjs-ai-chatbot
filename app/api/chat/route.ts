import { StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { createOpenAIConfig } from '@/lib/ai-gateway';

// Disable static optimization to ensure this runs on every request
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Chat API Route
 * Uses Vercel AI SDK with Cloudflare AI Gateway for cost optimization
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', {
        status: 400,
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'OpenAI API key not configured',
          message: 'Please add OPENAI_API_KEY to your environment variables',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize OpenAI with Cloudflare AI Gateway
    const config = createOpenAIConfig();
    const openai = new OpenAI(config);

    console.log('🚀 Using Cloudflare AI Gateway:', config.baseURL);

    // Create chat completion with streaming
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    console.log('🔄 Stream started');

    // Create a ReadableStream from the OpenAI response
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
          console.log('📊 Check analytics:', 'https://dash.cloudflare.com/fe867c47829b4a3be82e1ad1401e724f/ai/ai-gateway/main-ai-gateway');
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    // Return the streaming response
    return new StreamingTextResponse(stream, {
      headers: {
        'X-AI-Gateway': 'Cloudflare',
        'X-Gateway-Name': 'main-ai-gateway',
      },
    });
  } catch (error: any) {
    console.error('❌ Chat API Error:', error);

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
