'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, RefreshCw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Segmented } from '@/components/controls';
import { ArticleCard } from '@/components/article-card';
import {
  CATEGORIES,
  COUNTRIES,
  countryName,
  exactTime,
  label,
  relativeTime,
  type NewsFeed,
  type Selection,
  type FeedStatus,
} from '@/lib/news';

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
    setQuery('');
    setVisible(6);
  }, [selection.country, selection.category, selection.format]);
  const articles = useMemo(
    () =>
      (feed?.articles ?? []).filter((article) =>
        `${article.title} ${article.description ?? ''} ${article.publisher}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [feed, query],
  );
  const refreshedAt = feed?.fetchedAt ?? status?.refreshedAt;
  return (
    <section id="reader" className="reader-section section-space" aria-labelledby="reader-title">
      <div className="section-heading">
        <div>
          <h2 id="reader-title">
            The live edition<span>.</span>
          </h2>
          <p>Original reporting, across three countries. Pick your perspective.</p>
        </div>
        <Segmented
          label="Country"
          value={selection.country}
          options={COUNTRIES.map((country) => ({ value: country.code, label: country.name }))}
          onChange={(country) => onSelect({ country })}
          className="country-selector"
        />
      </div>
      <Card className="reader-shell">
        <Sidebar className="reader-sidebar h-auto" aria-label="News sections">
          <SidebarHeader>
            <span className="reader-edition-name">{countryName(selection.country)}</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Sections</SidebarGroupLabel>
              {CATEGORIES.map((category) => (
                <SidebarItem
                  key={category}
                  active={selection.category === category}
                  onClick={() => onSelect({ category })}
                >
                  {category === 'general' ? 'Top stories' : label(category)}
                </SidebarItem>
              ))}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="mt-0">
            <span className="sidebar-note">Stories open at the original publisher.</span>
          </SidebarFooter>
        </Sidebar>
        <div className="reader-main">
          <div className="reader-toolbar">
            <div className="reader-feed-title">
              <span
                className={`live-dot ${error || status?.status === 'retained' ? 'warning-dot' : ''}`}
              />
              <h3>{label(selection.category)}</h3>
              <span aria-live="polite">
                {feed ? `${articles.length} stories` : error ? 'Unavailable' : 'Loading'}
              </span>
            </div>
            <label className="search-field">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search this edition"
                aria-label="Search headlines and publishers"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisible(6);
                }}
              />
              {query && (
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                >
                  <X size={16} />
                </Button>
              )}
            </label>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Refresh news"
              title="Refresh news"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw size={17} className={loading ? 'refreshing' : ''} />
            </Button>
          </div>
          <div className="mobile-categories">
            <Segmented
              label="News category"
              value={selection.category}
              options={CATEGORIES.map((category) => ({
                value: category,
                label: category === 'general' ? 'Top stories' : label(category),
              }))}
              onChange={(category) => onSelect({ category })}
            />
          </div>
          <div className="edition-freshness">
            <time title={exactTime(refreshedAt)} dateTime={refreshedAt ?? undefined}>
              {refreshedAt
                ? `${status?.status === 'retained' ? 'Retained from' : 'Refreshed'} ${relativeTime(refreshedAt, now)}`
                : 'Refresh time unavailable'}
            </time>
            <a href="#status">
              View feed health <ArrowUpRight size={14} />
            </a>
          </div>
          {error && (
            <div role="alert" className="inline-error">
              <p>
                {feed ? 'Showing the last loaded edition. ' : ''}
                {error}
              </p>
              <Button variant="outline" onClick={refresh}>
                Try again
              </Button>
            </div>
          )}
          <div className="reader-content" aria-busy={loading}>
            {!feed && loading ? (
              <div className="reader-loading" role="status" aria-label="Loading headlines">
                <div className="edition-grid">
                  <div className="loading-lead">
                    <Skeleton className="article-photo" />
                    <Skeleton className="loading-meta" />
                    <Skeleton className="loading-title" />
                    <Skeleton className="loading-description" />
                    <Skeleton className="loading-action" />
                  </div>
                  <div className="edition-secondary">
                    {[0, 1].map((n) => (
                      <div key={n} className="loading-standard">
                        <Skeleton className="article-photo" />
                        <Skeleton className="loading-meta" />
                        <Skeleton className="loading-title" />
                        <Skeleton className="loading-action" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="brief-grid">
                  {[0, 1, 2].map((n) => (
                    <div key={n} className="loading-brief">
                      <Skeleton className="loading-meta" />
                      <Skeleton className="loading-title" />
                      <Skeleton className="loading-action" />
                    </div>
                  ))}
                </div>
                <span className="sr-only">Fetching the selected public feed.</span>
              </div>
            ) : articles.length ? (
              <>
                <div className="edition-grid">
                  <ArticleCard article={articles[0]} now={now} variant="lead" />
                  <div className="edition-secondary">
                    {articles.slice(1, 3).map((article) => (
                      <ArticleCard key={article.url} article={article} now={now} />
                    ))}
                  </div>
                </div>
                <div className="brief-grid">
                  {articles.slice(3, 6).map((article) => (
                    <ArticleCard key={article.url} article={article} now={now} variant="brief" />
                  ))}
                </div>
                {visible > 6 && (
                  <div className="more-stories">
                    {articles.slice(6, visible).map((article) => (
                      <ArticleCard key={article.url} article={article} now={now} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              !error && (
                <div className="empty-state">
                  <Search size={30} />
                  <h3>{query ? 'No matching stories' : 'No stories in this edition'}</h3>
                  <p>
                    {query
                      ? 'Try a different headline or publisher.'
                      : 'Choose another section, or refresh this feed.'}
                  </p>
                  <Button variant="outline" onClick={() => (query ? setQuery('') : refresh())}>
                    {query ? 'Clear search' : 'Refresh feed'}
                  </Button>
                </div>
              )
            )}
          </div>
          <div className="reader-bottom">
            <span>
              {feed
                ? `Showing ${Math.min(visible, articles.length)} of ${articles.length}`
                : 'Direct from the public feed'}
            </span>
            {visible < articles.length && (
              <Button variant="outline" size="lg" onClick={() => setVisible((value) => value + 6)}>
                More stories <ArrowDown size={16} />
              </Button>
            )}
            <span>Publisher access terms apply.</span>
          </div>
        </div>
      </Card>
    </section>
  );
}
