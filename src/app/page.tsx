import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const [retailRes, equipmentRes] = await Promise.all([
    supabase.from('products').select('id, name, price, image_url').eq('category', 'retail').order('created_at', { ascending: false }).limit(4),
    supabase.from('products').select('id, name, price, image_url, brand').eq('category', 'equipment').order('created_at', { ascending: false }).limit(4),
  ])

  const retailProducts = retailRes.data ?? []
  const equipmentProducts = equipmentRes.data ?? []

  return (
    <div className="min-h-screen bg-canvas">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="font-display text-lg font-semibold text-ink">BUANA</p>
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#produk" className="hover:text-ink">Produk</a>
            <a href="#layanan" className="hover:text-ink">Layanan</a>
            <a href="#kontak" className="hover:text-ink">Kontak</a>
          </nav>
          <Link href="/login" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Masuk
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="mb-3 text-sm font-medium text-primary">Distribusi Retail &amp; Equipment</p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
          Kebutuhan Retail, Equipment,<br /> dan Service Dapur — Satu Tempat
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted">
          BUANA menyediakan produk food &amp; beverage, equipment refrigeration dari brand terpercaya,
          dan layanan service equipment langsung ke lokasi Anda.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#produk" className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90">
            Lihat Produk
          </a>
          <a href="#layanan" className="rounded-md border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-canvas">
            Ajukan Service
          </a>
        </div>
      </section>

      {/* Kategori */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-line bg-surface p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">🛒</div>
            <p className="font-medium text-ink">Retail Food &amp; Beverage</p>
            <p className="mt-1 text-sm text-muted">Produk food &amp; ingredients siap kirim ke lokasi bisnis Anda.</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">❄️</div>
            <p className="font-medium text-ink">Equipment Refrigeration</p>
            <p className="mt-1 text-sm text-muted">Chiller, freezer, dan equipment dari Bromic &amp; True Refrigeration.</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">🔧</div>
            <p className="font-medium text-ink">Service &amp; Maintenance</p>
            <p className="mt-1 text-sm text-muted">Teknisi berpengalaman datang langsung ke lokasi Anda.</p>
          </div>
        </div>
      </section>

      {/* Produk Pilihan */}
      <section id="produk" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-1 font-display text-2xl font-semibold text-ink">Produk Terbaru</h2>
        <p className="mb-6 text-sm text-muted">Sebagian produk yang tersedia — download aplikasi untuk katalog lengkap.</p>

        <p className="mb-3 text-sm font-medium text-ink">Retail</p>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {retailProducts.map((p) => (
            <div key={p.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="mb-3 flex h-24 items-center justify-center rounded-md bg-primary-light">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="h-full w-full rounded-md object-cover" />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <p className="text-sm text-ink">{p.name}</p>
              <p className="mt-1 text-sm font-medium text-ink">Rp{Number(p.price).toLocaleString('id-ID')}</p>
            </div>
          ))}
          {retailProducts.length === 0 && <p className="text-sm text-muted">Belum ada produk retail.</p>}
        </div>

        <p className="mb-3 text-sm font-medium text-ink">Equipment</p>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {equipmentProducts.map((p) => (
            <div key={p.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="mb-3 flex h-24 items-center justify-center rounded-md bg-primary-light">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="h-full w-full rounded-md object-cover" />
                ) : (
                  <span className="text-2xl">❄️</span>
                )}
              </div>
              {p.brand && <p className="text-xs text-muted">{p.brand}</p>}
              <p className="text-sm text-ink">{p.name}</p>
              <p className="mt-1 text-sm font-medium text-ink">Rp{Number(p.price).toLocaleString('id-ID')}</p>
            </div>
          ))}
          {equipmentProducts.length === 0 && <p className="text-sm text-muted">Belum ada produk equipment.</p>}
        </div>
      </section>

      {/* Kenapa kami */}
      <section id="layanan" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Kenapa BUANA</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[
            { icon: '📍', title: 'Tracking Real-Time', desc: 'Pantau posisi kurir & teknisi secara live.' },
            { icon: '🛡️', title: 'Garansi Resmi', desc: 'Semua unit equipment tercatat dengan garansi jelas.' },
            { icon: '📅', title: 'Booking Fleksibel', desc: 'Ajukan service kapan saja lewat aplikasi.' },
            { icon: '🚚', title: 'Pengiriman Terpercaya', desc: 'Tim kurir & armada siap antar pesanan Anda.' },
          ].map((f) => (
            <div key={f.title}>
              <div className="mb-2 text-2xl">{f.icon}</div>
              <p className="font-medium text-ink">{f.title}</p>
              <p className="mt-1 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted md:flex-row">
          <p>© {new Date().getFullYear()} BUANA. Semua hak dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-ink">Kebijakan Privasi</Link>
            <Link href="/login" className="hover:text-ink">Login Staff</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}