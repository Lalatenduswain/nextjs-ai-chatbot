import ChatWithProviderSelect from '@/components/ChatWithProviderSelect';

export const metadata = {
  title: 'AI Chat - Provider Selection',
  description: 'Chat with AI using multiple providers: Workers AI, OpenAI, or Hybrid mode',
};

export default function ProvidersPage() {
  return <ChatWithProviderSelect />;
}
