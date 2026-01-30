// Cloudflare AI Gateway Configuration
export const AI_GATEWAY_CONFIG = {
  accountId: 'fe867c47829b4a3be82e1ad1401e724f',
  gatewayName: 'main-ai-gateway',
  baseUrl: 'https://gateway.ai.cloudflare.com/v1',
} as const;

/**
 * Get the Cloudflare AI Gateway URL for a specific provider
 * @param provider - The AI provider (openai, anthropic, huggingface, etc.)
 * @param endpoint - The API endpoint path
 * @returns The complete AI Gateway URL
 */
export function getAIGatewayUrl(provider: string, endpoint: string = ''): string {
  const { baseUrl, accountId, gatewayName } = AI_GATEWAY_CONFIG;
  const path = endpoint ? `/${endpoint}` : '';
  return `${baseUrl}/${accountId}/${gatewayName}/${provider}${path}`;
}

/**
 * Create OpenAI configuration with AI Gateway
 */
export function createOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  return {
    apiKey,
    baseURL: getAIGatewayUrl('openai', 'v1'),
  };
}

/**
 * Create Anthropic configuration with AI Gateway
 */
export function createAnthropicConfig() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
  }

  return {
    apiKey,
    baseURL: getAIGatewayUrl('anthropic'),
  };
}

/**
 * Gateway analytics and monitoring
 */
export const GATEWAY_ANALYTICS_URL = `https://dash.cloudflare.com/${AI_GATEWAY_CONFIG.accountId}/ai/ai-gateway/${AI_GATEWAY_CONFIG.gatewayName}`;

export interface GatewayMetrics {
  requestCount: number;
  cacheHits: number;
  averageLatency: number;
  costSavings: number;
}

/**
 * Log gateway usage (for client-side tracking)
 */
export function logGatewayUsage(metrics: Partial<GatewayMetrics>) {
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 AI Gateway Metrics:', {
      ...metrics,
      analyticsUrl: GATEWAY_ANALYTICS_URL,
    });
  }
}
