import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://news-api-live.vercel.app', changeFrequency: 'daily', priority: 1 }];
}
