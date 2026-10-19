# GreenSteps: Dokumentasi Desain UI Mobile & Aksesibilitas (Portrait 390x844)

**GreenSteps** adalah rancangan aplikasi mobile (iOS & Android) aksi lingkungan bergaya game sosial untuk anak muda Indonesia. Menggabungkan konsep **"Strava versi Penghijauan"** dan **mekanik streak ala Duolingo**, GreenSteps mendorong kebiasaan baik lewat kebersamaan squad kosan secara apa adanya, tanpa rasa bersalah dan tanpa motivasi klise.

---

## 1. Pendekatan Desain Visual & Copywriting

### Prinsip Visual (Raw Craft & Hand-Drawn Flat):
1. **Tanpa Shadow & Blur:** Tidak menggunakan drop shadow, inner shadow, glow, maupun backdrop blur. Kedalaman dibangun murni melalui:
   - Blok warna palet kontras
   - Garis luar tebal 2.5px (`#18614D`) dengan ujung membulat (*stroke-linecap="round"*)
   - Tumpukan bidang datar yang jelas
2. **Tanpa Emoji:** Seluruh ikon dan ilustrasi digambar tangan menggunakan SVG garis tebal (2.5px) dengan bentuk sedikit asimetris alami.
3. **Warna Solid Murni:** Tidak menggunakan gradien warna.
4. **Bentuk Blob Organik Beragam:** Setiap kartu menggunakan variasi kurva blob yang berbeda (`--blob-shape-1` s.d. `--blob-shape-5`), bukan rounded rectangle seragam. Tombol berbentuk pil (*pill-shaped*).
5. **Pemisah Kuas Kasar (Brushstroke Divider):** Garis pemisah berupa sapuan kuas kasar solid SVG.
6. **Tekstur Kertas Kraft Halus:** Background krem dengan tekstur mikro kertas kraft, sementara area baca dan tombol tetap polos solid demi ketajaman teks.
7. **Tata Letak Asimetris:** Judul besar rata kiri, stiker oranye miring 3–6 derajat, dan ilustrasi flat berkarakter.

### Palet Warna Resmi (Mode Normal)
| Warna | Hex Code | Peran & Penggunaan |
|---|---|---|
| **Oranye** | `#D9822B` | Aksen, tombol CTA, streak api, sticker miring |
| **Krem** | `#EDE4B5` | Background kanvas dan kartu utama |
| **Hijau** | `#4A9A44` | Progres misi, status selesai, ikon aktif |
| **Hijau Tua** | `#18614D` | Teks utama, garis outline 2.5px, bottom nav, tombol sekunder |

> Aturan kontras: semua teks minimal rasio 4.5:1 (teks hijau tua di atas krem > 6.0:1). Teks tidak pernah hijau terang di atas krem.

### Karakter Copywriting
- Bahasa Indonesia sehari-hari anak muda: pendek, langsung pada intinya, spesifik, apa adanya.
- Menghapus kalimat AI klise, seruan berlebihan, dan basa-basi motivasi.
- Contoh:
  - *"hari ini baru 1 dari 3 misi. tumbler udah dibawa belum?"*
  - *"selesai. 1 botol plastik nggak jadi sampah."*
  - *"5 dari 6 anggota squadmu sudah selesai."*
  - Label tombol: *"mulai"*, *"foto bukti"*, *"bagikan"*, *"masuk squad"*, *"simpan"*.

---

## 2. Struktur 5 Layar Utama

1. **Layar 1: Onboarding + Preferensi Aksesibilitas + Squad**
   - 3 slide sambutan bergambar flat (bumi mini, squad kosan, streak & monster).
   - "Sesuaikan aplikasimu" (opt-in): kartu toggle besar untuk Netra, Rungu, Motorik, dan Kognitif/ADHD.
   - Panel squad: masuk pakai kode (`KOS-BAROKAH-24`) atau buat squad baru.
