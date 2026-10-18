# Alur dan Layar Prototipe Aksesia (Queue & Service Companion)

Prototipe ini adalah **wireframe bergerak beresolusi rendah (low-fidelity)** untuk aplikasi pendamping antrean dan layanan puskesmas yang inklusif dan ramah disabilitas di Indonesia.

---

## Prinsip Desain Utama

1. **Tanyakan Preferensi, Bukan Diagnosis Medis:**
   Aplikasi tidak pernah menanyakan riwayat atau nama disabilitas. Pengguna hanya ditanya kebutuhan kenyamanan interaksi ("Mau tampilan seperti apa?"), lengkap dengan tombol *Lewati*.
2. **Lapisan Dasar Selalu Aktif (Always-On Base Layer):**
   - Kontras tinggi sesuai WCAG 2.2 AA (minimal 4.5:1 untuk teks normal, 3:1 untuk elemen UI).
   - Setiap status disajikan dengan **Ikon + Teks** (tidak pernah hanya mengandalkan warna).
   - Area sentuh minimal **48 × 48 px**.
   - Bahasa Indonesia sederhana dan lugas tanpa istilah medis rumit.
   - Satu aksi utama per layar, tidak ada batas waktu (*no time limits*), dan dapat dibatalkan.
3. **Lapisan Aksesibilitas Opsional (Dimatikan secara *default*, dapat diaktifkan kapan saja):**
   - Pembesar ukuran teks (slider dinamis 100% s.d. 200%).
   - Mode kontras tinggi (bingkai tebal, teks kontras maksimal).
   - Palet ramah buta warna (*monochrome / pattern-safe*).
   - Pembaca layar bawaan (*Text-to-Speech* web).
   - Mode sederhana (tampilan ringkas & bertahap).
   - Notifikasi getar dan kedip visual multi-saluran (*multi-channel*).
   - Pengurangan animasi (*reduced motion*).
4. **Ikon Aksesibilitas Universal yang Persisten:**
   Diletakkan di pojok kanan atas di setiap layar untuk membuka pengaturan aksesibilitas secara instan tanpa kehilangan alur antrean.
5. **Privasi Penuh di Perangkat:**
   Seluruh preferensi dan data hanya disimpan di memori/perangkat lokal (*local storage*).

---

## Daftar Layar dan Tujuannya

### 1. Layar Onboarding (`screen-onboarding`)
- **Tujuan:** Menyambut pengguna baru dan menawarkan penyesuaian kenyamanan visual/auditori sebelum mulai menggunakan aplikasi.
- **Komponen:**
  - Salam singkat dan penjelasan tujuan.
  - Daftar periksa preferensi cepat: Teks lebih besar, Kontras lebih tinggi, Bacakan teks, Tampilan sederhana, Notifikasi getar & kedip.
  - Tombol aksi utama: **Simpan Pengaturan** & **Lewati (Gunakan Pengaturan Standar)**.

### 2. Layar Beranda (`screen-home`)
- **Tujuan:** Titik awal pengguna dengan status kunjungan yang jelas dan navigasi ringkas.
- **Komponen:**
  - Kartu kunjungan aktif (atau informasi bahwa belum ada jadwal).
  - Tombol aksi utama yang besar: **Daftar Kunjungan Baru**.
  - Akses cepat ke riwayat atau informasi loket.
  - Ikon aksesibilitas universal di pojok kanan atas.

### 3. Layar Pendaftaran Kunjungan (`screen-register`)
- **Tujuan:** Menuntun pengguna memilih puskesmas dan jadwal kedatangan secara bertahap dan mudah dipahami.
- **Komponen:**
  - Pilihan Puskesmas tujuan (contoh: Puskesmas Sukamaju, Puskesmas Melati).
  - Pilihan poli/layanan (Umum, Gigi, Lansia & Prioritas, KIA).
  - Pilihan sesi waktu (Pagi 08.00 - 10.00, Siang 10.00 - 12.00).
  - Tombol **Lanjut ke Pengaturan Preferensi Layanan** dan tombol kembali.

### 4. Layar Berbagi Preferensi Akses (`screen-share-pref`)
- **Tujuan:** Memberi kendali penuh kepada pengguna apakah ingin membagikan kebutuhan akses kepada staf puskesmas sebelum tiba.
- **Komponen:**
  - Sakelar *toggle*: "Bagikan preferensi aksesku ke puskesmas supaya mereka bisa bersiap" (standar: MATI).
  - Pratinjau transparan mengenai apa yang akan dibaca staf: misalnya "Perlu bicara pelan", "Butuh bantuan mencatat/menulis", "Pendamping bahasa isyarat".
  - Catatan privasi: "Data ini tidak memuat diagnosis medis dan hanya aktif untuk kunjungan hari ini."
  - Tombol **Konfirmasi & Dapatkan Tiket Antrean**.

### 5. Layar Tiket & Check-in Hari Kunjungan (`screen-checkin`)
- **Tujuan:** Menampilkan nomor antrean dalam ukuran besar dan tombol check-in mandiri saat tiba di puskesmas.
- **Komponen:**
  - Tampilan nomor antrean besar (misal: **A-014**).
  - Status lokasi: "Anda berada di Puskesmas Sukamaju".
  - Tombol aksi utama: **Saya Sudah Tiba di Puskesmas (Check-in)**.

