import { ImageResponse } from 'next/og'

export const alt = "G's Stock clinical research supply"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #071b1d 0%, #123c3c 55%, #208070 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: '72px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', fontSize: 36, fontWeight: 600, letterSpacing: '-1px' }}>
          G&apos;s Stock
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 920 }}>
          <div style={{ display: 'flex', fontSize: 82, fontWeight: 700, letterSpacing: '-4px', lineHeight: 1.05 }}>
            Clinical Research Supply
          </div>
          <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.35, marginTop: 28, opacity: 0.85 }}>
            Considered compounds. Clear detail sheets. Secure checkout.
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: '2px', opacity: 0.7, textTransform: 'uppercase' }}>
          Research catalog
        </div>
      </div>
    ),
    size,
  )
}
