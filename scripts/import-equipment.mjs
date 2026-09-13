// Jalanin: node scripts/import-equipment.mjs "C:\Users\xtcli\OneDrive\ドキュメント\Bromic Refrigeration 2026 July Pricelist + Accessories(1).xlsx"
// Output: supabase/import_equipment.sql (siap di-paste ke SQL Editor Supabase)

import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'

const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node scripts/import-equipment.mjs <path-to-xlsx>')
  process.exit(1)
}

const workbook = XLSX.readFile(filePath)

function toPrice(v) {
  if (v === undefined || v === null || v === '') return null
  if (typeof v === 'number') return v
  const s = String(v).trim()
  if (s.toUpperCase() === 'FOC') return 0
  const n = parseFloat(s.replace(/,/g, ''))
  return isNaN(n) ? null : n
}

function warrantyMonths(v) {
  if (v === undefined || v === null) return null
  const m = String(v).trim().match(/^(\d+)/)
  return m ? parseInt(m[1], 10) * 12 : null
}

function esc(s) {
  return String(s).replace(/'/g, "''").trim()
}

function sheetRows(sheetName) {
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`)
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: undefined })
}

const products = []

// --- Bromic Refrigeration ---
{
  const rows = sheetRows('Bromic Refrigeration')
  const headerIdx = rows.findIndex((r) => r[0] === 'Part No.')
  let brand = 'Bromic'
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const col0 = row[0]
    if (col0 === undefined) continue
    if (String(col0).trim() === 'Accessories' && row[1] === undefined) {
      brand = 'Bromic Accessories'
      continue
    }
    const price = toPrice(row[2])
    if (price === null) continue
    const name = row[1] !== undefined ? String(row[1]).trim() : String(col0).trim()
    products.push({
      sku: `BR-${String(col0).trim()}`,
      name,
      description: name,
      price,
      brand,
      warrantyMonths: warrantyMonths(row[5]),
    })
  }
}

// --- True Refrigeration ---
{
  const rows = sheetRows('True Refrigeration')
  const headerIdx = rows.findIndex((r) => r[0] === 'Model')
  let section = null
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const col0 = row[0]
    if (col0 === undefined) continue
    const price = toPrice(row[1])
    if (price === null) {
      section = String(col0).trim()
      continue
    }
    const name = String(col0).trim()
    products.push({
      sku: `TR-${name}`,
      name,
      description: section ? `${section} — ${name}` : name,
      price,
      brand: 'True Refrigeration',
      warrantyMonths: warrantyMonths(row[4]),
    })
  }
}

// --- True Accessories ---
{
  const rows = sheetRows('True Accessories - Pricing PDF')
  const headerIdx = rows.findIndex((r) => r[0] === 'Description')
  let section = null
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const col0 = row[0]
    if (col0 === undefined) continue
    const price = toPrice(row[2])
    if (price === null) {
      section = String(col0).trim()
      continue
    }
    const name = String(col0).trim()
    const partNo = row[1] !== undefined ? String(row[1]).trim() : name
    products.push({
      sku: `TA-${partNo}`,
      name,
      description: section ? `${section} — ${name}` : name,
      price,
      brand: 'True Accessories',
      warrantyMonths: null,
    })
  }
}

// --- dedupe exact duplicate rows ---
const seen = new Set()
const deduped = []
for (const p of products) {
  const key = `${p.sku}|${p.name}|${p.price}|${p.description}`
  if (seen.has(key)) continue
  seen.add(key)
  deduped.push(p)
}

// --- disambiguate remaining sku collisions (same part number, different item) ---
const skuCount = {}
for (const p of deduped) skuCount[p.sku] = (skuCount[p.sku] || 0) + 1
const skuSeen = {}
for (const p of deduped) {
  if (skuCount[p.sku] > 1) {
    skuSeen[p.sku] = (skuSeen[p.sku] || 0) + 1
    if (skuSeen[p.sku] > 1) p.sku = `${p.sku}-${skuSeen[p.sku]}`
  }
}

// --- build SQL ---
const values = deduped.map((p) => {
  const wm = p.warrantyMonths ?? 'null'
  return `('equipment', '${esc(p.sku)}', '${esc(p.name)}', '${esc(p.description)}', ${p.price}, 'pcs', 0, 0, '${esc(p.brand)}', ${wm})`
})

const sql =
  `insert into products (category, sku, name, description, price, unit, stock_qty, low_stock_threshold, brand, default_warranty_months)\nvalues\n` +
  values.join(',\n') +
  ';\n'

const outPath = path.join('supabase', 'import_equipment.sql')
fs.mkdirSync('supabase', { recursive: true })
fs.writeFileSync(outPath, sql)

console.log(`Done. ${deduped.length} products written to ${outPath}`)