import Script from 'next/script'
import { THEME_STORAGE_KEY } from '@/lib/theme'

export function ThemeScript() {
  return (
    <Script id="gs-stock-theme" strategy="beforeInteractive">
      {`(() => {
        try {
          const stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
          const theme = stored === 'light' || stored === 'dark'
            ? stored
            : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          const root = document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(theme);
          root.style.colorScheme = theme;
        } catch {}
      })()`}
    </Script>
  )
}
