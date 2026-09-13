import { createClient } from '@/lib/supabase/server'
import StokMenipisCard from '@/components/modules/dashboard/StokMenipisCard'

type LowStockItem = { id: string; name: string; category: 'retail' | 'equipment'; displayQty: number; threshold: number }

export default async function DashboardPage() {
  const supabase = await createClient()
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999)

  const [pendingOrdersRes, retailProductsRes, equipmentProductsRes, serialNumbersRes, serviceTodayRes] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
    supabase.from('products').select('id, name, stock_qty, low_stock_threshold').eq('category', 'retail'),
    supabase.from('products').select('id, name, low_stock_threshold').eq('category', 'equipment'),
    supabase.from('serial_numbers').select('product_id').eq('status', 'in_stock'),
    supabase.from('service_requests').select('id, complaint, scheduled_at, location_address')
      .gte('scheduled_at', todayStart.toISOString()).lte('scheduled_at', todayEnd.toISOString()).order('scheduled_at'),
  ])

  const pendingOrders = pendingOrdersRes.count ?? 0

  const availableCountByProduct: Record<string, number> = {}
  for (const sn of serialNumbersRes.data ?? []) {
    availableCountByProduct[sn.product_id] = (availableCountByProduct[sn.product_id] ?? 0) + 1
  }

  const retailLowStock: LowStockItem[] = (retailProductsRes.data ?? [])
    .filter((p) => p.stock_qty <= p.low_stock_threshold)
    .map((p) => ({ id: p.id, name: p.name, category: 'retail', displayQty: p.stock_qty, threshold: p.low_stock_threshold }))

  const equipmentLowStock: LowStockItem[] = (equipmentProductsRes.data ?? [])
    .filter((p) => (availableCountByProduct[p.id] ?? 0) <= p.low_stock_threshold)
    .map((p) => ({ id: p.id, name: p.name, category: 'equipment', displayQty: availableCountByProduct[p.id] ?? 0, threshold: p.low_stock_threshold }))

  const lowStockItems: LowStockItem[] = [...retailLowStock, ...equipmentLowStock]
  const serviceToday = serviceTodayRes.data ?? []

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-muted">Ringkasan operasional hari ini</p>
      </div>

      <div className="flex divide-x divide-line rounded-lg border border-line bg-surface">
        <div className="flex-1 px-6 py-5">
          <p className="text-sm text-muted">Order pending</p>
          <p className="font-display text-4xl font-semibold text-ink">{pendingOrders}</p>
        </div>
        <div className="flex-1 px-6 py-5">
          <p className="text-sm text-muted">Stok menipis</p>
          <p className={`font-display text-4xl font-semibold ${lowStockItems.length ? 'text-amber' : 'text-ink'}`}>{lowStockItems.length}</p>
        </div>
        <div className="flex-1 px-6 py-5">
          <p className="text-sm text-muted">Jadwal service hari ini</p>
          <p className="font-display text-4xl font-semibold text-ink">{serviceToday.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <StokMenipisCard items={lowStockItems} />

        <div>
          <h2 className="mb-3 font-medium text-ink">Jadwal service hari ini</h2>
          <div className="divide-y divide-line rounded-lg border border-line bg-surface">
            {serviceToday.map((s) => (
              <div key={s.id} className="px-4 py-3 text-sm">
                <p className="text-ink">{s.complaint}</p>
                <p className="text-xs text-muted">{s.location_address}</p>
              </div>
            ))}
            {serviceToday.length === 0 && <p className="px-4 py-3 text-sm text-muted">Gak ada jadwal hari ini</p>}
          </div>
        </div>
      </div>
    </div>
  )
}