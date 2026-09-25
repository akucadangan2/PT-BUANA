'use client'

import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/client'
import Pagination from '@/components/ui/Pagination'
import { formatPrice } from '@/lib/format-price'

type Product = {
  id: string; sku: string; name: string; description: string | null
  price: number; unit: string; stock_qty: number; low_stock_threshold: number
  image_url: string | null; subcategory: string | null
}

export default function ProductTable({ category }: { category: 'retail' | 'equipment' }) {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [floorPrices, setFloorPrices] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [categoryOptions, setCategoryOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ sku: '', name: '', description: '', price: 0, unit: 'pcs', stock_qty: 0, low_stock_threshold: 5, image_url: '', floor_price: '', subcategory: '' })

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase.from('products').select('*', { count: 'exact' }).eq('category', category).order('name').range(from, to)
    if (search.trim()) query = query.ilike('name', `%${search.trim()}%`)
    if (categoryFilter !== 'all') query = query.eq('subcategory', categoryFilter)
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

  async function loadCategoryOptions() {
    const { data } = await supabase.from('products').select('subcategory').eq('category', category).not('subcategory', 'is', null)
    const set = new Set<string>()
    data?.forEach((row) => { if (row.subcategory && row.subcategory.trim()) set.add(row.subcategory.trim()) })
    setCategoryOptions(Array.from(set).sort())
  }

  useEffect(() => { load() }, [category, page, pageSize, search, categoryFilter])
  useEffect(() => { setPage(1) }, [category, search, categoryFilter])
  useEffect(() => { loadCategoryOptions() }, [category])

  function openAdd() {
    setEditing(null)
    setForm({ sku: '', name: '', description: '', price: 0, unit: 'pcs', stock_qty: 0, low_stock_threshold: 5, image_url: '', floor_price: '', subcategory: '' })
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      sku: p.sku, name: p.name, description: p.description ?? '', price: p.price, unit: p.unit,
      stock_qty: p.stock_qty, low_stock_threshold: p.low_stock_threshold, image_url: p.image_url ?? '',
      floor_price: floorPrices[p.id] !== undefined ? String(floorPrices[p.id]) : '',
      subcategory: p.subcategory ?? '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { floor_price: floorPriceValue, ...productForm } = form
    let productId = editing?.id

    if (editing) {
      await supabase.from('products').update(productForm).eq('id', editing.id)
    } else {
      const { data } = await supabase.from('products').insert({ ...productForm, category }).select().single()
      productId = data?.id
    }

    if (productId && floorPriceValue.trim() !== '') {
      await supabase.from('product_floor_prices').upsert({ product_id: productId, floor_price: Number(floorPriceValue) }, { onConflict: 'product_id' })
    }

    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus produk ini?')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar')
      return
    }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      setForm((prev) => ({ ...prev, image_url: data.publicUrl }))
    } catch (err: any) {
      alert('Gagal upload gambar: ' + (err.message ?? 'Terjadi kesalahan'))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      let query = supabase.from('products').select('id, sku, name, description, price, unit, stock_qty, low_stock_threshold, subcategory, image_url').eq('category', category).order('name')
      if (search.trim()) query = query.ilike('name', `%${search.trim()}%`)
      if (categoryFilter !== 'all') query = query.eq('subcategory', categoryFilter)
      const { data } = await query
      if (!data || data.length === 0) {
        alert('Tidak ada produk untuk diexport')
        return
      }

      const { data: floorData } = await supabase.from('product_floor_prices').select('product_id, floor_price').in('product_id', data.map((p) => p.id))
      const floorMap: Record<string, number> = {}
      floorData?.forEach((f) => { floorMap[f.product_id] = f.floor_price })

      const rows = data.map((p) => ({
        SKU: p.sku,
        Name: p.name,
        Description: p.description ?? '',
        Price: p.price,
        Unit: p.unit,
        Stock: p.stock_qty,
        'Low Stock Threshold': p.low_stock_threshold,
        Category: p.subcategory ?? '',
        'Image URL': p.image_url ?? '',
        'Floor Price': floorMap[p.id] ?? '',
      }))

      const worksheet = XLSX.utils.json_to_sheet(rows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
      XLSX.writeFile(workbook, `${category}-products-${new Date().toISOString().slice(0, 10)}.xlsx`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Produk {category === 'retail' ? 'Retail' : 'Equipment'}</h1>
          <p className="text-sm text-muted">{total} produk terdaftar</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} disabled={exporting} className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink disabled:opacity-50">
            {exporting ? 'Mengexport...' : 'Export'}
          </button>
          <button onClick={openAdd} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">+ Tambah Produk</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">Semua Kategori</option>
          {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

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
                  <th className="px-4 py-3 font-normal">Kategori</th>
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
                    <td className="px-4 py-3 text-muted">{p.subcategory ?? '-'}</td>
                    <td className="px-4 py-3 text-ink">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-amber">{floorPrices[p.id] !== undefined ? formatPrice(floorPrices[p.id]) : '-'}</td>
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
                  <tr><td colSpan={8} className="px-4 py-6 text-center text-muted">Gak ada produk yang cocok</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-ink/20 px-4">
          <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-line bg-surface p-6">
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
              {category === 'retail' && (
                <input placeholder="Kategori (misal: Minuman, Snack, Bumbu)" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Foto Produk</label>
                <div className="flex items-center gap-3">
                  {form.image_url ? (
                    <img src={form.image_url} alt="" className="h-14 w-14 rounded-md border border-line object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-md border border-dashed border-line text-muted">?</div>
                  )}
                  <label className="cursor-pointer rounded-md border border-line px-3 py-2 text-sm text-ink hover:bg-canvas">
                    {uploading ? 'Mengupload...' : 'Upload Foto'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="Atau paste URL gambar (opsional)"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <input type="number" placeholder="Ambang stok menipis" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: Number(e.target.value) })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-md px-4 py-2 text-sm text-muted">Batal</button>
              <button type="submit" disabled={uploading} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}