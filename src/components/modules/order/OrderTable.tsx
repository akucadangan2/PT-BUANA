'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Pagination from '@/components/ui/Pagination'
import { formatPrice } from '@/lib/format-price'

type OrderItem = { id: string; product_id: string; serial_number_id: string | null; qty: number; price: number; products: { name: string } | null }
type Order = {
  id: string; status: string; total: number; created_at: string; updated_at: string | null
  delivery_address: string | null
  users: { full_name: string; phone: string | null } | null
  order_items: OrderItem[]
}
type SerialOption = { id: string; serial_number: string }

const statusOptions = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled']
const statusLabel: Record<string, string> = {
  pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', delivered: 'Delivered', cancelled: 'Cancelled',
}
const statusStyle: Record<string, string> = {
  pending: 'bg-amber-light text-amber', confirmed: 'bg-primary-light text-primary', processing: 'bg-primary-light text-primary',
  delivered: 'bg-success/10 text-success', cancelled: 'bg-danger/10 text-danger',
}

export default function OrderTable({ category }: { category: 'retail' | 'equipment' }) {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [availableSerials, setAvailableSerials] = useState<Record<string, SerialOption[]>>({})

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase
      .from('orders')
      .select('id, status, total, created_at, updated_at, delivery_address, users!customer_id(full_name, phone), order_items(id, product_id, serial_number_id, qty, price, products(name))', { count: 'exact' })
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range(from, to)
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    const { data, count } = await query
    setOrders((data as any) ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  async function loadCounts() {
    const results = await Promise.all(
      statusOptions.map((s) => supabase.from('orders').select('id', { count: 'exact', head: true }).eq('category', category).eq('status', s))
    )
    const map: Record<string, number> = {}
    statusOptions.forEach((s, i) => { map[s] = results[i].count ?? 0 })
    setCounts(map)
  }

  useEffect(() => { load() }, [category, page, pageSize, statusFilter])
  useEffect(() => { setPage(1) }, [category, statusFilter])
  useEffect(() => { loadCounts() }, [category])

  async function openDetail(order: Order) {
    setDetailOrder(order)
    if (category === 'equipment') {
      for (const item of order.order_items) {
        if (!availableSerials[item.product_id]) {
          const { data } = await supabase.from('serial_numbers').select('id, serial_number').eq('product_id', item.product_id).eq('status', 'in_stock')
          setAvailableSerials((prev) => ({ ...prev, [item.product_id]: data ?? [] }))
        }
      }
    }
  }

  async function updateStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    if (detailOrder?.id === orderId) setDetailOrder({ ...detailOrder, status })
    load()
    loadCounts()
  }

  async function assignSerial(itemId: string, serialNumberId: string) {
    await supabase.from('order_items').update({ serial_number_id: serialNumberId }).eq('id', itemId)
    await supabase.from('serial_numbers').update({ status: 'delivered' }).eq('id', serialNumberId)
    load()
    if (detailOrder) {
      const updatedItems = detailOrder.order_items.map((it) => (it.id === itemId ? { ...it, serial_number_id: serialNumberId } : it))
      setDetailOrder({ ...detailOrder, order_items: updatedItems })
    }
  }

  const totalAllCount = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Order {category === 'retail' ? 'Retail' : 'Equipment'}</h1>
        <p className="text-sm text-muted">{total} order</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${
            statusFilter === 'all' ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted hover:bg-canvas'
          }`}
        >
          Semua
          <span className={`rounded-full px-1.5 text-[11px] ${statusFilter === 'all' ? 'bg-primary text-white' : 'bg-line text-muted'}`}>{totalAllCount}</span>
        </button>
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${
              statusFilter === s ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted hover:bg-canvas'
            }`}
          >
            {statusLabel[s]}
            <span className={`rounded-full px-1.5 text-[11px] ${statusFilter === s ? 'bg-primary text-white' : 'bg-line text-muted'}`}>{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th className="px-4 py-3 font-normal">Order</th>
                  <th className="px-4 py-3 font-normal">Customer</th>
                  <th className="px-4 py-3 font-normal">Total</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Tanggal</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-canvas">
                    <td className="px-4 py-3 text-muted">#{o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-ink">{o.users?.full_name ?? '-'}</td>
                    <td className="px-4 py-3 text-ink">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[o.status]}`}>{statusLabel[o.status] ?? o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openDetail(o)} className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-light">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">Gak ada order</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}

      {detailOrder && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/20 px-4" onClick={() => setDetailOrder(null)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-surface" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-surface px-5 py-4">
              <div>
                <h3 className="font-display font-semibold text-ink">Order #{detailOrder.id.slice(0, 8)}</h3>
                <p className="text-xs text-muted">Dibuat {new Date(detailOrder.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <button onClick={() => setDetailOrder(null)} className="text-muted hover:text-ink">✕</button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Status</p>
                <select
                  value={detailOrder.status}
                  onChange={(e) => updateStatus(detailOrder.id, e.target.value)}
                  className={`w-full rounded-md border border-line px-3 py-2 text-sm font-medium ${statusStyle[detailOrder.status]}`}
                >
                  {statusOptions.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
                </select>
                {detailOrder.updated_at && (
                  <p className="mt-1 text-xs text-muted">Terakhir diupdate {new Date(detailOrder.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Customer</p>
                <div className="rounded-md border border-line bg-canvas p-3 text-sm">
                  <p className="text-ink">{detailOrder.users?.full_name ?? '-'}</p>
                  <p className="text-muted">{detailOrder.users?.phone ?? 'Telepon belum diisi'}</p>
                </div>
              </div>

              {detailOrder.delivery_address && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Alamat Pengiriman</p>
                  <p className="rounded-md border border-line bg-canvas p-3 text-sm text-ink">{detailOrder.delivery_address}</p>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Item Dipesan</p>
                <div className="space-y-2">
                  {detailOrder.order_items.map((item) => (
                    <div key={item.id} className="rounded-md border border-line bg-canvas p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-ink">{item.products?.name}</p>
                        <p className="text-muted">{item.qty} × {formatPrice(item.price)}</p>
                      </div>
                      {category === 'equipment' && (
                        <div className="mt-2">
                          {item.serial_number_id ? (
                            <span className="text-xs font-medium text-success">✓ Serial number terpasang</span>
                          ) : (
                            <select
                              defaultValue=""
                              onChange={(e) => e.target.value && assignSerial(item.id, e.target.value)}
                              className="w-full rounded-md border border-line px-2 py-1.5 text-xs"
                            >
                              <option value="" disabled>Pilih serial number</option>
                              {(availableSerials[item.product_id] ?? []).map((sn) => <option key={sn.id} value={sn.id}>{sn.serial_number}</option>)}
                            </select>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line pt-4">
                <p className="text-sm font-medium text-ink">Total</p>
                <p className="font-display text-lg font-semibold text-ink">{formatPrice(detailOrder.total)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}