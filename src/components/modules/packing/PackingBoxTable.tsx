'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Box = { id: string; name: string; length_cm: number; width_cm: number; height_cm: number; max_weight_kg: number | null }

export default function PackingBoxTable() {
  const supabase = createClient()
  const [boxes, setBoxes] = useState<Box[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Box | null>(null)
  const [form, setForm] = useState({ name: '', length_cm: '', width_cm: '', height_cm: '', max_weight_kg: '' })

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('packing_boxes').select('*').order('length_cm')
    setBoxes(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ name: '', length_cm: '', width_cm: '', height_cm: '', max_weight_kg: '' })
    setShowForm(true)
  }

  function openEdit(b: Box) {
    setEditing(b)
    setForm({ name: b.name, length_cm: String(b.length_cm), width_cm: String(b.width_cm), height_cm: String(b.height_cm), max_weight_kg: b.max_weight_kg ? String(b.max_weight_kg) : '' })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      name: form.name,
      length_cm: Number(form.length_cm),
      width_cm: Number(form.width_cm),
      height_cm: Number(form.height_cm),
      max_weight_kg: form.max_weight_kg.trim() !== '' ? Number(form.max_weight_kg) : null,
    }
    if (editing) {
      await supabase.from('packing_boxes').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('packing_boxes').insert(payload)
    }
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus ukuran box ini?')) return
    await supabase.from('packing_boxes').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Packing Boxes</h1>
          <p className="text-sm text-muted">Katalog ukuran box yang dipakai buat rekomendasi packing otomatis</p>
        </div>
        <button onClick={openAdd} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">+ Tambah Box</button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-normal">Nama</th>
                <th className="px-4 py-3 font-normal">Dimensi (P×L×T cm)</th>
                <th className="px-4 py-3 font-normal">Max Berat</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {boxes.map((b) => (
                <tr key={b.id} className="hover:bg-canvas">
                  <td className="px-4 py-3 text-ink">{b.name}</td>
                  <td className="px-4 py-3 text-muted">{b.length_cm} × {b.width_cm} × {b.height_cm}</td>
                  <td className="px-4 py-3 text-muted">{b.max_weight_kg ? `${b.max_weight_kg} kg` : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(b)} className="mr-3 text-primary">Edit</button>
                    <button onClick={() => handleDelete(b.id)} className="text-danger">Hapus</button>
                  </td>
                </tr>
              ))}
              {boxes.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-muted">Belum ada box</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-ink/20 px-4">
          <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
            <h2 className="mb-4 font-display font-semibold text-ink">{editing ? 'Edit' : 'Tambah'} Box</h2>
            <div className="space-y-3">
              <input placeholder="Nama box (misal: Medium)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" placeholder="P (cm)" value={form.length_cm} onChange={(e) => setForm({ ...form, length_cm: e.target.value })} className="rounded-md border border-line px-2 py-2 text-sm outline-none focus:border-primary" required />
                <input type="number" placeholder="L (cm)" value={form.width_cm} onChange={(e) => setForm({ ...form, width_cm: e.target.value })} className="rounded-md border border-line px-2 py-2 text-sm outline-none focus:border-primary" required />
                <input type="number" placeholder="T (cm)" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} className="rounded-md border border-line px-2 py-2 text-sm outline-none focus:border-primary" required />
              </div>
              <input type="number" placeholder="Max berat (kg, opsional)" value={form.max_weight_kg} onChange={(e) => setForm({ ...form, max_weight_kg: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
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