2. **Layar 2: Beranda**
   - Sapaan akrab (*"rian."*), streak api (*"7 hari streak"*), poin (*"850 poin"*).
   - Norma sosial: *"72% anak kos di sekitarmu pakai tumbler hari ini."* & *"5 dari 6 anggota squadmu sudah selesai."*
   - Progres squad kosan, avatar gambar tangan, dan interaksi *"colek agus"*.
   - Kartu monster mingguan: *Kiki si Kresek Nakal* (sisa 380 HP).
   - Tombol pill *"mulai misi"*.
3. **Layar 3: Misi Harian + Monster Sampah**
   - Kartu berburu monster sampah harian (*Kiki si Kresek Nakal*).
   - Pemilih varian adaptif: *Cari sendiri*, *Petunjuk suara* (lengkap dengan suara Web Speech API), dan *Pilih dari daftar*. Banner kesetaraan menegaskan nilai dampak sama.
   - Daftar misi 5–10 menit: bawa tumbler, buang sampah pada tempatnya, tolak sedotan, tanpa sendok plastik delivery.
   - Dialog verifikasi aksi: foto bukti atau konfirmasi langsung.
4. **Layar 4: Kartu Hasil / Bagikan**
   - Layar selesai: *"selesai. 1 botol plastik nggak jadi sampah. +50 poin squad. streak naik jadi 8 hari."*
   - Kartu Strava 9:16 rapi dan estetik untuk Instagram Story / WhatsApp Status.
   - Pilihan warna kartu (hijau tua, oranye, krem).
   - Tombol *"bagikan"* dan *"simpan"*.
5. **Layar 5: Progres Dampak & Badge**
   - Metrik nyata pribadi vs squad: 42 botol plastik, 38 kantong kresek, 26.5 kg CO2, 14.8 kg kardus.
   - Grafik batang konsistensi mingguan.
   - Koleksi badge lengkap: *Eco-Rookie*, *Tumbler Warrior*, *Earth's Bestie*, *Zero-Waste Boss*, *Main Character*.
   - Circle League (leaderboard squad kosan, reset 2 hari lagi).

### Fitur Poin & Voucher Belanja (Reward System)
Poin yang dikumpulkan dari misi harian tidak hanya berupa gamifikasi abstrak, melainkan dapat langsung ditukarkan menjadi tiket belanja nyata dan cashback:
1. **Akses Cepat:** Chip saldo poin di header beranda (*"850 poin • tukar"*), kartu *"tukar poin misi"* di Beranda, serta menu Profil.
2. **Katalog Voucher Mahasiswa / Anak Kos:**
   - *Voucher Belanja Minimarket Rp 10.000* (Indomaret / Alfamart / Kantin Kosan) — 500 poin
   - *Cashback Saldo E-Wallet Rp 15.000* (GoPay / ShopeePay / DANA) — 750 poin
   - *Gratis 1x Isi Ulang Galon Kosan (Rp 6.000)* (Depo Air Berkah) — 300 poin
   - *Diskon Minuman Tumbler Rp 5.000* (Warkop & Kafe Kampus) — 250 poin
   - *Tiket Sembako Squad Kosan Rp 25.000* (Minyak / Beras Warung Bu Sari) — 1.200 poin
3. **Mekanisme Interaktif:** Saldo poin berkurang secara dinamis saat ditukar. Voucher tersimpan di profil pengguna dengan kode voucher dan barcode solid untuk ditunjukkan langsung ke kasir.

---

## 3. Varian Aksesibilitas Wajib

- **Mode Kontras Tinggi + Teks Besar:** Latar putih polos, garis tebal 3px hitam solid, teks hitam pekat, skala teks 125%, dan target sentuh diperbesar menjadi minimal 56px.
- **Mode Fokus Kognitif (ADHD & Lansia):** Sapuan kuas, dekorasi latar, dan elemen sekunder disembunyikan. Menampilkan banner instruksi satu tugas utama per layar.
- **Area Sentuh Minimal:** 48x48px pada mode standar dan 56x56px pada mode motorik.
