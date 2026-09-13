'use client'

import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

type LowStockItem = {
  id: string
  name: string
  category: 'retail' | 'equipment'
  displayQty: number
  threshold: number
}

type Props = {
  items: LowStockItem[]
}

function shortenName(name: string, max = 22) {
  if (name.length <= max) return name
  return `${name.substring(0, max)}...`
}

export default function StokMenipisCard({ items }: Props) {
  const chartData = items
    .slice()
    .sort((a, b) => a.displayQty - b.displayQty)
    .slice(0, 8)
    .map((item) => ({
      id: item.id,
      name: shortenName(item.name),
      fullName: item.name,
      stok: item.displayQty,
      threshold: item.threshold,
      category: item.category,
    }))

  if (items.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-line bg-surface px-6 text-center">
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
          Stok dalam kondisi aman
        </p>

        <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
          Tidak ada produk yang mencapai batas minimum stok.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <svg
                width="17"
                height="17"
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
            </span>

            <div>
              <p className="text-sm font-semibold text-ink">
                Kondisi Stok
              </p>

              <p className="text-xs text-muted">
                {items.length} produk perlu perhatian
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/products"
          className="text-xs font-medium text-primary transition hover:opacity-70"
        >
          Lihat detail
        </Link>
      </div>

      {/* CHART */}
      <div className="px-3 pb-2 pt-5">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 5,
                right: 25,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                opacity={0.15}
              />

              <XAxis
                type="number"
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: '#64748b',
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{
                  fontSize: 11,
                  fill: '#64748b',
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: 'rgba(0,0,0,0.025)',
                }}
                content={<CustomTooltip />}
              />

              <Bar
                dataKey="stok"
                name="Stok tersedia"
                fill="#f59e0b"
                radius={[0, 6, 6, 0]}
                maxBarSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-black/[0.01] px-5 py-3">
        <div className="flex items-center gap-4 text-[11px] text-muted">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Stok tersedia
          </div>

          <div>
            Menampilkan {Math.min(items.length, 8)} produk paling kritis
          </div>
        </div>

        {items.length > 8 && (
          <span className="text-[11px] text-muted">
            +{items.length - 8} produk lainnya
          </span>
        )}
      </div>
    </div>
  )
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: any[]
}) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  return (
    <div className="min-w-[190px] rounded-xl border border-line bg-white p-3 shadow-xl">
      <p className="max-w-[220px] text-xs font-semibold text-ink">
        {data.fullName}
      </p>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-muted">
            Stok tersedia
          </span>

          <span className="text-xs font-semibold text-amber-600">
            {data.stok}
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-muted">
            Batas minimum
          </span>

          <span className="text-xs font-medium text-ink">
            {data.threshold}
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-muted">
            Kategori
          </span>

          <span className="text-xs font-medium capitalize text-ink">
            {data.category}
          </span>
        </div>
      </div>
    </div>
  )
}