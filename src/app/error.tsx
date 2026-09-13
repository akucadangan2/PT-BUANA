'use client'

import { useEffect } from 'react'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="text-center">
        <p className="font-display text-5xl font-bold text-danger">Oops</p>
        <h1 className="mt-4 font-display text-xl font-semibold text-ink">Terjadi Kesalahan</h1>
        <p className="mt-2 text-sm text-muted">Ada masalah teknis yang gak terduga. Coba lagi, atau kembali ke beranda.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => reset()} className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">Coba Lagi</button>
          <a href="/" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">Kembali ke Beranda</a>
        </div>
      </div>
    </div>
  )
}