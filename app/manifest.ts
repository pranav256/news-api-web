import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'news-api — Public News JSON & Live Broadsheet Reader',
    short_name: 'news-api',
    description:
      'Free, no-key global news JSON refreshed every two hours via GitHub Actions. Deduplicated, atomic commits, open CORS.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f4ee',
    theme_color: '#161513',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
