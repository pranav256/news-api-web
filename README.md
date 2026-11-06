# news-api

An editorial news reader and developer portal for [pranav256/news-api](https://github.com/pranav256/news-api).

[Live website](https://news-api-live.vercel.app) · [Reference reader](https://24x7.vercel.app) · [Data repository](https://github.com/pranav256/news-api)

## Development

Requires Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
npm start
```

Run the browser checks against a production build:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

The checks use isolated browser contexts and real public feeds. A network connection is required; failure-state checks deliberately block requests without substituting article data.

## Architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Base UI and Motion. Newsreader, Inter and JetBrains Mono are bundled locally. The page and metadata are statically generated; no application server, proxy, credentials or database is needed for news fetching.

The browser reads public JSON directly from `raw.githubusercontent.com`. A separate GitHub Actions workflow in the data repository runs every two hours. It deduplicates article URLs and commits the resulting JSON. Failed refreshes retain the last successful files.

| Resource           | Path relative to the data repository        |
| ------------------ | ------------------------------------------- |
| Standard news      | `/{country}/{category}.json`                |
| News with metadata | `/data/{country}/{category}_headlines.json` |
| Feed health        | `/data/status.json`                         |

Countries: `in`, `us`, `gb`. Sections: general, business, technology, science, health, sports and entertainment.

## Reading and building

- Country, category and response format are reflected in the URL.
- The reader loads real publisher content, supports local search and progressively reveals stories.
- Editorial exclusions omit entire stories; publisher headlines are never rewritten.
- Endpoint links and cURL, JavaScript, Python and Go examples follow the selected feed.
- The API playground includes a copyable live JSON preview of the first visible article. Original response counts are preserved; the complete endpoint remains available.
- Health reads the manifest every minute while the page is visible. News is checked every two minutes. These checks do not trigger the upstream workflow.
- Missing metadata remains unavailable. Partial runs, retained feeds, stale manifests and network failures have separate states.
- Requests are cancellable, time out after 15 seconds and ignore superseded responses.
- Theme choice is saved locally, defaults to the system preference and is applied before rendering. Motion respects reduced-motion preferences.

## Project structure

- `app/`: page, global tokens, local font loading and metadata.
- `components/`: reading, code examples, telemetry and navigation.
- `components/ui/`: reusable editorial components adapted from [Better Design](https://better-design.com/design-systems/cream-editorial), retaining the project's Lucide icons.
- `hooks/use-resource.ts`: client fetching and refresh lifecycle.
- `lib/news.ts`: validated response types, endpoint construction and code examples.
- `tests/`: browser checks for feed synchronization, clipboard, responsive navigation, theme persistence and network recovery.

## Deployment

Vercel builds `main` with `npm run build`. No environment variables are required. The canonical website is `https://news-api-live.vercel.app`.

Article text and photography belong to their original publishers. External links open the original reports; publisher access restrictions may apply. Fonts are distributed under their included open font licenses.
