'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.replace('/admin/dashboard')
      }
    }

    checkSession()
  }, [router])

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Email dan password wajib diisi.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        if (error.message.toLowerCase().includes('invalid login')) {
          setError('Email atau password yang Anda masukkan salah.')
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          setError('Email belum dikonfirmasi.')
        } else {
          setError('Gagal masuk. Silakan coba kembali.')
        }

        return
      }

      router.replace('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Terjadi gangguan. Periksa koneksi internet Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fa]">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.08)] lg:grid-cols-[1.05fr_0.95fr]">

          {/* LEFT */}
          <section className="relative hidden min-h-[650px] overflow-hidden bg-[#101828] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            {/* Glow */}
            <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                System Operational
              </div>

              <h1 className="mt-8 max-w-md font-display text-4xl font-semibold leading-tight tracking-tight">
                Kelola operasional
                <span className="block text-white/50">
                  dalam satu dashboard.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/50">
                Pantau pesanan, pelanggan, produk, booking service, pengiriman,
                dan aktivitas operasional Buana secara terpusat.
              </p>
            </div>

            {/* PIXEL SERVICE ANIMATION */}
            <div className="relative z-10 flex flex-1 items-center justify-center py-12">
              <div className="service-scene">
                <div className="cloud cloud-one">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="cloud cloud-two">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="service-sign">
                  <span className="service-dot" />
                  MAINTENANCE CREW
                </div>

                <div className="pipe">
                  <div className="pipe-head" />
                  <div className="pipe-body" />
                </div>

                <div className="pixel-worker">
                  <div className="worker-hat" />
                  <div className="worker-head">
                    <div className="worker-eye" />
                    <div className="worker-nose" />
                  </div>

                  <div className="worker-body" />

                  <div className="worker-arm worker-arm-left" />
                  <div className="worker-arm worker-arm-right">
                    <div className="wrench">
                      <div className="wrench-head" />
                      <div className="wrench-stick" />
                    </div>
                  </div>

                  <div className="worker-leg worker-leg-left" />
                  <div className="worker-leg worker-leg-right" />
                </div>

                <div className="spark spark-one">✦</div>
                <div className="spark spark-two">✦</div>
                <div className="spark spark-three">✦</div>

                <div className="platform">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="brick" />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/40">
              <span>Buana Operations Panel</span>
              <span>Secure Access</span>
            </div>
          </section>

          {/* RIGHT / LOGIN */}
          <section className="flex min-h-[650px] items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-[420px]">
              {/* Mobile Logo */}
              <div className="mb-10 lg:hidden">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-sm">
                  B
                </div>
              </div>

              <div className="mb-8">
                <div className="mb-5 hidden h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-sm lg:flex">
                  B
                </div>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Buana Admin
                </p>

                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
                  Selamat datang kembali
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Masuk menggunakan akun administrator untuk melanjutkan ke
                  dashboard operasional.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* ERROR */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold">
                      !
                    </div>

                    <p className="leading-5">{error}</p>
                  </div>
                )}

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    Email
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted transition-colors group-focus-within:text-primary">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </div>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@buana.my.id"
                      autoComplete="email"
                      disabled={loading}
                      required
                      className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-sm text-ink outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-ink"
                    >
                      Password
                    </label>
                  </div>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted transition-colors group-focus-within:text-primary">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="5" y="10" width="14" height="10" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      disabled={loading}
                      required
                      className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-12 text-sm text-ink outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted transition-colors hover:text-ink disabled:cursor-not-allowed"
                    >
                      {showPassword ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="m3 3 18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 4.24A10.9 10.9 0 0 1 12 4c5 0 9 4 10 8a11.5 11.5 0 0 1-2.1 4.2" />
                          <path d="M6.6 6.6C4.2 8 2.7 10 2 12c1 4 5 8 10 8 1.5 0 2.8-.3 4-.8" />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Memverifikasi akun...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Masuk ke Dashboard

                      <svg
                        className="transition-transform group-hover:translate-x-1"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>

                <span>Koneksi terenkripsi & akses terbatas</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* PIXEL ANIMATION STYLE */}
      <style jsx>{`
        .service-scene {
          position: relative;
          width: 420px;
          height: 300px;
        }

        .service-sign {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
        }

        .service-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #34d399;
          box-shadow: 0 0 12px #34d399;
          animation: serviceBlink 1.5s infinite;
        }

        .pixel-worker {
          position: absolute;
          left: 145px;
          bottom: 60px;
          width: 100px;
          height: 150px;
          animation: workerBounce 1.4s ease-in-out infinite;
        }

        .worker-hat {
          position: absolute;
          left: 22px;
          top: 0;
          width: 58px;
          height: 20px;
          background: #ef4444;
          border-radius: 14px 14px 2px 2px;
          box-shadow: -10px 12px 0 -5px #ef4444;
        }

        .worker-head {
          position: absolute;
          left: 29px;
          top: 18px;
          width: 48px;
          height: 43px;
          border-radius: 8px 12px 12px 8px;
          background: #f4bd8a;
        }

        .worker-eye {
          position: absolute;
          right: 9px;
          top: 11px;
          width: 5px;
          height: 7px;
          background: #111827;
        }

        .worker-nose {
          position: absolute;
          right: -7px;
          top: 18px;
          width: 12px;
          height: 11px;
          border-radius: 3px;
          background: #f4bd8a;
        }

        .worker-body {
          position: absolute;
          left: 24px;
          top: 59px;
          width: 58px;
          height: 55px;
          border-radius: 8px 8px 3px 3px;
          background: #2563eb;
          box-shadow: inset 0 16px 0 #ef4444;
        }

        .worker-arm {
          position: absolute;
          top: 68px;
          width: 18px;
          height: 48px;
          border-radius: 8px;
          background: #f4bd8a;
          transform-origin: top center;
        }

        .worker-arm-left {
          left: 10px;
          transform: rotate(8deg);
        }

        .worker-arm-right {
          right: 0;
          animation: serviceArm 1.2s ease-in-out infinite;
        }

        .worker-leg {
          position: absolute;
          top: 108px;
          width: 23px;
          height: 35px;
          background: #1d4ed8;
        }

        .worker-leg::after {
          content: '';
          position: absolute;
          bottom: -7px;
          width: 32px;
          height: 12px;
          border-radius: 4px;
          background: #6b4423;
        }

        .worker-leg-left {
          left: 25px;
        }

        .worker-leg-right {
          right: 17px;
        }

        .wrench {
          position: absolute;
          right: -12px;
          bottom: -34px;
          width: 30px;
          height: 60px;
        }

        .wrench-stick {
          position: absolute;
          left: 12px;
          top: 16px;
          width: 7px;
          height: 43px;
          border-radius: 4px;
          background: #d1d5db;
        }

        .wrench-head {
          position: absolute;
          left: 4px;
          top: 0;
          width: 23px;
          height: 23px;
          border: 6px solid #d1d5db;
          border-top-color: transparent;
          border-radius: 50%;
        }

        .pipe {
          position: absolute;
          right: 70px;
          bottom: 52px;
          width: 60px;
          height: 110px;
        }

        .pipe-head {
          position: absolute;
          top: 0;
          left: -9px;
          width: 77px;
          height: 31px;
          border-radius: 5px;
          background: #22c55e;
          box-shadow:
            inset 0 -7px 0 rgba(0, 0, 0, 0.12),
            inset 7px 0 0 rgba(255, 255, 255, 0.08);
        }

        .pipe-body {
          position: absolute;
          top: 28px;
          left: 2px;
          width: 56px;
          height: 82px;
          background: #16a34a;
          box-shadow:
            inset -10px 0 0 rgba(0, 0, 0, 0.12),
            inset 8px 0 0 rgba(255, 255, 255, 0.06);
        }

        .platform {
          position: absolute;
          left: 15px;
          right: 15px;
          bottom: 25px;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 3px;
        }

        .brick {
          position: relative;
          height: 36px;
          border-radius: 3px;
          background: #b45309;
          border: 2px solid #78350f;
          box-shadow: inset 0 6px 0 rgba(255, 255, 255, 0.08);
        }

        .brick::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(120, 53, 15, 0.7);
        }

        .cloud {
          position: absolute;
          opacity: 0.16;
          animation: cloudMove 8s ease-in-out infinite alternate;
        }

        .cloud span {
          position: absolute;
          display: block;
          border-radius: 999px;
          background: white;
        }

        .cloud span:nth-child(1) {
          width: 50px;
          height: 18px;
          left: 0;
          top: 15px;
        }

        .cloud span:nth-child(2) {
          width: 25px;
          height: 25px;
          left: 12px;
          top: 3px;
        }

        .cloud span:nth-child(3) {
          width: 30px;
          height: 30px;
          left: 28px;
          top: 0;
        }

        .cloud-one {
          left: 30px;
          top: 75px;
        }

        .cloud-two {
          right: 85px;
          top: 85px;
          transform: scale(0.7);
          animation-delay: -4s;
        }

        .spark {
          position: absolute;
          color: #fbbf24;
          font-size: 18px;
          opacity: 0;
        }

        .spark-one {
          right: 118px;
          bottom: 150px;
          animation: spark 1.2s infinite;
        }

        .spark-two {
          right: 92px;
          bottom: 170px;
          animation: spark 1.2s 0.4s infinite;
        }

        .spark-three {
          right: 132px;
          bottom: 184px;
          animation: spark 1.2s 0.8s infinite;
        }

        @keyframes workerBounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes serviceArm {
          0%,
          100% {
            transform: rotate(-25deg);
          }

          50% {
            transform: rotate(22deg);
          }
        }

        @keyframes spark {
          0% {
            opacity: 0;
            transform: scale(0.2);
          }

          40% {
            opacity: 1;
            transform: scale(1.2);
          }

          100% {
            opacity: 0;
            transform: translateY(-15px) scale(0.3);
          }
        }

        @keyframes cloudMove {
          from {
            transform: translateX(-5px);
          }

          to {
            transform: translateX(15px);
          }
        }

        @keyframes serviceBlink {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.35;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pixel-worker,
          .worker-arm-right,
          .spark,
          .cloud,
          .service-dot {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  )
}