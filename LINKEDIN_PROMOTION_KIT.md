# LinkedIn Profile Optimization & Launch Campaign

A complete, copy-paste ready blueprint for setting up your LinkedIn profile and executing a 4-part promotional campaign for **news-api**, **news-api-web**, and **24x7**.

---

## 1. Profile Setup Blueprint

### Headline Options (Choose One)

**Option 1: Engineering & Architecture Focus (Recommended)**
> Software Engineer | Creator of news-api (Serverless, no-key global news pipeline) & news-api-web | Next.js · TypeScript · Python · Vercel

**Option 2: Open Source / Product Focus**
> Building open-source developer tooling | news-api · news-api-web · Next.js · Distributed Systems

---

### About Section

```markdown
I build software focused on architectural simplicity, zero unnecessary infrastructure, and thoughtful design craft.

Recently, I designed and open-sourced news-api—a serverless data pipeline that provides free, no-key global news JSON updated every 2 hours without running a single backend server. The pipeline scrapes multi-region news feeds across India, the US, and the UK via automated GitHub Actions, deduplicates content by canonical URL, and commits atomic JSON files served worldwide through GitHub's CDN with open CORS.

To accompany the dataset, I built and deployed news-api-web: an editorial, broadsheet-style developer portal and live news reader adhering to the Unslop design principles (strict 4px rhythm, warm newsprint typography, and zero SaaS chrome bloat).

Core focus areas:
• Full-Stack & Frontend: Next.js 14 (App Router), TypeScript, React, Tailwind CSS
• Systems & Pipelines: Python, GitHub Actions CI/CD, Serverless workflows, REST APIs
• Infrastructure: Vercel, Git-backed static CDNs, Web scraping & RSS parsing

Check out my work:
• Live Editorial Portal: https://news-api-live.vercel.app
• Dataset Pipeline: https://github.com/pranav256/news-api
• Live Implementation: https://24x7.vercel.app
```

---

### Featured Section (Add as Media / Links)

1. **Link 1: news-api Web Portal**
   - **URL:** `https://news-api-live.vercel.app`
   - **Title:** `news-api Web — Live Broadsheet Reader & API Documentation`
   - **Description:** `Production Next.js 14 portal featuring real-time client-side broadsheet reading, interactive endpoint inspection, and telemetry tracking across 21 global feeds.`

2. **Link 2: news-api Open Source Repository**
   - **URL:** `https://github.com/pranav256/news-api`
   - **Title:** `news-api — Serverless News Scraping Pipeline`
   - **Description:** `Automated Python pipeline fetching, deduplicating, and publishing structured JSON news feeds every two hours with zero server overhead.`

3. **Link 3: 24x7 Reference Implementation**
   - **URL:** `https://24x7.vercel.app`
   - **Title:** `24x7 — Real-Time News Application`
   - **Description:** `Production news web application powered directly by the news-api static JSON data layer.`

---

### Projects Section Entry

- **Project Name:** `news-api & news-api-web`
- **Associated With:** Independent Project / Open Source
- **Dates:** Ongoing
- **Project URL:** `https://news-api-live.vercel.app`
- **Description:**
  ```text
  Designed and built a completely serverless open-source news data layer and companion web application:
  • Engineered an automated scraping pipeline using Python and GitHub Actions that refreshes 21 categorized feeds across India (in), the US (us), and the UK (gb) every 2 hours.
  • Eliminated server maintenance costs by using Git as an immutable, versioned data store and raw.githubusercontent.com as a globally cached, CORS-enabled CDN.
  • Built news-api-web with Next.js 14, implementing a high-signal editorial broadsheet UI with real-time health telemetry monitoring (status.json) and one-click code generation in cURL, JavaScript, Python, and Go.
  • Connected production consumers including 24x7 (https://24x7.vercel.app).
  ```

---

### Skills to Add

- Next.js
- TypeScript
- Python
- REST APIs
- GitHub Actions
- Serverless Computing
- Vercel
- Web Scraping
- Front-End Development
- Git

---

## 2. Multi-Stage Launch Campaign

All posts adhere strictly to the **Unslop** tone: direct, verifiable facts, architectural depth, and zero exaggerated hype.

---

### Post 1: The Launch / Problem-Solution (Day 1)

**Hook:** Commercial news APIs charge upwards of $400/month or lock simple developer experimentation behind restrictive API keys and rate limits.

**Post Content:**
```text
Commercial news APIs charge hundreds of dollars a month or restrict free tiers to 50–100 requests per day with mandatory API keys.

For side projects, prototype dashboards, and hobby feeds, you shouldn't need to manage credentials or run an expensive database.

I built and open-sourced news-api: a serverless news pipeline that publishes clean, structured JSON feeds every two hours—completely free, with zero API keys required.

How it works:
1. A GitHub Actions workflow triggers every 2 hours.
2. Python ingestion scripts scrape NewsAPI and verified RSS feeds across 3 regions (India, US, UK) and 7 categories (tech, business, science, sports, health, entertainment, general).
3. Articles are deduplicated by canonical URL and written atomically to the repository.
4. Clients fetch directly from raw.githubusercontent.com, backed by global CDN edge caching with open CORS (Access-Control-Allow-Origin: *).

To make exploring the data effortless, I also built news-api-web: an editorial, broadsheet-style documentation site and live reader.

Explore the live reader and API docs:
https://news-api-live.vercel.app

Reference consumer app (24x7):
https://24x7.vercel.app

GitHub repositories:
• Data pipeline: https://github.com/pranav256/news-api
• Web portal: https://github.com/pranav256/news-api-web

#opensource #webdev #nextjs #python #softwareengineering
```

