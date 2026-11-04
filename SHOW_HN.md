# Show HN: news-api — Free, no-key global news JSON refreshed every 2h

### Submission Details
- **Title:** `Show HN: news-api – Free, no-key global news JSON refreshed every 2h`
- **URL:** `https://news-api-web-five.vercel.app`
- **Text / Comment:**

```text
Hey HN,

Commercial news APIs often cost upwards of $400/mo or restrict free developer tiers to 50 requests/day with mandatory API keys. For small side projects, personal RSS readers, terminal dashboards, or testing LLM pipelines, you shouldn't have to register for keys or run a backend server.

I built news-api (https://github.com/pranav256/news-api) — a serverless news pipeline that scrapes and commits structured JSON news files every two hours.

Architecture:
- GitHub Actions cron runs every 120 minutes.
- Python ingestion scripts query upstream NewsAPI and verified RSS feeds across 3 countries (in, us, gb) and 7 categories (general, business, health, science, sports, technology, entertainment).
- Articles are deduplicated by canonical URL and written atomically to the repository.
- A health manifest (data/status.json) tracks provider counts, article counts, generation timestamps, and refresh status across all 21 feeds.
- Clients fetch directly from raw.githubusercontent.com, which serves global edge CDN responses with CORS enabled (`Access-Control-Allow-Origin: *`).

Endpoints:
- Simple: `https://raw.githubusercontent.com/pranav256/news-api/main/{country}/{category}.json`
- Rich headlines: `https://raw.githubusercontent.com/pranav256/news-api/main/data/{country}/{category}_headlines.json`
- Health: `https://raw.githubusercontent.com/pranav256/news-api/main/data/status.json`

To make exploring the data easy, I also built news-api-web (https://news-api-web-five.vercel.app): an editorial broadsheet reader and interactive API documentation portal built with Next.js 14 and designed under the Unslop principles (strict 4px grid rhythm, Newsreader serif typography, no SaaS glow bloat).

A live reference web app consuming this pipeline is also running at https://24x7.vercel.app.

Everything is open source:
- Pipeline: https://github.com/pranav256/news-api
- Web portal: https://github.com/pranav256/news-api-web

I'd love feedback on feed coverage and data reliability.
```
