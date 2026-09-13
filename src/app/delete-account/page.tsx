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
      setError('Centang konfirmasi dulu sebelum melanjutkan')
      return
    }
    setError('')
    setLoading(true)
    try {
      await requestAccountDeletion(email, password)
      setDone(true)
    } catch (err: any) {
      setError(err.message ?? 'Gagal memproses permintaan')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-sm text-ink">
        <h1 className="mb-2 font-display text-2xl font-semibold">Akun Berhasil Dihapus</h1>
        <p className="text-muted">
          Data pribadi Anda (nama, telepon, alamat, favorit) sudah dihapus dan akses login ke akun ini
          sudah dinonaktifkan permanen. Riwayat transaksi tetap disimpan dalam bentuk anonim untuk
          keperluan pencatatan sesuai kewajiban hukum yang berlaku.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-ink">
      <h1 className="mb-2 font-display text-2xl font-semibold">Penghapusan Akun</h1>
      <p className="mb-8 text-muted">
        Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Data yang Akan Dihapus</h2>
      <p className="mb-4">
        Nama, nomor telepon, alamat tersimpan, produk favorit, dan token notifikasi akan dihapus dari
        sistem kami. Akses login ke akun ini akan dinonaktifkan secara permanen.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Data yang Dapat Dipertahankan</h2>
      <p className="mb-6">
        Riwayat transaksi (order, service) tetap disimpan dalam bentuk anonim untuk memenuhi kewajiban
        hukum, perpajakan, dan pencatatan transaksi, sesuai jangka waktu yang berlaku.
      </p>

      <div className="rounded-lg border border-line bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Ajukan Penghapusan Akun</h2>

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email akun Anda"
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
            Saya mengerti tindakan ini permanen dan tidak dapat dibatalkan.
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-danger py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Hapus Akun Saya'}
          </button>
        </form>
      </div>
    </div>
  )
}