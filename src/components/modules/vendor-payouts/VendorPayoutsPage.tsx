'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/format-price'

type PayoutRow = {
  id: string; qty: number; price: number; vendor_price: number | null; vendor_paid: boolean
  products: { name: string; vendor_id: string; users: { full_name: string; phone: string | null } | null } | null
  orders: { status: string; created_at: string } | null
}

export default function VendorPayoutsPage() {
  const supabase = createClient()
  const [rows, setRows] = useState<PayoutRow[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('order_items')
      .select('id, qty, price, vendor_price, vendor_paid, products!inner(name, vendor_id, users(full_name, phone)), orders(status, created_at)')
      .not('products.vendor_id', 'is', null)
      .order('id', { ascending: false })
    setRows((data as any) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function togglePaid(id: string, current: boolean) {
    await supabase.from('order_items').update({ vendor_paid: !current }).eq('id', id)
    load()
  }

  const totalUnpaid = rows.filter((r) => !r.vendor_paid).reduce((sum, r) => sum + (r.vendor_price ?? r.price), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Vendor Payout</h1>
        <p className="text-sm text-muted">Rekonsiliasi transfer manual ke vendor</p>
      </div>

      <div className="rounded-lg border border-line bg-surface p-5">
        <p className="text-sm text-muted">Total belum ditransfer</p>
        <p className="font-display text-3xl font-semibold text-amber">{formatPrice(totalUnpaid)}</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-normal">Vendor</th>
                <th className="px-4 py-3 font-normal">Item</th>
                <th className="px-4 py-3 font-normal">Harga Customer</th>
                <th className="px-4 py-3 font-normal">Ke Vendor</th>
                <th className="px-4 py-3 font-normal">Status Order</th>
                <th className="px-4 py-3 font-normal">Transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-canvas">
                  <td className="px-4 py-3 text-ink">{r.products?.users?.full_name ?? '-'}</td>
                  <td className="px-4 py-3 text-ink">{r.products?.name}</td>
                  <td className="px-4 py-3 text-muted">{formatPrice(r.price)}</td>
                  <td className="px-4 py-3 text-success">{r.vendor_price !== null ? formatPrice(r.vendor_price) : formatPrice(r.price)}</td>
                  <td className="px-4 py-3 text-muted">{r.orders?.status}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePaid(r.id, r.vendor_paid)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.vendor_paid ? 'bg-success/10 text-success' : 'bg-amber-light text-amber'}`}
                    >
                      {r.vendor_paid ? 'Sudah' : 'Belum'}
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">Belum ada penjualan vendor</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}