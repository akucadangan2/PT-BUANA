import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format-price'

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
      <header className="sticky top-0 z-50 border-b border-[#dfe5dc] bg-[#f7f8f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center">
            <Image
              src="/logo.png"
              alt="Buana"
              width={180}
              height={60}
              priority
              className="h-11 w-auto object-contain sm:h-12"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-[#536055] lg:flex">
            <a
              href="#services"
              className="transition hover:text-[#28542c]"
            >
              Services
            </a>

            <a
              href="#products"
              className="transition hover:text-[#28542c]"
            >
              Products
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-[#28542c]"
            >
              How It Works
            </a>

            <a
              href="#app"
              className="transition hover:text-[#28542c]"
            >
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
              className="rounded-xl bg-[#244c28] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#193a1d]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[#e2e7df] bg-[#f7f8f5]">
          <div className="absolute -left-52 top-20 h-[420px] w-[420px] rounded-full bg-[#dce8d7]/60 blur-3xl" />
          <div className="absolute -right-48 -top-28 h-[460px] w-[460px] rounded-full bg-[#e8eee3] blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-[1fr_.95fr] lg:px-8 lg:pb-28 lg:pt-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6e1d3] bg-white/80 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#37633b] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#37633b]" />
                Built for Australian businesses
              </div>

              <h1 className="max-w-3xl text-[44px] font-black leading-[0.98] tracking-[-0.055em] text-[#172018] sm:text-6xl lg:text-[72px]">
                Supply.
                <br />
                Equipment.
                <br />
                <span className="text-[#37633b]">Service.</span>
              </h1>

              <p className="mt-7 max-w-xl text-[15px] leading-7 text-[#667068] sm:text-[17px]">
                One connected platform for retail supply, commercial
                refrigeration equipment and professional field service.
                Designed to make everyday business operations simpler.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#products"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-xl bg-[#244c28] px-7 text-sm font-bold text-white shadow-lg shadow-[#244c28]/15 transition hover:-translate-y-0.5 hover:bg-[#193a1d]"
                >
                  Explore Products
                  <span className="ml-2">→</span>
                </a>

                <a
                  href="#services"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-xl border border-[#d8dfd5] bg-white px-7 text-sm font-bold text-[#263229] shadow-sm transition hover:border-[#9bb19b]"
                >
                  Explore Services
                </a>
              </div>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-[#dde3da] pt-7">
                <div>
                  <p className="text-lg font-black text-[#172018]">
                    400+
                  </p>
                  <p className="mt-1 text-[10px] font-medium leading-4 text-[#7a837b]">
                    Equipment models
                  </p>
                </div>

                <div>
                  <p className="text-lg font-black text-[#172018]">
                    Live
                  </p>
                  <p className="mt-1 text-[10px] font-medium leading-4 text-[#7a837b]">
                    Order tracking
                  </p>
                </div>

                <div>
                  <p className="text-lg font-black text-[#172018]">
                    AU
                  </p>
                  <p className="mt-1 text-[10px] font-medium leading-4 text-[#7a837b]">
                    Business support
                  </p>
                </div>
              </div>
            </div>

            {/* HERO DASHBOARD */}
            <div className="relative mx-auto w-full max-w-[570px]">
              <div className="absolute -left-5 top-12 h-36 w-36 rounded-full bg-[#bfd0b8]/40 blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-[#d9e0d6] bg-white p-3 shadow-[0_30px_80px_rgba(30,55,31,0.12)] sm:p-5">
                <div className="overflow-hidden rounded-[25px] bg-[#f4f6f2]">
                  <div className="flex items-center justify-between border-b border-[#e0e5dd] bg-white px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/logo.png"
                        alt="Buana"
                        width={100}
                        height={34}
                        className="h-7 w-auto object-contain"
                      />

                      <div className="hidden h-5 w-px bg-[#dde2da] sm:block" />

                      <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#929a92] sm:block">
                        Operations
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#657066]">
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="mb-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8c958d]">
                        Business overview
                      </p>

                      <div className="mt-2 flex items-end justify-between">
                        <div>
                          <p className="text-xl font-black tracking-tight text-[#172018] sm:text-2xl">
                            Everything connected.
                          </p>

                          <p className="mt-1 text-[11px] text-[#7a837b]">
                            Orders, equipment and service in one place.
                          </p>
                        </div>

                        <div className="hidden rounded-lg bg-[#e7eee3] px-3 py-2 text-[9px] font-black text-[#37633b] sm:block">
                          LIVE
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-[#e0e5dd] bg-white p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf2ea] text-sm font-black text-[#37633b]">
                            01
                          </div>

                          <span className="text-[9px] font-bold text-emerald-600">
                            ACTIVE
                          </span>
                        </div>

                        <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-[#909890]">
                          Retail
                        </p>

                        <p className="mt-1 text-sm font-black text-[#172018]">
                          Business Supply
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#244c28] p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-black">
                            02
                          </div>

                          <span className="h-2 w-2 rounded-full bg-[#b9d8a9]" />
                        </div>

                        <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-white/55">
                          Equipment
                        </p>

                        <p className="mt-1 text-sm font-black">
                          Commercial Range
                        </p>
                      </div>

                      <div className="col-span-2 rounded-2xl border border-[#e0e5dd] bg-white p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#909890]">
                              Current service
                            </p>

                            <p className="mt-1.5 text-sm font-black text-[#172018]">
                              Equipment Maintenance
                            </p>
                          </div>

                          <div className="rounded-full bg-[#edf4ea] px-3 py-1.5 text-[9px] font-black text-[#37633b]">
                            ON THE WAY
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="flex justify-between text-[9px] font-semibold text-[#8b948c]">
                            <span>Confirmed</span>
                            <span>Assigned</span>
                            <span>Arrival</span>
                          </div>

                          <div className="relative mt-3 h-1.5 rounded-full bg-[#e7ebe5]">
                            <div className="h-full w-[68%] rounded-full bg-[#37633b]" />
                            <div className="absolute left-[67%] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#37633b] shadow" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {[
                        ['Orders', '24'],
                        ['Deliveries', '08'],
                        ['Services', '05'],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-[#e0e5dd] bg-white px-3 py-3"
                        >
                          <p className="text-base font-black text-[#172018]">
                            {value}
                          </p>
                          <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-[#969d96]">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section
          id="services"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#47704a]">
                What we do
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] text-[#172018] sm:text-4xl">
                More than
                <span className="block text-[#37633b]">
                  a supplier.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-[#6b746c]">
                Buana connects essential supply, commercial equipment
                and after-sales support through one streamlined
                experience.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group rounded-[26px] border border-[#dde3da] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl sm:p-7">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#8b958c]">
                    01
                  </span>
                  <span className="text-lg text-[#37633b]">↗</span>
                </div>

                <h3 className="mt-10 text-xl font-black tracking-tight text-[#172018]">
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

              <div className="group rounded-[26px] bg-[#244c28] p-6 text-white transition hover:-translate-y-1 hover:shadow-xl sm:p-7">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-black tracking-[0.2em] text-white/45">
                    02
                  </span>
                  <span className="text-lg text-white/80">↗</span>
                </div>

                <h3 className="mt-10 text-xl font-black tracking-tight">
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

              <div className="group rounded-[26px] border border-[#dde3da] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl sm:col-span-2 sm:p-7">
                <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-black tracking-[0.2em] text-[#8b958c]">
                        03
                      </span>
                    </div>

                    <h3 className="mt-8 text-xl font-black tracking-tight text-[#172018]">
                      Service & Maintenance
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#707971]">
                      Request an experienced technician, monitor service
                      progress and keep commercial equipment supported
                      after purchase.
                    </p>
                  </div>

                  <a
                    href="#app"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#d9e0d6] px-5 text-xs font-black text-[#37633b] transition hover:bg-[#f1f5ef]"
                  >
                    Book via app →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="bg-[#172018] py-20 text-white lg:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
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
                  completing a service visit, Buana keeps the process
                  clear.
                </p>

                <a
                  href="#app"
                  className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 text-xs font-black text-[#244c28] transition hover:bg-[#eaf0e7]"
                >
                  Get the Buana App
                </a>
              </div>

              <div className="border-t border-white/10">
                {process.map((item) => (
                  <div
                    key={item.number}
                    className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[70px_1fr_auto] sm:items-center"
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
          </div>
        </section>

        {/* PRODUCTS */}
        <section
          id="products"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#47704a]">
                Catalogue
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#172018] sm:text-4xl">
                Latest products.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#707971]">
                Browse a selection of products currently available.
                Open the Buana app to access the complete catalogue.
              </p>
            </div>

            <a
              href="#app"
              className="inline-flex w-fit text-xs font-black text-[#37633b]"
            >
              Full catalogue in app →
            </a>
          </div>

          {/* RETAIL */}
          <div className="mt-12">
            <div className="mb-5 flex items-end justify-between border-b border-[#dce2d9] pb-4">
              <div>
                <p className="text-lg font-black text-[#172018]">
                  Retail
                </p>
                <p className="mt-1 text-[11px] text-[#818a82]">
                  Food & beverage supply
                </p>
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#a0a7a0]">
                Latest arrivals
              </p>
            </div>

            {retailProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {retailProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-[20px] border border-[#dde3da] bg-white p-2.5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[24px] sm:p-3"
                  >
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[15px] bg-[#f1f3ef] sm:rounded-[19px]">
                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="text-xs font-black uppercase tracking-wider text-[#9aa29a]">
                          BUANA
                        </span>
                      )}

                      <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-[#526054] backdrop-blur">
                        Retail
                      </div>
                    </div>

                    <div className="px-1 pb-2 pt-3 sm:px-2 sm:pb-3 sm:pt-4">
                      <p className="line-clamp-2 min-h-[36px] text-xs font-bold leading-[18px] text-[#202921] sm:text-sm">
                        {p.name}
                      </p>

                      <p className="mt-2.5 text-sm font-black text-[#37633b] sm:text-base">
                        {formatPrice(Number(p.price))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#ccd5c9] bg-white px-6 py-12 text-center">
                <p className="text-sm font-black text-[#536055]">
                  Retail products coming soon.
                </p>
              </div>
            )}
          </div>

          {/* EQUIPMENT */}
          <div id="equipment" className="mt-16">
            <div className="mb-5 flex items-end justify-between border-b border-[#dce2d9] pb-4">
              <div>
                <p className="text-lg font-black text-[#172018]">
                  Equipment
                </p>

                <p className="mt-1 text-[11px] text-[#818a82]">
                  Commercial refrigeration
                </p>
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#a0a7a0]">
                Commercial range
              </p>
            </div>

            {equipmentProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {equipmentProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-[20px] border border-[#dde3da] bg-white p-2.5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[24px] sm:p-3"
                  >
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[15px] bg-[#f1f3ef] sm:rounded-[19px]">
                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="text-xs font-black uppercase tracking-wider text-[#9aa29a]">
                          BUANA
                        </span>
                      )}

                      <div className="absolute left-2 top-2 rounded-full bg-[#244c28]/95 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white">
                        Equipment
                      </div>
                    </div>

                    <div className="px-1 pb-2 pt-3 sm:px-2 sm:pb-3 sm:pt-4">
                      {p.brand && (
                        <p className="mb-1 text-[9px] font-black uppercase tracking-[0.13em] text-[#929a92]">
                          {p.brand}
                        </p>
                      )}

                      <p className="line-clamp-2 min-h-[36px] text-xs font-bold leading-[18px] text-[#202921] sm:text-sm">
                        {p.name}
                      </p>

                      <p className="mt-2.5 text-sm font-black text-[#37633b] sm:text-base">
                        {formatPrice(Number(p.price))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#ccd5c9] bg-white px-6 py-12 text-center">
                <p className="text-sm font-black text-[#536055]">
                  Equipment catalogue coming soon.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-y border-[#dde3da] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#47704a]">
                  Why Buana
                </p>

                <h2 className="mt-4 max-w-md text-3xl font-black leading-tight tracking-[-0.045em] text-[#172018] sm:text-4xl">
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

                    <p className="mt-4 text-sm font-black text-[#172018]">
                      {feature.title}
                    </p>

                    <p className="mt-2 max-w-sm text-xs leading-5 text-[#747d75]">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* APP */}
        <section
          id="app"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="relative overflow-hidden rounded-[32px] bg-[#244c28] px-6 py-12 text-white shadow-2xl shadow-[#244c28]/15 sm:px-10 lg:px-16 lg:py-16">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-white/[0.035]" />
            <div className="absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-[#76936f]/15 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_.7fr]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b9d1b1]">
                  Buana Mobile
                </p>

                <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">
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

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:-translate-y-1"
                  >
                    <Image
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      alt="Get it on Google Play"
                      width={162}
                      height={48}
                      unoptimized
                    />
                  </a>

                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:-translate-y-1"
                  >
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

              <div className="mx-auto w-full max-w-[300px]">
                <div className="rounded-[36px] border border-white/20 bg-[#132c16] p-2.5 shadow-2xl">
                  <div className="overflow-hidden rounded-[28px] bg-[#f4f6f2]">
                    <div className="flex items-center justify-between bg-white px-4 py-4">
                      <Image
                        src="/logo.png"
                        alt="Buana"
                        width={92}
                        height={32}
                        className="h-7 w-auto object-contain"
                      />

                      <div className="h-8 w-8 rounded-full bg-[#edf2ea]" />
                    </div>

                    <div className="p-3">
                      <div className="rounded-2xl bg-[#244c28] p-4 text-white">
                        <p className="text-[8px] font-bold uppercase tracking-wider text-white/50">
                          Current order
                        </p>

                        <p className="mt-2 text-xs font-black">
                          Delivery #BU1024
                        </p>

                        <p className="mt-1 text-[9px] text-white/60">
                          Your order is on the way
                        </p>

                        <div className="mt-4 h-1 rounded-full bg-white/15">
                          <div className="h-full w-3/4 rounded-full bg-[#b8d3af]" />
                        </div>
                      </div>

                      <p className="mb-2 mt-5 text-[9px] font-black uppercase tracking-wider text-[#6e786f]">
                        Quick access
                      </p>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          ['01', 'Shop'],
                          ['02', 'Service'],
                          ['03', 'Track'],
                        ].map(([number, label]) => (
                          <div
                            key={label}
                            className="rounded-xl bg-white p-3 shadow-sm"
                          >
                            <p className="text-[9px] font-black text-[#37633b]">
                              {number}
                            </p>
                            <p className="mt-3 text-[8px] font-bold text-[#59645b]">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>

                      <p className="mb-2 mt-5 text-[9px] font-black uppercase tracking-wider text-[#6e786f]">
                        Equipment
                      </p>

                      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#edf2ea] text-[9px] font-black text-[#37633b]">
                          EQ
                        </div>

                        <div>
                          <p className="text-[9px] font-black text-[#172018]">
                            Commercial Chiller
                          </p>

                          <p className="mt-1 text-[8px] text-[#909890]">
                            View equipment
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex justify-around border-t border-[#e2e6df] pt-3">
                        {['Home', 'Orders', 'Track', 'Profile'].map(
                          (label, index) => (
                            <div
                              key={label}
                              className="text-center"
                            >
                              <div
                                className={`mx-auto h-1.5 w-1.5 rounded-full ${
                                  index === 0
                                    ? 'bg-[#37633b]'
                                    : 'bg-[#cbd1ca]'
                                }`}
                              />

                              <p className="mt-1.5 text-[7px] font-semibold text-[#8b948c]">
                                {label}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-4xl border-t border-[#dce2d9] pt-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#47704a]">
              BUANA Australia
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-[#172018] sm:text-4xl">
              Everything your operation needs.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#707971] sm:text-base">
              Discover retail products, commercial equipment and
              convenient field service through one connected platform.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#products"
                className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-[#244c28] px-7 text-sm font-bold text-white transition hover:bg-[#193a1d]"
              >
                Browse Products
              </a>

              <a
                href="#app"
                className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-[#d4dcd2] bg-white px-7 text-sm font-bold text-[#314034] transition hover:border-[#9eb09d]"
              >
                Download the App
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#dce2d9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Image
                src="/logo.png"
                alt="Buana"
                width={155}
                height={52}
                className="h-12 w-auto object-contain"
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
                <a
                  href="#products"
                  className="hover:text-[#37633b]"
                >
                  Products
                </a>
                <a
                  href="#equipment"
                  className="hover:text-[#37633b]"
                >
                  Equipment
                </a>
                <a
                  href="#services"
                  className="hover:text-[#37633b]"
                >
                  Services
                </a>
                <a
                  href="#app"
                  className="hover:text-[#37633b]"
                >
                  Mobile App
                </a>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9ba29b]">
                Legal
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-[#626d64]">
                <Link
                  href="/privacy"
                  className="hover:text-[#37633b]"
                >
                  Privacy Policy
                </Link>

                <Link
                  href="/delete-account"
                  className="hover:text-[#37633b]"
                >
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
                  className="hover:text-[#37633b]"
                >
                  Google Play
                </a>

                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#37633b]"
                >
                  App Store
                </a>

                <Link
                  href="/login"
                  className="hover:text-[#37633b]"
                >
                  Staff Login
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-[#e0e5dd] pt-6 text-[10px] font-medium text-[#9ba29b] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} BUANA. All rights reserved.
            </p>

            <p>Retail • Equipment • Service • Australia</p>
          </div>
        </div>
      </footer>
    </div>
  )
}