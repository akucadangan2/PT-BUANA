import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format-price'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.buana.app'
const APP_STORE_URL = 'https://apps.apple.com/app/buana/id0000000000' // TODO: update once live on the App Store

const features = [
  {
    icon: '📍',
    title: 'Real-Time Tracking',
    desc: 'Follow your courier and technician live from dispatch to arrival.',
  },
  {
    icon: '🛡️',
    title: 'Official Warranty',
    desc: 'Equipment purchases are recorded with clear warranty information.',
  },
  {
    icon: '📅',
    title: 'Flexible Booking',
    desc: 'Book equipment service and maintenance directly from the Buana app.',
  },
  {
    icon: '🚚',
    title: 'Reliable Delivery',
    desc: 'Orders are handled by our delivery network across Australia.',
  },
  {
    icon: '💬',
    title: 'Direct Chat',
    desc: 'Communicate directly with your assigned courier or technician.',
  },
  {
    icon: '💳',
    title: 'Secure Checkout',
    desc: 'Simple and secure card payments powered by Stripe.',
  },
  {
    icon: '🏪',
    title: 'Vendor Marketplace',
    desc: 'Discover selected secondhand equipment from trusted vendors.',
  },
  {
    icon: '🌏',
    title: 'Built for Australia',
    desc: 'Retail, equipment and field service in one connected platform.',
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
    <div className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-950">

      {/* =========================================================
          GLOBAL ANIMATION
      ========================================================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html {
              scroll-behavior: smooth;
            }

            @keyframes buanaDrive {
              0% {
                left: -90px;
                transform: translateY(0);
              }
              25% {
                transform: translateY(-2px);
              }
              50% {
                transform: translateY(0);
              }
              75% {
                transform: translateY(-2px);
              }
              100% {
                left: calc(100% + 30px);
                transform: translateY(0);
              }
            }

            @keyframes buanaWalk {
              0% {
                left: -60px;
                transform: translateY(0) rotate(-2deg);
              }
              25% {
                transform: translateY(-4px) rotate(2deg);
              }
              50% {
                transform: translateY(0) rotate(-2deg);
              }
              75% {
                transform: translateY(-4px) rotate(2deg);
              }
              100% {
                left: calc(100% + 20px);
                transform: translateY(0) rotate(-2deg);
              }
            }

            @keyframes buanaCloud {
              from {
                transform: translateX(-80px);
              }
              to {
                transform: translateX(calc(100vw + 120px));
              }
            }

            @keyframes buanaFloat {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-8px);
              }
            }

            @keyframes buanaPulse {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: .55;
                transform: scale(.82);
              }
            }

            @keyframes buanaPackage {
              0%, 100% {
                transform: translateY(0) rotate(-2deg);
              }
              50% {
                transform: translateY(-7px) rotate(2deg);
              }
            }

            @keyframes buanaTool {
              0%, 100% {
                transform: rotate(-8deg);
              }
              50% {
                transform: rotate(12deg);
              }
            }

            @keyframes buanaDash {
              to {
                stroke-dashoffset: -40;
              }
            }

            .buana-truck {
              position: absolute;
              bottom: 22px;
              left: -90px;
              animation: buanaDrive 11s linear infinite;
            }

            .buana-tech {
              position: absolute;
              bottom: 22px;
              left: -60px;
              animation: buanaWalk 14s linear infinite;
              animation-delay: 2.5s;
            }

            .buana-cloud-one {
              animation: buanaCloud 28s linear infinite;
            }

            .buana-cloud-two {
              animation: buanaCloud 34s linear infinite;
              animation-delay: -15s;
            }

            .buana-float {
              animation: buanaFloat 4s ease-in-out infinite;
            }

            .buana-package {
              animation: buanaPackage 3s ease-in-out infinite;
            }

            .buana-tool {
              animation: buanaTool 1.7s ease-in-out infinite;
            }

            .buana-pulse {
              animation: buanaPulse 1.7s ease-in-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              *,
              *::before,
              *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                scroll-behavior: auto !important;
              }
            }
          `,
        }}
      />

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <a href="#" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black tracking-tight text-white shadow-sm shadow-blue-600/20 transition-transform group-hover:scale-105">
              B
            </div>

            <div className="leading-none">
              <p className="text-[17px] font-black tracking-[-0.03em] text-slate-950">
                BUANA
              </p>
              <p className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Australia
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a href="#products" className="transition hover:text-blue-600">
              Products
            </a>

            <a href="#services" className="transition hover:text-blue-600">
              Services
            </a>

            <a href="#how-it-works" className="transition hover:text-blue-600">
              How it works
            </a>

            <a href="#app" className="transition hover:text-blue-600">
              Mobile App
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#products"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Browse
            </a>

            <Link
              href="/login"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              Sign In
            </Link>
          </div>

        </div>
      </header>

      <main>

        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative overflow-hidden bg-white">

          <div className="absolute left-[-120px] top-[-160px] h-[360px] w-[360px] rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute right-[-160px] top-[120px] h-[380px] w-[380px] rounded-full bg-cyan-100/60 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:pb-20 lg:pt-24">

            {/* HERO COPY */}
            <div className="relative z-10">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <span className="buana-pulse h-2 w-2 rounded-full bg-blue-600" />
                Retail • Equipment • Field Service
              </div>

              <h1 className="max-w-3xl text-[42px] font-black leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[68px]">
                Everything your
                <span className="block text-blue-600">
                  business needs.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[16px] leading-7 text-slate-600 sm:text-lg">
                Order food and beverage products, purchase commercial
                refrigeration equipment, and book experienced technicians —
                all through one connected Buana platform.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#products"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-blue-600 px-7 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Explore Products
                  <span className="ml-2">→</span>
                </a>

                <a
                  href="#services"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600"
                >
                  Book a Service
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">

                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-700">
                    ✓
                  </span>
                  Live tracking
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-700">
                    ✓
                  </span>
                  Secure checkout
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-700">
                    ✓
                  </span>
                  Australia-wide support
                </div>

              </div>
            </div>

            {/* =====================================================
                HERO GAME / DELIVERY SCENE
            ===================================================== */}
            <div className="relative mx-auto w-full max-w-[600px]">

              <div className="relative h-[410px] overflow-hidden rounded-[30px] border border-slate-200 bg-gradient-to-b from-sky-100 via-sky-50 to-white shadow-2xl shadow-slate-200/60 sm:h-[480px]">

                {/* Status top */}
                <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm backdrop-blur sm:left-6 sm:right-6 sm:top-6">

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-base">
                      🚚
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Live order
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-slate-900 sm:text-sm">
                        Delivery is on the way
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
                    <span className="buana-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    LIVE
                  </div>

                </div>

                {/* Clouds */}
                <div className="buana-cloud-one absolute left-0 top-[105px] text-4xl opacity-70">
                  ☁️
                </div>

                <div className="buana-cloud-two absolute left-0 top-[150px] text-3xl opacity-50">
                  ☁️
                </div>

                {/* Sun */}
                <div className="buana-float absolute right-8 top-[105px] flex h-14 w-14 items-center justify-center rounded-full bg-amber-300 shadow-lg shadow-amber-200/60">
                  ☀️
                </div>

                {/* Skyline */}
                <div className="absolute bottom-[92px] left-0 right-0 flex items-end justify-around px-3 opacity-80">

                  <div className="h-24 w-16 rounded-t-lg bg-slate-200">
                    <div className="grid grid-cols-2 gap-2 p-3">
                      <span className="h-3 rounded-sm bg-sky-300" />
                      <span className="h-3 rounded-sm bg-sky-300" />
                      <span className="h-3 rounded-sm bg-sky-300" />
                      <span className="h-3 rounded-sm bg-sky-300" />
                    </div>
                  </div>

                  <div className="h-32 w-20 rounded-t-xl bg-slate-300">
                    <div className="grid grid-cols-2 gap-2 p-4">
                      <span className="h-3 rounded-sm bg-white/70" />
                      <span className="h-3 rounded-sm bg-white/70" />
                      <span className="h-3 rounded-sm bg-white/70" />
                      <span className="h-3 rounded-sm bg-white/70" />
                      <span className="h-3 rounded-sm bg-white/70" />
                      <span className="h-3 rounded-sm bg-white/70" />
                    </div>
                  </div>

                  <div className="h-20 w-24 rounded-t-xl bg-blue-100">
                    <div className="mt-4 text-center text-[10px] font-black tracking-widest text-blue-700">
                      BUANA
                    </div>
                  </div>

                  <div className="h-28 w-16 rounded-t-lg bg-slate-200">
                    <div className="grid grid-cols-2 gap-2 p-3">
                      <span className="h-3 rounded-sm bg-sky-300" />
                      <span className="h-3 rounded-sm bg-sky-300" />
                      <span className="h-3 rounded-sm bg-sky-300" />
                      <span className="h-3 rounded-sm bg-sky-300" />
                    </div>
                  </div>

                </div>

                {/* Road */}
                <div className="absolute bottom-0 left-0 right-0 h-[94px] bg-slate-800">

                  <div className="absolute left-0 right-0 top-[44px] flex gap-8 overflow-hidden">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-1 w-12 shrink-0 rounded-full bg-white/60"
                      />
                    ))}
                  </div>

                  {/* Delivery Van */}
                  <div className="buana-truck z-20">
                    <div className="relative h-[50px] w-[90px]">

                      <div className="absolute bottom-2 left-0 h-8 w-[58px] rounded-lg bg-blue-600 shadow-lg">
                        <span className="absolute left-3 top-2 text-[10px] font-black text-white">
                          BUANA
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-[54px] h-7 w-8 rounded-r-lg rounded-t-lg bg-blue-500">
                        <div className="absolute right-1 top-1 h-3 w-4 rounded-sm bg-sky-100" />
                      </div>

                      <div className="absolute bottom-0 left-3 h-4 w-4 rounded-full border-[3px] border-slate-400 bg-slate-950" />
                      <div className="absolute bottom-0 right-2 h-4 w-4 rounded-full border-[3px] border-slate-400 bg-slate-950" />

                    </div>
                  </div>

                  {/* Technician */}
                  <div className="buana-tech z-20">
                    <div className="relative h-[58px] w-[42px]">

                      <div className="absolute left-[12px] top-0 text-[25px]">
                        👨‍🔧
                      </div>

                      <div className="buana-tool absolute -right-3 top-4 text-lg">
                        🔧
                      </div>

                      <div className="absolute bottom-0 left-0 rounded-md bg-amber-500 px-1.5 py-1 text-[9px] shadow">
                        🧰
                      </div>

                    </div>
                  </div>

                </div>

                {/* Floating package */}
                <div className="buana-package absolute bottom-[118px] left-5 z-20 rounded-2xl border border-white bg-white/90 p-3 shadow-xl sm:left-7">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Order
                      </p>
                      <p className="text-[11px] font-bold text-slate-900">
                        Packed & ready
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technician card */}
                <div className="buana-float absolute bottom-[120px] right-4 z-20 rounded-2xl border border-white bg-white/90 p-3 shadow-xl sm:right-7">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔧</span>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Service
                      </p>
                      <p className="text-[11px] font-bold text-slate-900">
                        Technician ready
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating desktop card */}
              <div className="absolute -bottom-5 left-1/2 z-30 hidden w-[82%] -translate-x-1/2 items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl sm:flex">

                <div>
                  <p className="text-xs font-bold text-slate-900">
                    One platform. Complete visibility.
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Order → Track → Receive → Service
                  </p>
                </div>

                <div className="flex -space-x-2">
                  {['📦', '🚚', '📍', '🔧'].map((item) => (
                    <div
                      key={item}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =========================================================
            TRUST STRIP
        ========================================================= */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">

            <div className="px-4 py-7 text-center">
              <p className="text-2xl font-black tracking-tight text-slate-950">
                400+
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                Equipment Models
              </p>
            </div>

            <div className="px-4 py-7 text-center">
              <p className="text-2xl font-black tracking-tight text-slate-950">
                Live
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                Delivery Tracking
              </p>
            </div>

            <div className="px-4 py-7 text-center">
              <p className="text-2xl font-black tracking-tight text-slate-950">
                Trusted
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                Equipment Brands
              </p>
            </div>

            <div className="px-4 py-7 text-center">
              <p className="text-2xl font-black tracking-tight text-slate-950">
                Secure
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                Online Payments
              </p>
            </div>

          </div>
        </section>

        {/* =========================================================
            SERVICES
        ========================================================= */}
        <section
          id="services"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >

          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              What we do
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
              More than a supplier.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              From everyday stock to commercial equipment and after-sales
              service, Buana keeps your operation connected.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">

            {/* Retail */}
            <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">

              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-100 transition duration-500 group-hover:scale-125" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                  🛒
                </div>

                <p className="mt-7 text-xl font-black tracking-tight text-slate-950">
                  Retail Supply
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Food, beverage and ingredient products ready for convenient
                  ordering and business delivery.
                </p>

                <a
                  href="#products"
                  className="mt-6 inline-flex items-center text-sm font-bold text-blue-600"
                >
                  Browse retail
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>

            </div>

            {/* Equipment */}
            <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">

              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-600/30 blur-xl transition duration-500 group-hover:scale-125" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                  ❄️
                </div>

                <p className="mt-7 text-xl font-black tracking-tight">
                  Commercial Equipment
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Refrigeration equipment including chillers and freezers from
                  trusted commercial brands.
                </p>

                <a
                  href="#equipment"
                  className="mt-6 inline-flex items-center text-sm font-bold text-sky-300"
                >
                  View equipment
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>

            </div>

            {/* Service */}
            <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">

              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-100 transition duration-500 group-hover:scale-125" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  🔧
                </div>

                <p className="mt-7 text-xl font-black tracking-tight text-slate-950">
                  Service & Maintenance
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Book a technician, follow their journey and keep your
                  equipment running with organised service support.
                </p>

                <a
                  href="#app"
                  className="mt-6 inline-flex items-center text-sm font-bold text-blue-600"
                >
                  Book via app
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================
            HOW IT WORKS / GAME SECTION
        ========================================================= */}
        <section
          id="how-it-works"
          className="overflow-hidden bg-slate-950 py-20 text-white lg:py-28"
        >

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">
                  Simple from start to finish
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  From your phone
                  <span className="block text-sky-400">
                    to your doorstep.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Order what you need or request a technician. Buana keeps you
                  updated throughout the journey.
                </p>

                <div className="mt-9 space-y-3">

                  {[
                    ['01', 'Place your order', 'Choose products or request equipment service.'],
                    ['02', 'We prepare & dispatch', 'Your order or technician is assigned and prepared.'],
                    ['03', 'Track everything live', 'Follow progress and location directly from the app.'],
                    ['04', 'Delivered & supported', 'Receive your order or complete your service visit.'],
                  ].map(([number, title, desc]) => (
                    <div
                      key={number}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black">
                        {number}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          {title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* SERVICE GAME CARD */}
              <div className="relative">

                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-[#172554] to-[#020617] p-5 shadow-2xl sm:p-7">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-400">
                        Service mission
                      </p>
                      <p className="mt-1 text-sm font-bold">
                        Technician on the way
                      </p>
                    </div>

                    <div className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-400">
                      ● LIVE
                    </div>
                  </div>

                  <div className="relative mt-6 h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-sky-300 to-sky-100">

                    {/* Clouds */}
                    <div className="buana-cloud-one absolute top-8 text-3xl">
                      ☁️
                    </div>

                    <div className="buana-cloud-two absolute top-20 text-2xl opacity-70">
                      ☁️
                    </div>

                    {/* Destination */}
                    <div className="absolute bottom-[67px] right-5">

                      <div className="relative h-[105px] w-[110px] rounded-t-xl bg-white shadow-xl">

                        <div className="absolute -top-6 left-[-6px] h-8 w-[122px] rounded-t-lg bg-blue-600" />

                        <p className="pt-4 text-center text-[10px] font-black tracking-widest text-blue-700">
                          CUSTOMER
                        </p>

                        <div className="mx-auto mt-3 h-12 w-8 rounded-t-md bg-slate-700" />

                      </div>

                      <div className="absolute -left-4 bottom-0 text-3xl">
                        🌳
                      </div>

                    </div>

                    {/* Road */}
                    <div className="absolute bottom-0 left-0 right-0 h-[68px] bg-slate-700">

                      <div className="absolute left-0 right-0 top-8 flex gap-5 overflow-hidden">
                        {Array.from({ length: 14 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-[3px] w-10 shrink-0 bg-white/60"
                          />
                        ))}
                      </div>

                      <div className="buana-tech z-20">
                        <div className="relative h-[55px] w-12">
                          <span className="absolute left-2 top-0 text-3xl">
                            👨‍🔧
                          </span>
                          <span className="buana-tool absolute -right-2 top-4 text-xl">
                            🔧
                          </span>
                          <span className="absolute bottom-0 left-0 text-xl">
                            🧰
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-2 shadow-lg">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        ETA
                      </p>
                      <p className="mt-0.5 text-xs font-black text-slate-900">
                        12 minutes
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-white/[0.06] p-3">
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 text-[11px] font-bold text-white">
                        On the way
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.06] p-3">
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Service
                      </p>
                      <p className="mt-1 text-[11px] font-bold text-white">
                        Maintenance
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.06] p-3">
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        Tracking
                      </p>
                      <p className="mt-1 text-[11px] font-bold text-emerald-400">
                        Active
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
            PRODUCTS
        ========================================================= */}
        <section
          id="products"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Catalogue
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Latest products
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                A preview of products currently available. Open the Buana app
                for the complete catalogue.
              </p>
            </div>

            <a
              href="#app"
              className="inline-flex w-fit items-center text-sm font-bold text-blue-600"
            >
              View full catalogue in app
              <span className="ml-2">→</span>
            </a>

          </div>

          {/* Retail */}
          <div className="mt-12">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                  🛒
                </div>

                <div>
                  <p className="text-sm font-black text-slate-950">
                    Retail
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Food & beverage supply
                  </p>
                </div>
              </div>
            </div>

            {retailProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

                {retailProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl sm:p-3"
                  >

                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:rounded-2xl">

                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-4xl">
                          📦
                        </span>
                      )}

                      <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-slate-600 shadow-sm backdrop-blur sm:left-3 sm:top-3 sm:text-[9px]">
                        Retail
                      </div>

                    </div>

                    <div className="px-1 pb-2 pt-3 sm:px-2 sm:pb-3 sm:pt-4">
                      <p className="line-clamp-2 min-h-[36px] text-xs font-bold leading-[18px] text-slate-900 sm:text-sm">
                        {p.name}
                      </p>

                      <p className="mt-2 text-sm font-black text-blue-600 sm:text-base">
                        {formatPrice(Number(p.price))}
                      </p>
                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <span className="text-3xl">📦</span>
                <p className="mt-3 text-sm font-bold text-slate-700">
                  Retail products coming soon.
                </p>
              </div>
            )}

          </div>

          {/* Equipment */}
          <div id="equipment" className="mt-14">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                ❄️
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">
                  Equipment
                </p>
                <p className="text-[11px] text-slate-500">
                  Commercial refrigeration
                </p>
              </div>
            </div>

            {equipmentProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

                {equipmentProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl sm:p-3"
                  >

                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:rounded-2xl">

                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-4xl">
                          ❄️
                        </span>
                      )}

                      <div className="absolute left-2 top-2 rounded-full bg-slate-950/90 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur sm:left-3 sm:top-3 sm:text-[9px]">
                        Equipment
                      </div>

                    </div>

                    <div className="px-1 pb-2 pt-3 sm:px-2 sm:pb-3 sm:pt-4">

                      {p.brand && (
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-[10px]">
                          {p.brand}
                        </p>
                      )}

                      <p className="line-clamp-2 min-h-[36px] text-xs font-bold leading-[18px] text-slate-900 sm:text-sm">
                        {p.name}
                      </p>

                      <p className="mt-2 text-sm font-black text-blue-600 sm:text-base">
                        {formatPrice(Number(p.price))}
                      </p>

                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <span className="text-3xl">❄️</span>
                <p className="mt-3 text-sm font-bold text-slate-700">
                  Equipment catalogue coming soon.
                </p>
              </div>
            )}

          </div>
        </section>

        {/* =========================================================
            WHY BUANA
        ========================================================= */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Connected experience
              </p>

              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Built to make ordering and service easier.
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg sm:rounded-3xl sm:p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-xl">
                    {feature.icon}
                  </div>

                  <p className="mt-5 text-sm font-black text-slate-950">
                    {feature.title}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {feature.desc}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* =========================================================
            APP DOWNLOAD
        ========================================================= */}
        <section
          id="app"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >

          <div className="relative overflow-hidden rounded-[30px] bg-blue-600 px-5 py-10 text-white shadow-2xl shadow-blue-600/20 sm:px-10 sm:py-14 lg:px-16 lg:py-16">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-2xl" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-900/20 blur-2xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_.8fr]">

              <div>
                <div className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-blue-100">
                  Buana Mobile App
                </div>

                <h2 className="mt-5 max-w-xl text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                  Your orders and services,
                  <span className="block text-cyan-200">
                    always in your pocket.
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100 sm:text-base">
                  Browse products, order equipment, track deliveries, book
                  technicians and communicate directly from your phone.
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

              {/* PHONE MOCKUP */}
              <div className="relative mx-auto w-full max-w-[300px]">

                <div className="buana-float rounded-[38px] border-[7px] border-slate-950 bg-white p-2 shadow-2xl">

                  <div className="overflow-hidden rounded-[28px] bg-slate-50">

                    <div className="flex items-center justify-between bg-white px-4 py-4">
                      <div>
                        <p className="text-[9px] font-medium text-slate-400">
                          Welcome to
                        </p>
                        <p className="text-sm font-black text-slate-950">
                          BUANA
                        </p>
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm">
                        👤
                      </div>
                    </div>

                    <div className="p-3">

                      <div className="rounded-2xl bg-blue-600 p-4 text-white">
                        <p className="text-[9px] font-medium text-blue-200">
                          Track your order
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black">
                              Delivery #BU1024
                            </p>
                            <p className="mt-1 text-[9px] text-blue-100">
                              Courier is on the way
                            </p>
                          </div>

                          <span className="text-2xl">
                            🚚
                          </span>
                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
                          <div className="h-full w-3/4 rounded-full bg-white" />
                        </div>
                      </div>

                      <p className="mb-2 mt-5 text-[10px] font-black text-slate-900">
                        Quick access
                      </p>

                      <div className="grid grid-cols-3 gap-2">

                        {[
                          ['🛒', 'Shop'],
                          ['🔧', 'Service'],
                          ['📍', 'Track'],
                        ].map(([icon, label]) => (
                          <div
                            key={label}
                            className="rounded-xl bg-white p-3 text-center shadow-sm"
                          >
                            <p className="text-lg">
                              {icon}
                            </p>
                            <p className="mt-1 text-[8px] font-bold text-slate-700">
                              {label}
                            </p>
                          </div>
                        ))}

                      </div>

                      <p className="mb-2 mt-5 text-[10px] font-black text-slate-900">
                        Popular equipment
                      </p>

                      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-xl">
                          ❄️
                        </div>

                        <div>
                          <p className="text-[9px] font-black text-slate-900">
                            Commercial Chiller
                          </p>
                          <p className="mt-1 text-[8px] text-slate-400">
                            View equipment
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-around border-t border-slate-100 pt-3 text-center">
                        {[
                          ['⌂', 'Home'],
                          ['▦', 'Orders'],
                          ['◉', 'Tracking'],
                          ['☻', 'Profile'],
                        ].map(([icon, label]) => (
                          <div key={label}>
                            <p className="text-xs text-blue-600">
                              {icon}
                            </p>
                            <p className="mt-1 text-[7px] font-medium text-slate-400">
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
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}
        <section className="px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pb-28">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              🇦🇺
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Ready to get started?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Discover products, commercial equipment and convenient service
              support with Buana.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <a
                href="#products"
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-blue-600 px-7 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Browse Products
              </a>

              <a
                href="#app"
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 text-sm font-bold text-slate-800 transition hover:border-blue-200 hover:text-blue-600"
              >
                Download the App
              </a>

            </div>

          </div>
        </section>

      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer
        id="contact"
        className="border-t border-slate-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
                  B
                </div>

                <div>
                  <p className="font-black tracking-tight text-slate-950">
                    BUANA
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Australia
                  </p>
                </div>

              </div>

              <p className="mt-4 max-w-[260px] text-xs leading-5 text-slate-500">
                Retail, commercial equipment and field service — connected in
                one platform.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Explore
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
                <a href="#products" className="hover:text-blue-600">
                  Products
                </a>
                <a href="#equipment" className="hover:text-blue-600">
                  Equipment
                </a>
                <a href="#services" className="hover:text-blue-600">
                  Services
                </a>
                <a href="#app" className="hover:text-blue-600">
                  Mobile App
                </a>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Legal
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
                <Link href="/privacy" className="hover:text-blue-600">
                  Privacy Policy
                </Link>

                <Link
                  href="/delete-account"
                  className="hover:text-blue-600"
                >
                  Account Deletion
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Account
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  Google Play
                </a>

                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  App Store
                </a>

                <Link
                  href="/login"
                  className="hover:text-blue-600"
                >
                  Staff Login
                </Link>
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} BUANA. All rights reserved.
            </p>

            <p>
              Retail • Equipment • Service
            </p>

          </div>

        </div>
      </footer>

    </div>
  )
}

