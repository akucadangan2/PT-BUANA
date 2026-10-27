'use client'

import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n/provider'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang, t } = useI18n()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className={`flex min-h-screen items-center justify-center bg-canvas px-6 ${lang === 'th' ? 'lang-th' : ''}`}>
      <div className="text-center">
        <p className="font-display text-5xl font-bold text-danger">{t.err.title}</p>
        <h1 className="mt-4 font-display text-xl font-semibold text-ink">{t.err.heading}</h1>
        <p className="mt-2 text-sm text-muted">{t.err.body}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => reset()} className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">{t.err.retry}</button>
          <a href="/" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">{t.err.home}</a>
        </div>
      </div>
    </div>
  )
}