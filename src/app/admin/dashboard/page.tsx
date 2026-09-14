import Link from 'next/link'
import { AlertTriangle, Calendar, CheckCircle2, ChevronRight, ClipboardList, Clock, MapPin, Package, Wrench } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import StokMenipisCard from '@/components/modules/dashboard/StokMenipisCard'
import type { ReactNode } from 'react'

type LowStockItem = {
  id: string
  name: string
  category: 'retail' | 'equipment'
  displayQty: number
  threshold: number
}

type ServiceTodayItem = {
  id: string
  complaint: string
  scheduled_at: string
  location_address: string | null
}

function formatTime(dateString: string) {
  return new Intl.DateTimeFormat('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(new Date(dateString))
}

function formatToday() {
  return new Intl.DateTimeFormat('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date())
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const [
    pendingOrdersRes,
    processingOrdersRes,
    completedTodayRes,
    retailProductsRes,
    equipmentProductsRes,
    serialNumbersRes,
    serviceTodayRes,
  ] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'delivered')
      .gte('updated_at', todayStart.toISOString())
      .lte('updated_at', todayEnd.toISOString()),
    supabase.from('products').select('id, name, stock_qty, low_stock_threshold').eq('category', 'retail'),
    supabase.from('products').select('id, name, low_stock_threshold').eq('category', 'equipment'),
    supabase.from('serial_numbers').select('product_id').eq('status', 'in_stock'),
    supabase
      .from('service_requests')
      .select('id, complaint, scheduled_at, location_address')
      .gte('scheduled_at', todayStart.toISOString())
      .lte('scheduled_at', todayEnd.toISOString())
      .order('scheduled_at', { ascending: true }),
  ])

  const pendingOrders = pendingOrdersRes.count ?? 0
  const processingOrders = processingOrdersRes.count ?? 0
  const completedToday = completedTodayRes.count ?? 0

  const availableCountByProduct: Record<string, number> = {}
  for (const sn of serialNumbersRes.data ?? []) {
    availableCountByProduct[sn.product_id] = (availableCountByProduct[sn.product_id] ?? 0) + 1
  }

  const retailLowStock: LowStockItem[] = (retailProductsRes.data ?? [])
    .filter((p) => Number(p.stock_qty ?? 0) <= Number(p.low_stock_threshold ?? 0))
    .map((p) => ({ id: p.id, name: p.name, category: 'retail', displayQty: Number(p.stock_qty ?? 0), threshold: Number(p.low_stock_threshold ?? 0) }))

  const equipmentLowStock: LowStockItem[] = (equipmentProductsRes.data ?? [])
    .filter((p) => (availableCountByProduct[p.id] ?? 0) <= Number(p.low_stock_threshold ?? 0))
    .map((p) => ({ id: p.id, name: p.name, category: 'equipment', displayQty: availableCountByProduct[p.id] ?? 0, threshold: Number(p.low_stock_threshold ?? 0) }))

  const lowStockItems: LowStockItem[] = [...retailLowStock, ...equipmentLowStock]
  const serviceToday = (serviceTodayRes.data ?? []) as ServiceTodayItem[]
  const operationalIssues = pendingOrders + lowStockItems.length + serviceToday.length

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Buana operations summary for {formatToday()}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/order/retail"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-canvas"
          >
            <ClipboardList size={16} />
            View Orders
          </Link>
          <Link
            href="/admin/service/booking"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Wrench size={16} />
            Manage Service
          </Link>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Pending Orders" value={pendingOrders} helper="Awaiting processing" tone={pendingOrders > 0 ? 'amber' : 'default'} icon={<Clock size={20} />} />
        <SummaryCard label="Processing" value={processingOrders} helper="Active orders" icon={<Package size={20} />} />
        <SummaryCard label="Low Stock" value={lowStockItems.length} helper="Needs attention" tone={lowStockItems.length > 0 ? 'amber' : 'default'} icon={<AlertTriangle size={20} />} />
        <SummaryCard label="Today's Service" value={serviceToday.length} helper={`${completedToday} orders completed today`} icon={<Calendar size={20} />} />
      </section>

      {/* OPERATIONAL STATUS */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Operational Status</p>
              <p className="mt-1 text-sm text-muted">
                {operationalIssues > 0 ? 'Some activities need your attention.' : 'All operations are running normally.'}
              </p>
            </div>
            <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${operationalIssues > 0 ? 'bg-amber-light text-amber' : 'bg-success/10 text-success'}`}>
              <span className={`h-2 w-2 rounded-full ${operationalIssues > 0 ? 'bg-amber' : 'bg-success'}`} />
              {operationalIssues > 0 ? `${operationalIssues} issues` : 'Normal'}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-sm text-muted">Completed Today</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="font-display text-3xl font-semibold text-ink">{completedToday}</p>
            <div className="rounded-md bg-success/10 p-2 text-success">
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        {/* STOCK */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Low Stock</h2>
              <p className="mt-0.5 text-xs text-muted">Products that have reached minimum stock level</p>
            </div>
            <Link href="/admin/produk/retail" className="text-xs font-medium text-primary hover:opacity-70">
              Manage Products
            </Link>
          </div>
          <StokMenipisCard items={lowStockItems} />
        </div>

        {/* SERVICE TODAY */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Today's Service Schedule</h2>
              <p className="mt-0.5 text-xs text-muted">Scheduled technician visits and activities</p>
            </div>
            <Link href="/admin/service/riwayat" className="text-xs font-medium text-primary hover:opacity-70">
              View All
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            {serviceToday.length > 0 ? (
              <div className="divide-y divide-line">
                {serviceToday.map((service, index) => (
                  <div key={service.id} className="flex gap-4 px-5 py-4">
                    <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-md bg-primary-light px-2 py-2 text-center">
                      <span className="text-xs text-muted">{index === 0 ? 'Next' : 'Time'}</span>
                      <span className="mt-0.5 text-sm font-semibold text-primary">{formatTime(service.scheduled_at)}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-1 text-sm font-medium text-ink">{service.complaint}</p>
                        <ChevronRight size={16} className="mt-0.5 shrink-0 text-muted" />
                      </div>
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{service.location_address || 'Location not provided'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 size={22} />
                </div>
                <p className="text-sm font-medium text-ink">No service scheduled</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-muted">No visits or services scheduled for today.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  helper,
  icon,
  tone = 'default',
}: {
  label: string
  value: number
  helper: string
  icon: ReactNode
  tone?: 'default' | 'amber'
}) {
  const isAmber = tone === 'amber'

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${isAmber ? 'bg-amber-light text-amber' : 'bg-primary-light text-primary'}`}>
          {icon}
        </div>
        <span className={`h-2 w-2 rounded-full ${value > 0 ? (isAmber ? 'bg-amber' : 'bg-primary') : 'bg-line'}`} />
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted">{label}</p>
        <p className={`mt-1 font-display text-3xl font-semibold ${isAmber && value > 0 ? 'text-amber' : 'text-ink'}`}>{value}</p>
        <p className="mt-1 text-xs text-muted">{helper}</p>
      </div>
    </div>
  )
}