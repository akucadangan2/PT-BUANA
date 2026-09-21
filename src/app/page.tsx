import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format-price'
import ScrollReveal from '@/components/ScrollReveal'

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.buana.app'

const APP_STORE_URL =
  'https://apps.apple.com/app/buana/id0000000000'

const features = [
  {
    number: '01',
    title: 'Real-Time Tracking',
    desc: 'Track deliveries and technician visits from dispatch through to arrival.',
  },
  {
    number: '02',
    title: 'Equipment Warranty',
    desc: 'Keep your commercial equipment purchases and warranty information organised.',
  },
  {
    number: '03',
    title: 'Service Booking',
    desc: 'Request maintenance and equipment service directly through the Buana platform.',
  },
  {
    number: '04',
    title: 'Reliable Delivery',
    desc: 'A connected delivery experience designed for businesses across Australia.',
  },
  {
    number: '05',
    title: 'Direct Communication',
    desc: 'Stay connected with your assigned courier or technician throughout the job.',
  },
  {
    number: '06',
    title: 'Secure Checkout',
    desc: 'Simple and secure online payments for products and equipment.',
  },
]

const process = [
  {
    number: '01',
    title: 'Choose what you need',
    desc: 'Browse retail products, commercial equipment or request a service.',
  },
  {
    number: '02',
    title: 'Order or book',
    desc: 'Complete your order or schedule a technician through the Buana app.',
  },
  {
    number: '03',
    title: 'Track progress',
    desc: 'Follow your delivery or service status with clear real-time updates.',
  },
  {
    number: '04',
    title: 'Delivered & supported',
    desc: 'Receive your order and continue managing service from one platform.',
  },
]

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </svg>
)

const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
)

const BoxIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-7 w-7"
  >
    <path d="M4 7h16v13H4z" />
    <path d="M3 4h18v4H3z" />
    <path d="M9 12h6" />
  </svg>
)

const StoreIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5"
  >
    <path d="M3 9l2-5h14l2 5" />
    <path d="M5 13v7h14v-7" />
    <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
  </svg>
)

const ToolIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5"
  >
    <path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 9.6 6 7.3 3.7a4 4 0 0 0 5 5L20 16.4a2.1 2.1 0 0 1-3 3l-7.7-7.7" />
  </svg>
)

