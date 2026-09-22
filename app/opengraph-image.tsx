import { ImageResponse } from 'next/og'

export const alt = "G's Stock — Clinical Research Supply"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'stretch',
          background: '#f8fafc',
          color: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: '72px',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            background: '#c7d2fe',
            borderRadius: '999px',
            display: 'flex',
            height: '440px',
            opacity: 0.55,
            position: 'absolute',
            right: '-110px',
            top: '-140px',
            width: '440px',
          }}
        />
        <div style={{ alignItems: 'center', display: 'flex', gap: '18px' }}>
          <div
            style={{
              alignItems: 'center',
              background: '#0f172a',
              borderRadius: '999px',
              color: '#ffffff',
              display: 'flex',
              fontSize: '30px',
              fontWeight: 700,
              height: '58px',
              justifyContent: 'center',
              width: '58px',
            }}
          >
            G
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>G&apos;s Stock</div>
            <div style={{ color: '#475569', fontSize: '16px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Clinical supply
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '870px' }}>
          <div style={{ color: '#4338ca', fontSize: '20px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Curated research supply
          </div>
          <div style={{ fontSize: '72px', fontWeight: 700, letterSpacing: '-0.06em', lineHeight: 1.02, marginTop: '22px' }}>
            A clearer standard for modern research.
          </div>
          <div style={{ color: '#475569', fontSize: '26px', lineHeight: 1.4, marginTop: '26px' }}>
            Research compounds with clear detail sheets and secure checkout.
          </div>
        </div>

        <div style={{ borderTop: '1px solid #cbd5e1', color: '#475569', display: 'flex', fontSize: '18px', justifyContent: 'space-between', paddingTop: '24px' }}>
          <span>Research use only</span>
          <span>G&apos;s Stock</span>
        </div>
      </div>
    ),
    size,
  )
}
