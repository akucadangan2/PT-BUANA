'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const groups = [
  { label: 'Utama', items: [{ label: 'Dashboard', href: '/admin/dashboard' }] },
  {
    label: 'Produk & stok',
    items: [
      { label: 'Produk retail', href: '/admin/produk/retail' },
      { label: 'Produk equipment', href: '/admin/produk/equipment' },
      { label: 'Serial number', href: '/admin/serial-number' },
      { label: 'Stok opname', href: '/admin/stok/opname' },
      { label: 'Riwayat stok', href: '/admin/stok/movement' },
    ],
  },
  {
    label: 'Transaksi',
    items: [
      { label: 'Order retail', href: '/admin/order/retail' },
      { label: 'Order equipment', href: '/admin/order/equipment' },
      { label: 'Delivery', href: '/admin/delivery' },
    ],
  },
  {
    label: 'Service',
    items: [
      { label: 'Booking masuk', href: '/admin/service/booking' },
      { label: 'Assign teknisi', href: '/admin/service/assign' },
      { label: 'Riwayat service', href: '/admin/service/riwayat' },
      { label: 'Warranty', href: '/admin/warranty' },
    ],
  },
  { label: 'Sales', items: [{ label: 'Buat Order', href: '/admin/sales' }] },
  { label: 'Lainnya', items: [{ label: 'Laporan', href: '/admin/laporan' }, { label: 'User', href: '/admin/user' }] },
]

export default function Sidebar() {
  const pathname = usePathname()
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
                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                      active ? 'bg-primary-light font-medium text-primary' : 'text-ink/80 hover:bg-canvas'
                    }`}
                  >
                    {item.label}
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