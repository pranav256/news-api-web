import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ee' },
    { media: '(prefers-color-scheme: dark)', color: '#161513' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://news-api-live.vercel.app'),
  title: {
    default: 'news-api — Free, No-Key Global News JSON & Live Broadsheet Reader',
    template: '%s · news-api',
  },
  description:
    'Free, serverless global news JSON refreshed every two hours via GitHub Actions. Deduplicated, atomically committed, and delivered via GitHub CDN with open CORS across 21 categorized feeds.',
  keywords: [
    'news api',
    'free news api',
    'open source news',
    'json news feeds',
    'github actions news',
    'serverless news api',
    'rss to json',
    'news reader web app',
    '24x7 news',
    'india news json',
    'us news json',
    'uk news json',
  ],
  authors: [{ name: 'Pranav', url: 'https://github.com/pranav256' }],
  creator: 'Pranav',
  publisher: 'news-api open data project',
  alternates: {
    canonical: 'https://news-api-live.vercel.app',
    languages: {
      'en-US': 'https://news-api-live.vercel.app',
    },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  openGraph: {
    title: 'news-api — Free, No-Key Global News JSON',
    description:
      'Serverless news pipeline scraped every 2 hours across India, US, and UK. 21 feeds, zero auth, zero servers, direct browser CORS.',
    url: 'https://news-api-live.vercel.app',
    siteName: 'news-api',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'news-api — Free, No-Key Global News JSON',
    description:
      'Serverless news pipeline refreshed every 2 hours. 21 feeds, 0 API keys, direct browser fetch with open CORS.',
    creator: '@pranav256',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://news-api-live.vercel.app/#website',
      url: 'https://news-api-live.vercel.app',
      name: 'news-api',
      description: 'Free, no-key global news JSON refreshed every two hours via GitHub Actions.',
      publisher: {
        '@type': 'Person',
        name: 'Pranav',
        url: 'https://github.com/pranav256',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://news-api-live.vercel.app/#webapp',
      name: 'news-api Web Portal & Live Reader',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      url: 'https://news-api-live.vercel.app',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Live Broadsheet News Reader with country & category filtering',
        'Direct browser fetch via raw.githubusercontent.com CDN',
        '21 automated news feeds refreshed every 2 hours',
        'Dynamic code snippets in cURL, JavaScript fetch, Python requests, and Go',
        'Real-time feed health and freshness telemetry',
      ],
    },
    {
      '@type': 'Dataset',
      '@id': 'https://news-api-live.vercel.app/#dataset',
      name: 'news-api Global Multi-Region News Feed Dataset',
      description:
        'Continuous public JSON dataset scraped from verified RSS feeds and NewsAPI across India, the United States, and the United Kingdom. Refreshed bi-hourly, deduplicated by URL, and served via GitHub edge CDN with open CORS.',
      url: 'https://github.com/pranav256/news-api',
      license: 'https://github.com/pranav256/news-api',
      creator: {
        '@type': 'Person',
        name: 'Pranav',
        url: 'https://github.com/pranav256',
      },
      distribution: [
        {
          '@type': 'DataDownload',
          encodingFormat: 'application/json',
          contentUrl: 'https://raw.githubusercontent.com/pranav256/news-api/main/in/general.json',
        },
        {
          '@type': 'DataDownload',
          encodingFormat: 'application/json',
          contentUrl: 'https://raw.githubusercontent.com/pranav256/news-api/main/data/status.json',
        },
      ],
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