### 6. Layar Menunggu Antrean (`screen-waiting`)
- **Tujuan:** Memberikan ketenangan bagi pengunjung selama menunggu tanpa perlu takut tertinggal panggilan pengeras suara.
- **Komponen:**
  - Status teks gamblang: *"Sebentar lagi giliran Anda"*.
  - Perkiraan antrean: *"Sisa 3 orang lagi di depan Anda"*.
  - Ikon + teks pendukung (indikator visual progress bar yang sederhana).
  - Tombol simulasi: **Simulasikan Giliran Dipanggil** (untuk memudahkan demonstrasi prototipe).

### 7. Layar Panggilan Giliran (`screen-called`)
- **Tujuan:** Memberitahukan panggilan secara multi-saluran (*multi-channel notification*) agar ramah bagi tunarungu, tunanetra, maupun lansia.
- **Komponen:**
  - Spanduk visual kontras tinggi berkedip: *"Giliran Anda! Silakan Menuju Loket 2"*.
  - Pemicu getar (*Vibration API*) otomatis pada perangkat yang mendukung.
  - Pengucapan suara (*Text-to-Speech*) otomatis jika fitur bacakan aktif.
  - Tombol aksi utama: **Saya Menuju Loket (Buka Kartu Komunikasi)**.

### 8. Layar di Loket / Kartu Komunikasi (`screen-counter`)
- **Tujuan:** Membantu percakapan dua arah antara pasien dan staf puskesmas di loket tanpa hambatan komunikasi.
- **Komponen:**
  - Kartu komunikasi bergambar + teks ukuran besar yang dapat ditekan untuk memperbesar ke layar penuh:
    - *Nyeri Hebat*
    - *Demam Tinggi*
    - *Butuh Juru Bahasa Isyarat*
    - *Tolong Bicara Lebih Pelan*
    - *Butuh Bantuan Menulis*
  - Kotak *"Ketik lalu Ucapkan"*: pasien mengetik pesan, lalu tombol suara melafalkannya via pengeras suara untuk staf.
  - Tombol penyelesaian: **Selesai Konsultasi / Pemeriksaan**.

### 9. Layar Selesai Kunjungan (`screen-after-visit`)
- **Tujuan:** Ringkasan langkah selanjutnya dalam bahasa lugas dan pengingat kontrol berikutnya.
- **Komponen:**
  - Status berhasil: "Pemeriksaan selesai".
  - Langkah selanjutnya: "Silakan mengambil obat di Loket Farmasi (Kanan pintu keluar)".
  - Pengingat kunjungan kontrol berikutnya jika ada.
  - Tombol: **Kembali ke Beranda**.

### 10. Layar Pengaturan Aksesibilitas Modal/Panel (`screen-settings`)
- **Tujuan:** Pusat kendali aksesibilitas yang dapat dibuka kapan saja melalui ikon aksesibilitas universal.
- **Komponen:**
  - Slider ukuran font (100% sampai 200%).
  - Sakelar Mode Kontras Tinggi (*High Contrast Mode*).
  - Sakelar Palet Ramah Buta Warna (*Color-blind Safe / Monochromatic Safe*).
  - Sakelar Pembaca Layar Otomatis (*Voice Reader / TTS*).
  - Sakelar Mode Sederhana (*Simple View*).
  - Sakelar Notifikasi Getar & Layar Berkedip.
  - Sakelar Kurangi Gerakan (*Reduced Motion*).
  - Kotak Pratinjau Langsung (*Live Preview Box*) yang seketika berubah saat pengaturan digeser.
  - Tombol: **Simpan & Kembali**.

### 11. Layar Tampilan Petugas / Staff View (`screen-staff`)
- **Tujuan:** Memberikan gambaran kepada pihak puskesmas mengenai daftar pasien yang sedang mengantre beserta kebutuhan aksesibilitas yang dibagikan.
- **Komponen:**
  - Daftar antrean loket: Nomor, Nama Samaran, Status.
  - Badge preferensi akses yang dibagikan pasien (misal: "Butuh bicara pelan", "Butuh bantuan menulis").
  - Tombol panggil pasien berikutnya.
  - Tombol pengalih cepat kembali ke Mode Pasien.

---

## Alur Pengguna (User Flow)

```
[1. Onboarding] -> (Simpan / Lewati)
       ↓
[2. Beranda] -> Klik "Daftar Kunjungan"
       ↓
[3. Pendaftaran] -> Pilih Poli & Sesi Waktu -> Klik "Lanjut"
       ↓
[4. Bagikan Preferensi Akses] -> (Opsi bagikan: On/Off) -> Klik "Dapatkan Tiket"
       ↓
[5. Tiket & Check-in] -> Tiba di Puskesmas -> Klik "Check-in"
       ↓
[6. Menunggu Antrean] -> Pantau sisa nomor -> Klik "Simulasikan Dipanggil"
       ↓
[7. Panggilan Giliran Loket] (Getar, Visual, Suara) -> Klik "Menuju Loket"
       ↓
[8. Di Loket: Kartu Komunikasi & Ketik-Bicara] -> Interaksi -> Klik "Selesai"
       ↓
[9. Selesai Kunjungan & Ringkasan Obat] -> Klik "Kembali ke Beranda"

* Catatan:
- [10. Pengaturan Aksesibilitas] dapat diakses KAPAN SAJA dari pojok kanan atas setiap layar.
- [11. Mode Petugas (Staff View)] dapat diakses kapan saja melalui tombol bilah atas untuk melihat simulasi perspektif perawat/petugas loket.
```
