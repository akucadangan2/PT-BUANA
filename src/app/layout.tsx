import './globals.css'
import { I18nProvider } from '@/lib/i18n/provider'
import { getDict } from '@/lib/i18n/server'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getDict()

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=Noto+Sans+Thai:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-canvas font-sans text-ink antialiased">
        <I18nProvider lang={lang} t={t}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}