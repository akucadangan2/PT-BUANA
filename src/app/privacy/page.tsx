export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-ink">
      <h1 className="mb-2 font-display text-2xl font-semibold">Kebijakan Privasi</h1>
      <p className="mb-8 text-muted">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p className="mb-4">
        Aplikasi ini dioperasikan oleh <strong>[NAMA PERUSAHAAN]</strong> ("kami"). Kebijakan ini menjelaskan
        bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi pengguna aplikasi kami.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Data yang Kami Kumpulkan</h2>
      <ul className="mb-4 list-disc space-y-1 pl-5">
        <li>Nama, alamat email, dan nomor telepon saat Anda mendaftar akun</li>
        <li>Alamat pengiriman yang Anda simpan untuk keperluan pemesanan</li>
        <li>Lokasi perangkat (GPS) — digunakan untuk menampilkan titik alamat pengiriman/lokasi service, dan untuk melacak posisi kurir/teknisi secara real-time selama proses pengantaran atau kunjungan service</li>
        <li>Foto yang diambil melalui kamera — digunakan sebagai bukti serah terima barang atau dokumentasi pengerjaan service</li>
        <li>Riwayat pemesanan dan permintaan service</li>
        <li>Token notifikasi (push notification) untuk mengirimkan pemberitahuan status pesanan/service</li>
      </ul>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Bagaimana Kami Menggunakan Data</h2>
      <ul className="mb-4 list-disc space-y-1 pl-5">
        <li>Memproses dan mengantarkan pesanan Anda</li>
        <li>Menjadwalkan dan melaksanakan kunjungan service/perbaikan</li>
        <li>Mengirimkan notifikasi terkait status pesanan atau service</li>
        <li>Menghubungi Anda terkait akun atau transaksi Anda</li>
      </ul>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Pihak Ketiga</h2>
      <p className="mb-4">
        Kami menggunakan layanan pihak ketiga berikut untuk mengoperasikan aplikasi ini: Supabase (basis data
        dan autentikasi), OneSignal (notifikasi push), dan Firebase Cloud Messaging (pengiriman notifikasi
        Android). Data yang diproses layanan-layanan ini tunduk pada kebijakan privasi masing-masing.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Penyimpanan &amp; Keamanan Data</h2>
      <p className="mb-4">
        Data Anda disimpan di server Supabase dengan akses dibatasi melalui kontrol keamanan tingkat baris
        (Row Level Security), yang berarti setiap pengguna hanya dapat mengakses datanya sendiri kecuali staf
        yang berwenang.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Hak Anda</h2>
      <p className="mb-4">
        Anda dapat meminta akses, koreksi, atau penghapusan data pribadi Anda dengan menghubungi kami melalui
        kontak di bawah ini.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">Kontak</h2>
      <p>Email: <strong>[EMAIL KONTAK]</strong></p>
    </div>
  )
}