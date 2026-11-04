---
title: How I Built a Free, Zero-Server News API Using GitHub Actions and Git as a CDN
published: true
tags: webdev, nextjs, python, opensource
cover_image: https://news-api-web-five.vercel.app/opengraph-image
canonical_url: https://news-api-web-five.vercel.app
---

Most commercial news APIs require paid subscriptions costing $400+ per month or lock developer tiers behind restrictive rate limits and mandatory API keys.

If you just want to build a quick side project—a personal news aggregator, a terminal RSS widget, or an LLM summarization pipeline—you shouldn't need to sign up for API keys, manage credentials, or pay for a dedicated backend server.

I built and open-sourced **news-api** to solve this: an automated data pipeline that continuously refreshes and commits structured JSON news files every two hours directly to GitHub.

- **Live Reader & API Docs:** [https://news-api-web-five.vercel.app](https://news-api-web-five.vercel.app)
- **Production Consumer App (24x7):** [https://24x7.vercel.app](https://24x7.vercel.app)
- **Data Pipeline Repo:** [https://github.com/pranav256/news-api](https://github.com/pranav256/news-api)
- **Web App Repo:** [https://github.com/pranav256/news-api-web](https://github.com/pranav256/news-api-web)

---

## 1. The Core Architecture

The entire system relies on three principles:
1. **Zero persistent server costs.**
2. **Git as an immutable, versioned database.**
3. **GitHub's raw content CDN as the edge delivery layer.**

```
 Upstream NewsAPI + RSS Feeds
             │
             ▼
   GitHub Actions Cron (Every 120m)
             │
      Python Scraper Engine
   (Deduplication + Normalization)
             │
             ▼
   Atomic Git Commit to Repo
  (data/status.json + 21 feeds)
             │
             ▼
   raw.githubusercontent.com
  (Edge CDN · Cache-Control · CORS: *)
             │
   ┌─────────┴─────────┐
   ▼                   ▼
news-api-web        24x7 Web App
(Editorial Portal)   (Consumer Client)
```

### The Ingestion Pipeline

Every two hours, a GitHub Actions workflow executes a Python scraper. The script queries upstream sources for:
- **3 Countries:** India (`in`), United States (`us`), United Kingdom (`gb`)
- **7 Categories:** General, Business, Health, Science, Sports, Technology, Entertainment

### Deduplication and Atomic Commits

To ensure data quality:
- Stories are deduplicated by canonical URL across sources.
- Writes are atomic: if an upstream provider fails or returns corrupt data, the pipeline keeps the last good payload. No blank feeds are ever committed.
- A health manifest (`data/status.json`) is updated on each cycle, documenting per-feed status (`updated` vs `retained`), total articles, provider counts, and generation timestamps.

---

## 2. Why raw.githubusercontent.com Works as an API

Fetching from `raw.githubusercontent.com` provides two major benefits:
1. **Global CDN Distribution:** GitHub serves raw files through Fastly edge caches with standard HTTP caching headers (`max-age=300`).
2. **Open CORS:** The response header includes:
   ```http
   Access-Control-Allow-Origin: *
   ```
This means any frontend application can make standard `fetch()` calls directly from the user's browser without needing a backend server or a reverse proxy.

---

## 3. How to Consume the Endpoints

### Simple Endpoint
```bash
curl -s "https://raw.githubusercontent.com/pranav256/news-api/main/in/technology.json" | jq .
```

### In Modern JavaScript / TypeScript
```typescript
async function getTechNews() {
  const res = await fetch(
    "https://raw.githubusercontent.com/pranav256/news-api/main/in/technology.json"
  );
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const data = await res.json();
  
  console.log(`Found ${data.articles.length} articles`);
  data.articles.forEach(article => console.log(article.title));
}

getTechNews();
```

---

## 4. The Editorial Web Portal (Unslop Design)

Along with the dataset, I built a documentation portal and live broadsheet reader using **Next.js 14 (App Router)** and **Tailwind CSS**.

Instead of standard SaaS tropes (glowing purple cards, gradient text, and empty buzzwords), the design is built following Damir Sokolovsky's **Unslop Design System**:
- Strict 4px grid spacing rhythm.
- Broadsheet typography pairing classic serif headlines (`Newsreader`) with monospace metadata.
- A warm newsprint color palette (`#f7f4ee` / `#161513`) with a single restrained amber accent.
- Real-time client-side live reader that fetches directly from the raw GitHub endpoints.

Check out the live portal at [https://news-api-web-five.vercel.app](https://news-api-web-five.vercel.app).

---

## Conclusion & Next Steps

All code and data feeds are completely open source. You can fork the repository, adapt the categories, or use the public endpoints in your own projects right now:

- [Explore the live reader](https://news-api-web-five.vercel.app)
- [Check out the 24x7 news app](https://24x7.vercel.app)
- [Star or fork on GitHub](https://github.com/pranav256/news-api)
