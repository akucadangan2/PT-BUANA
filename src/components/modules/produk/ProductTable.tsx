'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Pagination from '@/components/ui/Pagination'

type Product = {
  id: string; sku: string; name: string; description: string | null
  price: number; unit: string; stock_qty: number; low_stock_threshold: number
  image_url: string | null
}

export default function ProductTable({ category }: { category: 'retail' | 'equipment' }) {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [floorPrices, setFloorPrices] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ sku: '', name: '', description: '', price: 0, unit: 'pcs', stock_qty: 0, low_stock_threshold: 5, image_url: '', floor_price: '' })

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase.from('products').select('*', { count: 'exact' }).eq('category', category).order('name').range(from, to)
    if (search.trim()) query = query.ilike('name', `%${search.trim()}%`)
    const { data, count } = await query
    setProducts(data ?? [])
    setTotal(count ?? 0)

    if (data && data.length > 0) {
      const { data: floorData } = await supabase.from('product_floor_prices').select('product_id, floor_price').in('product_id', data.map((p) => p.id))
      const map: Record<string, number> = {}
      floorData?.forEach((f) => { map[f.product_id] = f.floor_price })
      setFloorPrices(map)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [category, page, pageSize, search])
  useEffect(() => { setPage(1) }, [category, search])

  function openAdd() {
    setEditing(null)
    setForm({ sku: '', name: '', description: '', price: 0, unit: 'pcs', stock_qty: 0, low_stock_threshold: 5, image_url: '', floor_price: '' })
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      sku: p.sku, name: p.name, description: p.description ?? '', price: p.price, unit: p.unit,
      stock_qty: p.stock_qty, low_stock_threshold: p.low_stock_threshold, image_url: p.image_url ?? '',
      floor_price: floorPrices[p.id] !== undefined ? String(floorPrices[p.id]) : '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { floor_price, ...productForm } = form
    let productId = editing?.id

    if (editing) {
      await supabase.from('products').update(productForm).eq('id', editing.id)
    } else {
      const { data } = await supabase.from('products').insert({ ...productForm, category }).select().single()
      productId = data?.id
    }

    if (productId && floor_price.trim() !== '') {
      await supabase.from('product_floor_prices').upsert({ product_id: productId, floor_price: Number(floor_price) }, { onConflict: 'product_id' })
    }

    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus produk ini?')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Produk {category === 'retail' ? 'Retail' : 'Equipment'}</h1>
          <p className="text-sm text-muted">{total} produk terdaftar</p>
        </div>
        <button onClick={openAdd} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">+ Tambah Produk</button>
      </div>

      <input
        placeholder="Cari nama produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
      />

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th className="px-4 py-3 font-normal"></th>
                  <th className="px-4 py-3 font-normal">SKU</th>
                  <th className="px-4 py-3 font-normal">Nama</th>
                  <th className="px-4 py-3 font-normal">Harga</th>
                  <th className="px-4 py-3 font-normal">Floor Price</th>
                  <th className="px-4 py-3 font-normal">{category === 'retail' ? 'Stok' : 'Unit'}</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-canvas">
                    <td className="px-4 py-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="h-8 w-8 rounded object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded bg-primary-light" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">{p.sku}</td>
                    <td className="px-4 py-3 text-ink">{p.name}</td>
                    <td className="px-4 py-3 text-ink">Rp{p.price.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-amber">{floorPrices[p.id] !== undefined ? `Rp${floorPrices[p.id].toLocaleString('id-ID')}` : '-'}</td>
                    <td className="px-4 py-3">
                      {category === 'retail' ? (
                        <span className={p.stock_qty <= p.low_stock_threshold ? 'text-amber' : 'text-ink'}>{p.stock_qty} {p.unit}</span>
                      ) : (
                        <a href="/admin/serial-number" className="text-primary underline underline-offset-2">Lihat serial number</a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(p)} className="mr-3 text-primary">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-danger">Hapus</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-6 text-center text-muted">Gak ada produk yang cocok</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-ink/20 px-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-line bg-surface p-6">
            <h2 className="mb-4 font-display font-semibold text-ink">{editing ? 'Edit' : 'Tambah'} Produk</h2>
            <div className="space-y-3">
              <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <textarea placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              <input type="number" placeholder="Harga" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <input type="number" placeholder="Floor price (harga terendah buat sales, opsional)" value={form.floor_price} onChange={(e) => setForm({ ...form, floor_price: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              {category === 'retail' && (
                <input type="number" placeholder="Stok" value={form.stock_qty} onChange={(e) => setForm({ ...form, stock_qty: Number(e.target.value) })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              )}
              <input type="url" placeholder="URL Gambar (opsional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              <input type="number" placeholder="Ambang stok menipis" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: Number(e.target.value) })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-md px-4 py-2 text-sm text-muted">Batal</button>
              <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}