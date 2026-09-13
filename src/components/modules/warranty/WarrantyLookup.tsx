'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type WarrantyResult = {
  serial_number: string; product_name: string; delivered_at: string | null
  warranty_months: number; warranty_expires_at: string | null; warranty_status: string
}

const statusStyle: Record<string, string> = { active: 'text-success', expired: 'text-danger', not_delivered: 'text-muted' }
const statusLabel: Record<string, string> = { active: 'Masih berlaku', expired: 'Sudah habis', not_delivered: 'Belum terkirim' }

export default function WarrantyLookup() {
  const supabase = createClient()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<WarrantyResult | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setNotFound(false)
    setResult(null)
    const { data } = await supabase.from('warranty_status').select('*').eq('serial_number', query.trim()).maybeSingle()
    if (data) setResult(data as any)
    else setNotFound(true)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Cek Warranty</h1>
        <p className="text-sm text-muted">Cari berdasarkan serial number unit</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Masukkan serial number"
          className="w-full max-w-sm rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">Cari</button>
      </form>

      {loading && <p className="text-sm text-muted">Mencari...</p>}
      {notFound && <p className="text-sm text-muted">Serial number gak ditemukan</p>}

      {result && (
        <div className="max-w-md rounded-lg border border-line bg-surface p-5">
          <p className="font-display text-lg font-semibold text-ink">{result.product_name}</p>
          <p className="mb-4 text-sm text-muted">{result.serial_number}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-line py-2">
              <span className="text-muted">Tanggal delivery</span>
              <span className="text-ink">{result.delivered_at ? new Date(result.delivered_at).toLocaleDateString('id-ID') : '-'}</span>
            </div>
            <div className="flex justify-between border-b border-line py-2">
              <span className="text-muted">Masa garansi</span>
              <span className="text-ink">{result.warranty_months} bulan</span>
            </div>
            <div className="flex justify-between border-b border-line py-2">
              <span className="text-muted">Berakhir</span>
              <span className="text-ink">{result.warranty_expires_at ? new Date(result.warranty_expires_at).toLocaleDateString('id-ID') : '-'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted">Status</span>
              <span className={`font-medium ${statusStyle[result.warranty_status]}`}>{statusLabel[result.warranty_status]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}