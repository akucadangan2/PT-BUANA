'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/client'

type TargetField = {
  key: string
  label: string
  required?: boolean
  isWarranty?: boolean
}

const TARGET_FIELDS: TargetField[] = [
  { key: 'sku', label: 'SKU', required: true },
  { key: 'name', label: 'Nama Produk', required: true },
  { key: 'price', label: 'Harga', required: true },
  { key: 'brand', label: 'Brand' },
  { key: 'subcategory', label: 'Kategori' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'default_warranty_months', label: 'Garansi (format "N/N", diambil angka pertama × 12)', isWarranty: true },
  { key: 'stock_qty', label: 'Stok' },
  { key: 'low_stock_threshold', label: 'Ambang Stok Menipis' },
  { key: 'image_url', label: 'URL Gambar' },
]

function parseWarrantyMonths(value: any) {
  if (!value) return null
  const match = String(value).match(/^(\d+)/)
  return match ? parseInt(match[1], 10) * 12 : null
}

export default function ImportProductsPage() {
  const supabase = createClient()
  const [category, setCategory] = useState<'retail' | 'equipment'>('equipment')
  const [fileName, setFileName] = useState('')
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState('')
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<any[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ inserted: number; skipped: number; errors: string[] } | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setResult(null)

    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = evt.target?.result
      const wb = XLSX.read(data, { type: 'binary' })
      setWorkbook(wb)
      setSheetNames(wb.SheetNames)
      const firstSheet = wb.SheetNames[0]
      setSelectedSheet(firstSheet)
      loadSheet(wb, firstSheet)
    }
    reader.readAsBinaryString(file)
  }

  function loadSheet(wb: XLSX.WorkBook, sheetName: string) {
    const sheet = wb.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
    setRows(json)
    setHeaders(json.length > 0 ? Object.keys(json[0] as object) : [])
    setMapping({})
  }

  function handleSheetChange(sheetName: string) {
    setSelectedSheet(sheetName)
    if (workbook) loadSheet(workbook, sheetName)
  }

  function buildProductRow(row: any) {
    const product: Record<string, any> = { category }
    for (const field of TARGET_FIELDS) {
      const sourceCol = mapping[field.key]
      if (!sourceCol) continue
      const raw = row[sourceCol]
      if (raw === undefined || raw === null || raw === '') continue

      if (field.isWarranty) {
        product[field.key] = parseWarrantyMonths(raw)
      } else if (field.key === 'price' || field.key === 'stock_qty' || field.key === 'low_stock_threshold') {
        product[field.key] = Number(raw) || 0
      } else {
        product[field.key] = String(raw).trim()
      }
    }
    return product
  }

  const canImport = mapping.sku && mapping.name && mapping.price && rows.length > 0

  async function handleImport() {
    setImporting(true)
    setResult(null)
    const seenSkus = new Set<string>()
    const products: Record<string, any>[] = []
    let skipped = 0

    for (const row of rows) {
      const product = buildProductRow(row)
      if (!product.sku) { skipped++; continue }
      if (seenSkus.has(product.sku)) { skipped++; continue }
      seenSkus.add(product.sku)
      products.push(product)
    }

    const errors: string[] = []
    let inserted = 0
    const batchSize = 50
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      const { error } = await supabase.from('products').upsert(batch, { onConflict: 'sku' })
      if (error) errors.push(`Batch ${i}-${i + batchSize}: ${error.message}`)
      else inserted += batch.length
    }

    setResult({ inserted, skipped, errors })
    setImporting(false)
  }

  const previewRows = rows.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Import Produk</h1>
        <p className="text-sm text-muted">Upload file Excel/CSV, petakan kolom, langsung masuk ke database — gak perlu script manual lagi.</p>
      </div>

      <div className="rounded-lg border border-line bg-surface p-5">
        <p className="mb-2 text-sm font-medium text-ink">1. Pilih kategori tujuan</p>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setCategory('retail')}
            className={`rounded-md border px-4 py-2 text-sm font-medium ${category === 'retail' ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted'}`}
          >
            Retail
          </button>
          <button
            onClick={() => setCategory('equipment')}
            className={`rounded-md border px-4 py-2 text-sm font-medium ${category === 'equipment' ? 'border-primary bg-primary-light text-primary' : 'border-line text-muted'}`}
          >
            Equipment
          </button>
        </div>

        <p className="mb-2 text-sm font-medium text-ink">2. Upload file</p>
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="mb-4 text-sm" />

        {sheetNames.length > 1 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-ink">3. Pilih sheet</p>
            <select value={selectedSheet} onChange={(e) => handleSheetChange(e.target.value)} className="rounded-md border border-line px-3 py-2 text-sm">
              {sheetNames.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {headers.length > 0 && (
          <>
            <p className="mb-2 text-sm font-medium text-ink">{sheetNames.length > 1 ? '4' : '3'}. Petakan kolom ({rows.length} baris terdeteksi)</p>
            <div className="mb-4 space-y-2">
              {TARGET_FIELDS.map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <label className="w-64 shrink-0 text-sm text-ink">
                    {field.label}
                    {field.required && <span className="text-danger"> *</span>}
                  </label>
                  <select
                    value={mapping[field.key] ?? ''}
                    onChange={(e) => setMapping((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="flex-1 rounded-md border border-line px-3 py-1.5 text-sm"
                  >
                    <option value="">— Skip —</option>
                    {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {previewRows.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium text-ink">Preview (5 baris pertama)</p>
                <div className="overflow-x-auto rounded-md border border-line">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-line bg-canvas text-left text-muted">
                        {TARGET_FIELDS.filter((f) => mapping[f.key]).map((f) => (
                          <th key={f.key} className="px-3 py-2 font-normal">{f.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {previewRows.map((row, i) => {
                        const mapped = buildProductRow(row)
                        return (
                          <tr key={i}>
                            {TARGET_FIELDS.filter((f) => mapping[f.key]).map((f) => (
                              <td key={f.key} className="px-3 py-2 text-ink">{String(mapped[f.key] ?? '-')}</td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={!canImport || importing}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {importing ? 'Mengimport...' : `Import ${rows.length} Produk`}
            </button>
            {!canImport && <p className="mt-2 text-xs text-danger">SKU, Nama, dan Harga wajib dipetakan dulu.</p>}
          </>
        )}
      </div>

      {result && (
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-sm font-medium text-ink">Hasil Import</p>
          <p className="mt-1 text-sm text-success">{result.inserted} produk berhasil di-import/update</p>
          {result.skipped > 0 && <p className="text-sm text-amber">{result.skipped} baris di-skip (SKU kosong/duplikat dalam file)</p>}
          {result.errors.length > 0 && (
            <div className="mt-2">
              {result.errors.map((err, i) => <p key={i} className="text-sm text-danger">{err}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}