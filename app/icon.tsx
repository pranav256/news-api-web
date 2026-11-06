import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#262923',
          borderRadius: 6,
          padding: 4,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '2px solid #f7f4ee',
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 3,
            background: '#1f1d1a',
          }}
        >
          <div style={{ height: 2, width: '100%', background: '#f7f4ee', borderRadius: 1 }} />
          <div style={{ height: 2, width: '60%', background: '#a34e32', borderRadius: 1 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ height: 2, width: '45%', background: '#a8a29e', borderRadius: 1 }} />
            <div style={{ width: 4, height: 4, background: '#a34e32', borderRadius: 1 }} />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
