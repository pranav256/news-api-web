import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'news-api — Free, no-key global news JSON';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f7f4ee',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          border: '12px solid #161513',
          fontFamily: 'serif',
          color: '#161513',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #161513',
            paddingBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: '0.12em',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            The Open Dispatch · news-api
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#b45309',
              fontFamily: 'monospace',
              fontWeight: 600,
            }}
          >
            Refreshed Every 2 Hours · Zero Auth
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '40px 0' }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Free, no-key global news JSON.
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#524f48',
              lineHeight: 1.4,
              fontFamily: 'sans-serif',
            }}
          >
            Scraped from NewsAPI and verified RSS every two hours. Deduplicated, atomically committed, and delivered worldwide via GitHub CDN with open CORS.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #dcd7ce',
            paddingTop: '24px',
            fontFamily: 'monospace',
            fontSize: 18,
            color: '#524f48',
          }}
        >
          <div>21 Feeds · India · United States · United Kingdom</div>
          <div style={{ color: '#161513', fontWeight: 600 }}>
            news-api-web-five.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
