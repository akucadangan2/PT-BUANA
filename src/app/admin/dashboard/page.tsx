import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StokMenipisCard from '@/components/modules/dashboard/StokMenipisCard'

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
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(new Date(dateString))
}

function formatToday() {
  return new Intl.DateTimeFormat('id-ID', {
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
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),

    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'processing'),

    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('updated_at', todayStart.toISOString())
      .lte('updated_at', todayEnd.toISOString()),

    supabase
      .from('products')
      .select('id, name, stock_qty, low_stock_threshold')
      .eq('category', 'retail'),

    supabase
      .from('products')
      .select('id, name, low_stock_threshold')
      .eq('category', 'equipment'),

    supabase
      .from('serial_numbers')
      .select('product_id')
      .eq('status', 'in_stock'),

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
    availableCountByProduct[sn.product_id] =
      (availableCountByProduct[sn.product_id] ?? 0) + 1
  }

  const retailLowStock: LowStockItem[] = (retailProductsRes.data ?? [])
    .filter(
      (p) =>
        Number(p.stock_qty ?? 0) <= Number(p.low_stock_threshold ?? 0)
    )
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: 'retail',
      displayQty: Number(p.stock_qty ?? 0),
      threshold: Number(p.low_stock_threshold ?? 0),
    }))

  const equipmentLowStock: LowStockItem[] = (equipmentProductsRes.data ?? [])
    .filter(
      (p) =>
        (availableCountByProduct[p.id] ?? 0) <=
        Number(p.low_stock_threshold ?? 0)
    )
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: 'equipment',
      displayQty: availableCountByProduct[p.id] ?? 0,
      threshold: Number(p.low_stock_threshold ?? 0),
    }))

  const lowStockItems: LowStockItem[] = [
    ...retailLowStock,
    ...equipmentLowStock,
  ]

  const serviceToday = (serviceTodayRes.data ?? []) as ServiceTodayItem[]

  const operationalIssues =
    pendingOrders + lowStockItems.length + serviceToday.length

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />

            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              Operational Overview
            </p>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted">
            Ringkasan operasional Buana untuk {formatToday()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-black/[0.03]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            Lihat Order
          </Link>

          <Link
            href="/admin/service"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M14.7 6.3a4 4 0 0 0-5-5l2.1 2.1-2.8 2.8-2.1-2.1a4 4 0 0 0 5 5l6.6 6.6a2 2 0 0 0 2.8-2.8Z" />
              <path d="m4 20 5.5-5.5" />
            </svg>

            Kelola Service
          </Link>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Order Pending"
          value={pendingOrders}
          helper="Menunggu diproses"
          tone={pendingOrders > 0 ? 'amber' : 'default'}
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          }
        />

        <SummaryCard
          label="Sedang Diproses"
          value={processingOrders}
          helper="Order aktif"
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 6h18" />
              <path d="M7 6V4h10v2" />
              <rect x="5" y="6" width="14" height="14" rx="2" />
              <path d="M9 11h6" />
              <path d="M9 15h4" />
            </svg>
          }
        />

        <SummaryCard
          label="Stok Menipis"
          value={lowStockItems.length}
          helper="Perlu perhatian"
          tone={lowStockItems.length > 0 ? 'amber' : 'default'}
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M21 8 12 3 3 8l9 5 9-5Z" />
              <path d="m3 8 9 5 9-5" />
              <path d="M3 12l9 5 9-5" />
              <path d="M3 16l9 5 9-5" />
            </svg>
          }
        />

        <SummaryCard
          label="Service Hari Ini"
          value={serviceToday.length}
          helper={`${completedToday} order selesai hari ini`}
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18" />
            </svg>
          }
        />
      </section>

      {/* OPERATIONAL STATUS */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Status operasional</p>

              <p className="mt-1 text-sm text-muted">
                {operationalIssues > 0
                  ? 'Ada beberapa aktivitas yang membutuhkan perhatian.'
                  : 'Semua aktivitas operasional dalam kondisi normal.'}
              </p>
            </div>

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                operationalIssues > 0
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  operationalIssues > 0
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />

              {operationalIssues > 0
                ? `${operationalIssues} perhatian`
                : 'Normal'}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-muted">Selesai hari ini</p>

          <div className="mt-2 flex items-end justify-between">
            <p className="font-display text-3xl font-semibold text-ink">
              {completedToday}
            </p>

            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
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
              <h2 className="font-display text-lg font-semibold text-ink">
                Stok menipis
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                Produk yang sudah mencapai batas minimum stok
              </p>
            </div>

            <Link
              href="/admin/products"
              className="text-xs font-medium text-primary transition hover:opacity-70"
            >
              Kelola produk
            </Link>
          </div>

          <StokMenipisCard items={lowStockItems} />
        </div>

        {/* SERVICE TODAY */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                Jadwal service hari ini
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                Aktivitas teknisi dan kunjungan yang dijadwalkan
              </p>
            </div>

            <Link
              href="/admin/service"
              className="text-xs font-medium text-primary transition hover:opacity-70"
            >
              Lihat semua
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            {serviceToday.length > 0 ? (
              <div className="divide-y divide-line">
                {serviceToday.map((service, index) => (
                  <Link
                    key={service.id}
                    href={`/admin/service/${service.id}`}
                    className="group flex gap-4 px-5 py-4 transition hover:bg-black/[0.02]"
                  >
                    <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/[0.06] px-2 py-2 text-center">
                      <span className="text-xs text-muted">
                        {index === 0 ? 'Next' : 'Jam'}
                      </span>

                      <span className="mt-0.5 text-sm font-semibold text-primary">
                        {formatTime(service.scheduled_at)}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-1 text-sm font-medium text-ink">
                          {service.complaint}
                        </p>

                        <svg
                          className="mt-0.5 shrink-0 text-muted transition-transform group-hover:translate-x-1"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </div>

                      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted">
                        <svg
                          className="mt-0.5 shrink-0"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>

                        <span className="line-clamp-2">
                          {service.location_address || 'Lokasi belum diisi'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>

                <p className="text-sm font-medium text-ink">
                  Tidak ada jadwal service
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
                  Belum ada kunjungan atau service yang dijadwalkan untuk hari
                  ini.
                </p>
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
  icon: React.ReactNode
  tone?: 'default' | 'amber'
}) {
  const isAmber = tone === 'amber'

  return (
    <div className="group rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isAmber
              ? 'bg-amber-50 text-amber-600'
              : 'bg-primary/[0.07] text-primary'
          }`}
        >
          {icon}
        </div>

        <span
          className={`h-2 w-2 rounded-full ${
            value > 0
              ? isAmber
                ? 'bg-amber-500'
                : 'bg-primary'
              : 'bg-gray-300'
          }`}
        />
      </div>

      <div className="mt-5">
        <p className="text-sm text-muted">{label}</p>

        <p
          className={`mt-1 font-display text-3xl font-semibold tracking-tight ${
            isAmber && value > 0 ? 'text-amber-600' : 'text-ink'
          }`}
        >
          {value}
        </p>

        <p className="mt-1 text-xs text-muted">{helper}</p>
      </div>
    </div>
  )
}