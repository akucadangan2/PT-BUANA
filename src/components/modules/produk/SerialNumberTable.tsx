'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Pagination from '@/components/ui/Pagination'

type Product = { id: string; name: string }
type SerialNumber = {
  id: string; serial_number: string; status: string; warranty_months: number; created_at: string
  products: { name: string } | null
}

const statusStyle: Record<string, string> = {
  in_stock: 'text-success', delivered: 'text-primary', service: 'text-amber', retired: 'text-muted',
}

export default function SerialNumberTable() {
  const supabase = createClient()
  const [items, setItems] = useState<SerialNumber[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ product_id: '', serial_number: '', warranty_months: 12 })

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase.from('serial_numbers').select('id, serial_number, status, warranty_months, created_at, products(name)', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
    if (search.trim()) query = query.ilike('serial_number', `%${search.trim()}%`)
    const [snRes, prodRes] = await Promise.all([
      query,
      supabase.from('products').select('id, name').eq('category', 'equipment').order('name'),
    ])
    setItems((snRes.data as any) ?? [])
    setTotal(snRes.count ?? 0)
    setProducts(prodRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [page, pageSize, search])
  useEffect(() => { setPage(1) }, [search])

  function openAdd() {
    setForm({ product_id: products[0]?.id ?? '', serial_number: '', warranty_months: 12 })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('serial_numbers').insert({ ...form, status: 'in_stock' })
    setShowForm(false)
    load()
  }

  async function handleRetire(id: string) {
    if (!confirm('Tandai unit ini retired?')) return
    await supabase.from('serial_numbers').update({ status: 'retired' }).eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Serial Number</h1>
          <p className="text-sm text-muted">{total} unit tercatat</p>
        </div>
        <button onClick={openAdd} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">+ Input Unit Baru</button>
      </div>

      <input placeholder="Cari serial number..." value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th className="px-4 py-3 font-normal">Serial Number</th>
                  <th className="px-4 py-3 font-normal">Produk</th>
                  <th className="px-4 py-3 font-normal">Garansi</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((sn) => (
                  <tr key={sn.id} className="hover:bg-canvas">
                    <td className="px-4 py-3 text-ink">{sn.serial_number}</td>
                    <td className="px-4 py-3 text-ink">{sn.products?.name}</td>
                    <td className="px-4 py-3 text-muted">{sn.warranty_months} bulan</td>
                    <td className={`px-4 py-3 font-medium ${statusStyle[sn.status]}`}>{sn.status}</td>
                    <td className="px-4 py-3 text-right">
                      {sn.status === 'in_stock' && <button onClick={() => handleRetire(sn.id)} className="text-danger">Retire</button>}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">Gak ada unit yang cocok</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-ink/20 px-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-line bg-surface p-6">
            <h2 className="mb-4 font-display font-semibold text-ink">Input Unit Baru</h2>
            <div className="space-y-3">
              <select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required>
                <option value="" disabled>Pilih produk equipment</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input placeholder="Serial number" value={form.serial_number} onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <input type="number" placeholder="Garansi (bulan)" value={form.warranty_months} onChange={(e) => setForm({ ...form, warranty_months: Number(e.target.value) })}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
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