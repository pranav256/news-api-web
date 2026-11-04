'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Search,
  Sun,
  Moon,
  Github,
  Linkedin,
  Twitter,
  ChevronDown,
  AlertTriangle,
  Radio,
  FileCode,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';

/* Types */
interface ArticleSource {
  id: string | null;
  name: string;
}

interface Article {
  source: ArticleSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface FeedStatus {
  country: string;
  category: string;
  status: 'updated' | 'retained';
  attempted_at: string;
  last_successful_refresh: string;
  providers: string[];
  articles_count: number;
}

interface PipelineStatusData {
  schema_version: number;
  generated_at: string;
  run_started_at: string;
  status: string;
  api_keys_detected?: number;
  newsapi_requests_used?: number;
  newsapi_requests_allowed?: number;
  rss_feeds_attempted?: number;
  rss_feeds_succeeded?: number;
  rss_feeds_failed?: number;
  feeds_updated?: number;
  feeds_retained?: number;
  feeds?: FeedStatus[];
  errors?: string[];
}

const COUNTRY_NAMES: Record<string, string> = {
  in: 'India',
  us: 'United States',
  gb: 'United Kingdom',
};

const CATEGORIES = [
  'general',
  'business',
  'health',
  'science',
  'sports',
  'technology',
  'entertainment',
];

export default function HomePage() {
  /* State */
  const [country, setCountry] = useState<'in' | 'us' | 'gb'>('us');
  const [category, setCategory] = useState<string>('general');
  const [format, setFormat] = useState<'simple' | 'headlines'>('simple');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [statusData, setStatusData] = useState<PipelineStatusData | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'updated' | 'retained'>('all');
  const [statusSearch, setStatusSearch] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'curl' | 'js' | 'python' | 'go'>('curl');
  
  const [theme, setTheme] = useState<'auto' | 'dark' | 'light'>('auto');
  const [isCopiedHero, setIsCopiedHero] = useState<boolean>(false);
  const [isCopiedReader, setIsCopiedReader] = useState<boolean>(false);
  const [isCopiedSnippet, setIsCopiedSnippet] = useState<boolean>(false);
  const [schemaOpen, setSchemaOpen] = useState<boolean>(false);
  const [editionDate, setEditionDate] = useState<string>('');

  /* Format relative time */
  const formatRelativeTime = useCallback((dateString: string | null | undefined) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  }, []);

