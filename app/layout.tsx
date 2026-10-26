import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TerribleProvider } from '@/context/TerribleContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BadDecisionCounter } from '@/components/BadDecisionCounter';
import { NotificationSystem } from '@/components/NotificationSystem';
import { AchievementToast } from '@/components/AchievementToast';
import { BadGPTModal } from '@/components/BadGPTModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Terrible UI - Beautifully Designed, Horribly Usable',
  description: "Welcome to the internet's least intuitive interface. Every bad decision was intentional.",
  openGraph: {
    title: 'Terrible UI - Beautifully Designed, Horribly Usable',
    description: "Explore the world's most unnecessarily complicated user interface.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terrible UI',
    description: 'Beautifully designed. Horribly usable.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
            <head>
        <meta name="theme-color" content="#06070a" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="min-h-full flex flex-col bg-[#06070a] text-gray-100 selection:bg-purple-500 selection:text-white">
        <ErrorBoundary>
          <TerribleProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
            <BadDecisionCounter />
            <NotificationSystem />
            <AchievementToast />
            <BadGPTModal />
          </TerribleProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
