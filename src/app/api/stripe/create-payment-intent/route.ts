import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function adminClient() {
  return createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Missing authorization' }, { status: 401 })
    const token = authHeader.replace('Bearer ', '')

    const { order_id } = await request.json()
    if (!order_id) return NextResponse.json({ error: 'order_id is required' }, { status: 400 })

    const supabase = adminClient()
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData.user) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, customer_id, total, payment_status, stripe_payment_intent_id')
      .eq('id', order_id)
      .single()

    if (orderError || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.customer_id !== userData.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (order.payment_status === 'paid') return NextResponse.json({ error: 'Order already paid' }, { status: 400 })

    // Reuse payment intent lama kalau ada & masih valid (hindari dobel charge kalau di-retry)
    if (order.stripe_payment_intent_id) {
      const existing = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id)
      if (existing.status !== 'succeeded' && existing.status !== 'canceled') {
        return NextResponse.json({ clientSecret: existing.client_secret })
      }
    }

    const amountInCents = Math.round(Number(order.total) * 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'aud',
      metadata: { order_id: order.id },
      automatic_payment_methods: { enabled: true },
    })

    await supabase.from('orders').update({ stripe_payment_intent_id: paymentIntent.id }).eq('id', order.id)

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    console.error('[create-payment-intent] Error:', err)
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 })
  }
}