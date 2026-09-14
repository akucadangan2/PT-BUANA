import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="text-center">
        <p className="font-display text-6xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-display text-xl font-semibold text-ink">Halaman Tidak Ditemukan</h1>
        <p className="mt-2 text-sm text-muted">
          Halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}