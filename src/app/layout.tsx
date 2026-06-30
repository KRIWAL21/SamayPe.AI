import React from 'react';
import type { Metadata } from 'next';
import AppLayoutShell from '@/components/AppLayoutShell';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'SamayPe AI — Your Autonomous Deadline Guardian',
  description: 'AI-powered proactive productivity companion built for the Vibe2Ship Hackathon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col md:flex-row antialiased selection:bg-purple-500 selection:text-white">
        <AppLayoutShell>
          {children}
        </AppLayoutShell>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#13131a',
              color: '#fff',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              backdropFilter: 'blur(10px)',
            }
          }} 
        />
      </body>
    </html>
  );
}
