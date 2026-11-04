# Reddit Promotion Posts (Ready to Post)

---

## 1. r/webdev

**Title:** `I built a zero-server news pipeline that serves clean JSON feeds every 2h with open CORS`

**Post Body:**
```text
Hey r/webdev,

Whenever I wanted to build a quick news feed widget, test a frontend framework, or play with news summarization, commercial news APIs were a pain: $449/month plans, developer tiers capped at 50 requests/day, or CORS errors requiring me to spin up a reverse proxy server.

So I built **news-api**: an open-source pipeline that runs entirely on GitHub Actions and uses Git as the database and CDN.

### How it works:
1. **Scheduled Ingestion**: Every 2 hours, GitHub Actions triggers a Python script that queries NewsAPI and verified RSS feeds across 3 countries (`in`, `us`, `gb`) and 7 categories (`technology`, `business`, `science`, `sports`, `health`, `entertainment`, `general`).
2. **Deduplication & Atomic Commits**: Articles are deduplicated by canonical URL and committed atomically. If an upstream source fails, it retains the last good payload instead of committing blank files.
3. **Zero-Server Global CDN**: Consumers fetch straight from `raw.githubusercontent.com`. GitHub serves this with edge caching and `Access-Control-Allow-Origin: *`, so any browser or frontend can fetch directly with zero backend proxy or API keys.
4. **Telemetry & Health**: It commits a `data/status.json` file tracking per-feed status ("updated" vs "retained"), provider count, and article count.

To showcase the data, I built a broadsheet-style live reader and documentation portal using Next.js 14 and Damir Sokolovsky's Unslop design principles (4px grid rhythm, Newsreader serif typography, no generic SaaS purple glow slop):

- **Live Reader & Docs**: https://news-api-web-five.vercel.app
- **Live Consumer Web App (24x7)**: https://24x7.vercel.app
- **Pipeline Repo**: https://github.com/pranav256/news-api
- **Web App Repo**: https://github.com/pranav256/news-api-web

Give it a try in your terminal:
```bash
curl -s "https://raw.githubusercontent.com/pranav256/news-api/main/in/technology.json" | jq .
```

Would love to hear your thoughts on feed coverage or architecture!
```

---

## 2. r/opensource

**Title:** `news-api: Free, no-key global news JSON updated every 2 hours without servers`

**Post Body:**
```text
Hey everyone,

I wanted to share an open-source project I've been maintaining: **news-api**.

It's a serverless public dataset of clean, categorized news JSON committed every 2 hours via automated GitHub Actions:

- **3 Regions**: India (`in`), United States (`us`), United Kingdom (`gb`)
- **7 Categories**: General, Business, Health, Science, Sports, Technology, Entertainment
- **21 Dedicated Feeds**
- **Zero API keys required**, completely free, with full browser CORS support.

Links:
- Pipeline Repo: https://github.com/pranav256/news-api
- Web Portal & Live Reader: https://news-api-web-five.vercel.app
- Production Example: https://24x7.vercel.app

All code is open and contributions/feed suggestions are welcome!
```
