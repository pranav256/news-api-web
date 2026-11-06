import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});
const newsreader = localFont({
  src: [
    {
      path: '../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2',
      weight: '200 800',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2',
      weight: '200 800',
      style: 'italic',
    },
  ],
  variable: '--font-newsreader',
  display: 'swap',
});
const mono = localFont({
  src: '../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-jetbrains',
  display: 'swap',
  weight: '100 800',
  preload: false,
});
const origin = 'https://news-api-live.vercel.app';
const description =
  'Read the latest news from India, the US, and the UK. Build with 21 free, public JSON feeds, scheduled every two hours. No API key required.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ee' },
    { media: '(prefers-color-scheme: dark)', color: '#1b1e1b' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: { default: 'news-api — The world’s news. Open to everyone.', template: '%s · news-api' },
  description,
  applicationName: 'news-api',
  authors: [{ name: 'Pranav', url: 'https://github.com/pranav256' }],
  creator: 'Pranav',
  alternates: { canonical: origin },
  openGraph: {
    title: 'The world’s news. Open to everyone.',
    description,
    url: origin,
    siteName: 'news-api',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'news-api — The world’s news. Open to everyone.',
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'news',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'news-api',
  url: origin,
  description,
  author: { '@type': 'Person', name: 'Pranav', url: 'https://github.com/pranav256' },
};
const themeScript = `(function(){try{var t=localStorage.getItem('news-theme');document.documentElement.classList.toggle('dark',t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))}catch(e){document.documentElement.classList.toggle('dark',matchMedia('(prefers-color-scheme: dark)').matches)}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <noscript>
          <p style={{ padding: '24px' }}>
            Enable JavaScript to read the live news feeds. You can also{' '}
            <a href="https://github.com/pranav256/news-api">browse the public data repository</a>.
          </p>
        </noscript>
      </body>
    </html>
  );
}
