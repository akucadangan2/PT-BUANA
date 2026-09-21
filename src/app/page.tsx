import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format-price'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.buana.app'
const APP_STORE_URL = 'https://apps.apple.com/app/buana/id0000000000' // TODO: update once live on the App Store

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
            <a href="#products" className="hover:text-ink">Products</a>
            <a href="#services" className="hover:text-ink">Services</a>
            <a href="#app" className="hover:text-ink">Get the App</a>
            <a href="#contact" className="hover:text-ink">Contact</a>
          </nav>
          <Link href="/login" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="mb-3 text-sm font-medium text-primary">Retail &amp; Equipment Distribution</p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
          Retail, Equipment,<br /> and Kitchen Service — All in One Place
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted">
          Buana supplies food &amp; beverage products, trusted-brand refrigeration equipment,
          and equipment service delivered straight to your location across Australia.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#products" className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90">
            View Products
          </a>
          <a href="#services" className="rounded-md border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-canvas">
            Request Service
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
            <Image
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              width={162}
              height={48}
              unoptimized
            />
          </a>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            <Image
              src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us"
              alt="Download on the App Store"
              width={140}
              height={48}
              unoptimized
            />
          </a>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 text-center sm:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-semibold text-ink">400+</p>
            <p className="mt-1 text-xs text-muted">Equipment Models</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-ink">Live</p>
            <p className="mt-1 text-xs text-muted">Delivery &amp; Technician Tracking</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-ink">Trusted</p>
            <p className="mt-1 text-xs text-muted">Brands: Bromic &amp; True Refrigeration</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-ink">Secure</p>
            <p className="mt-1 text-xs text-muted">Payments via Stripe</p>
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-line bg-surface p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">🛒</div>
            <p className="font-medium text-ink">Retail Food &amp; Beverage</p>
            <p className="mt-1 text-sm text-muted">Food &amp; ingredient products ready to ship to your business location.</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">❄️</div>
            <p className="font-medium text-ink">Refrigeration Equipment</p>
            <p className="mt-1 text-sm text-muted">Chillers, freezers, and equipment from Bromic &amp; True Refrigeration.</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">🔧</div>
            <p className="font-medium text-ink">Service &amp; Maintenance</p>
            <p className="mt-1 text-sm text-muted">Experienced technicians come directly to your location.</p>
          </div>
        </div>
      </section>

      {/* Produk Pilihan */}
      <section id="products" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-1 font-display text-2xl font-semibold text-ink">Latest Products</h2>
        <p className="mb-6 text-sm text-muted">A selection of available products — download the app for the full catalogue.</p>

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
              <p className="mt-1 text-sm font-medium text-ink">{formatPrice(Number(p.price))}</p>
            </div>
          ))}
          {retailProducts.length === 0 && <p className="text-sm text-muted">No retail products yet.</p>}
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
              <p className="mt-1 text-sm font-medium text-ink">{formatPrice(Number(p.price))}</p>
            </div>
          ))}
          {equipmentProducts.length === 0 && <p className="text-sm text-muted">No equipment products yet.</p>}
        </div>
      </section>

      {/* Kenapa kami */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Why Buana</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[
            { icon: '📍', title: 'Real-Time Tracking', desc: 'Track your courier & technician location live.' },
            { icon: '🛡️', title: 'Official Warranty', desc: 'Every equipment unit is recorded with a clear warranty.' },
            { icon: '📅', title: 'Flexible Booking', desc: 'Request service anytime through the app.' },
            { icon: '🚚', title: 'Reliable Delivery', desc: 'Our courier team and fleet are ready to deliver your order.' },
            { icon: '💬', title: 'Direct Chat', desc: 'Message your courier or technician directly about your order.' },
            { icon: '💳', title: 'Secure Checkout', desc: 'Pay safely by card through Stripe.' },
            { icon: '🏪', title: 'Vendor Marketplace', desc: 'Browse secondhand equipment listed by trusted vendors.' },
            { icon: '🌐', title: 'English &amp; Indonesian', desc: 'The app is available in both languages.' },
          ].map((f) => (
            <div key={f.title}>
              <div className="mb-2 text-2xl">{f.icon}</div>
              <p className="font-medium text-ink">{f.title}</p>
              <p className="mt-1 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* App download */}
      <section id="app" className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink">Get the Buana App</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Browse the full catalogue, track your delivery live, book equipment service, and chat directly
            with your courier or technician — all from your phone.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Image
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                width={162}
                height={48}
                unoptimized
              />
            </a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Image
                src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us"
                alt="Download on the App Store"
                width={140}
                height={48}
                unoptimized
              />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">Ready to order or book a service?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Browse our catalogue or reach out to our team — we&apos;re here to help.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href="#products" className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90">
            Browse Products
          </a>
          <a href="#contact" className="rounded-md border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-canvas">
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <p className="font-display text-base font-semibold text-ink">BUANA</p>
              <p className="mt-2 text-xs text-muted">
                Retail, equipment, and service — supplied and supported across Australia.
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Company</p>
              <div className="flex flex-col gap-2 text-sm text-muted">
                <a href="#products" className="hover:text-ink">Products</a>
                <a href="#services" className="hover:text-ink">Why Buana</a>
                <a href="#app" className="hover:text-ink">Get the App</a>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Legal</p>
              <div className="flex flex-col gap-2 text-sm text-muted">
                <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
                <Link href="/delete-account" className="hover:text-ink">Account Deletion</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Get the App</p>
              <div className="flex flex-col gap-2">
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-ink">
                  Google Play
                </a>
                <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-ink">
                  App Store
                </a>
                <Link href="/login" className="text-sm text-muted hover:text-ink">Staff Login</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-line pt-6 text-center text-xs text-muted">
            © {new Date().getFullYear()} BUANA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}