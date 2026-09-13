'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, BellOff, BellRing } from 'lucide-react'
import Sidebar from './Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useAdminNotifications } from './useAdminNotifications'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const { badges, notifPermission, requestPermission } = useAdminNotifications()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      <div className={`shrink-0 overflow-hidden transition-all duration-200 ${open ? 'w-64' : 'w-0'}`}>
        <div className="w-64">
          <Sidebar badges={badges} />
        </div>
      </div>

      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b border-line bg-surface px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="rounded-md p-1.5 text-muted hover:bg-canvas"
              aria-label="Toggle sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {!open && <span className="font-display text-base font-semibold text-ink">Buana Panel</span>}
          </div>

          <div className="flex items-center gap-3">
            {notifPermission === 'granted' && (
              <span title="Notifikasi browser aktif" className="flex h-8 w-8 items-center justify-center rounded-md text-success">
                <BellRing size={18} />
              </span>
            )}
            {notifPermission === 'default' && (
              <button
                onClick={requestPermission}
                title="Aktifkan notifikasi browser"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-canvas"
              >
                <Bell size={18} />
              </button>
            )}
            {notifPermission === 'denied' && (
              <span title="Notifikasi diblokir — aktifkan lewat pengaturan browser" className="flex h-8 w-8 items-center justify-center rounded-md text-muted">
                <BellOff size={18} />
              </span>
            )}

            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 text-sm text-muted">
                <span className="h-7 w-7 rounded-full bg-primary-light text-center text-xs font-medium leading-7 text-primary">A</span>
                Admin
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 w-40 rounded-md border border-line bg-surface py-1 shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-canvas"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}