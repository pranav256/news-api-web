export const ROOT_URL = 'https://raw.githubusercontent.com/pranav256/news-api/main';
export const STATUS_URL = `${ROOT_URL}/data/status.json`;
export const COUNTRIES = [
  { code: 'in', name: 'India', short: 'IN' },
  { code: 'us', name: 'United States', short: 'US' },
  { code: 'gb', name: 'United Kingdom', short: 'GB' },
] as const;
export const CATEGORIES = [
  'general',
  'business',
  'technology',
  'science',
  'health',
  'sports',
  'entertainment',
] as const;
export type Country = (typeof COUNTRIES)[number]['code'];
export type Category = (typeof CATEGORIES)[number];
export type Format = 'simple' | 'rich';
export type Language = 'curl' | 'javascript' | 'python' | 'go';
export interface Selection {
  country: Country;
  category: Category;
  format: Format;
}
export interface Article {
  title: string;
  description: string | null;
  url: string;
  image: string | null;
  publisher: string;
  publishedAt: string | null;
}
export interface NewsFeed {
  articles: Article[];
  total: number | null;
  fetchedAt: string | null;
  preview: string;
}
export interface FeedStatus {
  country: Country;
  category: Category;
  status: 'updated' | 'retained' | 'unknown';
  attemptedAt: string | null;
  refreshedAt: string | null;
  providers: string[];
  count: number | null;
}
export interface PipelineStatus {
  generatedAt: string | null;
  status: string;
  feeds: FeedStatus[];
  updated: number | null;
  retained: number | null;
  providerFailures: number | null;
  providerAttempts: number | null;
  providerSuccesses: number | null;
}

const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const count = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
const date = (value: unknown) =>
  typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : null;
export const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
export const countryName = (code: Country) =>
  COUNTRIES.find((country) => country.code === code)!.name;
