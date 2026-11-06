'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, Newspaper, RefreshCw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Segmented } from '@/components/controls';
import {
  CATEGORIES,
  COUNTRIES,
  countryName,
  exactTime,
  label,
  relativeTime,
  type Article,
  type NewsFeed,
  type Selection,
  type FeedStatus,
} from '@/lib/news';

function ArticleImage({ article, eager = false }: { article: Article; eager?: boolean }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="article-image">
      {article.image && !broken ? (
        <img
          src={article.image}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="image-fallback">
          <Newspaper size={36} strokeWidth={1} />
          <span>{article.publisher}</span>
        </div>
      )}
      <span className="image-open" aria-hidden="true">
        <ArrowUpRight size={19} />
      </span>
    </div>
  );
}

function ArticleMeta({ article, now }: { article: Article; now: number }) {
  return (
    <div className="article-meta">
      <span>{article.publisher}</span>
      <time dateTime={article.publishedAt ?? undefined} title={exactTime(article.publishedAt)}>
        {relativeTime(article.publishedAt, now)}
      </time>
    </div>
  );
}

function Story({
  article,
  variant,
  now,
}: {
  article: Article;
  variant: 'lead' | 'secondary' | 'compact' | 'grid';
  now: number;
}) {
  return (
    <article className={`story story-${variant}`}>
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="story-link">
        {variant !== 'compact' && (
          <ArticleImage key={article.url} article={article} eager={variant === 'lead'} />
        )}
        <div className="story-copy">
          <ArticleMeta article={article} now={now} />
          <h3>{article.title}</h3>
          {variant === 'lead' && <p className="story-description">{article.description}</p>}
          {variant === 'lead' && (
            <span className="read-story">
              Read the full story <ArrowUpRight size={15} />
            </span>
          )}
        </div>
      </a>
    </article>
  );
}

function StorySkeleton({ variant }: { variant: 'lead' | 'secondary' | 'compact' }) {
  return (
    <div className={`story story-${variant}`}>
      {variant !== 'compact' && <Skeleton className="article-image" />}
      <div className="article-meta">
        <Skeleton className="ghost-publisher" />
        <Skeleton className="ghost-time" />
      </div>
      <Skeleton className="ghost-heading" />
      {variant === 'lead' && (
        <>
          <Skeleton className="story-description" />
          <div className="read-story">
            <Skeleton className="h-4 w-28" />
          </div>
        </>
      )}
    </div>
  );
}

function ReaderSkeleton() {
  return (
    <div role="status" aria-label="Loading headlines from the selected feed">
      <div className="edition-grid reader-skeleton">
        <StorySkeleton variant="lead" />
        <div className="secondary-column">
          <StorySkeleton variant="secondary" />
          <StorySkeleton variant="secondary" />
        </div>
        <div className="briefing-column">
          <div className="briefing-title">
            Also in the headlines <span className="mono">—</span>
          </div>
          {[0, 1, 2].map((n) => (
            <StorySkeleton variant="compact" key={n} />
          ))}
          <div className="briefing-note">
            <Skeleton className="ghost-note-title" />
            <Skeleton className="ghost-note-copy" />
          </div>
        </div>
      </div>
      <div className="reader-bottom" aria-hidden="true">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-11 w-32" />
        <Skeleton className="skeleton-extra h-4 w-28" />
      </div>
    </div>
  );
}

