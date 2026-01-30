import { StreamingTextResponse } from 'ai';
import { streamWorkersAI, WORKERS_AI_MODELS } from '@/lib/cloudflare-workers-ai';

// Use edge runtime for optimal performance
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Chat API Route using Cloudflare Workers AI
 * Free tier: 10,000 neurons per day
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', {
        status: 400,
      });
    }

    // Check if Cloudflare API token is configured
    if (!process.env.CLOUDFLARE_API_TOKEN) {
      return new Response(
        JSON.stringify({
          error: 'Cloudflare API token not configured',
          message: 'Please add CLOUDFLARE_API_TOKEN to your environment variables',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get model from environment or use default
    const model = process.env.WORKERS_AI_MODEL || WORKERS_AI_MODELS.DEFAULT;

    console.log('🤖 Using Cloudflare Workers AI:', model);
    console.log('📊 Free tier: 10,000 neurons/day');

    // Stream response from Workers AI
    const stream = await streamWorkersAI(messages, model);

    // Return the streaming response
    return new StreamingTextResponse(stream, {
      headers: {
        'X-AI-Provider': 'Cloudflare-Workers-AI',
        'X-AI-Model': model,
        'X-AI-Gateway': 'Cloudflare',
      },
    });
  } catch (error: any) {
    console.error('❌ Workers AI Error:', error);

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
