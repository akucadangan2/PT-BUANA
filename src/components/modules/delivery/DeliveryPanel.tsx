'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Map, { Marker } from 'react-map-gl'
import Pagination from '@/components/ui/Pagination'
import 'mapbox-gl/dist/mapbox-gl.css'

type Delivery = {
  id: string; status: string; current_lat: number | null; current_lng: number | null
  delivered_at: string | null; created_at: string
  orders: { id: string; total: number } | null
  users: { full_name: string } | null
}
type Courier = { id: string; full_name: string }

const statusOptions = ['pending', 'assigned', 'picked_up', 'on_the_way', 'delivered', 'failed']
const statusStyle: Record<string, string> = {
  pending: 'text-amber', assigned: 'text-muted', picked_up: 'text-primary', on_the_way: 'text-amber', delivered: 'text-success', failed: 'text-danger',
}

export default function DeliveryPanel() {
  const supabase = createClient()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [selected, setSelected] = useState<Delivery | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase.from('deliveries').select('id, status, current_lat, current_lng, delivered_at, created_at, orders(id, total), users(full_name)', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    const [delRes, courierRes] = await Promise.all([
      query,
      supabase.from('users').select('id, full_name').eq('role', 'kurir'),
    ])
    setDeliveries((delRes.data as any) ?? [])
    setTotal(delRes.count ?? 0)
    setCouriers(courierRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [page, pageSize, statusFilter])
  useEffect(() => { setPage(1) }, [statusFilter])

  useEffect(() => {
    const channel = supabase
      .channel('deliveries-location')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'deliveries' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function assignCourier(deliveryId: string, courierId: string) {
    await supabase.from('deliveries').update({ courier_id: courierId, status: 'assigned' }).eq('id', deliveryId)
    load()
  }

  async function updateStatus(deliveryId: string, status: string) {
    const patch: any = { status }
    if (status === 'delivered') patch.delivered_at = new Date().toISOString()
    await supabase.from('deliveries').update(patch).eq('id', deliveryId)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Delivery</h1>
        <p className="text-sm text-muted">{total} pengiriman</p>
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

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2 space-y-3">
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <div className="divide-y divide-line">
              {loading && <p className="p-4 text-sm text-muted">Memuat...</p>}
              {deliveries.map((d) => (
                <button key={d.id} onClick={() => setSelected(d)}
                  className={`block w-full px-4 py-3 text-left text-sm hover:bg-canvas ${selected?.id === d.id ? 'bg-primary-light' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-ink">#{d.orders?.id.slice(0, 8)}</span>
                    <span className={`text-xs font-medium ${statusStyle[d.status]}`}>{d.status}</span>
                  </div>
                  <p className="text-xs text-muted">{d.users?.full_name ?? 'Belum ada kurir'}</p>
                </button>
              ))}
              {!loading && deliveries.length === 0 && <p className="p-4 text-sm text-muted">Gak ada delivery</p>}
            </div>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>

        <div className="col-span-3 overflow-hidden rounded-lg border border-line bg-surface">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="h-72 bg-canvas">
                {selected.current_lat && selected.current_lng ? (
                  <Map
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    initialViewState={{ latitude: selected.current_lat, longitude: selected.current_lng, zoom: 13 }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                  >
                    <Marker latitude={selected.current_lat} longitude={selected.current_lng}>
                      <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary-light" />
                    </Marker>
                  </Map>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">Belum ada update lokasi</div>
                )}
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <p className="mb-1 text-xs text-muted">Assign kurir</p>
                  <select defaultValue="" onChange={(e) => e.target.value && assignCourier(selected.id, e.target.value)}
                    className="w-full rounded-md border border-line px-3 py-2 text-sm">
                    <option value="" disabled>Pilih kurir</option>
                    {couriers.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((s) => (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                          selected.status === s ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted hover:bg-canvas'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-10 text-sm text-muted">Pilih delivery buat lihat detail & lokasi</div>
          )}
        </div>
      </div>
    </div>
  )
}