export function Reader({
  selection,
  onSelect,
  feed,
  loading,
  error,
  refresh,
  status,
  now,
}: {
  selection: Selection;
  onSelect: (selection: Partial<Selection>) => void;
  feed: NewsFeed | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  status?: FeedStatus;
  now: number;
}) {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(6);
  useEffect(() => {
    setVisible(6);
    setQuery('');
  }, [selection.country, selection.category]);
  const articles = useMemo(
    () =>
      (feed?.articles ?? []).filter((article) =>
        `${article.title} ${article.publisher}`.toLowerCase().includes(query.toLowerCase().trim()),
      ),
    [feed, query],
  );
  const choose = (value: Partial<Selection>) => {
    setVisible(6);
    setQuery('');
    onSelect(value);
  };
  const refreshedAt = feed?.fetchedAt ?? status?.refreshedAt;
  return (
    <section id="reader" className="reader-section" aria-labelledby="reader-title">
      <div className="section-heading reader-heading">
        <div>
          <h2 id="reader-title">
            The latest edition<span className="accent-period">.</span>
          </h2>
          <p>Headlines from original sources.</p>
        </div>
        <Segmented
          label="Country"
          value={selection.country}
          options={COUNTRIES.map((country) => ({
            value: country.code,
            label: country.name,
            prefix: country.short,
          }))}
          onChange={(country) => choose({ country })}
          className="country-selector"
        />
      </div>
      <div className="reader-toolbar">
        <Segmented
          label="News category"
          value={selection.category}
          options={CATEGORIES.map((category) => ({
            value: category,
            label: category === 'general' ? 'Top stories' : label(category),
          }))}
          onChange={(category) => choose({ category })}
          className="category-selector"
        />
        <label className="search-field">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(6);
            }}
            placeholder="Search this edition"
            aria-label="Search headlines and publishers"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </label>
      </div>
      <div className="edition-info">
        <span>
          <span className="live-dot" />
          <span>{countryName(selection.country)}</span>
          <span className="info-divider">/</span>
          <span>{label(selection.category)}</span>
          <span className="info-divider">/</span>
          <span aria-live="polite">{feed ? `${articles.length} stories` : 'Loading edition'}</span>
        </span>
        <div>
          <time title={exactTime(refreshedAt)} dateTime={refreshedAt ?? undefined}>
            {refreshedAt ? `Updated ${relativeTime(refreshedAt, now)}` : 'Refresh time unavailable'}
          </time>
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh news"
            title="Refresh news"
          >
            <RefreshCw size={14} className={loading ? 'refreshing' : ''} />
          </Button>
        </div>
      </div>
      {error && (
        <div className="inline-error" role="alert">
          <p>
            {feed ? 'Showing the last loaded edition. ' : ''}
            {error}
          </p>
          <Button variant="outline" size="lg" onClick={refresh}>
            Try again
          </Button>
        </div>
      )}
      <div aria-busy={loading} className="reader-content">
        {!feed && loading ? (
          <ReaderSkeleton />
        ) : articles.length > 0 ? (
          <>
            <div className="edition-grid">
              <Story article={articles[0]} variant="lead" now={now} />
              <div className="secondary-column">
                {articles.slice(1, 3).map((article) => (
                  <Story key={article.url} article={article} variant="secondary" now={now} />
                ))}
              </div>
              <div className="briefing-column">
                <div className="briefing-title">
                  Also in the headlines{' '}
                  <span className="mono">
                    {String(Math.min(3, Math.max(0, articles.length - 3))).padStart(2, '0')}
                  </span>
                </div>
                {articles.slice(3, 6).map((article) => (
                  <Story key={article.url} article={article} variant="compact" now={now} />
                ))}
                <a
                  className="briefing-note"
                  href="https://24x7.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Make time for the full story.</span>
                  <span>
                    Save your reading list on 24x7 <ArrowUpRight size={15} />
                  </span>
                </a>
              </div>
            </div>
            {visible > 6 && (
              <div className="more-stories">
                {articles.slice(6, visible).map((article) => (
                  <Story key={article.url} article={article} variant="grid" now={now} />
                ))}
              </div>
            )}
            <div className="reader-bottom">
              <span className="small-text">
                Showing {Math.min(visible, articles.length)} of {articles.length} stories
              </span>
              {visible < articles.length && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisible((value) => value + 6)}
                >
                  More stories <ArrowDown size={16} />
                </Button>
              )}
              <span className="small-text">Original reporting. Original sources.</span>
            </div>
          </>
        ) : (
          !error && (
            <div className="empty-state">
              <Search size={28} strokeWidth={1.3} />
              <h3>{query ? 'No matching stories' : 'No stories in this edition'}</h3>
              <p>
                {query
                  ? 'Try another headline or publisher.'
                  : 'Choose another section or check back after the next refresh.'}
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => (query ? setQuery('') : choose({ category: 'general' }))}
              >
                {query ? 'Clear search' : 'Explore top stories'}
              </Button>
            </div>
          )
        )}
      </div>
    </section>
  );
}
