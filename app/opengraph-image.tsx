import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'PetPass - One passport for every paw';
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
          fontSize: 128,
          background: '#E8F4F5',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div style={{ fontSize: 200 }}>🐾</div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: '#006D77',
              letterSpacing: '-0.025em',
            }}
          >
            PetPass
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#83C5BE',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'monospace',
            }}
          >
            One passport for every paw
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
