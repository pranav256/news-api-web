import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://news-api-web-five.vercel.app'),
  title: 'news-api — Free, No-Key Global News JSON & Live Broadsheet Reader',
  description:
    'Free, serverless global news JSON refreshed every two hours. Deduplicated, atomically committed, and delivered via GitHub CDN with open CORS across 21 categorized feeds.',
  keywords: [
    'news api',
    'free news api',
    'open source news',
    'json news feeds',
    'github actions',
    'serverless news',
    'rss scraper',
    '24x7 news',
  ],
  authors: [{ name: 'Pranav', url: 'https://github.com/pranav256' }],
  creator: 'Pranav',
  openGraph: {
    title: 'news-api — Free, No-Key Global News JSON',
    description:
      'Serverless news pipeline scraped every 2 hours across India, US, and UK. Zero auth, zero servers, direct browser CORS.',
    url: 'https://news-api-web-five.vercel.app',
    siteName: 'news-api',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'news-api — Free, No-Key Global News JSON',
    description:
      'Serverless news pipeline refreshed every 2 hours. 21 feeds, 0 API keys, direct browser fetch with open CORS.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="auto">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
