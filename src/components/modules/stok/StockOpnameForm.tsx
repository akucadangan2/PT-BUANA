'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Product = { id: string; sku: string; name: string; stock_qty: number }

export default function StockOpnameForm() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [counted, setCounted] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('products').select('id, sku, name, stock_qty').eq('category', 'retail').order('name')
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave(p: Product) {
    const val = counted[p.id]
    if (val === undefined || val === '') return
    const actual = Number(val)
    const diff = actual - p.stock_qty
    if (diff === 0) return
    setSavingId(p.id)
    await supabase.from('stock_movements').insert({ product_id: p.id, type: 'opname_adjustment', qty: diff, note: `Opname: tercatat ${p.stock_qty} -> fisik ${actual}` })
    await supabase.from('products').update({ stock_qty: actual }).eq('id', p.id)
    setCounted((prev) => ({ ...prev, [p.id]: '' }))
    setSavingId(null)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Stok Opname</h1>
        <p className="text-sm text-muted">Cocokkan stok fisik dengan stok tercatat (produk retail)</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-normal">SKU</th>
                <th className="px-4 py-3 font-normal">Nama</th>
                <th className="px-4 py-3 font-normal">Stok tercatat</th>
                <th className="px-4 py-3 font-normal">Stok fisik</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-canvas">
                  <td className="px-4 py-3 text-muted">{p.sku}</td>
                  <td className="px-4 py-3 text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-ink">{p.stock_qty}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      placeholder="-"
                      value={counted[p.id] ?? ''}
                      onChange={(e) => setCounted((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      className="w-24 rounded-md border border-line px-2 py-1 outline-none focus:border-primary"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleSave(p)}
                      disabled={savingId === p.id}
                      className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-primary hover:bg-canvas disabled:opacity-50"
                    >
                      {savingId === p.id ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">Belum ada produk retail</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}