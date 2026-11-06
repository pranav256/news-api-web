'use client';

import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUpRight, Github, Globe2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Magnetic, ThemeToggle } from '@/components/controls';
import { Reader } from '@/components/reader';
import { ApiReference } from '@/components/api-reference';
import FeedHealth from '@/components/feed-health';
import { useResource } from '@/hooks/use-resource';
import {
  endpoint,
  parseNews,
  parseStatus,
  readSelection,
  relativeTime,
  STATUS_URL,
  type Selection,
} from '@/lib/news';

const navigation = [
  { id: 'reader', name: 'Live reader' },
  { id: 'docs', name: 'API reference' },
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
  useEffect(() => {
    if (menuOpen) document.querySelector<HTMLAnchorElement>('#primary-navigation a')?.focus();
  }, [menuOpen]);
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
  const onSelect = useCallback(
    (value: Partial<Selection>) => setSelection((previous) => ({ ...previous, ...value })),
    [],
  );
  const feedStatus = health.data?.feeds.find(
    (feed) => feed.country === selection.country && feed.category === selection.category,
  );
  return (
    <MotionConfig reducedMotion="user">
      <a href="#reader" className="skip-link">
        Skip to news
      </a>
      <header className="site-header">
        <div className="header-inner shell">
          <div className="brand-lockup">
            <a href="/" className="wordmark" aria-label="news-api home">
              news-api<span>.</span>
            </a>
            <span className="header-divider" />
            <span className="brand-descriptor">An open news project</span>
          </div>
          <nav
            id="primary-navigation"
            aria-label="Main navigation"
            className={`main-nav ${menuOpen ? 'is-open' : ''}`}
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
              24x7 reader <ArrowUpRight size={12} />
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
              <Github size={18} />
              <span>GitHub</span>
              <ArrowUpRight size={13} />
            </a>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon-lg"
              className="menu-toggle"
              id="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </header>
      <main className="shell">
        <section className="masthead" aria-labelledby="page-title">
          <div className="masthead-copy">
            <h1 id="page-title">
              The world’s news.
              <br />
              <em>Open to everyone.</em>
            </h1>
            <div className="masthead-caption">
              <span className="caption-line" />
              <span>Independent sources. Shared possibilities.</span>
            </div>
          </div>
          <div className="masthead-aside">
            <Globe2 className="hero-globe" size={28} strokeWidth={1} />
            <p>
              Across borders.
              <br />
              Beyond the paywall of data.
            </p>
            <span className="hero-description">
              News from India, the US, and the UK.
              <br /> Free news feeds. A fresh perspective every two hours.
            </span>
            <Magnetic>
              <Button asChild size="lg">
                <a href="#docs">
                  Start building <ArrowUpRight size={17} />
                </a>
              </Button>
            </Magnetic>
            <a href="#reader" className="hero-reader-link">
              Or stay for the stories <ArrowDown size={13} />
            </a>
          </div>
        </section>
        <div className="edition-strip">
          <span className="mono edition-date">
            {now
              ? new Date(now).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'The open edition'}
          </span>
          <span className="edition-strip-center">
            03 countries<span>07 sections</span>
            <span>21 open feeds</span>
          </span>
          <a href="#status">
            <span
              className={`live-dot ${health.data?.status === 'partial' ? 'warning-dot' : ''}`}
            />
            {health.data
              ? `Last run ${relativeTime(health.data.generatedAt, now)}`
              : health.error
                ? 'Status unavailable'
                : 'Checking the latest run'}
            <ArrowUpRight size={12} />
          </a>
        </div>
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
        <div className="open-data-banner">
          <span className="banner-mark" aria-hidden="true">
            {'{ }'}
          </span>
          <div>
            <h2>Read it here. Build on it anywhere.</h2>
            <p>The same stories, ready for your next project.</p>
          </div>
          <a href="#docs" className="text-link">
            Meet the API <ArrowRight size={17} />
          </a>
        </div>
        <ApiReference selection={selection} onSelect={onSelect} />
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
          className="architecture-section section-block"
          aria-labelledby="architecture-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="architecture-title">
                A small footprint.
                <br />
                <em>An open world.</em>
              </h2>
              <p>A simple pipeline, with nothing to run on your end.</p>
            </div>
            <a
              className="text-link"
              href="https://github.com/pranav256/news-api/actions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch the workflow <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="architecture-grid">
            <div>
              <span className="step-number">01 / COLLECT</span>
              <h3>The world keeps moving.</h3>
              <p>
                A scheduled GitHub Actions workflow gathers news from publishers every two hours.
              </p>
            </div>
            <div>
              <span className="step-number">02 / PUBLISH</span>
              <h3>One clean source.</h3>
              <p>
                Duplicate URLs are removed. JSON files are committed to Git. Failed refreshes keep
                the last successful feed.
              </p>
            </div>
            <div>
              <span className="step-number">03 / BUILD</span>
              <h3>Straight to your browser.</h3>
              <p>
                Fetch public files directly from GitHub. Open CORS makes every feed accessible
                without a proxy or API key.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="/" className="wordmark">
                news-api<span>.</span>
              </a>
              <p>A public resource for a curious world.</p>
              <a
                href="https://github.com/pranav256"
                target="_blank"
                rel="noopener noreferrer"
                className="small-text"
              >
                Built by Pranav <ArrowUpRight size={12} />
              </a>
            </div>
            <div className="footer-links">
              <span>EXPLORE</span>
              <a href="#reader">Live reader</a>
              <a href="#docs">API reference</a>
              <a href="#status">Feed health</a>
              <a href="#architecture">How it works</a>
            </div>
            <div className="footer-links">
              <span>OPEN SOURCE</span>
              <a
                href="https://github.com/pranav256/news-api"
                target="_blank"
                rel="noopener noreferrer"
              >
                Data repository <ArrowUpRight size={12} />
              </a>
              <a
                href="https://github.com/pranav256/news-api-web"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website source <ArrowUpRight size={12} />
              </a>
              <a href={STATUS_URL} target="_blank" rel="noopener noreferrer">
                Live status manifest <ArrowUpRight size={12} />
              </a>
              <a
                href="https://github.com/pranav256/news-api/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report an issue <ArrowUpRight size={12} />
              </a>
            </div>
            <div className="footer-callout">
              <span>TAKE YOUR TIME</span>
              <p>
                Good reading deserves
                <br />
                <em>a place to return to.</em>
              </p>
              <a
                className="text-link"
                href="https://24x7.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the 24x7 reader <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>News belongs to its respective publishers.</span>
            <span>Open data. Endless possibilities.</span>
            <a href="#page-title">Back to the top ↑</a>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}
