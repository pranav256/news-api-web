'use client';

import { useState } from 'react';
import { ArrowUpRight, Braces, ChevronDown } from 'lucide-react';
import { CopyButton, Segmented } from '@/components/controls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { endpoint, label, snippet, type Language, type Selection, STATUS_URL } from '@/lib/news';

const languages: { value: Language; label: string }[] = [
  { value: 'curl', label: 'cURL' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
];

export function ApiReference({
  selection,
  onSelect,
}: {
  selection: Selection;
  onSelect: (value: Partial<Selection>) => void;
}) {
  const [language, setLanguage] = useState<Language>('javascript');
  const url = endpoint(selection);
  return (
    <section id="docs" className="api-section section-block" aria-labelledby="api-title">
      <div className="api-intro">
        <h2 id="api-title">
          Good stories.
          <br />
          <em>Great possibilities.</em>
        </h2>
        <p>Public news feeds for your next project.</p>
        <p className="api-description">No signup. No API key.</p>
        <a
          className="text-link"
          href="https://github.com/pranav256/news-api"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore the repository <ArrowUpRight size={16} />
        </a>
        <div className="api-facts">
          <span>
            <Braces size={17} /> Plain JSON
          </span>
          <span>Open CORS</span>
          <span>Free to fetch</span>
        </div>
      </div>
      <div className="api-workspace" id="endpoints">
        <div className="endpoint-heading">
          <span className="mono">YOUR ENDPOINT</span>
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
        <div className="endpoint-address">
          <span className="get-method">GET</span>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
          <CopyButton value={url} label="Copy URL" />
        </div>
        <div className="endpoint-selection">
          <span>
            {selection.country.toUpperCase()}
            <span className="info-divider">/</span>
            {label(selection.category)}
          </span>
          <a href="#reader">
            Change feed <ArrowUpRight size={13} />
          </a>
        </div>
        <Tabs
          value={language}
          onValueChange={(value) => setLanguage(value as Language)}
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
            <CopyButton value={snippet(language, url)} label="Copy code" />
          </div>
          {languages.map((item) => (
            <TabsContent key={item.value} value={item.value}>
              <pre tabIndex={0} aria-label={`${item.label} code example`}>
                <code>
                  {snippet(item.value, url)
                    .split('\n')
                    .map((line, i) => (
                      <span className={`code-line ${line.includes(url) ? 'code-url' : ''}`} key={i}>
                        <span className="line-number" aria-hidden="true">
                          {i + 1}
                        </span>
                        <span>{line || ' '}</span>
                      </span>
                    ))}
                </code>
              </pre>
            </TabsContent>
          ))}
          <div className="code-footer">
            <span className="code-dot" /> Direct from GitHub to your application.
          </div>
        </Tabs>
        <details className="schema-details">
          <summary>
            What’s in the response? <ChevronDown size={16} />
          </summary>
          <p>
            {selection.format === 'rich'
              ? 'The metadata format adds country, category, providers, fetched_at and articles_count alongside the articles array.'
              : 'The standard format returns status, totalResults and an articles array.'}
          </p>
          <p>
            Each article includes source, author, title, description, url, urlToImage, publishedAt
            and content. Missing publisher fields may be null.
          </p>
          <a href={STATUS_URL} target="_blank" rel="noopener noreferrer" className="text-link">
            Open the health manifest <ArrowUpRight size={14} />
          </a>
        </details>
      </div>
    </section>
  );
}
