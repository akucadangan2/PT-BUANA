'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function anonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function requestAccountDeletion(email: string, password: string) {
  // Verifikasi kredensial dulu — mastiin yang minta hapus emang pemilik akun
  const anon = anonClient()
  const { data, error } = await anon.auth.signInWithPassword({ email, password })
  if (error || !data.user) {
    throw new Error('Email atau password salah')
  }

  const userId = data.user.id
  const admin = adminClient()

  // Anonim-kan data pribadi
  await admin.from('users').update({
    full_name: 'Pengguna Terhapus',
    phone: null,
    onesignal_player_id: null,
    deleted_at: new Date().toISOString(),
  }).eq('id', userId)

  // Hapus data yang murni personal, gak ada alasan buat dipertahanin
  await admin.from('customer_addresses').delete().eq('customer_id', userId)
  await admin.from('favorites').delete().eq('customer_id', userId)

  // Blokir login permanen (hindari cascade delete ke orders/service_requests)
  await admin.auth.admin.updateUserById(userId, { ban_duration: '876000h' })

  return { success: true }
}