export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-ink">
      <h1 className="mb-2 font-display text-2xl font-semibold">
        Kebijakan Privasi
      </h1>

      <p className="mb-8 text-muted">
        Terakhir diperbarui:{' '}
        {new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <p className="mb-4">
        Aplikasi ini dioperasikan oleh <strong>[NAMA PERUSAHAAN/KLIEN]</strong> dan
        dikembangkan serta didukung secara teknis oleh{' '}
        <strong>PT RHG Teknologi Indonesia</strong> sebagai vendor teknologi.
        Kebijakan Privasi ini menjelaskan bagaimana data pribadi pengguna
        dikumpulkan, digunakan, disimpan, dan dilindungi selama menggunakan
        aplikasi.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Data yang Kami Kumpulkan
      </h2>

      <ul className="mb-4 list-disc space-y-1 pl-5">
        <li>Nama, alamat email, dan nomor telepon saat Anda mendaftar akun</li>

        <li>
          Alamat pengiriman yang Anda simpan untuk keperluan pemesanan
        </li>

        <li>
          Lokasi perangkat (GPS), yang digunakan untuk menentukan titik alamat
          pengiriman atau lokasi service serta melacak posisi kurir atau teknisi
          secara real-time selama proses pengantaran atau kunjungan service
        </li>

        <li>
          Foto yang diambil melalui kamera, yang digunakan sebagai bukti serah
          terima barang atau dokumentasi pengerjaan service
        </li>

        <li>Riwayat pemesanan dan permintaan service</li>

        <li>
          Token notifikasi (push notification) untuk mengirimkan pemberitahuan
          terkait status pesanan atau service
        </li>
      </ul>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Bagaimana Kami Menggunakan Data
      </h2>

      <ul className="mb-4 list-disc space-y-1 pl-5">
        <li>Memproses dan mengantarkan pesanan Anda</li>

        <li>
          Menjadwalkan dan melaksanakan kunjungan service atau perbaikan
        </li>

        <li>
          Mengirimkan notifikasi terkait status pesanan atau service
        </li>

        <li>
          Menghubungi Anda terkait akun, transaksi, pesanan, atau permintaan
          service
        </li>

        <li>
          Menjaga keamanan, stabilitas, dan fungsi aplikasi
        </li>

        <li>
          Melakukan pemeliharaan dan peningkatan layanan aplikasi
        </li>
      </ul>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Pihak Ketiga
      </h2>

      <p className="mb-4">
        Untuk menjalankan aplikasi, kami menggunakan beberapa layanan pihak
        ketiga, termasuk <strong>Supabase</strong> untuk basis data dan
        autentikasi, <strong>OneSignal</strong> untuk layanan push notification,
        serta <strong>Firebase Cloud Messaging</strong> untuk pengiriman
        notifikasi pada perangkat Android. Data yang diproses oleh layanan
        tersebut juga tunduk pada kebijakan privasi masing-masing penyedia
        layanan.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Vendor Teknologi
      </h2>

      <p className="mb-4">
        <strong>PT RHG Teknologi Indonesia</strong> bertindak sebagai vendor
        teknologi yang menyediakan layanan pengembangan, integrasi,
        pemeliharaan, dan dukungan teknis terhadap aplikasi. Dalam pelaksanaan
        layanan tersebut, vendor dapat memperoleh akses terbatas terhadap sistem
        atau data apabila diperlukan untuk keperluan teknis, pemeliharaan,
        troubleshooting, keamanan, atau penyelesaian gangguan aplikasi.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Penyimpanan &amp; Keamanan Data
      </h2>

      <p className="mb-4">
        Data pengguna disimpan menggunakan infrastruktur Supabase dengan
        mekanisme keamanan dan pembatasan akses, termasuk Row Level Security
        (RLS). Akses terhadap data dibatasi berdasarkan hak akses pengguna dan
        hanya dapat dilakukan oleh pengguna atau staf yang memiliki kewenangan
        sesuai kebutuhan operasional.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Penghapusan Data
      </h2>

      <p className="mb-4">
        Pengguna dapat mengajukan permintaan penghapusan akun dan data pribadi
        yang terkait dengan akun tersebut. Permintaan dapat dilakukan melalui
        kontak pengelola aplikasi atau vendor teknologi yang tercantum di bawah.
        Penghapusan data akan dilakukan sesuai ketentuan hukum dan kebutuhan
        penyimpanan data transaksi yang berlaku.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Hak Pengguna
      </h2>

      <p className="mb-4">
        Pengguna dapat meminta akses, koreksi, pembaruan, atau penghapusan data
        pribadi yang tersimpan. Pengguna juga dapat menghubungi pengelola
        aplikasi apabila memiliki pertanyaan mengenai penggunaan dan
        perlindungan data pribadi.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Perubahan Kebijakan Privasi
      </h2>

      <p className="mb-4">
        Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu untuk
        menyesuaikan perubahan layanan, teknologi, maupun ketentuan yang
        berlaku. Tanggal pembaruan terbaru akan ditampilkan pada bagian atas
        halaman ini.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Kontak
      </h2>

      <div className="space-y-1">
        <p>
          Pengelola Aplikasi:{' '}
          <strong>[NAMA PERUSAHAAN/KLIEN]</strong>
        </p>

        <p>
          Email Pengelola:{' '}
          <strong>[EMAIL PERUSAHAAN/KLIEN]</strong>
        </p>

        <p>
          Vendor Teknologi:{' '}
          <strong>PT RHG Teknologi Indonesia</strong>
        </p>

        <p>
          Email Vendor:{' '}
          <strong>[EMAIL RHG]</strong>
        </p>
      </div>
    </div>
  )
}