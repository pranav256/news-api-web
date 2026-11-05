import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://news-api-live.vercel.app/sitemap.xml',
    host: 'https://news-api-live.vercel.app',
  };
}
