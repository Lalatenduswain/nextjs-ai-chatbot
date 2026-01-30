import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'AI Chat - Cloudflare AI Gateway',
  description: 'Next.js AI Chatbot powered by Cloudflare AI Gateway for cost optimization and performance',
  keywords: ['AI', 'chatbot', 'Cloudflare', 'AI Gateway', 'Next.js', 'OpenAI'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