---

### Post 2: Technical Architecture Deep Dive (Day 3)

**Hook:** Why run a 24/7 backend server when Git can serve as your immutable database and global CDN?

**Post Content:**
```text
Why maintain a 24/7 backend server when Git can act as your immutable database and CDN?

When building news-api, the primary architectural goal was zero server overhead and 100% operational resilience.

Here is the technical breakdown of the pipeline:

1. Scheduled Execution:
GitHub Actions runs a cron trigger every 120 minutes. No VPS, no persistent Docker containers, no idle cloud bills.

2. Ingestion & Normalization:
A lightweight Python engine queries upstream sources, standardizes payloads into NewsAPI-compatible JSON schemas, and deduplicates stories by canonical URL.

3. Atomic Commits & Retention:
If an upstream feed fails, the pipeline retains the last successful payload rather than committing a blank or corrupted file. Writes are atomic.

4. Edge Delivery:
Consumers fetch straight from raw.githubusercontent.com. Because GitHub sets Access-Control-Allow-Origin: * with HTTP 300s caching, client browsers can fetch directly with zero proxy middleware.

5. Health Telemetry:
Every run updates a data/status.json manifest tracking provider counts, article counts, generation timestamps, and refresh status across all 21 feeds.

Check out the full architecture breakdown and live status monitor:
https://news-api-live.vercel.app/#status

Code: https://github.com/pranav256/news-api

#systemdesign #cloudcomputing #python #githubactions #architecture
```

---

### Post 3: Frontend Craft & The Unslop Design System (Day 5)

**Hook:** Most modern developer tools look identical: dark purple gradients, neon glowing borders, and generic marketing buzzwords.

**Post Content:**
```text
Most developer tools today look identical: purple neon gradients, glowing card borders, and AI-generated hype copy.

When building news-api-web, I deliberately took the opposite path by applying Damir Sokolovsky's Unslop design principles:

• Strict 4px Grid Rhythm: Balanced hierarchy, proportional sibling cards, and structured column gutters instead of arbitrary padding.
• Warm Broadsheet Typography: Serif headlines paired with clean mono code snippets, reminiscent of classic newspaper print rather than generic SaaS dashboards.
• Restrained Palette: Warm newsprint surfaces (#f7f4ee in light mode, #161513 in dark mode) with a single amber accent (#b45309). No colored shadows, no radial background blobs.
• Direct, Verifiable Copy: No "magic", "supercharged", or "game-changing" filler. Every section describes exactly what the pipeline does, with copyable code snippets in cURL, JavaScript, Python, and Go.
• Live Client-Side Data: The reader doesn't simulate articles—it pulls live data from the GitHub CDN in real time.

Live site:
https://news-api-live.vercel.app

Frontend source code (Next.js 14 App Router & Tailwind CSS):
https://github.com/pranav256/news-api-web

#frontend #webdesign #uiux #typography #nextjs
```

---

### Post 4: The Consumer Ecosystem & Real-World Use Cases (Day 7)

**Hook:** Static JSON feeds are most useful when real applications depend on them.

**Post Content:**
```text
A common question with static data architectures: "Can a Git-backed JSON pipeline actually support production web applications?"

Yes.

A live example is 24x7 (https://24x7.vercel.app), a real-time news application that consumes the news-api dataset directly.

Because the data layer exposes standard REST patterns (both simple endpoints like /{country}/{category}.json and rich endpoints with headline/everything metadata), any client can:
• Fetch live news without registering for API credentials.
• Avoid exposing secret keys in client-side bundles.
• Rely on automatic 2-hour freshness guarantees.

Whether you're building a terminal CLI news reader, a personal RSS dashboard, an LLM summarizer, or a mobile reader, the endpoints are completely open:

curl https://raw.githubusercontent.com/pranav256/news-api/main/in/technology.json

Check out the live reader and integrate it into your projects:
Portal: https://news-api-live.vercel.app
Client demo: https://24x7.vercel.app
Repo: https://github.com/pranav256/news-api

#reactjs #opensource #buildinpublic #javascript #apis
```

---

## 3. Execution & Distribution Strategy

1. **Schedule**:
   - Post 1: Tuesday at 8:30 AM local time.
   - Post 2: Thursday at 9:00 AM local time.
   - Post 3: Following Tuesday at 8:30 AM local time.
   - Post 4: Following Thursday at 9:00 AM local time.
2. **Media Assets**:
   - For Post 1 & 3: Attach a clean screenshot of the live broadsheet reader from `news-api-live.vercel.app`.
   - For Post 2: Attach a screenshot of the data status telemetry panel or a simple architecture diagram.
3. **Engagement**:
   - Respond to every comment within the first 60 minutes to boost LinkedIn algorithm distribution.
   - Cross-post summaries to Twitter/X, Hacker News (`Show HN: news-api`), and Reddit (`r/webdev`, `r/opensource`).
