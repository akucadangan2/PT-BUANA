'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type LowStockItem = { id: string; name: string; category: 'retail' | 'equipment'; displayQty: number; threshold: number }

export default function StokMenipisCard({ items }: { items: LowStockItem[] }) {
  const [open, setOpen] = useState(false)

  const chartData = [...items]
    .sort((a, b) => a.displayQty - b.displayQty)
    .slice(0, 8)
    .map((i) => ({ name: i.name.length > 14 ? i.name.slice(0, 14) + '…' : i.name, qty: i.displayQty, full: i.name }))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-primary"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium text-ink">Low Stock</h2>
          <span className="text-xs text-primary underline underline-offset-2">View details</span>
        </div>

        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">All good, no low stock items</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number, _name, entry) => [`${value} units`, entry.payload.full]}
                cursor={{ fill: '#F7F8FA' }}
              />
              <Bar dataKey="qty" radius={[0, 4, 4, 0]} barSize={14}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="#C77D1F" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/20 px-4" onClick={() => setOpen(false)}>
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-lg border border-line bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="font-display font-semibold text-ink">All Low Stock Items ({items.length})</h3>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-ink">✕</button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-canvas text-left text-muted">
                    <th className="px-5 py-2 font-normal">Product</th>
                    <th className="px-5 py-2 font-normal">Category</th>
                    <th className="px-5 py-2 font-normal">Available</th>
                    <th className="px-5 py-2 font-normal">Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {items
                    .sort((a, b) => a.displayQty - b.displayQty)
                    .map((item) => (
                      <tr key={item.id}>
                        <td className="px-5 py-2.5 text-ink">{item.name}</td>
                        <td className="px-5 py-2.5 text-muted">{item.category === 'retail' ? 'Retail' : 'Equipment'}</td>
                        <td className="px-5 py-2.5 font-medium text-amber">{item.displayQty}</td>
                        <td className="px-5 py-2.5 text-muted">{item.threshold}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}