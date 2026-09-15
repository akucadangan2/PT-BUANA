'use client'

import { Fragment, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Pagination from '@/components/ui/Pagination'
import { formatPrice } from '@/lib/format-price'

type OrderItem = { id: string; product_id: string; serial_number_id: string | null; qty: number; price: number; products: { name: string } | null }
type Order = { id: string; status: string; total: number; created_at: string; users: { full_name: string } | null; order_items: OrderItem[] }
type SerialOption = { id: string; serial_number: string }

const statusOptions = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled']
const statusStyle: Record<string, string> = {
  pending: 'text-amber', confirmed: 'text-primary', processing: 'text-primary', delivered: 'text-success', cancelled: 'text-danger',
}

export default function OrderTable({ category }: { category: 'retail' | 'equipment' }) {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [availableSerials, setAvailableSerials] = useState<Record<string, SerialOption[]>>({})

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase
      .from('orders')
      .select('id, status, total, created_at, users!customer_id(full_name), order_items(id, product_id, serial_number_id, qty, price, products(name))', { count: 'exact' })
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range(from, to)
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    const { data, count } = await query
    setOrders((data as any) ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [category, page, pageSize, statusFilter])
  useEffect(() => { setPage(1) }, [category, statusFilter])

  async function toggleExpand(order: Order) {
    if (expanded === order.id) { setExpanded(null); return }
    setExpanded(order.id)
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
    load()
  }

  async function assignSerial(itemId: string, serialNumberId: string) {
    await supabase.from('order_items').update({ serial_number_id: serialNumberId }).eq('id', itemId)
    await supabase.from('serial_numbers').update({ status: 'delivered' }).eq('id', serialNumberId)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Order {category === 'retail' ? 'Retail' : 'Equipment'}</h1>
        <p className="text-sm text-muted">{total} order</p>
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
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th className="px-4 py-3 font-normal">Order</th>
                  <th className="px-4 py-3 font-normal">Customer</th>
                  <th className="px-4 py-3 font-normal">Total</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => (
                  <Fragment key={o.id}>
                    <tr onClick={() => toggleExpand(o)} className="cursor-pointer hover:bg-canvas">
                      <td className="px-4 py-3 text-muted">#{o.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-ink">{o.users?.full_name ?? '-'}</td>
                      <td className="px-4 py-3 text-ink">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3">
                        <select value={o.status} onClick={(e) => e.stopPropagation()} onChange={(e) => updateStatus(o.id, e.target.value)}
                          className={`rounded-md border border-line bg-surface px-2 py-1 text-xs font-medium ${statusStyle[o.status]}`}>
                          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-muted">{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
                    </tr>
                    {expanded === o.id && (
                      <tr>
                        <td colSpan={5} className="bg-canvas px-4 py-4">
                          <div className="space-y-2">
                            {o.order_items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between rounded-md border border-line bg-surface px-3 py-2 text-sm">
                                <div>
                                  <p className="text-ink">{item.products?.name}</p>
                                  <p className="text-xs text-muted">{item.qty} x {formatPrice(item.price)}</p>
                                </div>
                                {category === 'equipment' && (
                                  item.serial_number_id ? (
                                    <span className="text-xs text-success">Serial terpasang</span>
                                  ) : (
                                    <select defaultValue="" onChange={(e) => e.target.value && assignSerial(item.id, e.target.value)}
                                      className="rounded-md border border-line px-2 py-1 text-xs">
                                      <option value="" disabled>Pilih serial number</option>
                                      {(availableSerials[item.product_id] ?? []).map((sn) => <option key={sn.id} value={sn.id}>{sn.serial_number}</option>)}
                                    </select>
                                  )
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {orders.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">Gak ada order</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}
    </div>
  )
}
