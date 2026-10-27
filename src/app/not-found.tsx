import Link from 'next/link'
import { getDict } from '@/lib/i18n/server'

export default async function NotFound() {
  const { lang, t } = await getDict()

  return (
    <div className={`flex min-h-screen items-center justify-center bg-canvas px-6 ${lang === 'th' ? 'lang-th' : ''}`}>
      <div className="text-center">
        <p className="font-display text-6xl font-bold text-primary">{t.nf.code}</p>
        <h1 className="mt-4 font-display text-xl font-semibold text-ink">{t.nf.heading}</h1>
        <p className="mt-2 text-sm text-muted">{t.nf.body}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          {t.nf.home}
        </Link>
      </div>
    </div>
  )
}