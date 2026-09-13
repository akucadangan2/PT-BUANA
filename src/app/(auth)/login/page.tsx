'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email atau password salah')
      setLoading(false)
      return
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-lg border border-line bg-surface p-8">
        <p className="font-display text-xl font-semibold text-ink">Ops Panel</p>
        <p className="mb-6 mt-1 text-sm text-muted">Masuk ke dashboard admin</p>
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        <label className="mb-1 block text-sm text-ink">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
        <label className="mb-1 block text-sm text-ink">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
        <button type="submit" disabled={loading}
          className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white disabled:opacity-50">
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}