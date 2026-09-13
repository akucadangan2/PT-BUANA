'use server'

import { createClient as createServerClient } from '@supabase/supabase-js'

function adminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createCustomerAccount(form: { email: string; password: string; full_name: string; phone: string }) {
  const supabase = adminClient()

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: form.email,
    password: form.password,
    email_confirm: true,
  })
  if (authError || !authUser.user) throw new Error(authError?.message ?? 'Gagal membuat akun customer')

  const { error: profileError } = await supabase.from('users').upsert({
    id: authUser.user.id,
    full_name: form.full_name,
    role: 'customer',
    phone: form.phone,
  }, { onConflict: 'id' })
  if (profileError) throw new Error(profileError.message)

  return authUser.user.id
}