'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/format-price'

type Listing = {
  id: string; name: string; description: string | null; price: number
  vendor_price: number | null; image_url: string | null; is_available: boolean
}

export default function VendorProductsPage() {
  const supabase = createClient()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Listing | null>(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', vendor_price: '', image_url: '' })

  async function load() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('products').select('*').eq('vendor_id', user?.id).order('name')
    setListings(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ name: '', description: '', price: '', vendor_price: '', image_url: '' })
    setShowForm(true)
  }

  function openEdit(l: Listing) {
    setEditing(l)
    setForm({
      name: l.name, description: l.description ?? '', price: String(l.price),
      vendor_price: l.vendor_price !== null ? String(l.vendor_price) : '', image_url: l.image_url ?? '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      vendor_price: form.vendor_price ? Number(form.vendor_price) : null,
      image_url: form.image_url,
      category: 'equipment',
      is_secondhand: true,
      vendor_id: user?.id,
    }
    if (editing) await supabase.from('products').update(payload).eq('id', editing.id)
    else await supabase.from('products').insert({ ...payload, sku: `VENDOR-${Date.now()}`, stock_qty: 1, low_stock_threshold: 0 })
    setShowForm(false)
    load()
  }

  async function toggleAvailable(l: Listing) {
    await supabase.from('products').update({ is_available: !l.is_available }).eq('id', l.id)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus listing ini?')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Listing Saya</h1>
          <p className="text-sm text-muted">{listings.length} item terdaftar</p>
        </div>
        <button onClick={openAdd} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">+ Tambah Listing</button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-normal"></th>
                <th className="px-4 py-3 font-normal">Nama</th>
                <th className="px-4 py-3 font-normal">Harga Jual</th>
                <th className="px-4 py-3 font-normal">Harga Saya Terima</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-canvas">
                  <td className="px-4 py-3">
                    {l.image_url ? <img src={l.image_url} alt="" className="h-8 w-8 rounded object-cover" /> : <div className="h-8 w-8 rounded bg-primary-light" />}
                  </td>
                  <td className="px-4 py-3 text-ink">{l.name}</td>
                  <td className="px-4 py-3 text-ink">{formatPrice(l.price)}</td>
                  <td className="px-4 py-3 text-success">{l.vendor_price !== null ? formatPrice(l.vendor_price) : '-'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAvailable(l)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.is_available ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}
                    >
                      {l.is_available ? 'Tersedia' : 'Terjual'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(l)} className="mr-3 text-primary">Edit</button>
                    <button onClick={() => handleDelete(l.id)} className="text-danger">Hapus</button>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">Belum ada listing</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-ink/20 px-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-line bg-surface p-6">
            <h2 className="mb-4 font-display font-semibold text-ink">{editing ? 'Edit' : 'Tambah'} Listing</h2>
            <div className="space-y-3">
              <input placeholder="Nama barang" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <textarea placeholder="Deskripsi (kondisi barang, dll)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              <input type="number" placeholder="Harga jual ke customer" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <input type="number" placeholder="Harga yang mau saya terima" value={form.vendor_price} onChange={(e) => setForm({ ...form, vendor_price: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              <input type="url" placeholder="URL Foto" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
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