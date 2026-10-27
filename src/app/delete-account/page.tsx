'use client'

import { useState } from 'react'
import { requestAccountDeletion } from './actions'
import { useI18n } from '@/lib/i18n/provider'
import { dateLocales } from '@/lib/i18n/config'

export default function DeleteAccountPage() {
  const { lang, t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const thai = lang === 'th' ? 'lang-th' : ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!confirmed) {
      setError(t.del.errConfirm)
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await requestAccountDeletion(email, password)
      if (!result.success) {
        setError(t.del.errCredentials)
        return
      }
      setDone(true)
    } catch {
      setError(t.del.errFailed)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className={`mx-auto max-w-2xl px-6 py-16 text-sm text-ink ${thai}`}>
        <h1 className="mb-2 font-display text-2xl font-semibold">{t.del.doneTitle}</h1>
        <p className="text-muted">{t.del.doneBody}</p>
      </div>
    )
  }

  const updated = t.del.updated.replace(
    '{date}',
    new Date().toLocaleDateString(dateLocales[lang], { year: 'numeric', month: 'long', day: 'numeric' })
  )

  return (
    <div className={`mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-ink ${thai}`}>
      <h1 className="mb-2 font-display text-2xl font-semibold">{t.del.title}</h1>
      <p className="mb-8 text-muted">{updated}</p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">{t.del.s1Title}</h2>
      <p className="mb-4">{t.del.s1Body}</p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">{t.del.s2Title}</h2>
      <p className="mb-6">{t.del.s2Body}</p>

      <div className="rounded-lg border border-line bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">{t.del.formTitle}</h2>

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder={t.del.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
          <input
            type="password"
            placeholder={t.del.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
          <label className="flex items-start gap-2 text-xs text-muted">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" />
            {t.del.confirm}
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-danger py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? t.del.loading : t.del.button}
          </button>
        </form>
      </div>
    </div>
  )
}