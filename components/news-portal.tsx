'use client';

import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  GitBranch,
  Github,
  Globe2,
  Menu,
  Rss,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Magnetic, ThemeToggle } from '@/components/controls';
import { ArticlePhoto } from '@/components/article-card';
import { Reader } from '@/components/reader';
import { ApiReference } from '@/components/api-reference';
import FeedHealth from '@/components/feed-health';
import { useResource } from '@/hooks/use-resource';
import {
  CATEGORIES,
  COUNTRIES,
  countryName,
  endpoint,
  exactTime,
  parseNews,
  parseStatus,
  readSelection,
  relativeTime,
  STATUS_URL,
  type Selection,
} from '@/lib/news';

const navigation = [
  { id: 'reader', name: 'Live reader' },
  { id: 'docs', name: 'API playground' },
  { id: 'status', name: 'Feed health' },
  { id: 'architecture', name: 'How it works' },
];

export default function NewsPortal() {
  const [selection, setSelection] = useState<Selection>({
    country: 'in',
    category: 'general',
    format: 'simple',
  });
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);
  const [active, setActive] = useState('reader');
  const [menuOpen, setMenuOpen] = useState(false);
  const news = useResource(endpoint(selection), parseNews, 120000);
  const health = useResource(STATUS_URL, parseStatus, 60000);
  useEffect(() => {
    const restore = () => setSelection(readSelection(window.location.search));
    restore();
    setReady(true);
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    window.addEventListener('popstate', restore);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('popstate', restore);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(selection)) url.searchParams.set(key, value);
    window.history.replaceState(window.history.state, '', url);
  }, [selection, ready]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
    );
    navigation.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (menuOpen) document.querySelector<HTMLAnchorElement>('#primary-navigation a')?.focus();
  }, [menuOpen]);
  const onSelect = useCallback(
    (value: Partial<Selection>) => setSelection((previous) => ({ ...previous, ...value })),
    [],
  );
  const feedStatus = health.data?.feeds.find(
    (feed) => feed.country === selection.country && feed.category === selection.category,
  );
  const heroArticle =
    news.data?.articles.find((article) => article.image) ?? news.data?.articles[0];
  const overdue = Boolean(
    health.data?.generatedAt && now - Date.parse(health.data.generatedAt) > 6 * 3600000,
  );
  const statusHealthy =
    ['ok', 'success'].includes(health.data?.status ?? '') && !overdue && !health.error;
  return (
    <MotionConfig reducedMotion="user">
      <a href="#reader" className="skip-link">
        Skip to news
      </a>
      <header className="site-header">
        <div className="shell header-inner">
          <a href="/" className="wordmark" aria-label="news-api home">
            <Braces size={25} strokeWidth={1.5} />
            <span>
              news-api<span className="accent-dot">.</span>
            </span>
          </a>
          <nav
            id="primary-navigation"
            className={`main-nav ${menuOpen ? 'is-open' : ''}`}
            aria-label="Main navigation"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setMenuOpen(false);
                document.getElementById('menu-toggle')?.focus();
              }
            }}
          >
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="https://24x7.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              24x7 reader <ArrowUpRight size={14} />
            </a>
          </nav>
          <div className="header-actions">
            <a
              href="https://github.com/pranav256/news-api"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              aria-label="Open news-api on GitHub"
            >
              <Github size={19} />
              <span>GitHub</span>
            </a>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon-lg"
              id="menu-toggle"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </Button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero shell" aria-labelledby="page-title">
          <div className="hero-copy">
            <h1 id="page-title">
              The world,
              <br />
              <em>in plain JSON.</em>
            </h1>
            <p>Public news from three countries. No signup or API key.</p>
            <div className="hero-actions">
              <Magnetic>
                <Button asChild size="lg">
                  <a href="#docs">
                    Explore the API <ArrowUpRight size={18} />
                  </a>
                </Button>
              </Magnetic>
            </div>
            <div className="hero-assurance">Fetch from any browser.</div>
            <div className="hero-facts">
              <div>
                <strong>{COUNTRIES.length}</strong>
                <span>Countries</span>
              </div>
              <div>
                <strong>{COUNTRIES.length * CATEGORIES.length}</strong>
                <span>Public feeds</span>
              </div>
              <div>
                <strong>
                  2<span>h</span>
                </strong>
                <span>Scheduled refresh</span>
              </div>
            </div>
          </div>
          <div className="hero-publication">
            <div className="publication-top">
              <span>From the public feed</span>
              <span>{countryName(selection.country)}</span>
            </div>
            <Card className="hero-story">
              {heroArticle ? (
                <a href={heroArticle.url} target="_blank" rel="noopener noreferrer">
                  <ArticlePhoto key={heroArticle.url} article={heroArticle} eager />
                  <div className="hero-story-copy">
                    <div className="article-meta">
                      <span>{heroArticle.publisher}</span>
                      <time
                        title={exactTime(heroArticle.publishedAt)}
                        dateTime={heroArticle.publishedAt ?? undefined}
                      >
                        {relativeTime(heroArticle.publishedAt, now)}
                      </time>
                    </div>
                    <h2>{heroArticle.title}</h2>
                    <span className="article-action">
                      Read the original report <ArrowUpRight size={16} />
                    </span>
                  </div>
                </a>
              ) : news.loading ? (
                <div role="status" aria-label="Loading featured story">
                  <Skeleton className="article-photo" />
                  <div className="hero-story-copy">
                    <Skeleton className="loading-meta" />
                    <Skeleton className="loading-title" />
                    <Skeleton className="loading-action" />
                  </div>
                </div>
              ) : (
                <div className="hero-no-story">
                  <NewspaperPlaceholder />
                  <h2>
                    {news.error ? 'The edition is unavailable.' : 'A fresh edition is on its way.'}
                  </h2>
                  <a href="#reader" className="text-link">
                    Choose a feed <ArrowRight size={16} />
                  </a>
                </div>
              )}
            </Card>
            <div className="publication-bottom">
              <span>Original sources. Direct access.</span>
              <a href="#reader" aria-label="Explore the live reader">
                <ArrowDown size={19} />
              </a>
            </div>
          </div>
        </section>
        <div className="edition-band">
          <div className="shell edition-band-inner">
            <span>
              {now
                ? new Date(now).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'The open edition'}
            </span>
            <div className="coverage-list">
              {COUNTRIES.map((country) => (
                <span key={country.code}>{country.name}</span>
              ))}
            </div>
            <a href="#status">
              <span className={`live-dot ${statusHealthy ? '' : 'warning-dot'}`} />
              {health.data
                ? `${overdue ? 'Refresh overdue' : health.data.status === 'partial' ? 'Partial run' : statusHealthy ? 'Last run' : 'Run needs attention'} ${relativeTime(health.data.generatedAt, now)}`
                : health.error
                  ? 'Status unavailable'
                  : 'Checking feed health'}
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="shell">
          <Reader
            selection={selection}
            onSelect={onSelect}
            feed={news.data}
            loading={news.loading}
            error={news.error}
            refresh={news.refresh}
            status={feedStatus}
            now={now}
          />
          <ApiReference
            selection={selection}
            onSelect={onSelect}
            feed={news.data}
            loading={news.loading}
            error={news.error}
          />
          <FeedHealth
            data={health.data}
            loading={health.loading}
            error={health.error}
            refresh={health.refresh}
            checkedAt={health.checkedAt}
            now={now}
            onSelect={onSelect}
          />
          <section
            id="architecture"
            className="architecture-section section-space"
            aria-labelledby="architecture-title"
          >
            <div className="architecture-intro">
              <h2 id="architecture-title">
                Small files.
                <br />
                <em>A wide open web.</em>
              </h2>
              <p>Scheduled collection. Static files. Nothing for you to host.</p>
              <a
                href="https://github.com/pranav256/news-api/actions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Watch the workflow <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="pipeline-list">
              <div>
                <span className="pipeline-number">01</span>
                <Rss size={23} strokeWidth={1.5} />
                <div>
                  <h3>Collect from publishers</h3>
                  <p>GitHub Actions gathers headline and RSS feeds every two hours.</p>
                </div>
              </div>
              <div>
                <span className="pipeline-number">02</span>
                <GitBranch size={23} strokeWidth={1.5} />
                <div>
                  <h3>Publish to Git</h3>
                  <p>
                    Duplicate URLs are removed. Atomic writes keep the previous feed if a refresh
                    fails.
                  </p>
                </div>
              </div>
              <div>
                <span className="pipeline-number">03</span>
                <Globe2 size={23} strokeWidth={1.5} />
                <div>
                  <h3>Fetch from anywhere</h3>
                  <p>
                    Read public JSON directly from GitHub. Open CORS means no proxy or credentials.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <section className="reference-section" aria-labelledby="reference-title">
          <div className="shell reference-inner">
            <div>
              <h2 id="reference-title">
                For the stories
                <br />
                <em>you want to return to.</em>
              </h2>
              <p>The 24x7 reader saves your reading list in this browser.</p>
            </div>
            <Button asChild size="lg">
              <a href="https://24x7.vercel.app" target="_blank" rel="noopener noreferrer">
                Open the 24x7 reader <ArrowUpRight size={18} />
              </a>
            </Button>
          </div>
        </section>
      </main>
      <footer className="site-footer shell">
        <div className="footer-grid">
          <div>
            <a href="/" className="wordmark">
              <Braces size={24} strokeWidth={1.5} />
              <span>
                news-api<span className="accent-dot">.</span>
              </span>
            </a>
            <p>Public news. A shared resource.</p>
            <a
              href="https://github.com/pranav256"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Built by Pranav <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="footer-links">
            <span>Explore</span>
            {navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.name}
              </a>
            ))}
            <a href="https://24x7.vercel.app" target="_blank" rel="noopener noreferrer">
              24x7 reader <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="footer-links">
            <span>Open source</span>
            <a
              href="https://github.com/pranav256/news-api"
              target="_blank"
              rel="noopener noreferrer"
            >
              Data repository <ArrowUpRight size={14} />
            </a>
            <a
              href="https://github.com/pranav256/news-api-web"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website source <ArrowUpRight size={14} />
            </a>
            <a href={STATUS_URL} target="_blank" rel="noopener noreferrer">
              Live health manifest <ArrowUpRight size={14} />
            </a>
            <a
              href="https://github.com/pranav256/news-api/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report an issue <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Reporting and photography belong to their respective publishers.</span>
          <a href="#page-title">
            Back to the top <ArrowUpRight size={15} />
          </a>
        </div>
      </footer>
    </MotionConfig>
  );
}

function NewspaperPlaceholder() {
  return <Braces size={48} strokeWidth={1} aria-hidden="true" />;
}
