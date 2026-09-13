'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import * as XLSX from 'xlsx'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

type OrderRow = { id: string; category: string; total: number; status: string; created_at: string }
type ServiceRow = { id: string; status: string; created_at: string }

export default function ReportsPanel() {
  const supabase = createClient()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [orderRes, serviceRes] = await Promise.all([
      supabase.from('orders').select('id, category, total, status, created_at').order('created_at', { ascending: false }),
      supabase.from('service_requests').select('id, status, created_at').order('created_at', { ascending: false }),
    ])
    setOrders(orderRes.data ?? [])
    setServices(serviceRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const salesByCategory = ['retail', 'equipment'].map((cat) => ({
    category: cat === 'retail' ? 'Retail' : 'Equipment',
    total: orders.filter((o) => o.category === cat && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
  }))

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  const completedServices = services.filter((s) => s.status === 'completed').length

  function exportExcel() {
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(orders), 'Orders')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(services), 'Service')
    XLSX.writeFile(wb, `laporan-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Laporan</h1>
          <p className="text-sm text-muted">Ringkasan penjualan dan service</p>
        </div>
        <button onClick={exportExcel} className="rounded-md border border-line px-4 py-2 text-sm font-medium text-primary hover:bg-canvas">
          Export Excel
        </button>
      </div>

      <div className="flex divide-x divide-line rounded-lg border border-line bg-surface">
        <div className="flex-1 px-6 py-5">
          <p className="text-sm text-muted">Total revenue</p>
          <p className="font-display text-3xl font-semibold text-ink">Rp{totalRevenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="flex-1 px-6 py-5">
          <p className="text-sm text-muted">Total order</p>
          <p className="font-display text-3xl font-semibold text-ink">{orders.length}</p>
        </div>
        <div className="flex-1 px-6 py-5">
          <p className="text-sm text-muted">Service selesai</p>
          <p className="font-display text-3xl font-semibold text-ink">{completedServices}</p>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-surface p-6">
        <h2 className="mb-4 font-medium text-ink">Penjualan per kategori</h2>
        {loading ? (
          <p className="text-sm text-muted">Memuat...</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salesByCategory}>
              <CartesianGrid stroke="#E2E5EA" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: '#667085', fontSize: 12 }} axisLine={{ stroke: '#E2E5EA' }} tickLine={false} />
              <YAxis tick={{ fill: '#667085', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => `Rp${v.toLocaleString('id-ID')}`} />
              <Bar dataKey="total" fill="#0F6E6E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}