'use client';

import { useState } from 'react';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { exactTime, relativeTime, type Article } from '@/lib/news';

export function ArticlePhoto({ article, eager = false }: { article: Article; eager?: boolean }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="article-photo">
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
        <div className="photo-fallback">
          <Newspaper size={36} strokeWidth={1} />
          <span>{article.publisher}</span>
        </div>
      )}
    </div>
  );
}

export function ArticleCard({
  article,
  now,
  variant = 'standard',
}: {
  article: Article;
  now: number;
  variant?: 'lead' | 'standard' | 'brief';
}) {
  return (
    <article className={`article-card article-${variant}`}>
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-link">
        {variant !== 'brief' && <ArticlePhoto key={article.url} article={article} />}
        <div className="article-copy">
          <div className="article-meta">
            <span>{article.publisher}</span>
            <time
              dateTime={article.publishedAt ?? undefined}
              title={exactTime(article.publishedAt)}
            >
              {relativeTime(article.publishedAt, now)}
            </time>
          </div>
          <h3>{article.title}</h3>
          {variant === 'lead' && <p className="article-description">{article.description}</p>}
          <span className="article-action">
            Read the story <ArrowUpRight size={16} />
          </span>
        </div>
      </a>
    </article>
  );
}
