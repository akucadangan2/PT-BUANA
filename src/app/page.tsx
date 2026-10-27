import type { CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format-price'
import ScrollReveal from '@/components/ScrollReveal'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { getDict } from '@/lib/i18n/server'
import { storeBadges } from '@/lib/i18n/config'

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.buana.app'

const APP_STORE_URL =
  'https://apps.apple.com/au/app/buana/id6815036658'

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

const TruckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-3.5 w-3.5"
  >
    <path d="M3 7h11v8H3z" />
    <path d="M14 10h4l3 3v2h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
)

// Globe with an orbiting courier icon — represents delivery coverage
// across every state in Australia, not just one city.
const GlobeOrbitBadge = () => (
  <div className="relative mx-auto flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24">
    <style>{`
      @keyframes buanaOrbit {
        from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
        to { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
      }
      .buana-orbit-track {
        animation: buanaOrbit 7s linear infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .buana-orbit-track { animation: none; }
      }
    `}</style>

    {/* Globe body */}
    <div className="absolute inset-2 overflow-hidden rounded-full bg-gradient-to-br from-[#3f7a43] to-[#16301a] shadow-inner">
      <div className="absolute inset-0 rounded-full border border-white/15" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
      <div className="absolute inset-[22%] rounded-full border border-white/10" />
    </div>

    {/* Orbit path */}
    <div className="absolute inset-0 rounded-full border border-dashed border-white/20" />

    {/* Orbiting courier icon */}
    <div
      className="buana-orbit-track absolute left-1/2 top-1/2 h-0 w-0"
      style={{ '--orbit-radius': '38px' } as CSSProperties}
    >
      <div className="flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#244c28] shadow-md">
        <TruckIcon />
      </div>
    </div>
  </div>
)

