'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type AdminBadges = {
  retailPending: number
  equipmentPending: number
  serviceRequested: number
}

export function useAdminNotifications() {
  const [badges, setBadges] = useState<AdminBadges>({ retailPending: 0, equipmentPending: 0, serviceRequested: 0 })
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const supabaseRef = useRef(createClient())

  async function loadCounts() {
    const supabase = supabaseRef.current
    const [retailRes, equipmentRes, serviceRes] = await Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending').eq('category', 'retail'),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending').eq('category', 'equipment'),
      supabase.from('service_requests').select('id', { count: 'exact', head: true }).eq('status', 'requested'),
    ])
    setBadges({
      retailPending: retailRes.count ?? 0,
      equipmentPending: equipmentRes.count ?? 0,
      serviceRequested: serviceRes.count ?? 0,
    })
  }

  function showBrowserNotification(title: string, body: string, url: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    const n = new Notification(title, { body, icon: '/logo.png' })
    n.onclick = () => {
      window.focus()
      window.location.href = url
    }
  }

  async function requestPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotifPermission('unsupported')
      return
    }
    const result = await Notification.requestPermission()
    setNotifPermission(result)
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission)
    } else {
      setNotifPermission('unsupported')
    }

    loadCounts()

    const supabase = supabaseRef.current
    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        loadCounts()
        const category = payload.new.category === 'retail' ? 'Retail' : 'Equipment'
        showBrowserNotification('Order Baru', `Order ${category} baru masuk`, `/admin/order/${payload.new.category}`)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, () => loadCounts())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_requests' }, (payload) => {
        loadCounts()
        showBrowserNotification('Booking Service Baru', payload.new.complaint ?? 'Ada booking service baru', '/admin/service/booking')
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'service_requests' }, () => loadCounts())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { badges, notifPermission, requestPermission }
}