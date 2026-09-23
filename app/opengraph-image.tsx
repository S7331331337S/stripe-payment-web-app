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
          background: '#fafafa',
          color: '#252527',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: '72px',
          width: '100%',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          <div style={{ background: '#475fa5', borderRadius: 18, display: 'flex', height: 48, width: 48 }} />
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 600, letterSpacing: '-1px' }}>G&apos;s Stock</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 920 }}>
          <div style={{ background: '#b7c3e4', display: 'flex', height: 4, marginBottom: 28, width: 76 }} />
          <div style={{ display: 'flex', fontSize: 82, fontWeight: 700, letterSpacing: '-4px', lineHeight: 1.02 }}>
            A clearer standard for modern research.
          </div>
          <div style={{ color: '#6a696d', display: 'flex', fontSize: 30, lineHeight: 1.35, marginTop: 28 }}>
            Considered compounds, presented with clarity and handled with care.
          </div>
        </div>
        <div style={{ color: '#475fa5', display: 'flex', fontSize: 22, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
          Curated research supply
        </div>
      </div>
    ),
    size,
  )
}
