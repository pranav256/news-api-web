import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#161513',
          padding: 24,
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            border: '8px solid #f7f4ee',
            borderRadius: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 16,
            background: '#1f1d1a',
          }}
        >
          <div style={{ height: 12, width: '100%', background: '#f7f4ee', borderRadius: 4 }} />
          <div style={{ height: 10, width: '65%', background: '#b45309', borderRadius: 3 }} />
          <div style={{ height: 8, width: '50%', background: '#a8a29e', borderRadius: 3 }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ height: 8, width: '40%', background: '#78716c', borderRadius: 3 }} />
            <div style={{ width: 20, height: 20, background: '#b45309', borderRadius: 4 }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
