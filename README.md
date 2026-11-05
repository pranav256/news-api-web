# news-api Web Application

A responsive, high-performance editorial web application and documentation portal for [pranav256/news-api](https://github.com/pranav256/news-api). Built with **Next.js (App Router)**, **TypeScript**, and styled strictly in accordance with Damir Sokolovsky's [Unslop Design System](https://heydamir.design/unslop).

[![Live Site](https://img.shields.io/badge/Live%20Deployment-news--api--live.vercel.app-success)](https://news-api-live.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Hosted on Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-black)](https://vercel.com)
[![License: Unlicensed](https://img.shields.io/badge/License-Unlicensed-lightgrey)](https://github.com/pranav256/news-api)

**Production URL**: [https://news-api-live.vercel.app](https://news-api-live.vercel.app)

---

## 📢 Promotion & Launch Kit

Ready-to-use launch drafts, architecture posts, and 1-click sharing buttons:
- **1-Click Social Shares**: [ONE_CLICK_SHARE_LINKS.md](./ONE_CLICK_SHARE_LINKS.md) (LinkedIn, X/Twitter, Reddit, Hacker News)
- **LinkedIn Profile Setup & 4-Part Campaign**: [LINKEDIN_PROMOTION_KIT.md](./LINKEDIN_PROMOTION_KIT.md)
- **Show HN Submission Draft**: [SHOW_HN.md](./SHOW_HN.md)
- **Reddit Posts (r/webdev, r/opensource)**: [REDDIT_POSTS.md](./REDDIT_POSTS.md)
- **Dev.to / Hashnode Technical Article**: [DEVTO_ARTICLE.md](./DEVTO_ARTICLE.md)

---

## Features

- **Live Broadsheet News Reader**:
  - Live client-side fetches directly from `raw.githubusercontent.com` with full CORS support.
  - Interactive country selector: **India** (`in`), **United States** (`us`), **United Kingdom** (`gb`).
  - Category tabs: General, Business, Health, Science, Sports, Technology, Entertainment.
  - Endpoint shape toggle: Simple NewsAPI compatible (`/{country}/{category}.json`) vs Enriched headlines (`/data/{country}/{category}_headlines.json`).
  - Instant text filter for loaded articles and publisher titles.
  - Real-time refresh time derived from `data/status.json`.
- **API Documentation & Code Generator**:
  - Interactive code snippets in **cURL**, **JavaScript (`fetch`)**, **Python (`requests`)**, and **Go**.
  - Dynamically synchronized with selected country and category.
  - Verified JSON schema reference for root and rich endpoints.
  - Country and Category lookup reference tables.
- **Feed Health & Freshness Telemetry Panel**:
  - Live pipeline status queried from `data/status.json`.
  - Matrix table of all 21 feeds with updated/retained badges, provider tags, article counts, and direct raw JSON links.
  - Diagnostics warning log for upstream feed issues.
- **Serverless Architecture Explainer**:
  - 3-Phase pipeline documentation detailing scheduled GitHub Actions scraping, URL deduplication, atomic file retention, and global edge delivery.
- **Unslop Design System Craft**:
  - Strict 4px spacing scale rhythm.
  - Warm newsprint paper (`#f7f4ee`) and dark broadsheet ink (`#161513`) neutral palette.
  - Restrained warm amber accent (`#b45309` / `#e0682b`).
  - 16px Lucide line icons, tabular figures, and zero AI-slop glows or gradient text.
  - Dark and Light mode via `prefers-color-scheme` with manual toggle override.

---

## Getting Started

### Local Development

1. Clone or navigate to the repository:
   ```bash
   cd news-api-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Deployment on Vercel

The project is hosted on Vercel and configured to automatically build and deploy every commit pushed to `main`:

- **Production URL**: [https://news-api-live.vercel.app](https://news-api-live.vercel.app)
- **Deployment Target**: Production Edge / Fluid Compute (Next.js 14)

---

## Attribution & Copyright

- Scraper infrastructure: [pranav256/news-api](https://github.com/pranav256/news-api).
- Design system: [Unslop](https://heydamir.design/unslop) by Damir Sokolovsky (CC BY 4.0).
- News content, titles, and excerpts belong to their respective publishers (The Hindu, BBC News, The New York Times, ESPN, Reuters, etc.).
