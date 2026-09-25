'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Badges = {
  retailPending: number
  equipmentPending: number
  serviceRequested: number
}

function buildGroups(badges: Badges) {
  return [
    { label: 'Main', items: [{ label: 'Dashboard', href: '/admin/dashboard', badge: 0 }] },
    {
      label: 'Products & Stock',
      items: [
        { label: 'Retail Products', href: '/admin/produk/retail', badge: 0 },
        { label: 'Equipment Products', href: '/admin/produk/equipment', badge: 0 },
        { label: 'Serial Numbers', href: '/admin/serial-number', badge: 0 },
        { label: 'Stock Count', href: '/admin/stok/opname', badge: 0 },
        { label: 'Stock History', href: '/admin/stok/movement', badge: 0 },
        { label: 'Import Products', href: '/admin/produk/import', badge: 0 },
      ],
    },
    {
      label: 'Sales & Order',
      items: [
        { label: 'Retail Orders', href: '/admin/order/retail', badge: badges.retailPending },
        { label: 'Equipment Orders', href: '/admin/order/equipment', badge: badges.equipmentPending },
        { label: 'Delivery', href: '/admin/delivery', badge: 0 },
        { label: 'Create Order', href: '/admin/sales', badge: 0 },
      ],
    },
    {
      label: 'Service',
      items: [
        { label: 'Incoming Bookings', href: '/admin/service/booking', badge: badges.serviceRequested },
        { label: 'Assign Technician', href: '/admin/service/assign', badge: 0 },
        { label: 'Service History', href: '/admin/service/riwayat', badge: 0 },
        { label: 'Warranty', href: '/admin/warranty', badge: 0 },
      ],
    },
    {
      label: 'Vendor',
      items: [
        { label: 'Listing Saya', href: '/admin/vendor/products', badge: 0 },
        { label: 'PO Masuk', href: '/admin/vendor/orders', badge: 0 },
      ],
    },
    {
      label: 'Other',
      items: [
        { label: 'Reports', href: '/admin/laporan', badge: 0 },
        { label: 'Users', href: '/admin/user', badge: 0 },
        { label: 'Customers', href: '/admin/customers', badge: 0 },
        { label: 'Vendor Payout', href: '/admin/vendor-payouts', badge: 0 },
      ],
    },
  ]
}

export default function Sidebar({ badges }: { badges: Badges }) {
  const pathname = usePathname()
  const groups = buildGroups(badges)
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['Main']))

  useEffect(() => {
    const activeGroup = groups.find((g) => g.items.some((item) => item.href === pathname))
    if (activeGroup) {
      setOpenGroups((prev) => new Set(prev).add(activeGroup.label))
    }
  }, [pathname])

  function toggleGroup(label: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-surface">
      <div className="border-b border-line px-5 py-5">
        <p className="font-display text-lg font-semibold text-ink">Buana Panel</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {groups.map((group) => {
            const isOpen = openGroups.has(group.label)
            const hasActiveItem = group.items.some((item) => item.href === pathname)
            const groupBadgeTotal = group.items.reduce((sum, item) => sum + item.badge, 0)

            return (
              <div key={group.label}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    hasActiveItem ? 'text-primary' : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {group.label}
                    {!isOpen && groupBadgeTotal > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-semibold text-white">
                        {groupBadgeTotal}
                      </span>
                    )}
                  </span>
                  <svg
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="mb-1 mt-0.5 space-y-0.5">
                    {group.items.map((item) => {
                      const active = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
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
                )}
              </div>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}