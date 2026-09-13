'use client'

type Props = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-1 text-sm text-muted">
      <div>{total === 0 ? 'Tidak ada data' : `${from}–${to} dari ${total}`}</div>
      <div className="flex items-center gap-3">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-line px-2 py-1 text-xs"
        >
          {[20, 50, 100].map((s) => <option key={s} value={s}>{s} / halaman</option>)}
        </select>
        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
            className="rounded-md border border-line px-2 py-1 text-xs disabled:opacity-40">Prev</button>
          <span className="px-2 text-xs">{page} / {totalPages}</span>
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
            className="rounded-md border border-line px-2 py-1 text-xs disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  )
}