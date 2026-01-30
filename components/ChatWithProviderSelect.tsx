'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';

type AIProvider = 'openai' | 'workers-ai' | 'hybrid';

export default function ChatWithProviderSelect() {
  const [provider, setProvider] = useState<AIProvider>('workers-ai');
  const [apiEndpoint, setApiEndpoint] = useState('/api/chat-workers');

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: apiEndpoint,
    body: {
      provider: provider === 'hybrid' ? 'workers-ai' : undefined,
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [requestCount, setRequestCount] = useState(0);

  // Update API endpoint when provider changes
  useEffect(() => {
    if (provider === 'openai') {
      setApiEndpoint('/api/chat');
    } else if (provider === 'workers-ai') {
      setApiEndpoint('/api/chat-workers');
    } else {
      setApiEndpoint('/api/chat-hybrid');
    }
  }, [provider]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track request count
  useEffect(() => {
    if (messages.length > 0) {
      setRequestCount(Math.floor(messages.length / 2));
    }
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const getProviderBadge = () => {
    switch (provider) {
      case 'openai':
        return { name: 'OpenAI + Gateway', color: 'bg-blue-500', cost: 'Optimized' };
      case 'workers-ai':
        return { name: 'Workers AI', color: 'bg-orange-500', cost: 'FREE' };
      case 'hybrid':
        return { name: 'Hybrid (Auto)', color: 'bg-purple-500', cost: 'Smart' };
    }
  };

  const badge = getProviderBadge();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Chat
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Powered by Cloudflare AI Gateway
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{requestCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {messages.filter(m => m.role === 'assistant').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Responses</div>
              </div>
            </div>
          </div>

          {/* Provider Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Provider:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setProvider('workers-ai')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  provider === 'workers-ai'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Workers AI (FREE)
              </button>
              <button
                onClick={() => setProvider('openai')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  provider === 'openai'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                OpenAI + Gateway
              </button>
              <button
                onClick={() => setProvider('hybrid')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  provider === 'hybrid'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Hybrid (Smart)
              </button>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${badge.color} text-white ml-2`}>
              {badge.cost}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                Welcome to AI Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose your AI provider and start chatting!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl mb-2">🆓</div>
                  <div className="font-semibold mb-1">Workers AI</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Free tier: 10,000 neurons/day
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-semibold mb-1">OpenAI + Gateway</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Up to 80% cost savings via caching
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="font-semibold mb-1">Hybrid Mode</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Automatically choose best provider
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-slide-up`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {message.role === 'user' ? '👤' : '🤖'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1 text-sm">
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </div>
                        <div className={`markdown ${message.role === 'user' ? 'text-white' : ''}`}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-slide-up">
                  <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🤖</div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-red-800 dark:text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <div className="font-semibold">Error</div>
                <div className="text-sm">{error.message}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={onSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Using: <span className="font-semibold">{badge.name}</span> • Cost: <span className="font-semibold">{badge.cost}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
