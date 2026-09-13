'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Pagination from '@/components/ui/Pagination'
import { formatPrice } from '@/lib/format-price'

type Log = { id: string; note: string | null; parts_used: string | null; cost: number; created_at: string }
type ServiceRequest = {
  id: string; complaint: string; status: string
  users: { full_name: string } | null
  service_logs: Log[]
}

const statusStyle: Record<string, string> = {
  requested: 'text-amber', assigned: 'text-primary', on_the_way: 'text-primary', in_progress: 'text-primary', completed: 'text-success', cancelled: 'text-danger',
}

export default function ServiceHistoryTable() {
  const supabase = createClient()
  const [items, setItems] = useState<ServiceRequest[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase
      .from('service_requests')
      .select('id, complaint, status, users(full_name), service_logs(id, note, parts_used, cost, created_at)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    const { data, count } = await query
    setItems((data as any) ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [page, pageSize, statusFilter])
  useEffect(() => { setPage(1) }, [statusFilter])

  const statusOptions = ['requested', 'assigned', 'on_the_way', 'in_progress', 'completed', 'cancelled']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Riwayat Service</h1>
        <p className="text-sm text-muted">{total} permintaan tercatat</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', ...statusOptions] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
              statusFilter === s ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted hover:bg-canvas'
            }`}>
            {s === 'all' ? 'Semua' : s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <>
          <div className="divide-y divide-line rounded-lg border border-line bg-surface">
            {items.map((s) => (
              <div key={s.id}>
                <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-canvas">
                  <div>
                    <p className="text-ink">{s.complaint}</p>
                    <p className="text-xs text-muted">{s.users?.full_name ?? 'Customer'}</p>
                  </div>
                  <span className={`text-xs font-medium ${statusStyle[s.status]}`}>{s.status}</span>
                </button>
                {expanded === s.id && (
                  <div className="bg-canvas px-4 py-3">
                    {s.service_logs.length === 0 ? (
                      <p className="text-sm text-muted">Belum ada log pengerjaan</p>
                    ) : (
                      <div className="space-y-2">
                        {s.service_logs.map((log) => (
                          <div key={log.id} className="rounded-md border border-line bg-surface px-3 py-2 text-sm">
                            <p className="text-ink">{log.note ?? 'Tidak ada catatan'}</p>
                            {log.parts_used && <p className="text-xs text-muted">Part dipakai: {log.parts_used}</p>}
                            <p className="text-xs text-muted">{formatPrice(log.cost)} pada {new Date(log.created_at).toLocaleDateString('id-ID')}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">Gak ada riwayat</p>}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}
    </div>
  )
}
