'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Pagination from '@/components/ui/Pagination'

type Movement = {
  id: string; type: string; qty: number; note: string | null; created_at: string
  products: { name: string; category: string } | null
  users: { full_name: string } | null
}

const typeStyle: Record<string, string> = { in: 'text-success', out: 'text-danger', opname_adjustment: 'text-amber' }
const typeLabel: Record<string, string> = { in: 'Masuk', out: 'Keluar', opname_adjustment: 'Opname' }

export default function StockMovementTable() {
  const supabase = createClient()
  const [items, setItems] = useState<Movement[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filter, setFilter] = useState<'all' | 'in' | 'out' | 'opname_adjustment'>('all')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let q = supabase
      .from('stock_movements')
      .select('id, type, qty, note, created_at, products(name, category), users(full_name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    if (filter !== 'all') q = q.eq('type', filter)
    const { data, count } = await q
    setItems((data as any) ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter, page, pageSize])
  useEffect(() => { setPage(1) }, [filter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Riwayat Stok</h1>
        <p className="text-sm text-muted">{total} pergerakan tercatat</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'in', 'out', 'opname_adjustment'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
              filter === f ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted hover:bg-canvas'
            }`}
          >
            {f === 'all' ? 'Semua' : typeLabel[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <>
          <div className="divide-y divide-line rounded-lg border border-line bg-surface">
            {items.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="text-ink">{m.products?.name}</p>
                  <p className="text-xs text-muted">{m.note ?? '-'} &middot; {m.users?.full_name ?? 'Sistem'}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${typeStyle[m.type]}`}>{m.qty > 0 ? '+' : ''}{m.qty}</p>
                  <p className="text-xs text-muted">{new Date(m.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">Belum ada pergerakan stok</p>}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}
    </div>
  )
}