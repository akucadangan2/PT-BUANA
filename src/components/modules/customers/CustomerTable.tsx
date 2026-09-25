'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Pagination from '@/components/ui/Pagination'

type Customer = {
  id: string; full_name: string; phone: string | null
  abn: string | null; delivery_note: string | null; billing_address: string | null
  access_suspended: boolean; created_at: string
}

export default function CustomerTable() {
  const supabase = createClient()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Customer | null>(null)
  const [saving, setSaving] = useState(false)
  const [orderCount, setOrderCount] = useState<number | null>(null)
  const [form, setForm] = useState({ full_name: '', phone: '', abn: '', delivery_note: '', billing_address: '' })

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase
      .from('users')
      .select('id, full_name, phone, abn, delivery_note, billing_address, access_suspended, created_at', { count: 'exact' })
      .eq('role', 'customer')
      .order('full_name')
      .range(from, to)
    if (search.trim()) query = query.ilike('full_name', `%${search.trim()}%`)
    const { data, count } = await query
    setCustomers((data as any) ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [page, pageSize, search])
  useEffect(() => { setPage(1) }, [search])

  async function openDetail(c: Customer) {
    setDetail(c)
    setForm({
      full_name: c.full_name, phone: c.phone ?? '', abn: c.abn ?? '',
      delivery_note: c.delivery_note ?? '', billing_address: c.billing_address ?? '',
    })
    const { count } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('customer_id', c.id)
    setOrderCount(count ?? 0)
  }

  async function handleSave() {
    if (!detail) return
    setSaving(true)
    await supabase.from('users').update(form).eq('id', detail.id)
    setSaving(false)
    setDetail(null)
    load()
  }

  async function toggleAccess() {
    if (!detail) return
    setSaving(true)
    const session = (await supabase.auth.getSession()).data.session
    const res = await fetch(`/api/admin/customers/${detail.id}/access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ suspend: !detail.access_suspended }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json()
      alert('Gagal ubah akses: ' + (data.error ?? 'Terjadi kesalahan'))
      return
    }
    setDetail({ ...detail, access_suspended: !detail.access_suspended })
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Customers</h1>
        <p className="text-sm text-muted">{total} customer terdaftar</p>
      </div>

      <input
        placeholder="Cari nama customer..."
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
                  <th className="px-4 py-3 font-normal">Nama</th>
                  <th className="px-4 py-3 font-normal">Telepon</th>
                  <th className="px-4 py-3 font-normal">ABN</th>
                  <th className="px-4 py-3 font-normal">Access</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-canvas">
                    <td className="px-4 py-3 text-ink">{c.full_name}</td>
                    <td className="px-4 py-3 text-muted">{c.phone ?? '-'}</td>
                    <td className="px-4 py-3 text-muted">{c.abn ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.access_suspended ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                        {c.access_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openDetail(c)} className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-light">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">Gak ada customer</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}

      {detail && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/20 px-4" onClick={() => setDetail(null)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-surface" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-surface px-5 py-4">
              <h3 className="font-display font-semibold text-ink">Detail Customer</h3>
              <button onClick={() => setDetail(null)} className="text-muted hover:text-ink">✕</button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Name</label>
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Address</label>
                <textarea value={form.billing_address} onChange={(e) => setForm({ ...form, billing_address: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" rows={2} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">ABN</label>
                <input value={form.abn} onChange={(e) => setForm({ ...form, abn: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Delivery Note</label>
                <textarea value={form.delivery_note} onChange={(e) => setForm({ ...form, delivery_note: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" rows={2} placeholder="Contoh: gunakan pintu belakang, hubungi security dulu, dll" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>

              {orderCount !== null && (
                <p className="text-xs text-muted">{orderCount} order tercatat sejak {new Date(detail.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              )}

              <div className="border-t border-line pt-4">
                <label className="mb-1 block text-xs font-medium text-muted">Access</label>
                <div className="flex items-center justify-between rounded-md border border-line p-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{detail.access_suspended ? 'Akses ditangguhkan' : 'Akses aktif'}</p>
                    <p className="text-xs text-muted">{detail.access_suspended ? 'Customer tidak bisa login ke app' : 'Customer bisa login & order normal'}</p>
                  </div>
                  <button
                    onClick={toggleAccess}
                    disabled={saving}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium ${detail.access_suspended ? 'bg-success text-white' : 'bg-danger text-white'} disabled:opacity-50`}
                  >
                    {detail.access_suspended ? 'Aktifkan' : 'Suspend'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setDetail(null)} className="rounded-md px-4 py-2 text-sm text-muted">Batal</button>
                <button onClick={handleSave} disabled={saving} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}