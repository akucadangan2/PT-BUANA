export default function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-ink">
      <h1 className="mb-2 font-display text-2xl font-semibold">
        Penghapusan Akun
      </h1>

      <p className="mb-8 text-muted">
        Terakhir diperbarui:{" "}
        {new Date().toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <p className="mb-4">
        Pengguna aplikasi Buana dapat mengajukan penghapusan akun dan data
        pribadi yang terkait dengan akun tersebut.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Cara Menghapus Akun
      </h2>

      <p className="mb-4">
        Untuk mengajukan penghapusan akun, silakan kirim permintaan melalui
        email resmi kami dengan menggunakan alamat email yang terdaftar pada
        akun Buana.
      </p>

      <p className="mb-4">
        Cantumkan subjek email <strong>Permintaan Penghapusan Akun</strong> dan
        sertakan informasi yang diperlukan untuk memverifikasi kepemilikan
        akun.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Data yang Akan Dihapus
      </h2>

      <p className="mb-4">
        Setelah permintaan berhasil diverifikasi, akun pengguna beserta data
        pribadi yang terkait dengan akun akan dihapus dari sistem kami,
        termasuk informasi profil dan data akun.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Data yang Dapat Dipertahankan
      </h2>

      <p className="mb-4">
        Data tertentu dapat disimpan apabila diperlukan untuk memenuhi
        kewajiban hukum, perpajakan, pencatatan transaksi, penyelesaian
        sengketa, pencegahan penyalahgunaan, atau kewajiban lain yang berlaku.
        Data tersebut akan disimpan hanya selama periode yang diperlukan.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Waktu Pemrosesan
      </h2>

      <p className="mb-4">
        Permintaan penghapusan akun akan diproses setelah proses verifikasi
        selesai. Pengguna akan menerima konfirmasi setelah proses penghapusan
        akun selesai.
      </p>

      <h2 className="mb-2 mt-6 font-display text-lg font-semibold">
        Hubungi Kami
      </h2>

      <p>
        Untuk mengajukan penghapusan akun atau mendapatkan informasi lebih
        lanjut, silakan hubungi kami melalui email resmi yang tercantum pada
        aplikasi atau situs Buana.
      </p>
    </div>
  );
}