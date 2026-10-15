import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'HydroCapy - Cozy Hydration & Bento Wellness',
  description: 'Interactive tilt-motion capybara hydration tracker and Bento wellness dashboard',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HydroCapy',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0284C7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-stone-50 text-stone-900 antialiased selection:bg-sky-200">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
