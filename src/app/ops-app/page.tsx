import { createClient } from '@/lib/supabase/server'

export default async function OpsAppDownloadPage() {
  const supabase = await createClient()
  const { data: files } = await supabase.storage.from('internal-app-releases').list('', {
    sortBy: { column: 'created_at', order: 'desc' },
  })

  const latestApk = files?.find((f) => f.name.endsWith('.apk'))
  const downloadUrl = latestApk
    ? supabase.storage.from('internal-app-releases').getPublicUrl(latestApk.name).data.publicUrl
    : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
          <span className="text-2xl">pkg</span>
        </div>
        <h1 className="font-display text-xl font-semibold text-ink">Buana Ops App</h1>
        <p className="mt-1 text-sm text-muted">Aplikasi internal untuk Kurir, Staff Gudang and Teknisi</p>

        {downloadUrl ? (
          <>
            <a href={downloadUrl} download className="mt-6 block w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-white hover:opacity-90">
              Download APK
            </a>
            {latestApk?.created_at && (
              <p className="mt-3 text-xs text-muted">
                Update terakhir: {new Date(latestApk.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </>
        ) : (
          <p className="mt-6 text-sm text-muted">Belum ada file APK tersedia.</p>
        )}

        <div className="mt-6 rounded-md bg-canvas p-3 text-left text-xs text-muted">
          <p className="mb-1 font-medium text-ink">Cara install:</p>
          <ol className="list-decimal space-y-1 pl-4">
            <li>Tap tombol Download di atas</li>
            <li>Buka file yang sudah terdownload</li>
            <li>Kalau muncul peringatan Unknown apps, izinkan install dari sumber ini</li>
            <li>Tap Install</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
