'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/format-price'

type VendorOrderItem = {
  id: string; qty: number; price: number
  products: { name: string } | null
  orders: { id: string; status: string; delivery_address: string | null; created_at: string; users: { full_name: string; phone: string | null } | null } | null
}

const statusLabel: Record<string, string> = { pending: 'Pending', confirmed: 'Dikonfirmasi', processing: 'Diproses', delivered: 'Selesai', cancelled: 'Dibatalkan' }

export default function VendorOrdersPage() {
  const supabase = createClient()
  const [items, setItems] = useState<VendorOrderItem[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('order_items')
      .select('id, qty, price, products!inner(name, vendor_id), orders(id, status, delivery_address, created_at, users!customer_id(full_name, phone))')
      .eq('products.vendor_id', user?.id)
      .order('id', { ascending: false })
    setItems((data as any) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function markDelivered(orderId: string) {
    await supabase.from('orders').update({ status: 'delivered' }).eq('id', orderId)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">PO Masuk</h1>
        <p className="text-sm text-muted">Order yang berisi listing kamu</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const order = item.orders
            const customer = order?.users
            return (
              <div key={item.id} className="rounded-lg border border-line bg-surface p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-ink">{item.products?.name}</p>
                    <p className="text-xs text-muted">{item.qty} unit · {formatPrice(item.price)}</p>
                  </div>
                  <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">{statusLabel[order?.status ?? ''] ?? order?.status}</span>
                </div>
                <div className="mt-3 rounded-md bg-canvas p-3 text-sm">
                  <p className="text-ink">{customer?.full_name ?? '-'}</p>
                  <p className="text-muted">{customer?.phone ?? '-'}</p>
                  <p className="mt-1 text-muted">{order?.delivery_address ?? 'Alamat belum diisi'}</p>
                </div>
                {order?.status !== 'delivered' && order?.status !== 'cancelled' && (
                  <button
                    onClick={() => markDelivered(order!.id)}
                    className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    Tandai Sudah Dikirim
                  </button>
                )}
              </div>
            )
          })}
          {items.length === 0 && <p className="rounded-lg border border-line bg-surface px-4 py-6 text-center text-sm text-muted">Belum ada PO masuk</p>}
        </div>
      )}
    </div>
  )
}