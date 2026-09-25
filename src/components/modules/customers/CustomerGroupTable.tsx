'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Group = { id: string; name: string; discount_percent: number }

export default function CustomerGroupTable() {
  const supabase = createClient()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Group | null>(null)
  const [form, setForm] = useState({ name: '', discount_percent: 0 })

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('customer_groups').select('*').order('name')
    setGroups(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ name: '', discount_percent: 0 })
    setShowForm(true)
  }

  function openEdit(g: Group) {
    setEditing(g)
    setForm({ name: g.name, discount_percent: g.discount_percent })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await supabase.from('customer_groups').update(form).eq('id', editing.id)
    } else {
      await supabase.from('customer_groups').insert(form)
    }
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus grup ini? Customer yang ada di grup ini akan balik ke harga normal (tanpa diskon).')) return
    await supabase.from('customer_groups').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Customer Groups</h1>
          <p className="text-sm text-muted">Kelola grup harga — tiap grup punya diskon default dari harga normal</p>
        </div>
        <button onClick={openAdd} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">+ Tambah Grup</button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-normal">Nama Grup</th>
                <th className="px-4 py-3 font-normal">Diskon</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {groups.map((g) => (
                <tr key={g.id} className="hover:bg-canvas">
                  <td className="px-4 py-3 text-ink">{g.name}</td>
                  <td className="px-4 py-3 text-ink">{g.discount_percent}%</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(g)} className="mr-3 text-primary">Edit</button>
                    <button onClick={() => handleDelete(g.id)} className="text-danger">Hapus</button>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-muted">Belum ada grup</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-ink/20 px-4">
          <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
            <h2 className="mb-4 font-display font-semibold text-ink">{editing ? 'Edit' : 'Tambah'} Grup</h2>
            <div className="space-y-3">
              <input placeholder="Nama grup (misal: Wholesale)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <div>
                <label className="mb-1 block text-xs text-muted">Diskon dari harga normal (%)</label>
                <input type="number" min={0} max={100} value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              </div>
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