export default async function HomePage() {
  const { lang, t } = await getDict()
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
    <div
      className={`min-h-screen overflow-x-hidden bg-[#f7f8f5] text-[#172018] ${
        lang === 'th' ? 'lang-th' : ''
      }`}
    >

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
              {t.nav.services}
            </a>
            <a href="#products" className="transition hover:text-[#28542c]">
              {t.nav.products}
            </a>
            <a href="#how-it-works" className="transition hover:text-[#28542c]">
              {t.nav.how}
            </a>
            <a href="#app" className="transition hover:text-[#28542c]">
              {t.nav.app}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#products"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#536055] transition hover:bg-white sm:inline-flex"
            >
              {t.nav.catalogue}
            </a>

            <LanguageSwitcher lang={lang} />

            <Link
              href="/login"
              className="rounded-xl bg-[#244c28] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#193a1d] sm:px-5 sm:text-sm"
            >
              {t.nav.signIn}
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
                  {t.hero.badge}
                </div>

                <h1 className="max-w-3xl text-[43px] font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[72px]">
                  {t.hero.title[0]}
                  <br />
                  {t.hero.title[1]}
                  <br />
                  <span className="text-[#37633b]">{t.hero.title[2]}</span>
                </h1>

                <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#667068] sm:mt-7 sm:text-[17px]">
                  {t.hero.body}
                </p>

                <div className="mt-8 grid gap-3 min-[460px]:flex sm:mt-9">
                  <a
                    href="#products"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[#244c28] px-6 text-sm font-bold text-white shadow-lg shadow-[#244c28]/15 transition hover:-translate-y-0.5 hover:bg-[#193a1d]"
                  >
                    {t.hero.cta1}
                    <span className="ml-2">→</span>
                  </a>

                  <a
                    href="#services"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-[#d8dfd5] bg-white px-6 text-sm font-bold text-[#263229] shadow-sm"
                  >
                    {t.hero.cta2}
                  </a>
                </div>

                <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 border-t border-[#dde3da] pt-6 sm:gap-5">
                  {t.hero.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-base font-black sm:text-lg">{stat.value}</p>
                      <p className="mt-1 text-[9px] leading-4 text-[#7a837b] sm:text-[10px]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
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
                          {t.panel.online}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8c958d] sm:text-[10px]">
                        {t.panel.overview}
                      </p>

                      <h3 className="mt-2 text-xl font-black sm:text-2xl">
                        {t.panel.title}
                      </h3>

                      <p className="mt-1 text-[10px] text-[#7a837b] sm:text-[11px]">
                        {t.panel.sub}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                        <div className="rounded-2xl border border-[#e0e5dd] bg-white p-3.5 sm:p-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf2ea] text-xs font-black text-[#37633b]">
                            01
                          </div>

                          <p className="mt-5 text-[9px] font-bold uppercase tracking-wider text-[#909890]">
                            {t.panel.retailLabel}
                          </p>
                          <p className="mt-1 text-xs font-black sm:text-sm">
                            {t.panel.retailValue}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#244c28] p-3.5 text-white sm:p-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-xs font-black">
                            02
                          </div>

                          <p className="mt-5 text-[9px] font-bold uppercase tracking-wider text-white/55">
                            {t.panel.equipLabel}
                          </p>
                          <p className="mt-1 text-xs font-black sm:text-sm">
                            {t.panel.equipValue}
                          </p>
                        </div>

                        <div className="col-span-2 rounded-2xl border border-[#e0e5dd] bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#909890]">
                                {t.panel.current}
                              </p>

                              <p className="mt-1.5 text-xs font-black sm:text-sm">
                                {t.panel.currentValue}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-[#edf4ea] px-2.5 py-1.5 text-[7px] font-black text-[#37633b] sm:text-[9px]">
                              {t.panel.status}
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
                  {t.svc.eyebrow}
                </p>

                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
                  {t.svc.title[0]}
                  <span className="block text-[#37633b]">
                    {t.svc.title[1]}
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-[#6b746c]">
                  {t.svc.body}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[#dde3da] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#8b958c]">
                    01
                  </span>

                  <h3 className="mt-9 text-xl font-black">
                    {t.svc.retail.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#707971]">
                    {t.svc.retail.desc}
                  </p>

                  <a
                    href="#products"
                    className="mt-7 inline-flex text-xs font-black text-[#37633b]"
                  >
                    {t.svc.retail.link}
                  </a>
                </div>

                <div className="rounded-[24px] bg-[#244c28] p-6 text-white transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
                  <span className="text-[10px] font-black tracking-[0.2em] text-white/45">
                    02
                  </span>

                  <h3 className="mt-9 text-xl font-black">
                    {t.svc.equip.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/65">
                    {t.svc.equip.desc}
                  </p>

                  <a
                    href="#equipment"
                    className="mt-7 inline-flex text-xs font-black text-[#d4e7ca]"
                  >
                    {t.svc.equip.link}
                  </a>
                </div>

                <div className="rounded-[24px] border border-[#dde3da] bg-white p-6 sm:col-span-2 sm:p-7">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#8b958c]">
                    03
                  </span>

                  <h3 className="mt-8 text-xl font-black">
                    {t.svc.service.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#707971]">
                    {t.svc.service.desc}
                  </p>

                  <a
                    href="#app"
                    className="mt-6 inline-flex rounded-xl border border-[#d9e0d6] px-5 py-3 text-xs font-black text-[#37633b]"
                  >
                    {t.svc.service.link}
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
                    {t.how.eyebrow}
                  </p>

                  <h2 className="mt-4 max-w-lg text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                    {t.how.title[0]}
                    <span className="block text-[#a9cb9f]">
                      {t.how.title[1]}
                    </span>
                  </h2>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
                    {t.how.body}
                  </p>

                  <a
                    href="#app"
                    className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 text-xs font-black text-[#244c28]"
                  >
                    {t.how.cta}
                  </a>
                </div>

                <div className="border-t border-white/10">
                  {t.how.steps.map((item, index) => (
                    <div
                      key={item.title}
                      className="grid gap-2 border-b border-white/10 py-6 sm:grid-cols-[70px_1fr_auto] sm:items-center"
                    >
                      <p className="text-xs font-black text-[#9fc297]">
                        {String(index + 1).padStart(2, '0')}
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
                {t.prod.eyebrow}
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                {t.prod.title}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#707971]">
                {t.prod.body}
              </p>
            </div>
          </ScrollReveal>

          {/* RETAIL */}
          <div className="mt-10 sm:mt-12">
            <div className="mb-5 flex items-end justify-between border-b border-[#dce2d9] pb-4">
              <div>
                <p className="text-lg font-black">{t.prod.retailTitle}</p>
                <p className="mt-1 text-[11px] text-[#818a82]">
                  {t.prod.retailSub}
                </p>
              </div>

              <p className="hidden text-[9px] font-black uppercase tracking-[0.18em] text-[#a0a7a0] min-[400px]:block">
                {t.prod.latest}
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
                          {t.prod.retailTag}
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
                {t.prod.retailEmpty}
              </div>
            )}
          </div>

          {/* EQUIPMENT */}
          <div id="equipment" className="mt-14 sm:mt-16">
            <div className="mb-5 border-b border-[#dce2d9] pb-4">
              <p className="text-lg font-black">{t.prod.equipTitle}</p>
              <p className="mt-1 text-[11px] text-[#818a82]">
                {t.prod.equipSub}
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
                {t.prod.equipEmpty}
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
                    {t.feat.eyebrow}
                  </p>

                  <h2 className="mt-4 max-w-md text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
                    {t.feat.title}
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2">
                  {t.feat.items.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="border-b border-[#e2e7df] py-6 sm:px-6 sm:[&:nth-child(odd)]:border-r"
                    >
                      <p className="text-[9px] font-black tracking-[0.2em] text-[#87a184]">
                        {String(index + 1).padStart(2, '0')}
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
                  <div className="mb-5 flex items-center gap-4">
                    <GlobeOrbitBadge />

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#b9d1b1] sm:text-[10px]">
                        {t.app.eyebrow}
                      </p>
                      <p className="mt-1 text-xs font-bold text-white/70 sm:text-sm">
                        {t.app.sub}
                      </p>
                    </div>
                  </div>

                  <h2 className="max-w-2xl text-[34px] font-black leading-[1.03] tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                    {t.app.title[0]}
                    <span className="block text-[#c4d9bc]">
                      {t.app.title[1]}
                    </span>
                  </h2>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                    {t.app.body}
                  </p>

                  <div className="mt-7 grid max-w-[390px] grid-cols-1 gap-2.5 min-[390px]:grid-cols-2 sm:mt-8">
                    <a
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[58px] items-center justify-center overflow-hidden rounded-xl bg-black px-3 transition duration-300 hover:-translate-y-1"
                    >
                      <Image
                        src={storeBadges[lang].play}
                        alt={t.app.playAlt}
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
                        src={storeBadges[lang].apple}
                        alt={t.app.appleAlt}
                        width={150}
                        height={50}
                        unoptimized
                        className="h-[39px] w-auto object-contain"
                      />
                    </a>
                  </div>

                  <div className="mt-8 grid max-w-md grid-cols-3 gap-2 border-t border-white/10 pt-6 sm:gap-4">
                    {t.app.points.map((point) => (
                      <div key={point.title}>
                        <p className="text-sm font-black">{point.title}</p>
                        <p className="mt-1 text-[9px] text-white/45">
                          {point.sub}
                        </p>
                      </div>
                    ))}
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
                            {t.mock.title}
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
                              {t.mock.search}
                            </span>
                          </div>
                        </div>

                        {/* CATEGORIES */}
                        <div className="flex gap-2 overflow-hidden border-b border-[#e4e8eb] bg-white px-4 py-2.5">
                          {t.mock.categories.map((category, i) => (
                            <span
                              key={category}
                              className={
                                i === 1
                                  ? 'shrink-0 rounded-full bg-[#11847d] px-4 py-2 text-[9px] font-semibold text-white'
                                  : 'shrink-0 rounded-full border border-[#d9dee4] px-3 py-2 text-[9px] font-semibold text-[#718096]'
                              }
                            >
                              {category}
                            </span>
                          ))}
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
                              {t.mock.retail}
                            </p>
                          </div>

                          <div className="text-center text-[#4d5854]">
                            <div className="mx-auto flex h-7 items-center justify-center">
                              <BoxIcon />
                            </div>
                            <p className="mt-1 text-[7px]">
                              {t.mock.equipment}
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
                              {t.mock.orders}
                            </p>
                          </div>

                          <div className="text-center text-[#4d5854]">
                            <div className="mx-auto flex h-7 items-center justify-center">
                              <ToolIcon />
                            </div>
                            <p className="mt-1 text-[7px]">
                              {t.mock.service}
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
                              {t.mock.profile}
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
                {t.cta.eyebrow}
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                {t.cta.title}
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#707971] sm:text-base">
                {t.cta.body}
              </p>

              <div className="mx-auto mt-8 grid max-w-md gap-3 min-[430px]:grid-cols-2">
                <a
                  href="#products"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-[#244c28] px-6 text-sm font-bold text-white"
                >
                  {t.cta.browse}
                </a>

                <a
                  href="#app"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-[#d4dcd2] bg-white px-6 text-sm font-bold text-[#314034]"
                >
                  {t.cta.download}
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
                {t.foot.tagline}
              </p>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9ba29b]">
                {t.foot.explore}
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-[#626d64]">
                <a href="#products">{t.foot.products}</a>
                <a href="#equipment">{t.foot.equipment}</a>
                <a href="#services">{t.foot.services}</a>
                <a href="#app">{t.foot.app}</a>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9ba29b]">
                {t.foot.legal}
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-[#626d64]">
                <Link href="/privacy">
                  {t.foot.privacy}
                </Link>

                <Link href="/delete-account">
                  {t.foot.deleteAccount}
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9ba29b]">
                {t.foot.account}
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-[#626d64]">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.foot.play}
                </a>

                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.foot.apple}
                </a>

                <Link href="/login">
                  {t.foot.staff}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-[#e0e5dd] pt-6 text-[10px] font-medium text-[#9ba29b] sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {t.foot.copy.replace('{year}', String(new Date().getFullYear()))}
            </p>

            <p>
              {t.foot.line}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}