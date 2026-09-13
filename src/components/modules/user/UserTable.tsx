'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createUser } from '@/app/admin/user/actions'

type User = { id: string; full_name: string; role: string; phone: string | null }

const roleLabel: Record<string, string> = { admin: 'Admin', staff_gudang: 'Staff Gudang', kurir: 'Kurir', teknisi: 'Teknisi' }
const roleStyle: Record<string, string> = { admin: 'text-primary', staff_gudang: 'text-ink', kurir: 'text-amber', teknisi: 'text-success' }

export default function UserTable() {
  const supabase = createClient()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'staff_gudang', phone: '' })

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, role, phone')
      .order('full_name')

    if (error) setError(error.message)
    setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createUser(form)
      setShowForm(false)
      setForm({ email: '', password: '', full_name: '', role: 'staff_gudang', phone: '' })
      load()
    } catch (err: any) {
      setError(err.message ?? 'Gagal menambah user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">User</h1>
          <p className="text-sm text-muted">{users.length} akun terdaftar</p>
        </div>
        <button onClick={() => setShowForm(true)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">+ Tambah User</button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="px-4 py-3 font-normal">Nama</th>
                <th className="px-4 py-3 font-normal">Role</th>
                <th className="px-4 py-3 font-normal">Telepon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-canvas">
                  <td className="px-4 py-3 text-ink">{u.full_name}</td>
                  <td className={`px-4 py-3 font-medium ${roleStyle[u.role]}`}>{roleLabel[u.role] ?? u.role}</td>
                  <td className="px-4 py-3 text-muted">{u.phone ?? '-'}</td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-muted">Belum ada user</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-ink/20 px-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-line bg-surface p-6">
            <h2 className="mb-4 font-display font-semibold text-ink">Tambah User</h2>
            {error && <p className="mb-3 text-sm text-danger">{error}</p>}
            <div className="space-y-3">
              <input type="text" placeholder="Nama lengkap" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required />
              <input type="password" placeholder="Password sementara" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" required minLength={6} />
              <input type="text" placeholder="No. telepon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary">
                <option value="staff_gudang">Staff Gudang</option>
                <option value="kurir">Kurir</option>
                <option value="teknisi">Teknisi</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-md px-4 py-2 text-sm text-muted">Batal</button>
              <button type="submit" disabled={saving} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}