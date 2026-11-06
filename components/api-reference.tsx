'use client';

import { useState } from 'react';
import { ArrowUpRight, Braces, Check, ChevronDown } from 'lucide-react';
import { CopyButton, Segmented } from '@/components/controls';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CATEGORIES,
  COUNTRIES,
  endpoint,
  label,
  snippet,
  type Category,
  type Country,
  type Language,
  type NewsFeed,
  type Selection,
  ROOT_URL,
  STATUS_URL,
} from '@/lib/news';

const languages: { value: Language | 'response'; label: string }[] = [
  { value: 'curl', label: 'cURL' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'response', label: 'JSON response' },
];
const searchCategories = ['business', 'health', 'science', 'sports', 'technology'];

export function ApiReference({
  selection,
  onSelect,
  feed,
  loading,
  error,
}: {
  selection: Selection;
  onSelect: (value: Partial<Selection>) => void;
  feed: NewsFeed | null;
  loading: boolean;
  error: string | null;
}) {
  const [language, setLanguage] = useState<Language | 'response'>('javascript');
  const url = endpoint(selection);
  const code = (value: Language | 'response') =>
    value === 'response' ? (feed?.preview ?? '') : snippet(value, url);
  const searchCategory = searchCategories.includes(selection.category)
    ? selection.category
    : 'business';
  return (
    <section id="docs" className="api-section section-space" aria-labelledby="api-title">
      <div className="section-heading">
        <div>
          <h2 id="api-title">
            Your next project starts here<span>.</span>
          </h2>
          <p>Select a feed. Copy the code. Make it your own.</p>
        </div>
        <a
          href="https://github.com/pranav256/news-api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Explore the repository <ArrowUpRight size={17} />
        </a>
      </div>
      <Card className="api-studio" id="endpoints">
        <div className="api-config">
          <div className="studio-identity">
            <Braces size={26} strokeWidth={1.5} />
            <span>API playground</span>
          </div>
          <p>
            One public URL.
            <br />
            Any language. Any browser.
          </p>
          <label className="studio-field">
            Country
            <select
              aria-label="API country"
              value={selection.country}
              onChange={(event) => onSelect({ country: event.target.value as Country })}
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>
          <label className="studio-field">
            Section
            <select
              aria-label="API section"
              value={selection.category}
              onChange={(event) => onSelect({ category: event.target.value as Category })}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {label(category)}
                </option>
              ))}
            </select>
          </label>
          <div className="format-field">
            <span>Response format</span>
            <Segmented
              label="Response format"
              value={selection.format}
              options={[
                { value: 'simple', label: 'Standard' },
                { value: 'rich', label: 'With metadata' },
              ]}
              onChange={(format) => onSelect({ format })}
            />
          </div>
          <div className="studio-guarantees">
            <span>
              <Check size={15} /> No API key
            </span>
            <span>
              <Check size={15} /> Open browser access
            </span>
            <span>
              <Check size={15} /> Static JSON in Git
            </span>
          </div>
        </div>
        <div className="api-code">
          <div className="endpoint-address">
            <span className="method-label">GET</span>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
            <CopyButton value={url} label="Copy URL" />
          </div>
          <Tabs
            value={language}
            onValueChange={(value) => setLanguage(value as Language | 'response')}
            className="code-window"
          >
            <div className="code-toolbar">
              <TabsList aria-label="Code language">
                {languages.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {(language !== 'response' || feed) && (
                <CopyButton
                  value={code(language)}
                  label={language === 'response' ? 'Copy JSON' : 'Copy code'}
                />
              )}
            </div>
            {languages.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                {item.value === 'response' && !feed ? (
                  <div className="response-state" role="status">
                    {error
                      ? 'The response is unavailable. Refresh the live edition to try again.'
                      : 'Fetching the selected public feed…'}
                  </div>
                ) : (
                  <pre tabIndex={0} aria-label={`${item.label} example`}>
                    <code>
                      {code(item.value)
                        .split('\n')
                        .map((line, index) => (
                          <span
                            className={`code-line ${line.includes(url) ? 'code-url' : ''}`}
                            key={index}
                          >
                            <span className="line-number" aria-hidden="true">
                              {index + 1}
                            </span>
                            <span>{line || ' '}</span>
                          </span>
                        ))}
                    </code>
                  </pre>
                )}
              </TabsContent>
            ))}
          </Tabs>
          <div className="code-footer">
            <span className={`live-dot ${error ? 'warning-dot' : ''}`} />
            {language === 'response'
              ? 'Live response preview: first visible article. Original feed counts are preserved.'
              : 'Fetched directly from raw.githubusercontent.com.'}
            {loading && feed && <span>Refreshing…</span>}
          </div>
        </div>
      </Card>
      <div className="api-notes">
        <details>
          <summary>
            Response fields <ChevronDown size={17} />
          </summary>
          <p>
            {selection.format === 'rich'
              ? 'Rich feeds include source, country, category, providers, fetched_at, articles_count and articles.'
              : 'Standard feeds return status, totalResults and articles.'}
          </p>
          <p>
            Articles include source, author, title, description, url, urlToImage, publishedAt and
            content. Missing publisher values may be null. The reader omits stories covered by its
            editorial exclusions; the public endpoint remains unchanged.
          </p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-link">
            Inspect the complete feed <ArrowUpRight size={15} />
          </a>
        </details>
        <details>
          <summary>
            More endpoints <ChevronDown size={17} />
          </summary>
          <p>
            Deep-search files are published for business, health, science, sports and technology.
            Search uses the available upstream request budget, with category RSS as a fallback.
          </p>
          <a
            href={`${ROOT_URL}/data/${selection.country}/${searchCategory}_everything.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Open {label(searchCategory)} search JSON <ArrowUpRight size={15} />
          </a>
          <a href={STATUS_URL} target="_blank" rel="noopener noreferrer" className="text-link">
            Open the health manifest <ArrowUpRight size={15} />
          </a>
          <p>
            Countries use in, us or gb. GitHub CDN caching can delay publication after a commit.
          </p>
        </details>
      </div>
    </section>
  );
}
