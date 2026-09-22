import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "G's Stock",
    short_name: "G's Stock",
    description: 'A considered catalog of research compounds with clear detail sheets and secure checkout.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1e6',
    theme_color: '#241810',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
