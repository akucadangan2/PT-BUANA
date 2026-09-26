'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Pagination from '@/components/ui/Pagination'
import { formatPrice } from '@/lib/format-price'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type OrderItem = { id: string; product_id: string; serial_number_id: string | null; qty: number; price: number; products: { name: string } | null }
type Order = {
  id: string; status: string; total: number; created_at: string; updated_at: string | null
  delivery_address: string | null
  users: { full_name: string; phone: string | null; abn: string | null; billing_address: string | null } | null
  order_items: OrderItem[]
}
type SerialOption = { id: string; serial_number: string }
type CreditNote = { id: string; amount: number; reason: string | null; status: string; created_at: string }

const statusOptions = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled']
const statusLabel: Record<string, string> = {
  pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', delivered: 'Delivered', cancelled: 'Cancelled',
}
const statusStyle: Record<string, string> = {
  pending: 'bg-amber-light text-amber', confirmed: 'bg-primary-light text-primary', processing: 'bg-primary-light text-primary',
  delivered: 'bg-success/10 text-success', cancelled: 'bg-danger/10 text-danger',
}

export default function OrderTable({ category }: { category: 'retail' | 'equipment' }) {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [availableSerials, setAvailableSerials] = useState<Record<string, SerialOption[]>>({})
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([])
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [returnQtys, setReturnQtys] = useState<Record<string, number>>({})
  const [returnReason, setReturnReason] = useState('')
  const [savingReturn, setSavingReturn] = useState(false)

  async function load() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase
      .from('orders')
      .select('id, status, total, created_at, updated_at, delivery_address, users!customer_id(full_name, phone, abn, billing_address), order_items(id, product_id, serial_number_id, qty, price, products(name))', { count: 'exact' })
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range(from, to)
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    const { data, count } = await query
    setOrders((data as any) ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  async function loadCounts() {
    const results = await Promise.all(
      statusOptions.map((s) => supabase.from('orders').select('id', { count: 'exact', head: true }).eq('category', category).eq('status', s))
    )
    const map: Record<string, number> = {}
    statusOptions.forEach((s, i) => { map[s] = results[i].count ?? 0 })
    setCounts(map)
  }

  useEffect(() => { load() }, [category, page, pageSize, statusFilter])
  useEffect(() => { setPage(1) }, [category, statusFilter])
  useEffect(() => { loadCounts() }, [category])

  async function loadCreditNotes(orderId: string) {
    const { data } = await supabase.from('credit_notes').select('id, amount, reason, status, created_at').eq('order_id', orderId).order('created_at', { ascending: false })
    setCreditNotes(data ?? [])
  }

  async function openDetail(order: Order) {
    setDetailOrder(order)
    setShowReturnForm(false)
    setReturnQtys({})
    setReturnReason('')
    await loadCreditNotes(order.id)
    if (category === 'equipment') {
      for (const item of order.order_items) {
        if (!availableSerials[item.product_id]) {
          const { data } = await supabase.from('serial_numbers').select('id, serial_number').eq('product_id', item.product_id).eq('status', 'in_stock')
          setAvailableSerials((prev) => ({ ...prev, [item.product_id]: data ?? [] }))
        }
      }
    }
  }

  async function updateStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    if (detailOrder?.id === orderId) setDetailOrder({ ...detailOrder, status })
    load()
    loadCounts()
  }

  async function assignSerial(itemId: string, serialNumberId: string) {
    await supabase.from('order_items').update({ serial_number_id: serialNumberId }).eq('id', itemId)
    await supabase.from('serial_numbers').update({ status: 'delivered' }).eq('id', serialNumberId)
    load()
    if (detailOrder) {
      const updatedItems = detailOrder.order_items.map((it) => (it.id === itemId ? { ...it, serial_number_id: serialNumberId } : it))
      setDetailOrder({ ...detailOrder, order_items: updatedItems })
    }
  }

  function openReturnForm() {
    if (!detailOrder) return
    const initial: Record<string, number> = {}
    detailOrder.order_items.forEach((item) => { initial[item.id] = 0 })
    setReturnQtys(initial)
    setReturnReason('')
    setShowReturnForm(true)
  }

  const returnTotal = detailOrder
    ? detailOrder.order_items.reduce((sum, item) => sum + (returnQtys[item.id] ?? 0) * item.price, 0)
    : 0

  async function submitReturn() {
    if (!detailOrder) return
    const itemsToReturn = detailOrder.order_items.filter((item) => (returnQtys[item.id] ?? 0) > 0)
    if (itemsToReturn.length === 0) {
      alert('Pilih minimal 1 item dengan qty retur lebih dari 0')
      return
    }
    setSavingReturn(true)
    try {
      const { data: creditNote, error } = await supabase
        .from('credit_notes')
        .insert({
          order_id: detailOrder.id,
          customer_id: (detailOrder as any).customer_id ?? null,
          amount: returnTotal,
          reason: returnReason || null,
        })
        .select()
        .single()

      if (error || !creditNote) throw error

      const rows = itemsToReturn.map((item) => ({
        credit_note_id: creditNote.id,
        order_item_id: item.id,
        product_name: item.products?.name ?? '-',
        qty_returned: returnQtys[item.id],
        amount: returnQtys[item.id] * item.price,
      }))
      await supabase.from('credit_note_items').insert(rows)

      setShowReturnForm(false)
      await loadCreditNotes(detailOrder.id)
    } catch (err: any) {
      alert('Gagal memproses retur: ' + (err.message ?? 'Terjadi kesalahan'))
    } finally {
      setSavingReturn(false)
    }
  }

  async function generateCreditNotePdf(cn: CreditNote) {
    if (!detailOrder) return
    const { data: items } = await supabase.from('credit_note_items').select('product_name, qty_returned, amount').eq('credit_note_id', cn.id)
    const { data: configRows } = await supabase.from('app_config').select('key, value').in('key', ['company_name', 'company_address', 'company_abn'])
    const config: Record<string, string> = {}
    configRows?.forEach((r: any) => { config[r.key] = r.value })

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(config.company_name ?? 'BUANA', 14, y)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    y += 6
    doc.text(config.company_address ?? '', 14, y)
    y += 5
    doc.text(`ABN: ${config.company_abn ?? '-'}`, 14, y)

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('CREDIT NOTE', pageWidth - 14, 20, { align: 'right' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Credit Note #: ${cn.id.slice(0, 8).toUpperCase()}`, pageWidth - 14, 28, { align: 'right' })
    doc.text(`Ref Invoice #: ${detailOrder.id.slice(0, 8).toUpperCase()}`, pageWidth - 14, 33, { align: 'right' })
    doc.text(`Date: ${new Date(cn.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - 14, 38, { align: 'right' })

    y = 50
    doc.setDrawColor(220, 220, 220)
    doc.line(14, y, pageWidth - 14, y)
    y += 10

    doc.setFont('helvetica', 'bold')
    doc.text('Issued To', 14, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(detailOrder.users?.full_name ?? '-', 14, y)

    autoTable(doc, {
      startY: y + 10,
      head: [['Item', 'Qty Returned', 'Amount']],
      body: (items ?? []).map((it: any) => [it.product_name, String(it.qty_returned), formatPrice(it.amount)]),
      foot: [['', 'Total Credit', formatPrice(cn.amount)]],
      theme: 'grid',
      headStyles: { fillColor: [192, 68, 46] },
      footStyles: { fillColor: [247, 248, 250], textColor: [16, 24, 40], fontStyle: 'bold' },
      styles: { fontSize: 9 },
    })

    let finalY = (doc as any).lastAutoTable.finalY + 10
    if (cn.reason) {
      doc.setFontSize(9)
      doc.text(`Reason: ${cn.reason}`, 14, finalY)
    }

    doc.save(`credit-note-${cn.id.slice(0, 8)}.pdf`)
  }

  async function generateInvoicePdf(order: Order) {
    setGeneratingPdf(true)
    try {
      const { data: configRows } = await supabase.from('app_config').select('key, value').in('key', ['company_name', 'company_address', 'company_abn', 'company_email'])
      const config: Record<string, string> = {}
      configRows?.forEach((r: any) => { config[r.key] = r.value })

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      let y = 20

      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(config.company_name ?? 'BUANA', 14, y)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      y += 6
      doc.text(config.company_address ?? '', 14, y)
      y += 5
      doc.text(`ABN: ${config.company_abn ?? '-'}`, 14, y)
      y += 5
      doc.text(config.company_email ?? '', 14, y)

      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('TAX INVOICE', pageWidth - 14, 20, { align: 'right' })
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(`Invoice #: ${order.id.slice(0, 8).toUpperCase()}`, pageWidth - 14, 28, { align: 'right' })
      doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - 14, 33, { align: 'right' })

      y = 50
      doc.setDrawColor(220, 220, 220)
      doc.line(14, y, pageWidth - 14, y)
      y += 10

      doc.setFont('helvetica', 'bold')
      doc.text('Bill To', 14, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      doc.text(order.users?.full_name ?? '-', 14, y)
      y += 5
      if (order.users?.billing_address) {
        const lines = doc.splitTextToSize(order.users.billing_address, 90)
        doc.text(lines, 14, y)
        y += lines.length * 5
      }
      if (order.users?.abn) {
        doc.text(`ABN: ${order.users.abn}`, 14, y)
        y += 5
      }

      const tableY = Math.max(y + 8, 85)
      autoTable(doc, {
        startY: tableY,
        head: [['Item', 'Qty', 'Unit Price', 'Subtotal']],
        body: order.order_items.map((item) => [
          item.products?.name ?? '-',
          String(item.qty),
          formatPrice(item.price),
          formatPrice(item.price * item.qty),
        ]),
        foot: [['', '', 'Total', formatPrice(order.total)]],
        theme: 'grid',
        headStyles: { fillColor: [15, 110, 110] },
        footStyles: { fillColor: [247, 248, 250], textColor: [16, 24, 40], fontStyle: 'bold' },
        styles: { fontSize: 9 },
      })

      let finalY = (doc as any).lastAutoTable.finalY + 15
      if (finalY > 250) { doc.addPage(); finalY = 20 }

      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('Surat Jalan / Delivery Note', 14, finalY)
      finalY += 8
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Deliver to:', 14, finalY)
      finalY += 5
      const addrLines = doc.splitTextToSize(order.delivery_address ?? '-', pageWidth - 28)
      doc.text(addrLines, 14, finalY)
      finalY += addrLines.length * 5 + 10

      doc.text('Received by (Name & Signature):', 14, finalY)
      finalY += 20
      doc.line(14, finalY, 90, finalY)
      doc.text('Date:', 110, finalY - 1)
      doc.line(125, finalY, 180, finalY)

      doc.save(`invoice-${order.id.slice(0, 8)}.pdf`)
    } finally {
      setGeneratingPdf(false)
    }
  }

  const totalAllCount = Object.values(counts).reduce((a, b) => a + b, 0)
  const totalCredited = creditNotes.reduce((sum, cn) => sum + cn.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Order {category === 'retail' ? 'Retail' : 'Equipment'}</h1>
        <p className="text-sm text-muted">{total} order</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${
            statusFilter === 'all' ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted hover:bg-canvas'
          }`}
        >
          Semua
          <span className={`rounded-full px-1.5 text-[11px] ${statusFilter === 'all' ? 'bg-primary text-white' : 'bg-line text-muted'}`}>{totalAllCount}</span>
        </button>
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${
              statusFilter === s ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted hover:bg-canvas'
            }`}
          >
            {statusLabel[s]}
            <span className={`rounded-full px-1.5 text-[11px] ${statusFilter === s ? 'bg-primary text-white' : 'bg-line text-muted'}`}>{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Memuat...</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th className="px-4 py-3 font-normal">Order</th>
                  <th className="px-4 py-3 font-normal">Customer</th>
                  <th className="px-4 py-3 font-normal">Total</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Tanggal</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-canvas">
                    <td className="px-4 py-3 text-muted">#{o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-ink">{o.users?.full_name ?? '-'}</td>
                    <td className="px-4 py-3 text-ink">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[o.status]}`}>{statusLabel[o.status] ?? o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openDetail(o)} className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-light">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">Gak ada order</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}

      {detailOrder && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/20 px-4" onClick={() => setDetailOrder(null)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-surface" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-surface px-5 py-4">
              <div>
                <h3 className="font-display font-semibold text-ink">Order #{detailOrder.id.slice(0, 8)}</h3>
                <p className="text-xs text-muted">Dibuat {new Date(detailOrder.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <button onClick={() => setDetailOrder(null)} className="text-muted hover:text-ink">✕</button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Status</p>
                <select
                  value={detailOrder.status}
                  onChange={(e) => updateStatus(detailOrder.id, e.target.value)}
                  className={`w-full rounded-md border border-line px-3 py-2 text-sm font-medium ${statusStyle[detailOrder.status]}`}
                >
                  {statusOptions.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
                </select>
                {detailOrder.updated_at && (
                  <p className="mt-1 text-xs text-muted">Terakhir diupdate {new Date(detailOrder.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Customer</p>
                <div className="rounded-md border border-line bg-canvas p-3 text-sm">
                  <p className="text-ink">{detailOrder.users?.full_name ?? '-'}</p>
                  <p className="text-muted">{detailOrder.users?.phone ?? 'Telepon belum diisi'}</p>
                </div>
              </div>

              {detailOrder.delivery_address && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Alamat Pengiriman</p>
                  <p className="rounded-md border border-line bg-canvas p-3 text-sm text-ink">{detailOrder.delivery_address}</p>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Item Dipesan</p>
                <div className="space-y-2">
                  {detailOrder.order_items.map((item) => (
                    <div key={item.id} className="rounded-md border border-line bg-canvas p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-ink">{item.products?.name}</p>
                        <p className="text-muted">{item.qty} × {formatPrice(item.price)}</p>
                      </div>
                      {category === 'equipment' && (
                        <div className="mt-2">
                          {item.serial_number_id ? (
                            <span className="text-xs font-medium text-success">✓ Serial number terpasang</span>
                          ) : (
                            <select
                              defaultValue=""
                              onChange={(e) => e.target.value && assignSerial(item.id, e.target.value)}
                              className="w-full rounded-md border border-line px-2 py-1.5 text-xs"
                            >
                              <option value="" disabled>Pilih serial number</option>
                              {(availableSerials[item.product_id] ?? []).map((sn) => <option key={sn.id} value={sn.id}>{sn.serial_number}</option>)}
                            </select>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line pt-4">
                <p className="text-sm font-medium text-ink">Total</p>
                <p className="font-display text-lg font-semibold text-ink">{formatPrice(detailOrder.total)}</p>
              </div>

              {totalCredited > 0 && (
                <div className="flex items-center justify-between rounded-md bg-danger/5 px-3 py-2">
                  <p className="text-sm text-danger">Total Credit Diterbitkan</p>
                  <p className="text-sm font-semibold text-danger">-{formatPrice(totalCredited)}</p>
                </div>
              )}

              <button
                onClick={() => generateInvoicePdf(detailOrder)}
                disabled={generatingPdf}
                className="w-full rounded-md border border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary-light disabled:opacity-50"
              >
                {generatingPdf ? 'Membuat PDF...' : '📄 Download Invoice / Surat Jalan (PDF)'}
              </button>

              <div className="border-t border-line pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">Retur & Credit Note</p>
                  {!showReturnForm && (
                    <button onClick={openReturnForm} className="text-xs font-medium text-danger hover:underline">
                      + Proses Retur
                    </button>
                  )}
                </div>

                {showReturnForm && (
                  <div className="mb-3 space-y-3 rounded-md border border-line bg-canvas p-3">
                    {detailOrder.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-ink">{item.products?.name}</p>
                          <p className="text-xs text-muted">Dipesan: {item.qty} × {formatPrice(item.price)}</p>
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={item.qty}
                          value={returnQtys[item.id] ?? 0}
                          onChange={(e) => {
                            const val = Math.min(item.qty, Math.max(0, Number(e.target.value)))
                            setReturnQtys((prev) => ({ ...prev, [item.id]: val }))
                          }}
                          className="w-16 rounded-md border border-line px-2 py-1 text-sm text-center outline-none focus:border-primary"
                        />
                      </div>
                    ))}
                    <textarea
                      placeholder="Alasan retur (opsional)"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-primary"
                      rows={2}
                    />
                    <div className="flex items-center justify-between border-t border-line pt-2">
                      <p className="text-sm font-medium text-ink">Total Credit</p>
                      <p className="text-sm font-semibold text-danger">{formatPrice(returnTotal)}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShowReturnForm(false)} className="rounded-md px-3 py-1.5 text-xs text-muted">Batal</button>
                      <button
                        onClick={submitReturn}
                        disabled={savingReturn || returnTotal <= 0}
                        className="rounded-md bg-danger px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                      >
                        {savingReturn ? 'Memproses...' : 'Terbitkan Credit Note'}
                      </button>
                    </div>
                  </div>
                )}

                {creditNotes.length > 0 && (
                  <div className="space-y-2">
                    {creditNotes.map((cn) => (
                      <div key={cn.id} className="flex items-center justify-between rounded-md border border-line bg-surface p-3 text-sm">
                        <div>
                          <p className="text-ink">Credit Note #{cn.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-muted">{new Date(cn.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}{cn.reason ? ` — ${cn.reason}` : ''}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-danger">-{formatPrice(cn.amount)}</p>
                          <button onClick={() => generateCreditNotePdf(cn)} className="text-xs text-primary hover:underline">PDF</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}