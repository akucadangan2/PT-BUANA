'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ServiceRequest = {
  id: string; complaint: string; location_address: string; created_at: string
  users: { full_name: string } | null
}

export default function ServiceBookingTable() {
  const supabase = createClient()
  const [items, setItems] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('service_requests')
      .select('id, complaint, location_address, created_at, users(full_name)')
      .eq('status', 'requested')
      .order('created_at', { ascending: false })
    setItems((data as any) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Booking Service Masuk</h1>
        <p className="text-sm text-muted">{items.length} permintaan belum di-assign</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <div className="divide-y divide-line rounded-lg border border-line bg-surface">
          {items.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="text-ink">{s.complaint}</p>
                <p className="text-xs text-muted">{s.users?.full_name ?? 'Customer'}</p>
                <p className="text-xs text-muted">{s.location_address}</p>
              </div>
              <a href="/admin/service/assign" className="rounded-md border border-line px-3 py-1.5 text-xs text-primary hover:bg-canvas">Assign teknisi</a>
            </div>
          ))}
          {items.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">Gak ada booking baru</p>}
        </div>
      )}
    </div>
  )
}