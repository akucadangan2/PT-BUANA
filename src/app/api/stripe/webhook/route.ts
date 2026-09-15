import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function adminClient() {
  return createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
  }

  const supabase = adminClient()

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent
    const orderId = intent.metadata.order_id
    if (orderId) {
      await supabase.from('orders').update({ payment_status: 'paid', status: 'confirmed' }).eq('id', orderId)
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent
    const orderId = intent.metadata.order_id
    if (orderId) {
      await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', orderId)
    }
  }

  return NextResponse.json({ received: true })
}