export default async function HomePage() {
  const supabase = await createClient()

  const [retailRes, equipmentRes] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, price, image_url')
      .eq('category', 'retail')
      .order('created_at', { ascending: false })
      .limit(4),

    supabase
      .from('products')
      .select('id, name, price, image_url, brand')
      .eq('category', 'equipment')
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const retailProducts = retailRes.data ?? []
  const equipmentProducts = equipmentRes.data ?? []

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8f5] text-[#172018]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#dfe5dc] bg-[#f7f8f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center">
            <Image
              src="/logo.png"
              alt="Buana"
              width={180}
              height={60}
              priority
              className="h-9 w-auto object-contain sm:h-12"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-[#536055] lg:flex">
            <a href="#services" className="transition hover:text-[#28542c]">
              Services
            </a>
            <a href="#products" className="transition hover:text-[#28542c]">
              Products
            </a>
            <a href="#how-it-works" className="transition hover:text-[#28542c]">
              How It Works
            </a>
            <a href="#app" className="transition hover:text-[#28542c]">
              Mobile App
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#products"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#536055] transition hover:bg-white sm:inline-flex"
            >
              Catalogue
            </a>

            <Link
              href="/login"
              className="rounded-xl bg-[#244c28] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#193a1d] sm:px-5 sm:text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[#e2e7df]">
          <div className="absolute -left-40 top-20 h-[350px] w-[350px] rounded-full bg-[#dce8d7]/70 blur-3xl" />
          <div className="absolute -right-48 -top-28 h-[460px] w-[460px] rounded-full bg-[#e8eee3] blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1fr_.95fr] lg:px-8 lg:pb-28 lg:pt-24">

            <ScrollReveal>
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6e1d3] bg-white/80 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#37633b] shadow-sm sm:text-[10px]">
                  <span className="h-2 w-2 rounded-full bg-[#37633b]" />
                  Built for Australian businesses
                </div>

                <h1 className="max-w-3xl text-[43px] font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[72px]">
                  Supply.
                  <br />
                  Equipment.
                  <br />
                  <span className="text-[#37633b]">Service.</span>
                </h1>

                <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#667068] sm:mt-7 sm:text-[17px]">
                  One connected platform for retail supply, commercial
                  refrigeration equipment and professional field service.
                  Designed to make everyday business operations simpler.
                </p>

                <div className="mt-8 grid gap-3 min-[460px]:flex sm:mt-9">
                  <a
                    href="#products"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[#244c28] px-6 text-sm font-bold text-white shadow-lg shadow-[#244c28]/15 transition hover:-translate-y-0.5 hover:bg-[#193a1d]"
                  >
                    Explore Products
                    <span className="ml-2">→</span>
                  </a>

                  <a
                    href="#services"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-[#d8dfd5] bg-white px-6 text-sm font-bold text-[#263229] shadow-sm"
                  >
                    Explore Services
                  </a>
                </div>

                <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 border-t border-[#dde3da] pt-6 sm:gap-5">
                  <div>
                    <p className="text-base font-black sm:text-lg">400+</p>
                    <p className="mt-1 text-[9px] leading-4 text-[#7a837b] sm:text-[10px]">
                      Equipment models
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-black sm:text-lg">Live</p>
                    <p className="mt-1 text-[9px] leading-4 text-[#7a837b] sm:text-[10px]">
                      Order tracking
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-black sm:text-lg">AU</p>
                    <p className="mt-1 text-[9px] leading-4 text-[#7a837b] sm:text-[10px]">
                      Business support
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* HERO PANEL */}
            <ScrollReveal direction="right" delay={120}>
              <div className="relative mx-auto w-full max-w-[570px]">
                <div className="absolute -left-5 top-12 h-36 w-36 rounded-full bg-[#bfd0b8]/40 blur-3xl" />

                <div className="relative overflow-hidden rounded-[26px] border border-[#d9e0d6] bg-white p-2.5 shadow-[0_30px_80px_rgba(30,55,31,0.12)] sm:rounded-[32px] sm:p-5">
                  <div className="overflow-hidden rounded-[20px] bg-[#f4f6f2] sm:rounded-[25px]">

                    <div className="flex items-center justify-between border-b border-[#e0e5dd] bg-white px-4 py-4 sm:px-6">
                      <Image
                        src="/logo.png"
                        alt="Buana"
                        width={100}
                        height={34}
                        className="h-6 w-auto sm:h-7"
                      />

                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#657066] sm:text-[9px]">
                          Online
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8c958d] sm:text-[10px]">
                        Business overview
                      </p>

                      <h3 className="mt-2 text-xl font-black sm:text-2xl">
                        Everything connected.
                      </h3>

                      <p className="mt-1 text-[10px] text-[#7a837b] sm:text-[11px]">
                        Orders, equipment and service in one place.
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                        <div className="rounded-2xl border border-[#e0e5dd] bg-white p-3.5 sm:p-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf2ea] text-xs font-black text-[#37633b]">
                            01
                          </div>

                          <p className="mt-5 text-[9px] font-bold uppercase tracking-wider text-[#909890]">
                            Retail
                          </p>
                          <p className="mt-1 text-xs font-black sm:text-sm">
                            Business Supply
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#244c28] p-3.5 text-white sm:p-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-xs font-black">
                            02
                          </div>

                          <p className="mt-5 text-[9px] font-bold uppercase tracking-wider text-white/55">
                            Equipment
                          </p>
                          <p className="mt-1 text-xs font-black sm:text-sm">
                            Commercial Range
                          </p>
                        </div>

                        <div className="col-span-2 rounded-2xl border border-[#e0e5dd] bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#909890]">
                                Current service
                              </p>

                              <p className="mt-1.5 text-xs font-black sm:text-sm">
                                Equipment Maintenance
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-[#edf4ea] px-2.5 py-1.5 text-[7px] font-black text-[#37633b] sm:text-[9px]">
                              ON THE WAY
                            </span>
                          </div>

                          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#e7ebe5]">
                            <div className="h-full w-[68%] rounded-full bg-[#37633b]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SERVICES */}
        <section
          id="services"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
        >
          <ScrollReveal>
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#47704a]">
                  What we do
                </p>

                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
                  More than
                  <span className="block text-[#37633b]">
                    a supplier.
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-[#6b746c]">
                  Buana connects essential supply, commercial equipment
                  and after-sales support through one streamlined experience.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[#dde3da] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#8b958c]">
                    01
                  </span>

                  <h3 className="mt-9 text-xl font-black">
                    Retail Supply
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#707971]">
                    Food, beverage and everyday products for convenient
                    business ordering.
                  </p>

                  <a
                    href="#products"
                    className="mt-7 inline-flex text-xs font-black text-[#37633b]"
                  >
                    Explore retail →
                  </a>
                </div>

                <div className="rounded-[24px] bg-[#244c28] p-6 text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
                  <span className="text-[10px] font-black tracking-[0.2em] text-white/45">
                    02
                  </span>

                  <h3 className="mt-9 text-xl font-black">
                    Commercial Equipment
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Refrigeration equipment from selected commercial
                    brands for professional operations.
                  </p>

                  <a
                    href="#equipment"
                    className="mt-7 inline-flex text-xs font-black text-[#d4e7ca]"
                  >
                    View equipment →
                  </a>
                </div>

                <div className="rounded-[24px] border border-[#dde3da] bg-white p-6 sm:col-span-2 sm:p-7">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#8b958c]">
                    03
                  </span>

                  <h3 className="mt-8 text-xl font-black">
                    Service & Maintenance
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#707971]">
                    Request an experienced technician, monitor service
                    progress and keep commercial equipment supported
                    after purchase.
                  </p>

                  <a
                    href="#app"
                    className="mt-6 inline-flex rounded-xl border border-[#d9e0d6] px-5 py-3 text-xs font-black text-[#37633b]"
                  >
                    Book via app →
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="bg-[#172018] py-16 text-white sm:py-20 lg:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#9fc297]">
                    One connected journey
                  </p>

                  <h2 className="mt-4 max-w-lg text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                    Simple from
                    <span className="block text-[#a9cb9f]">
                      start to finish.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
                    From placing an order to receiving a delivery or
                    completing a service visit, Buana keeps the process clear.
                  </p>

                  <a
                    href="#app"
                    className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 text-xs font-black text-[#244c28]"
                  >
                    Get the Buana App
                  </a>
                </div>

                <div className="border-t border-white/10">
                  {process.map((item) => (
                    <div
                      key={item.number}
                      className="grid gap-2 border-b border-white/10 py-6 sm:grid-cols-[70px_1fr_auto] sm:items-center"
                    >
                      <p className="text-xs font-black text-[#9fc297]">
                        {item.number}
                      </p>

                      <div>
                        <p className="text-base font-black">
                          {item.title}
                        </p>

                        <p className="mt-1.5 max-w-md text-xs leading-5 text-white/45">
                          {item.desc}
                        </p>
                      </div>

                      <span className="hidden text-xl text-white/25 sm:block">
                        →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* PRODUCTS */}
        <section
          id="products"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
        >
          <ScrollReveal>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#47704a]">
                Catalogue
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Latest products.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#707971]">
                Browse a selection of products currently available.
                Open the Buana app to access the complete catalogue.
              </p>
            </div>
          </ScrollReveal>

          {/* RETAIL */}
          <div className="mt-10 sm:mt-12">
            <div className="mb-5 flex items-end justify-between border-b border-[#dce2d9] pb-4">
              <div>
                <p className="text-lg font-black">Retail</p>
                <p className="mt-1 text-[11px] text-[#818a82]">
                  Food & beverage supply
                </p>
              </div>

              <p className="hidden text-[9px] font-black uppercase tracking-[0.18em] text-[#a0a7a0] min-[400px]:block">
                Latest arrivals
              </p>
            </div>

            {retailProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {retailProducts.map((p, index) => (
                  <ScrollReveal key={p.id} delay={index * 80}>
                    <div className="group h-full overflow-hidden rounded-[20px] border border-[#dde3da] bg-white p-2.5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[24px] sm:p-3">
                      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[15px] bg-[#f1f3ef] sm:rounded-[19px]">
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <BoxIcon />
                        )}

                        <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[7px] font-black uppercase text-[#526054]">
                          Retail
                        </div>
                      </div>

                      <div className="px-1 pb-2 pt-3 sm:px-2">
                        <p className="line-clamp-2 min-h-[36px] text-xs font-bold leading-[18px] sm:text-sm">
                          {p.name}
                        </p>

                        <p className="mt-2 text-sm font-black text-[#37633b] sm:text-base">
                          {formatPrice(Number(p.price))}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#ccd5c9] bg-white px-6 py-12 text-center text-sm font-black text-[#536055]">
                Retail products coming soon.
              </div>
            )}
          </div>

          {/* EQUIPMENT */}
          <div id="equipment" className="mt-14 sm:mt-16">
            <div className="mb-5 border-b border-[#dce2d9] pb-4">
              <p className="text-lg font-black">Equipment</p>
              <p className="mt-1 text-[11px] text-[#818a82]">
                Commercial refrigeration
              </p>
            </div>

            {equipmentProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {equipmentProducts.map((p, index) => (
                  <ScrollReveal key={p.id} delay={index * 80}>
                    <div className="group h-full overflow-hidden rounded-[20px] border border-[#dde3da] bg-white p-2.5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[24px] sm:p-3">
                      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[15px] bg-[#f1f3ef]">
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <BoxIcon />
                        )}
                      </div>

                      <div className="px-1 pb-2 pt-3 sm:px-2">
                        {p.brand && (
                          <p className="mb-1 text-[8px] font-black uppercase tracking-wider text-[#929a92]">
                            {p.brand}
                          </p>
                        )}

                        <p className="line-clamp-2 min-h-[36px] text-xs font-bold leading-[18px] sm:text-sm">
                          {p.name}
                        </p>

                        <p className="mt-2 text-sm font-black text-[#37633b] sm:text-base">
                          {formatPrice(Number(p.price))}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#ccd5c9] bg-white px-6 py-12 text-center text-sm font-black text-[#536055]">
                Equipment catalogue coming soon.
              </div>
            )}
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-y border-[#dde3da] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            <ScrollReveal>
              <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#47704a]">
                    Why Buana
                  </p>

                  <h2 className="mt-4 max-w-md text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
                    Built around everyday business needs.
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2">
                  {features.map((feature) => (
                    <div
                      key={feature.number}
                      className="border-b border-[#e2e7df] py-6 sm:px-6 sm:[&:nth-child(odd)]:border-r"
                    >
                      <p className="text-[9px] font-black tracking-[0.2em] text-[#87a184]">
                        {feature.number}
                      </p>

                      <p className="mt-4 text-sm font-black">
                        {feature.title}
                      </p>

                      <p className="mt-2 max-w-sm text-xs leading-5 text-[#747d75]">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* MOBILE APP */}
        <section
          id="app"
          className="mx-auto max-w-7xl px-3 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
        >
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[28px] bg-[#244c28] px-5 py-10 text-white shadow-2xl shadow-[#244c28]/15 sm:rounded-[36px] sm:px-10 sm:py-14 lg:px-16 lg:py-16">

              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-white/[0.035]" />
              <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#76936f]/15 blur-3xl" />

              <div className="relative grid items-center gap-12 lg:grid-cols-[.9fr_.65fr] lg:gap-20">

                {/* APP TEXT */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#b9d1b1] sm:text-[10px]">
                    Buana Mobile
                  </p>

                  <h2 className="mt-4 max-w-2xl text-[34px] font-black leading-[1.03] tracking-[-0.045em] sm:mt-5 sm:text-4xl lg:text-5xl">
                    Your business,
                    <span className="block text-[#c4d9bc]">
                      wherever you are.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                    Browse products, order equipment, track deliveries,
                    request service and manage your Buana activity directly
                    from your phone.
                  </p>

                  <div className="mt-7 grid max-w-[390px] grid-cols-1 gap-2.5 min-[390px]:grid-cols-2 sm:mt-8">
                    <a
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[58px] items-center justify-center overflow-hidden rounded-xl bg-black px-3 transition duration-300 hover:-translate-y-1"
                    >
                      <Image
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                        alt="Get it on Google Play"
                        width={170}
                        height={50}
                        unoptimized
                        className="h-[52px] w-auto object-contain"
                      />
                    </a>

                    <a
                      href={APP_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[58px] items-center justify-center rounded-xl bg-black px-3 transition duration-300 hover:-translate-y-1"
                    >
                      <Image
                        src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us"
                        alt="Download on the App Store"
                        width={150}
                        height={50}
                        unoptimized
                        className="h-[39px] w-auto object-contain"
                      />
                    </a>
                  </div>

                  <div className="mt-8 grid max-w-md grid-cols-3 gap-2 border-t border-white/10 pt-6 sm:gap-4">
                    <div>
                      <p className="text-sm font-black">Shop</p>
                      <p className="mt-1 text-[9px] text-white/45">
                        Retail products
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-black">Track</p>
                      <p className="mt-1 text-[9px] text-white/45">
                        Live updates
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-black">Service</p>
                      <p className="mt-1 text-[9px] text-white/45">
                        Book technicians
                      </p>
                    </div>
                  </div>
                </div>

                {/* REAL APP STYLE MOCKUP */}
                <ScrollReveal direction="scale" delay={100}>
                  <div className="relative mx-auto w-full max-w-[330px]">

                    <div className="absolute inset-x-10 bottom-[-25px] h-24 rounded-full bg-black/30 blur-3xl" />

                    <div className="relative rounded-[46px] border border-white/20 bg-[#111713] p-[7px] shadow-[0_40px_100px_rgba(0,0,0,.38)]">

                      {/* PHONE */}
                      <div className="relative overflow-hidden rounded-[40px] bg-[#f8f9fa]">

                        {/* STATUS */}
                        <div className="flex h-9 items-center justify-between bg-white px-5 text-[8px] font-bold text-[#1b2330]">
                          <span>1:49</span>

                          <div className="flex items-center gap-1">
                            <span>●</span>
                            <span>●</span>
                            <span>▮</span>
                          </div>
                        </div>

                        {/* APP HEADER */}
                        <div className="flex items-center justify-between bg-white px-5 pb-4 pt-3">
                          <p className="text-[18px] font-black tracking-[-0.04em] text-[#172033]">
                            Retail Products
                          </p>

                          <div className="flex items-center gap-4 text-[#172033]">
                            <div className="grid grid-cols-3 gap-[2px]">
                              {Array.from({ length: 9 }).map((_, i) => (
                                <span
                                  key={i}
                                  className="h-[3px] w-[3px] rounded-[1px] bg-current"
                                />
                              ))}
                            </div>

                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="h-5 w-5"
                            >
                              <path d="M3 4h2l2.5 11h10l2-7H7" />
                              <circle cx="10" cy="19" r="1" />
                              <circle cx="18" cy="19" r="1" />
                            </svg>
                          </div>
                        </div>

                        {/* SEARCH */}
                        <div className="border-b border-[#e5e8ec] bg-[#f8f9fa] px-4 pb-3 pt-3">
                          <div className="flex h-[50px] items-center gap-4 rounded-[12px] border border-[#d8dde3] bg-white px-4 text-[#44505a]">
                            <SearchIcon />

                            <span className="text-[13px] tracking-wide text-[#697079]">
                              Search products...
                            </span>
                          </div>
                        </div>

                        {/* CATEGORIES */}
                        <div className="flex gap-2 overflow-hidden border-b border-[#e4e8eb] bg-white px-4 py-2.5">
                          <span className="shrink-0 rounded-full border border-[#d9dee4] px-3 py-2 text-[9px] font-semibold text-[#718096]">
                            All
                          </span>

                          <span className="shrink-0 rounded-full bg-[#11847d] px-4 py-2 text-[9px] font-semibold text-white">
                            Accessories
                          </span>

                          <span className="shrink-0 rounded-full border border-[#d9dee4] px-3 py-2 text-[9px] font-semibold text-[#718096]">
                            Beverages
                          </span>

                          <span className="shrink-0 rounded-full border border-[#d9dee4] px-3 py-2 text-[9px] font-semibold text-[#718096]">
                            Branding
                          </span>
                        </div>

                        {/* PRODUCTS */}
                        <div className="grid grid-cols-2 gap-2.5 bg-[#f8f9fa] p-4 pb-20">

                          {[
                            ['Syringe', 'A$22.86'],
                            ['C9 Waffle Disc', 'A$95.90'],
                            ['Biscoff Crumbs 750g', 'A$17.75'],
                            ['3-Bottle Commercial Sauce Warmer', 'A$285.00'],
                          ].map(([name, price], index) => (
                            <div
                              key={name}
                              className="overflow-hidden rounded-[12px] border border-[#dce2e5] bg-white"
                            >
                              <div className="relative flex aspect-[.94] items-center justify-center bg-[#e3f1f0] text-[#0f7874]">
                                <BoxIcon />

                                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#718096] shadow-sm">
                                  <HeartIcon />
                                </div>

                                {index === 0 && (
                                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#d34a33]">
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="h-4 w-4"
                                    >
                                      <path d="M12 21s-7-4.5-9.5-8.4C.2 9 1.4 4.5 5.4 3.4 8 2.7 10.2 4 12 6c1.8-2 4-3.3 6.6-2.6 4 1.1 5.2 5.6 2.9 9.2C19 16.5 12 21 12 21Z" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              <div className="min-h-[68px] px-2.5 py-2.5">
                                <p className="line-clamp-2 text-[10px] font-medium leading-[14px] text-[#1e293b]">
                                  {name}
                                </p>

                                <p className="mt-1 text-[11px] font-black text-[#172033]">
                                  {price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* BOTTOM NAV */}
                        <div className="absolute inset-x-0 bottom-0 grid grid-cols-5 border-t border-[#e7e9ec] bg-white px-2 pb-3 pt-2 shadow-[0_-10px_30px_rgba(0,0,0,.04)]">

                          <div className="text-center text-[#0d7773]">
                            <div className="mx-auto flex h-7 w-10 items-center justify-center rounded-full bg-[#e0f2f0]">
                              <StoreIcon />
                            </div>
                            <p className="mt-1 text-[7px] font-medium">
                              Retail
                            </p>
                          </div>

                          <div className="text-center text-[#4d5854]">
                            <div className="mx-auto flex h-7 items-center justify-center">
                              <BoxIcon />
                            </div>
                            <p className="mt-1 text-[7px]">
                              Equipment
                            </p>
                          </div>

                          <div className="relative text-center text-[#4d5854]">
                            <div className="absolute -right-0.5 -top-1 rounded-full bg-[#cc4d37] px-1 text-[6px] text-white">
                              14
                            </div>
                            <div className="mx-auto flex h-7 items-center justify-center">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-5 w-5"
                              >
                                <path d="M6 3h12v18H6z" />
                                <path d="M9 7h6M9 11h6M9 15h4" />
                              </svg>
                            </div>
                            <p className="mt-1 text-[7px]">
                              Orders
                            </p>
                          </div>

                          <div className="text-center text-[#4d5854]">
                            <div className="mx-auto flex h-7 items-center justify-center">
                              <ToolIcon />
                            </div>
                            <p className="mt-1 text-[7px]">
                              Service
                            </p>
                          </div>

                          <div className="text-center text-[#4d5854]">
                            <div className="mx-auto flex h-7 items-center justify-center">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-5 w-5"
                              >
                                <circle cx="12" cy="8" r="3" />
                                <path d="M5 21c.5-4 3-6 7-6s6.5 2 7 6" />
                              </svg>
                            </div>
                            <p className="mt-1 text-[7px]">
                              Profile
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 shadow-xl">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-black uppercase tracking-[0.15em] text-[#244c28]">
                          BUANA Mobile
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl border-t border-[#dce2d9] pt-14 text-center sm:pt-16">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#47704a]">
                BUANA Australia
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Everything your operation needs.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#707971] sm:text-base">
                Discover retail products, commercial equipment and convenient
                field service through one connected platform.
              </p>

              <div className="mx-auto mt-8 grid max-w-md gap-3 min-[430px]:grid-cols-2">
                <a
                  href="#products"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-[#244c28] px-6 text-sm font-bold text-white"
                >
                  Browse Products
                </a>

                <a
                  href="#app"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-[#d4dcd2] bg-white px-6 text-sm font-bold text-[#314034]"
                >
                  Download the App
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#dce2d9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <Image
                src="/logo.png"
                alt="Buana"
                width={155}
                height={52}
                className="h-11 w-auto object-contain"
              />

              <p className="mt-5 max-w-[270px] text-xs leading-5 text-[#7a837b]">
                Retail, commercial equipment and field service connected
                through one Buana platform.
              </p>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9ba29b]">
                Explore
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-[#626d64]">
                <a href="#products">Products</a>
                <a href="#equipment">Equipment</a>
                <a href="#services">Services</a>
                <a href="#app">Mobile App</a>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9ba29b]">
                Legal
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-[#626d64]">
                <Link href="/privacy">
                  Privacy Policy
                </Link>

                <Link href="/delete-account">
                  Account Deletion
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9ba29b]">
                Account
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-[#626d64]">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Play
                </a>

                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  App Store
                </a>

                <Link href="/login">
                  Staff Login
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-[#e0e5dd] pt-6 text-[10px] font-medium text-[#9ba29b] sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} BUANA. All rights reserved.
            </p>

            <p>
              Retail • Equipment • Service • Australia
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}