  const formatDateTime = useCallback((dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
    } catch {
      return dateString;
    }
  }, []);

  /* Active Endpoint URLs */
  const activeUrl = useMemo(() => {
    if (format === 'headlines') {
      return `https://raw.githubusercontent.com/pranav256/news-api/main/data/${country}/${category}_headlines.json`;
    }
    return `https://raw.githubusercontent.com/pranav256/news-api/main/${country}/${category}.json`;
  }, [country, category, format]);

  const heroUrl = useMemo(() => {
    return `https://raw.githubusercontent.com/pranav256/news-api/main/${country}/${category}.json`;
  }, [country, category]);

  /* Theme Management */
  useEffect(() => {
    const saved = localStorage.getItem('news-api-theme') as 'auto' | 'dark' | 'light' | null;
    if (saved) setTheme(saved);

    const now = new Date();
    setEditionDate(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('news-api-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'auto') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else setTheme('auto');
  };

  /* Fetch Articles */
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(activeUrl);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setArticles(Array.isArray(data.articles) ? data.articles : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch news data');
    } finally {
      setLoading(false);
    }
  }, [activeUrl]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  /* Fetch Telemetry Status */
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('https://raw.githubusercontent.com/pranav256/news-api/main/data/status.json');
      if (!res.ok) return;
      const data: PipelineStatusData = await res.json();
      setStatusData(data);
    } catch (err) {
      console.warn('Status fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  /* Copy to Clipboard */
  const copyText = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 1800);
    });
  };

  /* Filtered Articles */
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) => {
      const title = (a.title || '').toLowerCase();
      const desc = (a.description || '').toLowerCase();
      const src = (a.source?.name || '').toLowerCase();
      return title.includes(q) || desc.includes(q) || src.includes(q);
    });
  }, [articles, searchQuery]);

  /* Filtered Status Table */
  const filteredFeeds = useMemo(() => {
    if (!statusData?.feeds) return [];
    const q = statusSearch.trim().toLowerCase();
    return statusData.feeds.filter((feed) => {
      if (statusFilter === 'updated' && feed.status !== 'updated') return false;
      if (statusFilter === 'retained' && feed.status === 'updated') return false;
      if (q) {
        const countryName = (COUNTRY_NAMES[feed.country] || feed.country).toLowerCase();
        const catName = feed.category.toLowerCase();
        return countryName.includes(q) || catName.includes(q);
      }
      return true;
    });
  }, [statusData, statusFilter, statusSearch]);

  /* Code Snippet String */
  const generatedCode = useMemo(() => {
    if (activeLang === 'curl') {
      return `curl -s "${activeUrl}" | jq .`;
    }
    if (activeLang === 'js') {
      return `// Browser fetch or Node 18+ (CORS supported natively)
async function fetchNews() {
  const res = await fetch("${activeUrl}");
  if (!res.ok) throw new Error(\`HTTP error! status: \${res.status}\`);
  const data = await res.json();
  console.log("Total articles:", data.totalResults || data.articles_count);
  console.log(data.articles);
}

fetchNews();`;
    }
    if (activeLang === 'python') {
      return `import requests

url = "${activeUrl}"
response = requests.get(url)
response.raise_for_status()

news_data = response.json()
print(f"Total articles: {len(news_data.get('articles', []))}")
for article in news_data.get('articles', []):
    print(f"- {article.get('title')} ({article.get('source', {}).get('name')})")`;
    }
    if (activeLang === 'go') {
      return `package main

import (
\t"encoding/json"
\t"fmt"
\t"net/http"
)

type NewsResponse struct {
\tStatus       string \`json:"status"\`
\tTotalResults int    \`json:"totalResults"\`
\tArticles     []struct {
\t\tTitle  string \`json:"title"\`
\t\tURL    string \`json:"url"\`
\t\tSource struct {
\t\t\tName string \`json:"name"\`
\t\t} \`json:"source"\`
\t} \`json:"articles"\`
}

func main() {
\tresp, err := http.Get("${activeUrl}")
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tvar data NewsResponse
\tif err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
\t\tpanic(err)
\t}

\tfmt.Printf("Fetched %d articles\\n", len(data.Articles))
}`;
    }
    return '';
  }, [activeUrl, activeLang]);

  /* Current feed refresh metadata */
  const currentFeedMeta = useMemo(() => {
    if (!statusData?.feeds) return null;
    return statusData.feeds.find((f) => f.country === country && f.category === category);
  }, [statusData, country, category]);

  return (
    <main>
      {/* 1. Masthead Strip */}
      <div className="masthead-strip">
        <div className="container masthead-inner">
          <div className="masthead-dateline">
            <span className="tabular">{editionDate || 'Daily Dispatch'}</span>
            <span className="masthead-divider">·</span>
            <span>Public Static News JSON Archive</span>
            <span className="masthead-divider">·</span>
            <span>Scraped every 2h via GitHub Actions</span>
          </div>
          <div className="masthead-telemetry">
            <span className="live-dot" />
            <span className="tabular">
              {statusData
                ? `Pipeline active · Run ${formatRelativeTime(statusData.generated_at)}`
                : 'Pipeline active'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Header */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand-group">
            <a href="#" className="brand-title">
              news-api
            </a>
            <span className="brand-tag">raw.githubusercontent.com</span>
          </div>

          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li><a href="#reader" className="nav-link">Live Reader</a></li>
              <li><a href="#endpoints" className="nav-link">Endpoints</a></li>
              <li><a href="#docs" className="nav-link">Docs &amp; Snippets</a></li>
              <li><a href="#status" className="nav-link">Feed Health</a></li>
              <li><a href="#architecture" className="nav-link">How It Works</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            <a
              href="https://24x7.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              title="Open 24x7 News Reader web app"
            >
              <ExternalLink className="icon" />
              <span>24x7.vercel.app</span>
            </a>

            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fnews-api-web-five.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title="Share news-api on LinkedIn"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="icon" />
            </a>

            <a
              href="https://twitter.com/intent/tweet?text=Free%2C%20no-key%20global%20news%20JSON%20refreshed%20every%202h%20via%20GitHub%20Actions.%20Zero%20servers%2C%20open%20CORS%20and%20live%20broadsheet%20reader%3A&url=https%3A%2F%2Fnews-api-web-five.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title="Share news-api on X / Twitter"
              aria-label="Share on X"
            >
              <Twitter className="icon" />
            </a>

            <button
              onClick={toggleTheme}
              className="icon-btn"
              title="Toggle theme (Light / Dark / Auto)"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Moon className="icon" /> : <Sun className="icon" />}
            </button>

            <a
              href="https://github.com/pranav256/news-api"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              <Github className="icon" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pretitle">
            <span>EST. 2026</span>
            <span>·</span>
            <span>NO API KEYS REQUIRED</span>
            <span>·</span>
            <span>ZERO RATE-LIMIT GATES</span>
          </div>

          <h1 className="hero-title">Free, no-key news JSON, refreshed every two hours</h1>

          <p className="hero-subhead">
            A serverless scraper committing structured JSON directly to GitHub. Fetch headline and topic feeds straight from <code>raw.githubusercontent.com</code> without authentication tokens, rate-limit gates, or backend infrastructure.
          </p>

          <div className="hero-snippet-box">
            <div className="snippet-top">
              <div className="snippet-meta">
                <span>GET</span>
                <span>·</span>
                <span>CORS: *</span>
                <span>·</span>
                <span>NewsAPI compatible schema</span>
              </div>
              <span className="tabular">
                {COUNTRY_NAMES[country]} {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </div>
            <div className="snippet-cmd-bar">
              <span className="snippet-cmd-text">{heroUrl}</span>
              <button
                className={`btn-copy ${isCopiedHero ? 'copied' : ''}`}
                onClick={() => copyText(heroUrl, setIsCopiedHero)}
              >
                {isCopiedHero ? <Check className="icon" /> : <Copy className="icon" />}
                <span>{isCopiedHero ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>
          </div>

          {/* Reference Implementation Showcase Banner */}
          <div className="showcase-banner">
            <div className="showcase-badge">LIVE IMPLEMENTATION</div>
            <div className="showcase-body">
              <span className="showcase-title">
                24x7 News Reader Web App
              </span>
              <span className="showcase-desc">
                Discover headlines, save a browser-local reading queue, and inspect feed freshness at <a href="https://24x7.vercel.app" target="_blank" rel="noopener noreferrer" className="showcase-link">24x7.vercel.app</a> — powered directly by this JSON dataset.
              </span>
            </div>
            <a
              href="https://24x7.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-copy"
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              <span>Open 24x7</span>
              <ExternalLink className="icon" style={{ width: '13px', height: '13px' }} />
            </a>
          </div>

          <div className="hero-stats-grid">
            <div className="stat-cell">
              <div className="stat-num tabular">{statusData?.feeds?.length ?? 21}</div>
              <div className="stat-label">Active feeds across 3 countries</div>
            </div>
            <div className="stat-cell">
              <div className="stat-num tabular">2h</div>
              <div className="stat-label">Automated cron refresh interval</div>
            </div>
            <div className="stat-cell">
              <div className="stat-num tabular">0</div>
              <div className="stat-label">API keys or signups required</div>
            </div>
            <div className="stat-cell">
              <div className="stat-num tabular">100%</div>
              <div className="stat-label">Direct browser CORS support</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live News Reader */}
      <section className="section-wrap" id="reader">
        <div className="container">
          <div className="section-header-row">
            <div className="section-title-group">
              <span className="section-eyebrow">BROADSHEET DEMO</span>
              <h2 className="section-title">Live News Reader</h2>
              <p className="section-desc">
                Client-side reader pulling real-time JSON files directly from GitHub. Looking for saved reading queues and offline caching? Launch the reference app at <a href="https://24x7.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--text-primary)' }}>24x7.vercel.app</a>.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <span className="tabular" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {currentFeedMeta
                  ? `${currentFeedMeta.status === 'updated' ? 'Refreshed' : 'Retained'} ${formatRelativeTime(
                      currentFeedMeta.last_successful_refresh
                    )} · ${currentFeedMeta.providers.join('+')}`
                  : 'Live data'}
              </span>
              <button
                onClick={fetchArticles}
                className="btn-copy"
                title="Re-fetch current endpoint"
              >
                <RefreshCw className="icon" />
                <span>Reload</span>
              </button>
            </div>
          </div>

          <div className="reader-frame">
            <div className="reader-toolbar">
              <div className="toolbar-row-top">
                {/* Country Selector */}
                <div className="segmented-group" role="radiogroup" aria-label="Select Country">
                  {(['in', 'us', 'gb'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCountry(c)}
                      className={`seg-btn ${country === c ? 'active' : ''}`}
                      role="radio"
                      aria-checked={country === c}
                    >
                      <span>{COUNTRY_NAMES[c]}</span>
                    </button>
                  ))}
                </div>

                {/* Format Selector */}
                <div className="format-switcher">
                  <label htmlFor="feed-format-select">Endpoint Shape:</label>
                  <select
                    id="feed-format-select"
                    className="toggle-select"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                  >
                    <option value="simple">Simple /{'{country}'}/{'{category}'}.json</option>
                    <option value="headlines">Rich Headlines /data/{'{country}'}/{'{category}'}_headlines.json</option>
                  </select>
                </div>
              </div>

              {/* Category Navigation Tabs */}
              <div className="category-tabs" role="tablist" aria-label="News Categories">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`cat-tab ${category === cat ? 'active' : ''}`}
                    role="tab"
                    aria-selected={category === cat}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Status & Filter Bar */}
            <div className="reader-status-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', maxWidth: '70%' }}>
                <span className="endpoint-pill">{activeUrl}</span>
                <button
                  className={`btn-copy ${isCopiedReader ? 'copied' : ''}`}
                  onClick={() => copyText(activeUrl, setIsCopiedReader)}
                  title="Copy endpoint URL"
                >
                  {isCopiedReader ? <Check className="icon" /> : <Copy className="icon" />}
                </button>
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-copy"
                  title="Open raw JSON in new tab"
                >
                  <ExternalLink className="icon" />
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className="reader-filter-wrap">
                  <Search className="icon filter-icon-pos" />
                  <input
                    type="text"
                    className="reader-filter-input"
                    placeholder="Filter articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Filter loaded articles"
                  />
                </div>
                <span className="reader-metrics tabular">
                  {loading ? 'Fetching...' : `${filteredArticles.length} article${filteredArticles.length === 1 ? '' : 's'}`}
                </span>
              </div>
            </div>

            {/* Article Grid */}
            <div className="articles-container">
              {loading ? (
                <div className="articles-grid">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="skeleton-card skeleton-pulse">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                          <div className="skeleton-line" style={{ width: '70px' }} />
                          <div className="skeleton-line" style={{ width: '50px' }} />
                        </div>
                        <div className="skeleton-line" style={{ width: '90%', height: '20px' }} />
                        <div className="skeleton-line" style={{ width: '75%', height: '20px' }} />
                        <div className="skeleton-line" style={{ width: '100%', height: '40px', marginTop: 'var(--space-1)' }} />
                        <div className="skeleton-line" style={{ width: '110px', marginTop: 'auto' }} />
                      </div>
                    ))}
                </div>
              ) : error ? (
                <div className="state-banner">
                  <AlertTriangle className="icon" style={{ width: '32px', height: '32px', color: 'var(--status-error)' }} />
                  <h3 className="state-title">Failed to load feed data</h3>
                  <p className="state-desc">The request to <code>{activeUrl}</code> failed ({error}).</p>
                  <button onClick={fetchArticles} className="btn-retry">
                    <RefreshCw className="icon" />
                    <span>Retry request</span>
                  </button>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="state-banner">
                  <h3 className="state-title">No articles found</h3>
                  <p className="state-desc">
                    {searchQuery
                      ? `No headlines match your search query "${searchQuery}".`
                      : 'This category feed is currently empty.'}
                  </p>
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="btn-retry">
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="articles-grid">
                  {filteredArticles.map((article, idx) => {
                    const sourceName = article.source?.name || 'Publisher';
                    const relTime = formatRelativeTime(article.publishedAt);
                    const authorText =
                      article.author && article.author.trim() && article.author.length < 50
                        ? `By ${article.author}`
                        : '';
                    const safeUrl = article.url || '#';

                    return (
                      <article key={idx} className="article-card">
                        <div>
                          <div className="article-card-header">
                            <span className="article-source-tag" title={sourceName}>
                              {sourceName}
                            </span>
                            <time className="article-time">{relTime}</time>
                          </div>

                          <h3 style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                            <a
                              href={safeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="article-headline"
                            >
                              {article.title || 'Untitled dispatch'}
                            </a>
                          </h3>

                          {article.description && (
                            <p className="article-excerpt">{article.description}</p>
                          )}
                        </div>

                        <div className="article-footer">
                          <span className="article-author">{authorText}</span>
                          <a
                            href={safeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="article-link-out"
                          >
                            <span>Read story</span>
                            <ExternalLink className="icon" style={{ width: '13px', height: '13px' }} />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. API Documentation & Code Snippets */}
      <section className="section-wrap" id="docs">
        <div className="container">
          <div className="section-header-row">
            <div className="section-title-group">
              <span className="section-eyebrow">INTEGRATION GUIDE</span>
              <h2 className="section-title">API Endpoints &amp; Code Snippets</h2>
              <p className="section-desc">
                Fetch plain JSON from any client, backend script, or static site generator. No headers, tokens, or initialization needed.
              </p>
            </div>
          </div>

          <div className="docs-grid" id="endpoints">
            <div className="endpoints-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 500 }}>
                Endpoint Patterns
              </h3>

              <div className="endpoint-item">
                <div className="endpoint-title-row">
                  <span className="method-badge">GET</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Root NewsAPI Format</span>
                </div>
                <code className="endpoint-url-code">
                  https://raw.githubusercontent.com/pranav256/news-api/main/{'{country}'}/{'{category}'}.json
                </code>
                <p className="endpoint-explain">
                  Original Flask-compatible endpoint. Returns standard <code>{'{ "status": "ok", "totalResults": N, "articles": [...] }'}</code>.
                </p>
              </div>

              <div className="endpoint-item">
                <div className="endpoint-title-row">
                  <span className="method-badge">GET</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rich Headlines Feed</span>
                </div>
                <code className="endpoint-url-code">
                  https://raw.githubusercontent.com/pranav256/news-api/main/data/{'{country}'}/{'{category}'}_headlines.json
                </code>
                <p className="endpoint-explain">
                  Combines NewsAPI top headlines and verified national RSS feeds with provider names and refresh timestamp metadata.
                </p>
              </div>

              <div className="endpoint-item">
                <div className="endpoint-title-row">
                  <span className="method-badge">GET</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deep Search (5 Categories)</span>
                </div>
                <code className="endpoint-url-code">
                  https://raw.githubusercontent.com/pranav256/news-api/main/data/{'{country}'}/{'{category}'}_everything.json
                </code>
                <p className="endpoint-explain">
                  Deep-search results when NewsAPI quota allows, falling back to RSS. Published for <code>business</code>, <code>health</code>, <code>science</code>, <code>sports</code>, <code>technology</code>.
                </p>
              </div>

              <div className="endpoint-item">
                <div className="endpoint-title-row">
                  <span className="method-badge">GET</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Telemetry &amp; Status</span>
                </div>
                <code className="endpoint-url-code">
                  https://raw.githubusercontent.com/pranav256/news-api/main/data/status.json
                </code>
                <p className="endpoint-explain">
                  Real-time pipeline health: per-feed status, last successful refresh timestamps, quota usage, and upstream errors.
                </p>
              </div>
            </div>

            <div className="code-generator-card">
              <div className="code-tabs-header">
                <div className="lang-tabs">
                  {(['curl', 'js', 'python', 'go'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`lang-tab ${activeLang === lang ? 'active' : ''}`}
                    >
                      {lang === 'js' ? 'JavaScript' : lang === 'python' ? 'Python' : lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  className={`btn-copy ${isCopiedSnippet ? 'copied' : ''}`}
                  onClick={() => copyText(generatedCode, setIsCopiedSnippet)}
                >
                  {isCopiedSnippet ? <Check className="icon" /> : <Copy className="icon" />}
                  <span>Copy snippet</span>
                </button>
              </div>

              <pre className="code-body-pre">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>

          <div className="reference-tables-grid">
            <div className="ref-table-card">
              <div className="ref-table-header">Supported Countries</div>
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Code</th>
                    <th>Coverage Providers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>India</strong></td>
                    <td><code>in</code></td>
                    <td>RSS (The Hindu, Indian Express, NDTV)</td>
                  </tr>
                  <tr>
                    <td><strong>United States</strong></td>
                    <td><code>us</code></td>
                    <td>NewsAPI Developer Quota + RSS (NYT, Reuters)</td>
                  </tr>
                  <tr>
                    <td><strong>United Kingdom</strong></td>
                    <td><code>gb</code></td>
                    <td>RSS (BBC News, The Guardian, Telegraph)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="ref-table-card">
              <div className="ref-table-header">Supported Categories</div>
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Root JSON</th>
                    <th>Rich Headlines &amp; Deep Search</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((cat) => (
                    <tr key={cat}>
                      <td><code>{cat}</code></td>
                      <td>Available (all 3 countries)</td>
                      <td>
                        {['business', 'health', 'science', 'sports', 'technology'].includes(cat)
                          ? 'Headlines + Everything feed'
                          : 'Headlines feed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="schema-preview-box">
            <div
              className="schema-preview-header"
              onClick={() => setSchemaOpen(!schemaOpen)}
              role="button"
              tabIndex={0}
            >
              <span>Verified Response Schema Reference (Simple vs Rich)</span>
              <ChevronDown
                className="icon"
                style={{
                  transform: schemaOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--duration-fast) var(--ease)',
                }}
              />
            </div>
            {schemaOpen && (
              <pre className="schema-code-block">
                <code>{`/* Simple Endpoint: /{country}/{category}.json */
{
  "status": "ok",                  // string ("ok")
  "totalResults": 45,              // integer
  "articles": [
    {
      "source": {
        "id": "the-hindu",         // string | null
        "name": "The Hindu"        // string (publisher name)
      },
      "author": "Vikas Vasudeva",  // string | null (frequently null)
      "title": "Article Headline", // string
      "description": "...",        // string | null
      "url": "https://...",        // string (canonical article link)
      "urlToImage": "https://...", // string | null (external CDN)
      "publishedAt": "2026-10-31T23:20:22Z", // ISO-8601 string
      "content": "..."             // string | null
    }
  ]
}

/* Rich Headlines: /data/{country}/{category}_headlines.json */
{
  "source": "news-api",
  "country": "us",
  "category": "general",
  "providers": ["newsapi", "rss"], // array of upstream sources
  "fetched_at": "2026-11-01T00:29:06.909534+00:00",
  "articles_count": 45,
  "articles": [ ... ]
}`}</code>
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* 5. Data Status & Freshness Panel */}
      <section className="section-wrap" id="status">
        <div className="container">
          <div className="section-header-row">
            <div className="section-title-group">
              <span className="section-eyebrow">PIPELINE MONITORING</span>
              <h2 className="section-title">Feed Freshness &amp; Health</h2>
              <p className="section-desc">
                Live status queried from <code>data/status.json</code>. Each feed records its last successful refresh and upstream health.
              </p>
            </div>

            <button onClick={fetchStatus} className="btn-copy">
              <RefreshCw className="icon" />
              <span>Refresh Telemetry</span>
            </button>
          </div>

          <div className="status-panel-card">
            <div className="status-summary-bar">
              <div className="summary-cell">
                <span className="summary-label">Pipeline Status</span>
                <span className="summary-val">
                  <span className="live-dot" />
                  <span>{statusData?.status === 'partial' ? 'Operational (Partial)' : 'Healthy'}</span>
                </span>
              </div>
              <div className="summary-cell">
                <span className="summary-label">Feeds Updated</span>
                <span className="summary-val tabular">
                  {statusData?.feeds_updated ?? 21} / {statusData?.feeds?.length ?? 21}
                </span>
              </div>
              <div className="summary-cell">
                <span className="summary-label">Feeds Retained (Stale)</span>
                <span className="summary-val tabular">{statusData?.feeds_retained ?? 0}</span>
              </div>
              <div className="summary-cell">
                <span className="summary-label">NewsAPI Requests Used</span>
                <span className="summary-val tabular">
                  {statusData?.newsapi_requests_used ?? '--'} / {statusData?.newsapi_requests_allowed ?? '--'}
                </span>
              </div>
              <div className="summary-cell">
                <span className="summary-label">RSS Feeds Succeeded</span>
                <span className="summary-val tabular">
                  {statusData?.rss_feeds_succeeded ?? '--'} / {statusData?.rss_feeds_attempted ?? '--'}
                </span>
              </div>
            </div>

            <div className="status-filter-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div className="segmented-group">
                  {(['all', 'updated', 'retained'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setStatusFilter(mode)}
                      className={`seg-btn ${statusFilter === mode ? 'active' : ''}`}
                    >
                      {mode === 'all'
                        ? `All Feeds (${statusData?.feeds?.length ?? 21})`
                        : mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="reader-filter-wrap">
                <Search className="icon filter-icon-pos" />
                <input
                  type="text"
                  className="reader-filter-input"
                  placeholder="Search country / category..."
                  value={statusSearch}
                  onChange={(e) => setStatusSearch(e.target.value)}
                  aria-label="Search status table"
                />
              </div>
            </div>

            <div className="table-container">
              <table className="status-table" aria-label="Feeds Health Table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Providers</th>
                    <th>Articles Count</th>
                    <th>Last Refresh</th>
                    <th>Raw File</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeeds.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                        No feed records available
                      </td>
                    </tr>
                  ) : (
                    filteredFeeds.map((feed, idx) => {
                      const isUpdated = feed.status === 'updated';
                      const rawUrl = `https://raw.githubusercontent.com/pranav256/news-api/main/${feed.country}/${feed.category}.json`;

                      return (
                        <tr key={idx}>
                          <td>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                              {COUNTRY_NAMES[feed.country] || feed.country}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                              ({feed.country})
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{feed.category}</td>
                          <td>
                            <span className={`status-badge ${isUpdated ? 'updated' : 'retained'}`}>
                              <span
                                className="live-dot"
                                style={{
                                  width: '5px',
                                  height: '5px',
                                  backgroundColor: isUpdated ? 'var(--status-updated)' : 'var(--status-retained)',
                                }}
                              />
                              {feed.status}
                            </span>
                          </td>
                          <td>
                            {(feed.providers || ['rss']).map((p, pIdx) => (
                              <span key={pIdx} className="provider-pill">
                                {p}
                              </span>
                            ))}
                          </td>
                          <td className="tabular" style={{ fontFamily: 'var(--font-mono)' }}>
                            {feed.articles_count ?? '--'}
                          </td>
                          <td className="tabular" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {formatDateTime(feed.last_successful_refresh || feed.attempted_at)}
                          </td>
                          <td>
                            <a
                              href={rawUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-copy"
                              style={{ padding: '2px 6px', fontSize: '11px' }}
                            >
                              <span>raw JSON</span>
                              <ExternalLink className="icon" style={{ width: '12px', height: '12px' }} />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {statusData?.errors && statusData.errors.length > 0 && (
            <div className="diagnostics-box">
              <div className="diag-title">
                <AlertTriangle className="icon" style={{ color: 'var(--status-retained)' }} />
                <span>Upstream Feed Diagnostics Log</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                When individual upstream feeds encounter network issues or XML parsing errors, the scraper automatically preserves the last good file without overwriting it.
              </p>
              <ul className="diag-list">
                {statusData.errors.map((err, eIdx) => (
                  <li key={eIdx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="section-wrap" id="architecture">
        <div className="container">
          <div className="section-header-row">
            <div className="section-title-group">
              <span className="section-eyebrow">HOW IT WORKS</span>
              <h2 className="section-title">Serverless Architecture &amp; Data Behaviors</h2>
              <p className="section-desc">
                Reliable static JSON without running databases, server daemons, or billable infrastructure.
              </p>
            </div>
          </div>

          <div className="arch-grid">
            <div className="arch-step-card">
              <span className="arch-step-num">PHASE 01</span>
              <h3 className="arch-step-title">Scheduled Scraper</h3>
              <p className="arch-step-desc">
                A GitHub Actions workflow triggers every two hours. It runs Python ingestion workers that query NewsAPI endpoints (within developer plan budget) and fallback RSS feeds for India, the US, and the UK.
              </p>
            </div>

            <div className="arch-step-card">
              <span className="arch-step-num">PHASE 02</span>
              <h3 className="arch-step-title">Atomic Persistence</h3>
              <p className="arch-step-desc">
                Incoming news items are deduplicated strictly by canonical URL. Writes are atomic; if an upstream feed fails, the workflow preserves the previous valid file so consumers never see truncated data.
              </p>
            </div>

            <div className="arch-step-card">
              <span className="arch-step-num">PHASE 03</span>
              <h3 className="arch-step-title">Global GitHub CDN</h3>
              <p className="arch-step-desc">
                Files are committed to GitHub only when contents change. GitHub’s global edge servers host the raw files with <code>Access-Control-Allow-Origin: *</code>, allowing direct in-browser <code>fetch()</code> anywhere.
              </p>
            </div>
          </div>

          <div className="guarantees-grid">
            <div className="guarantee-card">
              <span className="guarantee-title">URL Deduplication</span>
              <span className="guarantee-text">No duplicate stories across multiple RSS sources or pagination windows.</span>
            </div>
            <div className="guarantee-card">
              <span className="guarantee-title">Graceful Retention</span>
              <span className="guarantee-text">Provider timeouts keep the last good file. Stale status is flagged in status.json.</span>
            </div>
            <div className="guarantee-card">
              <span className="guarantee-title">Zero API Keys</span>
              <span className="guarantee-text">You fetch public raw files; no credentials to rotate or leak on your frontend.</span>
            </div>
            <div className="guarantee-card">
              <span className="guarantee-title">Reference Implementation</span>
              <span className="guarantee-text">
                <a href="https://24x7.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>24x7.vercel.app</a> demonstrates zero-backend client-side consumption with reading queues.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                news-api
              </div>
              <p style={{ maxWidth: '380px', marginTop: 'var(--space-1)', lineHeight: 1.5 }}>
                An open-source news data publisher maintained by{' '}
                <a
                  href="https://github.com/pranav256"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}
                >
                  pranav256
                </a>
                . Publishing reliable static feeds for developers worldwide.
              </p>
              <p style={{ marginTop: 'var(--space-2)', fontSize: '12px', color: 'var(--text-muted)' }}>
                Original news articles, headlines, excerpts, and images belong to their respective publishers (The Hindu, BBC News, The New York Times, ESPN, Reuters, and independent syndications).
              </p>
            </div>

            <div className="footer-col">
              <div className="footer-heading">PROJECT LINKS</div>
              <ul className="footer-links">
                <li>
                  <a href="https://24x7.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>24x7 News Reader App</span>
                    <ExternalLink className="icon" style={{ width: '12px', height: '12px' }} />
                  </a>
                </li>
                <li><a href="https://github.com/pranav256/news-api" target="_blank" rel="noopener noreferrer">GitHub news-api Scraper</a></li>
                <li><a href="https://github.com/pranav256/news-api-web" target="_blank" rel="noopener noreferrer">GitHub news-api-web Portal</a></li>
                <li><a href="https://raw.githubusercontent.com/pranav256/news-api/main/data/status.json" target="_blank" rel="noopener noreferrer">Live status.json</a></li>
                <li><a href="https://github.com/pranav256/news-api/issues" target="_blank" rel="noopener noreferrer">Report an Issue</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <div className="footer-heading">ATTRIBUTION &amp; CRAFT</div>
              <ul className="footer-links">
                <li><span>Repository License: Unlicensed / Author Copyright</span></li>
                <li>
                  <span>
                    Crafted according to the{' '}
                    <a
                      href="https://heydamir.design/unslop"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'underline' }}
                    >
                      Unslop
                    </a>{' '}
                    design system by Damir Sokolovsky
                  </span>
                </li>
                <li><a href="#reader">Back to Live Reader &uarr;</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>&copy; 2026 news-api open data project. Published for educational &amp; research integration.</div>
            <div className="tabular">Edge CDN: raw.githubusercontent.com · No tracking · No telemetry cookies</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
