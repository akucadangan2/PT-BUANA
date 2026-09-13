'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Badges = {
  retailPending: number
  equipmentPending: number
  serviceRequested: number
}

function buildGroups(badges: Badges) {
  return [
    { label: 'Utama', items: [{ label: 'Dashboard', href: '/admin/dashboard', badge: 0 }] },
    {
      label: 'Produk & stok',
      items: [
        { label: 'Produk retail', href: '/admin/produk/retail', badge: 0 },
        { label: 'Produk equipment', href: '/admin/produk/equipment', badge: 0 },
        { label: 'Serial number', href: '/admin/serial-number', badge: 0 },
        { label: 'Stok opname', href: '/admin/stok/opname', badge: 0 },
        { label: 'Riwayat stok', href: '/admin/stok/movement', badge: 0 },
      ],
    },
    {
      label: 'Transaksi',
      items: [
        { label: 'Order retail', href: '/admin/order/retail', badge: badges.retailPending },
        { label: 'Order equipment', href: '/admin/order/equipment', badge: badges.equipmentPending },
        { label: 'Delivery', href: '/admin/delivery', badge: 0 },
      ],
    },
    {
      label: 'Service',
      items: [
        { label: 'Booking masuk', href: '/admin/service/booking', badge: badges.serviceRequested },
        { label: 'Assign teknisi', href: '/admin/service/assign', badge: 0 },
        { label: 'Riwayat service', href: '/admin/service/riwayat', badge: 0 },
        { label: 'Warranty', href: '/admin/warranty', badge: 0 },
      ],
    },
    { label: 'Sales', items: [{ label: 'Buat Order', href: '/admin/sales', badge: 0 }] },
    {
      label: 'Lainnya',
      items: [
        { label: 'Laporan', href: '/admin/laporan', badge: 0 },
        { label: 'User', href: '/admin/user', badge: 0 },
      ],
    },
  ]
}

export default function Sidebar({ badges }: { badges: Badges }) {
  const pathname = usePathname()
  const groups = buildGroups(badges)

  return (
    <aside className="w-64 shrink-0 border-r border-line bg-surface px-4 py-6">
      <div className="mb-8 px-2">
        <p className="font-display text-lg font-semibold text-ink">Buana Panel</p>
      </div>
      <nav className="space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2 text-xs text-muted">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                      active ? 'bg-primary-light font-medium text-primary' : 'text-ink/80 hover:bg-canvas'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1.5 text-[11px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}