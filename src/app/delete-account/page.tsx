'use client'

import { useState } from 'react'
import { requestAccountDeletion } from './actions'

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!confirmed) {
      setError('Please confirm the checkbox before continuing')
      return
    }
    setError('')
    setLoading(true)
    try {
      await requestAccountDeletion(email, password)
      setDone(true)
    } catch (err: any) {
      setError(err.message ?? 'Failed to process your request')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-sm text-ink">
        <h1 className="mb-2 font-display text-2xl font-semibold">Account Deleted</h1>
        <p className="text-muted">
          Your personal data (name, phone number, addresses, favourites) has been deleted and login
          access to this account has been permanently disabled. Transaction history remains stored in
          anonymised form for record-keeping purposes as required by law.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-ink">
      <h1 className="mb-2 font-display text-2xl font-semibold">Account Deletion</h1>
      <p className="mb-8 text-muted">
        Last updated: {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Data That Will Be Deleted</h2>
      <p className="mb-4">
        Your name, phone number, saved addresses, favourite products, and notification token will be
        deleted from our system. Login access to this account will be permanently disabled.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Data That May Be Retained</h2>
      <p className="mb-6">
        Transaction history (orders, service) remains stored in anonymised form to meet legal, tax, and
        record-keeping obligations, for the period required by applicable law.
      </p>

      <div className="rounded-lg border border-line bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Request Account Deletion</h2>

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Your account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
          <label className="flex items-start gap-2 text-xs text-muted">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" />
            I understand this action is permanent and cannot be undone.
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-danger py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Delete My Account'}
          </button>
        </form>
      </div>
    </div>
  )
}