import { ImageResponse } from 'next/og';

export const alt = 'news-api — The world, in plain JSON.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#f7f4ee',
        color: '#262923',
        padding: '56px 72px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #cfcfc3',
          paddingBottom: 24,
        }}
      >
        <span style={{ fontSize: 32, letterSpacing: '-2px' }}>news-api.</span>
        <span style={{ fontSize: 15, color: '#6c6d62' }}>Public news. Open browser access.</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 84,
          lineHeight: 1.05,
          letterSpacing: '-5px',
        }}
      >
        <span>The world,</span>
        <span style={{ color: '#a34e32', fontStyle: 'italic' }}>in plain JSON.</span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #cfcfc3',
          paddingTop: 24,
          fontSize: 18,
          color: '#55594f',
        }}
      >
        <span>3 countries · 21 public feeds · No API key</span>
        <span>news-api-live.vercel.app</span>
      </div>
    </div>,
    size,
  );
}
