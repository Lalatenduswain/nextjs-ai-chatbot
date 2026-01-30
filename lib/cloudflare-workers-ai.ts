// Cloudflare Workers AI Configuration
export const WORKERS_AI_CONFIG = {
  accountId: 'fe867c47829b4a3be82e1ad1401e724f',
  apiEndpoint: 'https://api.cloudflare.com/client/v4/accounts',
} as const;

/**
 * Available Cloudflare Workers AI Models
 */
export const WORKERS_AI_MODELS = {
  // Text Generation Models
  LLAMA_2_7B: '@cf/meta/llama-2-7b-chat-int8',
  LLAMA_2_13B: '@cf/meta/llama-2-13b-chat-awq',
  MISTRAL_7B: '@cf/mistral/mistral-7b-instruct-v0.1',
  CODELLAMA_7B: '@cf/meta/codellama-7b-instruct-awq',
  GEMMA_7B: '@hf/google/gemma-7b-it',

  // Recommended for chat
  DEFAULT: '@cf/meta/llama-2-7b-chat-int8',
} as const;

/**
 * Get Cloudflare Workers AI endpoint
 */
export function getWorkersAIEndpoint(model: string = WORKERS_AI_MODELS.DEFAULT): string {
  const { apiEndpoint, accountId } = WORKERS_AI_CONFIG;
  return `${apiEndpoint}/${accountId}/ai/run/${model}`;
}

/**
 * Create Workers AI configuration
 */
export function createWorkersAIConfig() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!apiToken) {
    throw new Error('CLOUDFLARE_API_TOKEN is not set in environment variables');
  }

  return {
    apiToken,
    accountId: WORKERS_AI_CONFIG.accountId,
  };
}

/**
 * Call Cloudflare Workers AI
 */
export async function callWorkersAI(
  messages: Array<{ role: string; content: string }>,
  model: string = WORKERS_AI_MODELS.DEFAULT
): Promise<Response> {
  const config = createWorkersAIConfig();
  const endpoint = getWorkersAIEndpoint(model);

  console.log('🤖 Using Cloudflare Workers AI:', model);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Workers AI request failed: ${error}`);
  }

  return response;
}

/**
 * Format messages for Workers AI
 */
export function formatMessagesForWorkersAI(
  messages: Array<{ role: string; content: string }>
): Array<{ role: string; content: string }> {
  // Workers AI expects messages in the same format
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

/**
 * Stream Workers AI response
 */
export async function streamWorkersAI(
  messages: Array<{ role: string; content: string }>,
  model: string = WORKERS_AI_MODELS.DEFAULT
): Promise<ReadableStream> {
  const response = await callWorkersAI(messages, model);

  // Create a transform stream to parse SSE format
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        controller.close();
        return;
      }

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log('✅ Workers AI stream completed');
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                continue;
              }

              try {
                const json = JSON.parse(data);
                const content = json.response || '';

                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error) {
        console.error('Workers AI stream error:', error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}
