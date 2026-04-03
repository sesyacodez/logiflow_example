// Root layout for LogiFlow AI — applies global styles, fonts, and metadata
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LogiFlow AI — Dynamic Logistics Optimization',
  description: 'Real-time resource reallocation across supply chain delivery points. Powered by AI-driven priority scoring.',
  manifest: '/manifest.json',
  themeColor: '#0F172A',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
