'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createCustomerAccount } from '@/app/admin/sales/actions'
import { formatPrice } from '@/lib/format-price'

type Customer = { id: string; full_name: string; phone: string | null }
type ProductResult = { id: string; sku: string; name: string; price: number; floor_price: number | null }
type CartItem = { product_id: string; name: string; floor_price: number | null; qty: number; price: number }

export default function SalesOrderPage() {
  const supabase = createClient()

  const [category, setCategory] = useState<'retail' | 'equipment'>('retail')

  const [customerMode, setCustomerMode] = useState<'search' | 'new'>('search')
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerResults, setCustomerResults] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState({ full_name: '', email: '', phone: '', password: '' })

  const [productSearch, setProductSearch] = useState('')
  const [productResults, setProductResults] = useState<ProductResult[]>([])
  const [cart, setCart] = useState<CartItem[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    setCart([])
  }, [category])

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (customerSearch.trim().length < 2) {
        setCustomerResults([])
        return
      }
      const { data } = await supabase
        .from('users')
        .select('id, full_name, phone')
        .eq('role', 'customer')
        .or(`full_name.ilike.%${customerSearch.trim()}%,phone.ilike.%${customerSearch.trim()}%`)
        .limit(10)
      setCustomerResults(data ?? [])
    }, 300)
    return () => clearTimeout(timeout)
  }, [customerSearch])

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (productSearch.trim().length < 2) {
        setProductResults([])
        return
      }
      const { data } = await supabase
        .from('products')
        .select('id, sku, name, price, product_floor_prices(floor_price)')
        .eq('category', category)
        .ilike('name', `%${productSearch.trim()}%`)
        .limit(10)
      setProductResults(
        (data ?? []).map((p: any) => ({
          id: p.id, sku: p.sku, name: p.name, price: p.price,
          floor_price: p.product_floor_prices?.floor_price ?? null,
        }))
      )
    }, 300)
    return () => clearTimeout(timeout)
  }, [productSearch, category])

  function addToCart(p: ProductResult) {
    if (cart.some((c) => c.product_id === p.id)) return
    setCart([...cart, { product_id: p.id, name: p.name, floor_price: p.floor_price, qty: 1, price: p.price }])
    setProductSearch('')
    setProductResults([])
  }

  function updateCartItem(productId: string, patch: Partial<CartItem>) {
    setCart(cart.map((c) => (c.product_id === productId ? { ...c, ...patch } : c)))
  }

  function removeFromCart(productId: string) {
    setCart(cart.filter((c) => c.product_id !== productId))
  }

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0)

  async function handleSubmit() {
    setMessage(null)
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Tambah minimal 1 produk dulu' })
      return
    }
    if (customerMode === 'search' && !selectedCustomer) {
      setMessage({ type: 'error', text: 'Pilih customer dulu, atau beralih ke "Customer Baru"' })
      return
    }
    if (customerMode === 'new' && (!newCustomer.full_name || !newCustomer.email || !newCustomer.password)) {
      setMessage({ type: 'error', text: 'Nama, email, dan password customer baru wajib diisi' })
      return
    }

    setSubmitting(true)
    try {
      const { data: { user: salesUser } } = await supabase.auth.getUser()

      let customerId = selectedCustomer?.id
      if (customerMode === 'new') {
        customerId = await createCustomerAccount(newCustomer)
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ customer_id: customerId, category, status: 'pending', total, created_by: salesUser?.id })
        .select()
        .single()
      if (orderError) throw orderError

      const items = cart.map((c) => ({ order_id: order.id, product_id: c.product_id, qty: c.qty, price: c.price }))
      const { error: itemsError } = await supabase.from('order_items').insert(items)
      if (itemsError) throw itemsError

      setMessage({ type: 'success', text: `Order berhasil dibuat (#${order.id.slice(0, 8)})` })
      setCart([])
      setSelectedCustomer(null)
      setCustomerSearch('')
      setNewCustomer({ full_name: '', email: '', phone: '', password: '' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message ?? 'Gagal membuat order' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Buat Order untuk Customer</h1>
        <p className="text-sm text-muted">Untuk order yang masuk lewat WhatsApp/email/telepon</p>
      </div>

      {message && (
        <div className={`rounded-md border px-4 py-3 text-sm ${message.type === 'success' ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger'}`}>
          {message.text}
        </div>
      )}

      {/* Kategori */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Kategori Produk</p>
        <div className="flex gap-2">
          {(['retail', 'equipment'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-md border px-4 py-2 text-sm font-medium ${category === c ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted hover:bg-canvas'}`}
            >
              {c === 'retail' ? 'Retail' : 'Equipment'}
            </button>
          ))}
        </div>
      </div>

      {/* Customer */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Customer</p>
        <div className="mb-3 flex gap-2">
          <button
            onClick={() => setCustomerMode('search')}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${customerMode === 'search' ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted'}`}
          >
            Cari Customer
          </button>
          <button
            onClick={() => setCustomerMode('new')}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${customerMode === 'new' ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted'}`}
          >
            Customer Baru
          </button>
        </div>

        {customerMode === 'search' ? (
          <div>
            {selectedCustomer ? (
              <div className="flex items-center justify-between rounded-md border border-primary bg-primary-light px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{selectedCustomer.full_name}</p>
                  <p className="text-xs text-muted">{selectedCustomer.phone}</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-primary">Ganti</button>
              </div>
            ) : (
              <div className="relative">
                <input
                  placeholder="Cari nama atau nomor telepon..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
                />
                {customerResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border border-line bg-surface shadow-lg">
                    {customerResults.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCustomer(c); setCustomerResults([]) }}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-canvas"
                      >
                        <p className="text-ink">{c.full_name}</p>
                        <p className="text-xs text-muted">{c.phone}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <input placeholder="Nama lengkap" value={newCustomer.full_name} onChange={(e) => setNewCustomer({ ...newCustomer, full_name: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
            <input type="email" placeholder="Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
            <input placeholder="No. telepon" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
            <input type="password" placeholder="Password sementara" value={newCustomer.password} onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
        )}
      </div>

      {/* Produk */}
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Tambah Produk</p>
        <div className="relative">
          <input
            placeholder={`Cari produk ${category}...`}
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {productResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-line bg-surface shadow-lg">
              {productResults.map((p) => (
                <button key={p.id} onClick={() => addToCart(p)} className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-canvas">
                  <span className="text-ink">{p.name}</span>
                  <span className="text-xs text-muted">
                    List: {formatPrice(p.price)}
                    {p.floor_price !== null && <span className="ml-2 text-amber">Floor: {formatPrice(p.floor_price)}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-normal">Produk</th>
                <th className="px-4 py-3 font-normal">Qty</th>
                <th className="px-4 py-3 font-normal">Harga Ditawarkan</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {cart.map((c) => {
                const belowFloor = c.floor_price !== null && c.price < c.floor_price
                return (
                  <tr key={c.product_id}>
                    <td className="px-4 py-3 text-ink">
                      {c.name}
                      {c.floor_price !== null && <p className="text-xs text-muted">Floor: {formatPrice(c.floor_price)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" min={1} value={c.qty} onChange={(e) => updateCartItem(c.product_id, { qty: Number(e.target.value) })} className="w-16 rounded-md border border-line px-2 py-1" />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={c.price}
                        onChange={(e) => updateCartItem(c.product_id, { price: Number(e.target.value) })}
                        className={`w-28 rounded-md border px-2 py-1 ${belowFloor ? 'border-danger text-danger' : 'border-line'}`}
                      />
                      {belowFloor && <p className="text-xs text-danger">Di bawah floor price</p>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => removeFromCart(c.product_id)} className="text-danger">Hapus</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {cart.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3">
          <span className="text-sm text-muted">Total</span>
          <span className="font-display text-xl font-semibold text-ink">{formatPrice(total)}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full rounded-md bg-primary py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting ? 'Membuat order...' : 'Buat Order'}
      </button>
    </div>
  )
}
