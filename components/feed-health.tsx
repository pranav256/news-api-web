'use client';

import { useState } from 'react';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/ui/stat-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Segmented } from '@/components/controls';
import {
  COUNTRIES,
  countryName,
  endpoint,
  exactTime,
  label,
  relativeTime,
  type Country,
  type FeedStatus,
  type PipelineStatus,
  type Selection,
} from '@/lib/news';

const tone = (status: FeedStatus['status']) =>
  status === 'updated' ? 'success' : status === 'retained' ? 'warning' : 'outline';

export default function FeedHealth({
  data,
  loading,
  error,
  refresh,
  checkedAt,
  now,
  onSelect,
}: {
  data: PipelineStatus | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  checkedAt: string | null;
  now: number;
  onSelect: (selection: Partial<Selection>) => void;
}) {
  const [region, setRegion] = useState<Country | 'all'>('in');
  const [filter, setFilter] = useState('all');
  const [selectedKey, setSelectedKey] = useState('in/general');
  const feeds =
    data?.feeds.filter(
      (feed) =>
        (region === 'all' || feed.country === region) &&
        (filter === 'all' || feed.status === filter),
    ) ?? [];
  const selected =
    feeds.find((feed) => `${feed.country}/${feed.category}` === selectedKey) ?? feeds[0];
  const delayed = Boolean(
    data?.generatedAt && now - Date.parse(data.generatedAt) > 6 * 60 * 60 * 1000,
  );
  const healthy = data?.status === 'ok' || data?.status === 'success';
  const total =
    data?.feeds.length && data.feeds.every((feed) => feed.count !== null)
      ? data.feeds.reduce((sum, feed) => sum + (feed.count ?? 0), 0)
      : null;
  return (
    <section id="status" className="health-section section-block" aria-labelledby="health-title">
      <div className="section-heading">
        <div>
          <h2 id="health-title">
            Feed health, in the open<span className="accent-period">.</span>
          </h2>
          <p>Every feed. Every refresh. All out in the open.</p>
        </div>
        <Button variant="outline" size="lg" onClick={refresh} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'refreshing' : ''} />
          Refresh status
        </Button>
      </div>
      {error && (
        <div role="alert" className="inline-error">
          <p>
            {data ? 'Showing the last checked status. ' : ''}
            {error}
          </p>
          <Button variant="outline" size="lg" onClick={refresh}>
            Try again
          </Button>
        </div>
      )}
      {!data ? (
        loading && (
          <div className="health-loading" role="status">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-80 w-full" />
            <span className="sr-only">Loading feed health.</span>
          </div>
        )
      ) : (
        <>
          <div className="health-overview">
            <StatCard
              label="Feeds updated in the last run"
              value={data.updated ?? '—'}
              description={`${data.feeds.length} feeds in the manifest`}
            />
            <div className="health-metric">
              <span className="metric-value">{total?.toLocaleString('en-GB') ?? '—'}</span>
              <span>Published articles</span>
            </div>
            <div className="health-metric">
              <span className="metric-value">{data.retained ?? '—'}</span>
              <span>Previous feeds retained</span>
            </div>
            <div
              className="run-status"
              data-connected={Boolean(checkedAt && !error && now - Date.parse(checkedAt) < 90000)}
            >
              <Badge variant={delayed || !healthy ? 'warning' : 'success'}>
                <span className={`live-dot ${healthy && !delayed ? '' : 'warning-dot'}`} />
                {delayed
                  ? 'Refresh overdue'
                  : healthy
                    ? 'Run completed'
                    : data.status === 'partial'
                      ? 'Partial run'
                      : 'Run needs attention'}
              </Badge>
              <span className="small-text">Published {relativeTime(data.generatedAt, now)}</span>
              <span className="small-text">Checked {relativeTime(checkedAt, now)}</span>
            </div>
          </div>
          <div className="health-controls">
            <Segmented
              label="Feed health region"
              value={region}
              options={[
                ...COUNTRIES.map((country) => ({
                  value: country.code as Country | 'all',
                  label: country.name,
                })),
                { value: 'all', label: 'All regions' },
              ]}
              onChange={setRegion}
            />
            <label className="status-filter">
              Show
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter by feed status"
              >
                <option value="all">All statuses</option>
                <option value="updated">Updated</option>
                <option value="retained">Retained</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>
          </div>
          <div className="health-records">
            <div className="feed-table">
              <Table aria-label="Feed health: select a feed to inspect its metadata">
                <TableHeader>
                  <TableRow>
                    <TableHead>Feed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="number-cell">Articles</TableHead>
                    <TableHead className="refresh-cell">Refreshed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeds.map((feed) => (
                    <TableRow
                      key={`${feed.country}/${feed.category}`}
                      data-state={selected === feed ? 'selected' : undefined}
                    >
                      <TableCell>
                        <button
                          className="feed-select"
                          type="button"
                          onClick={() => setSelectedKey(`${feed.country}/${feed.category}`)}
                          aria-pressed={selected === feed}
                        >
                          <span className="country-code">{feed.country.toUpperCase()}</span>
                          {label(feed.category)}
                          <ArrowUpRight size={13} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tone(feed.status)}>{label(feed.status)}</Badge>
                      </TableCell>
                      <TableCell className="number-cell mono">{feed.count ?? '—'}</TableCell>
                      <TableCell className="refresh-cell">
                        <time
                          title={exactTime(feed.refreshedAt)}
                          dateTime={feed.refreshedAt ?? undefined}
                        >
                          {relativeTime(feed.refreshedAt, now)}
                        </time>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {feeds.length === 0 && (
                <p className="table-empty">No feeds match this status. Choose another filter.</p>
              )}
            </div>
            {selected && (
              <Sidebar
                className="feed-detail h-auto w-full rounded-lg border"
                aria-label="Selected feed details"
              >
                <SidebarHeader className="px-6">
                  <div className="detail-heading w-full">
                    <span className="mono">FEED DETAILS</span>
                    <Badge variant={tone(selected.status)}>{label(selected.status)}</Badge>
                  </div>
                </SidebarHeader>
                <SidebarContent className="px-6 py-4">
                  <div>
                    <h3>{label(selected.category)}</h3>
                    <p>{countryName(selected.country)}</p>
                  </div>
                  <dl>
                    <div>
                      <dt>Last successful refresh</dt>
                      <dd>{exactTime(selected.refreshedAt)}</dd>
                    </div>
                    <div>
                      <dt>Last attempt</dt>
                      <dd>{exactTime(selected.attemptedAt)}</dd>
                    </div>
                    <div>
                      <dt>Providers</dt>
                      <dd>
                        {selected.providers.length ? selected.providers.join(' + ') : 'Unavailable'}
                      </dd>
                    </div>
                    <div>
                      <dt>Published articles</dt>
                      <dd>{selected.count ?? 'Unavailable'}</dd>
                    </div>
                  </dl>
                </SidebarContent>
                <SidebarFooter className="px-6 py-4">
                  <a
                    className="text-link"
                    href={endpoint({
                      country: selected.country,
                      category: selected.category,
                      format: 'rich',
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Inspect the JSON <ArrowUpRight size={15} />
                  </a>
                  <SidebarItem
                    icon={<ArrowUpRight size={16} />}
                    className="mt-3 min-h-11 border border-(--line-strong) text-center"
                    onClick={() => {
                      onSelect({ country: selected.country, category: selected.category });
                      window.location.hash = 'reader';
                    }}
                  >
                    Read this feed
                  </SidebarItem>
                </SidebarFooter>
              </Sidebar>
            )}
          </div>
          <div className="health-footnote">
            <p>
              <strong>Updated</strong> means a provider returned fresh data.{' '}
              <strong>Retained</strong> means the previous successful feed is still available.
            </p>
            <p>
              {data.providerAttempts !== null
                ? `${data.providerSuccesses ?? '—'} of ${data.providerAttempts} RSS sources succeeded${data.providerFailures ? `; ${data.providerFailures} failed` : ''}. `
                : ''}
              Status is checked every minute while this page is open.
            </p>
            {delayed && (
              <p className="warning-text">
                The manifest is more than six hours old. Check the workflow for the latest run.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
