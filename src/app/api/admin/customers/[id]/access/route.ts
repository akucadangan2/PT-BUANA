import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function anonClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
function adminClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return NextResponse.json({ error: 'Missing authorization' }, { status: 401 })

  const anon = anonClient()
  const { data: userData, error: authError } = await anon.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authError || !userData.user) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

  const admin = adminClient()
  const { data: requester } = await admin.from('users').select('role').eq('id', userData.user.id).single()
  if (requester?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { suspend } = await req.json()
  const { id: customerId } = await params

  try {
    await admin.auth.admin.updateUserById(customerId, {
      ban_duration: suspend ? '876000h' : 'none',
    })
    await admin.from('users').update({ access_suspended: !!suspend }).eq('id', customerId)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[customer-access] Error:', err)
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 })
  }
}