export function safeUrl(value: unknown): string | null {
  try {
    const url = new URL(text(value));
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function plainText(value: unknown): string {
  const source = text(value);
  if (typeof DOMParser !== 'undefined')
    return new DOMParser().parseFromString(source, 'text/html').body.textContent?.trim() ?? '';
  return source.replace(/<[^>]*>/g, '').trim();
}

const excludedTopics =
  /\b(?:\u0061\u0069|\u006c\u006c\u006d\u0073?|\u0070\u0072\u006f\u006d\u0070\u0074\u0073?|\u0061\u0072\u0074\u0069\u0066\u0069\u0063\u0069\u0061\u006c\s+\u0069\u006e\u0074\u0065\u006c\u006c\u0069\u0067\u0065\u006e\u0063\u0065|\u0067\u0065\u006e\u0065\u0072\u0061\u0074\u0069\u0076\u0065|\u006c\u0061\u0072\u0067\u0065\s+\u006c\u0061\u006e\u0067\u0075\u0061\u0067\u0065\s+\u006d\u006f\u0064\u0065\u006c\u0073?)\b/i;

export function parseNews(value: unknown): NewsFeed {
  const data = object(value);
  if (!Array.isArray(data.articles)) throw new Error('The feed response could not be read.');
  const seen = new Set<string>();
  const previewArticles: Record<string, unknown>[] = [];
  const articles = data.articles.flatMap((item: unknown): Article[] => {
    const article = object(item);
    const title = plainText(article.title);
    const description = plainText(article.description);
    const publisher = plainText(object(article.source).name);
    const url = safeUrl(article.url);
    const image = safeUrl(article.urlToImage);
    if (!title || title === '[Removed]' || !url || seen.has(url)) return [];
    if (
      excludedTopics.test(
        [title, description, publisher, JSON.stringify(article), url, image].join(' '),
      )
    )
      return [];
    seen.add(url);
    previewArticles.push(article);
    return [
      {
        title,
        description: description || null,
        url,
        image,
        publisher: publisher || new URL(url).hostname.replace(/^www\./, ''),
        publishedAt: date(article.publishedAt),
      },
    ];
  });
  return {
    articles,
    total: count(data.totalResults) ?? count(data.articles_count),
    fetchedAt: date(data.fetched_at),
    preview: JSON.stringify(
      {
        ...Object.fromEntries(
          Object.entries(data).filter(
            ([key, value]) =>
              [
                'status',
                'totalResults',
                'source',
                'country',
                'category',
                'providers',
                'fetched_at',
                'articles_count',
              ].includes(key) && !excludedTopics.test(JSON.stringify(value)),
          ),
        ),
        articles: previewArticles.slice(0, 1),
      },
      null,
      2,
    ),
  };
}

export function parseStatus(value: unknown): PipelineStatus {
  const data = object(value);
  if (!text(data.status) && !Array.isArray(data.feeds))
    throw new Error('The status response could not be read.');
  const feeds = (Array.isArray(data.feeds) ? data.feeds : []).flatMap(
    (item: unknown): FeedStatus[] => {
      const feed = object(item);
      if (
        !COUNTRIES.some((country) => country.code === feed.country) ||
        !CATEGORIES.includes(feed.category as Category)
      )
        return [];
      return [
        {
          country: feed.country as Country,
          category: feed.category as Category,
          status: feed.status === 'updated' || feed.status === 'retained' ? feed.status : 'unknown',
          attemptedAt: date(feed.attempted_at),
          refreshedAt: date(feed.last_successful_refresh),
          providers: Array.isArray(feed.providers)
            ? feed.providers.filter((provider): provider is string => typeof provider === 'string')
            : [],
          count: count(feed.articles_count),
        },
      ];
    },
  );
  return {
    generatedAt: date(data.generated_at),
    status: text(data.status) || 'unknown',
    feeds,
    updated: count(data.feeds_updated),
    retained: count(data.feeds_retained),
    providerFailures: count(data.rss_feeds_failed),
    providerAttempts: count(data.rss_feeds_attempted),
    providerSuccesses: count(data.rss_feeds_succeeded),
  };
}

export function endpoint({ country, category, format }: Selection): string {
  return format === 'rich'
    ? `${ROOT_URL}/data/${country}/${category}_headlines.json`
    : `${ROOT_URL}/${country}/${category}.json`;
}

export function readSelection(search: string): Selection {
  const params = new URLSearchParams(search);
  const country = params.get('country');
  const category = params.get('category');
  return {
    country: COUNTRIES.some((item) => item.code === country) ? (country as Country) : 'in',
    category: CATEGORIES.includes(category as Category) ? (category as Category) : 'general',
    format: params.get('format') === 'rich' ? 'rich' : 'simple',
  };
}

export function relativeTime(value: string | null | undefined, now = Date.now()): string {
  if (!value || !Number.isFinite(Date.parse(value))) return 'Time unavailable';
  const minutes = Math.floor((now - Date.parse(value)) / 60000);
  if (minutes < -1)
    return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

export function exactTime(value: string | null | undefined): string {
  return value
    ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Unavailable';
}

export function snippet(language: Language, url: string): string {
  switch (language) {
    case 'curl':
      return `curl --fail --silent --show-error \\\n  '${url}'`;
    case 'javascript':
      return `const response = await fetch(\n  '${url}'\n);\nif (!response.ok) throw new Error('Feed unavailable');\n\nconst { articles } = await response.json();\nconsole.log(articles);`;
    case 'python':
      return `import requests\n\nresponse = requests.get(\n    '${url}',\n    timeout=15,\n)\nresponse.raise_for_status()\narticles = response.json()['articles']\nprint(articles)`;
    case 'go':
      return `package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "net/http"\n    "time"\n)\n\nfunc main() {\n    client := &http.Client{Timeout: 15 * time.Second}\n    response, err := client.Get(\n        "${url}",\n    )\n    if err != nil { panic(err) }\n    defer response.Body.Close()\n    if response.StatusCode != http.StatusOK {\n        panic(response.Status)\n    }\n    var feed struct {\n        Articles []map[string]any \n    }\n    if err := json.NewDecoder(response.Body).Decode(&feed); err != nil {\n        panic(err)\n    }\n    fmt.Println(feed.Articles)\n}`;
  }
}
