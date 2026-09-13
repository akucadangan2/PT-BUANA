'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ServiceRequest = { id: string; complaint: string; location_address: string; users: { full_name: string } | null }
type Technician = { id: string; full_name: string }

export default function ServiceAssignTable() {
  const supabase = createClient()
  const [items, setItems] = useState<ServiceRequest[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [formState, setFormState] = useState<Record<string, { technician_id: string; scheduled_at: string }>>({})

  async function load() {
    setLoading(true)
    const [reqRes, techRes] = await Promise.all([
      supabase.from('service_requests').select('id, complaint, location_address, users(full_name)').eq('status', 'requested').order('created_at'),
      supabase.from('users').select('id, full_name').eq('role', 'teknisi'),
    ])
    setItems((reqRes.data as any) ?? [])
    setTechnicians(techRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAssign(id: string) {
    const f = formState[id]
    if (!f?.technician_id || !f?.scheduled_at) return
    await supabase.from('service_requests').update({ technician_id: f.technician_id, scheduled_at: f.scheduled_at, status: 'assigned' }).eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Assign Teknisi</h1>
        <p className="text-sm text-muted">{items.length} permintaan menunggu jadwal</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="rounded-lg border border-line bg-surface p-4">
              <p className="text-sm text-ink">{s.complaint}</p>
              <p className="mb-1 text-xs text-muted">{s.users?.full_name ?? 'Customer'}</p>
              <p className="mb-3 text-xs text-muted">{s.location_address}</p>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <p className="mb-1 text-xs text-muted">Teknisi</p>
                  <select value={formState[s.id]?.technician_id ?? ''} onChange={(e) => setFormState({ ...formState, [s.id]: { ...formState[s.id], technician_id: e.target.value, scheduled_at: formState[s.id]?.scheduled_at ?? '' } })}
                    className="rounded-md border border-line px-3 py-2 text-sm">
                    <option value="">Pilih teknisi</option>
                    {technicians.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted">Jadwal</p>
                  <input type="datetime-local" value={formState[s.id]?.scheduled_at ?? ''} onChange={(e) => setFormState({ ...formState, [s.id]: { ...formState[s.id], scheduled_at: e.target.value, technician_id: formState[s.id]?.technician_id ?? '' } })}
                    className="rounded-md border border-line px-3 py-2 text-sm" />
                </div>
                <button onClick={() => handleAssign(s.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">Assign</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="rounded-lg border border-line bg-surface px-4 py-6 text-center text-sm text-muted">Gak ada yang perlu di-assign</p>}
        </div>
      )}
    </div>
  )
}