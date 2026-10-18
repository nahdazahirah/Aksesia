# Dokumentasi Prototipe GreenSteps (UI/UX Competition Reference)

**GreenSteps: Digital Experiences for Sustainable Living**  
Prototipe referensi UI/UX untuk aksi lingkungan berbasis budaya *mabar* (main bareng) dan FOMO positif bagi anak kos, asrama, dan mahasiswa di lingkungan bersama, dirancang inklusif dan ramah disabilitas (WCAG 2.2 AA).

---

## 1. Konteks Masalah & Solusi Desain

### Akar Masalah:
Sikap apatis anak muda terhadap sampah dan gaya hidup ramah lingkungan bukan disebabkan oleh kurangnya edukasi, melainkan:
1. **Tidak ada yang memulai duluan:** Keengganan terlihat "sok suci" atau canggung di lingkungan bersama (kos/asrama).
2. **Dampak tindakan kecil tidak terlihat:** Membawa tumbler atau memilah satu botol terasa sia-sia jika dilihat sendiri.
3. **Lingkungan sekitar tidak melakukan hal yang sama:** Tidak adanya norma sosial kolektif yang terlihat nyata.

### Pendekatan Solusi GreenSteps:
- Mengubah aksi lingkungan menjadi **game aksi kolektif ala "Strava untuk Penghijauan" & Pokemon raid battle**.
- **Nada Bicara (*Tone of Voice*):** Ramah, santai, bahasa Indonesia sehari-hari, berfokus pada kebersamaan dan apresiasi, tanpa kalimat yang menyalahkan atau menggurui (*guilt-free, camaraderie-first*).
- **Aksesibilitas sebagai Fondasi:** Aksesibilitas bukan sekadar menu tempelan, melainkan bagian dari alur utama sejak onboarding dan dapat diakses kapan saja lewat panel universal.

---

## 2. Struktur 5 Layar Inti (Core Screens)

Prototipe ini secara ketat memuat **5 Layar Inti** tanpa penambahan layar di luar spesifikasi:

### Layar 1: Onboarding + Preferensi Aksesibilitas + Squad (`screen-onboarding`)
- **Tujuan:** Menyambut pengguna, memberikan kontrol kenyamanan visual/interaksi secara *opt-in*, serta menghubungkan pengguna ke squad kos/kampus.
- **Komponen Utama:**
  - *Hero Banner:* Ajakan santai mabar aksi hijau kosan.
  - *Checklist Preferensi Aksesibilitas Awal:* Pilihan cepat teks lebih besar, kontras tinggi, mode ramah buta warna, mode fokus kognitif, kurangi gerakan, dan area sentuh lega.
  - *Gabung/Buat Squad:* Pilihan gabung menggunakan kode (`KOS-BAROKAH-24`) atau membuat squad baru, lengkap dengan pratinjau profil anggota squad.
  - *Aksi Utama:* Tombol "Mulai Mabar Hijau! 🚀" dan "Lewati & Gunakan Standar".

### Layar 2: Beranda (`screen-home`)
- **Tujuan:** Menampilkan progres kolektif teman kosan, norma sosial sekitar, dan akses cepat misi.
- **Komponen Utama:**
  - *Mabar Meter Hari Ini:* Menampilkan rasio penyelesaian squad ("5 dari 6 anggota sudah selesai hari ini" / 83%).
  - *Daftar Roster Squad:* Status tiap teman kos (misal: "Fajar - Bawa Tumbler ✅", "Agus - Belum Misi ⏳").
  - *Interaksi Colek Santai:* Tombol ramah untuk mencolek teman yang belum misi tanpa intimidasi, dengan simulasi respon interaktif.
  - *Kabar Baik Norma Sosial:* Menampilkan data lingkungan ("72% anak kos di sekitarmu memakai tumbler hari ini") untuk menciptakan dorongan sosial positif.
  - *Mini Banner Boss Raid:* Ringkasan sisa HP Boss Kresek dan tombol cepat ke arena misi.
  - *Akses Cepat Misi Harian:* Tombol tindakan langsung berukuran ramah motorik.

### Layar 3: Misi Harian + Item Harian + Misi Adaptif (`screen-missions`)
- **Tujuan:** Tempat pelaksanaan aksi harian, perlawanan terhadap Boss mingguan, dan perburuan item sampah sekitar.
- **Komponen Utama:**
  - *Boss Raid Mingguan:* "Raksasa Kresek Kosan" dengan indikator HP bar (1.000 HP). Setiap aksi yang diselesaikan memberikan *damage* visual ke boss.
  - *Misi Adaptif Inklusif (Wajib):*
    - **Varian A (Mobilitas Penuh):** Aksi jalan 50 langkah memungut 2 sampah plastik di lorong/pekarangan kos.
    - **Varian B (Ramah Mobilitas / Motorik Sederhana):** Sortir 1 sampah di meja/kamar sendiri tanpa perlu berkeliling.
    - **Varian C (Ramah Sensorik / Netra / Teks & Audio):** Panduan suara / deskripsi teks untuk mengenali simbol daur ulang kemasan (PET 1 & HDPE 2). Dilengkapi tombol putar audio panduan langsung.
    - **Prinsip Kesetaraan:** Banner eksplisit menegaskan bahwa seluruh varian bernilai sama: menyumbang **+1 Misi Squad** dan memotong **-120 HP Boss**.
  - *Misi Rutin Harian (5-10 menit):* Bawa tumbler (+1 botol), tolak sedotan plastik, matikan colokan charger.
  - *Item Harian ala Pokemon ("Monster Sampah Terdeteksi"):* Daftar kartu item sampah sekitar (Gelas Boba di tangga, Kardus Paket di teras, Kresek di dapur bersama) yang bisa "Dibereskan/Ditangkap".

### Layar 4: Kartu Hasil / Bagikan (`screen-share`)
- **Tujuan:** Sarana pamer pencapaian positif ke media sosial (Instagram Story / WhatsApp Status) dengan format kartu vertikal estetik (rasio 9:16).
- **Komponen Utama:**
  - *Story Card Preview:* Format mirip Spotify Wrapped / Strava dengan visual avatar, nama pengguna, nama squad, streak hari, metrik botol terselamatkan, dan damage ke Boss.
  - *Pengubah Tema Kartu:* Pilihan palet warna langsung ("Daun Hijau Segar", "Senja Hangat", "Midnight Eco").
  - *Tombol Aksi Sosial:* "Bagikan ke Instagram Story", "Salin Teks Ringkasan Aksi", dan "Unduh Gambar (Simulasi)".

### Layar 5: Progres Dampak Nyata (`screen-impact`)
- **Tujuan:** Menunjukkan bahwa aksi pengguna memberikan dampak konkret bagi bumi dan lingkungan kosan, bukan hanya angka gamifikasi abstrak.
- **Komponen Utama:**
  - *Tab Switcher:* Beralih antara "Dampak Pribadiku" dan "Dampak Seluruh Squad".
  - *Metrik Hasil Nyata & Analogi Hidup:*
    - 42 Botol Plastik Diselamatkan *(setara mencegah 1 karung sampah di TPA)*.
    - 38 Kantong Kresek Ditolak *(setara mencegah 2 saluran got tersumbat)*.
    - 26.5 kg CO2 Dicegah *(setara mematikan 6 lampu kamar kos non-stop 1 minggu)*.
    - 14.8 kg Kardus & Kertas Terpilah *(siap disetor ke Bank Sampah)*.
  - *Pelacak Konsistensi / Streak:* Riwayat visual 7 hari berturut-turut.
  - *Target Kolektif Bank Sampah Kampus:* Progres pengumpulan 250 botol untuk traktir es teh bareng satu kosan.

---

## 3. Fitur Aksesibilitas Universal & Panduan Demo Lomba

Aksesibilitas dirancang melekat pada setiap komponen dan dapat dibuka kapan saja melalui **Ikon Aksesibilitas Universal (pojok kanan atas)** atau melalui **Onboarding**.

### Bagaimana Menjalankan Demo untuk Juri:
1. **Demo Skala Huruf (Low Vision / Lansia):**
   - Buka panel aksesibilitas (ikon manusia merentangkan tangan di kanan atas).
   - Klik tombol `125%` atau `150%`. Seluruh teks, kartu, dan tombol membesar secara proporsional tanpa merusak tata letak.
2. **Demo Kontras Tinggi (Netra / Low Vision - WCAG AAA):**
   - Aktifkan toggle *Kontras Tinggi*.
   - Latar belakang berubah menjadi putih murni, teks hitam pekat, dan semua batas kartu/tombol berubah menjadi garis tebal hitam 3px solid dengan rasio kontras > 21:1.
3. **Demo Ramah Buta Warna (Pola & Simbol Berbeda):**
   - Aktifkan toggle *Ramah Buta Warna*.
   - Badge status dan bar progres menampilkan pola garis arsir (*diagonal stripes*), batas putus-putus, dan simbol bentuk (●, ✓, ▲) sehingga makna tidak bergantung pada persepsi warna.
4. **Demo Mode Fokus (ADHD / Kognitif / Neurodivergen):**
   - Aktifkan toggle *Mode Fokus*.
   - Elemen distraksi (widget norma sosial sekunder, badge dekoratif, tombol ekstra) disembunyikan. Antarmuka berubah menjadi tampilan tenang dengan jarak antar elemen yang longgar, menonjolkan aksi utama.
5. **Demo Kurangi Gerakan (Vestibular / Sensitivitas Gerak):**
   - Aktifkan toggle *Kurangi Gerakan*.
   - Semua transisi layar dan animasi pengisian bar progres dinonaktifkan seketika.
6. **Demo Area Sentuh Lega (Disabilitas Motorik / Tremor):**
   - Aktifkan toggle *Area Sentuh Ekstra Lega*.
   - Target sentuh membesar menjadi minimal **56 px** dengan jarak (*spacing*) longgar antar tombol untuk mencegah salah tekan.
7. **Demo Multi-Saluran & Text-to-Speech (Rungu & Netra):**
   - Tekan tombol *Bacakan Layar* di header untuk mendengarkan ringkasan layar melalui Web Speech API Bahasa Indonesia.
   - Selesaikan suatu misi: sistem memicu getaran (*Vibration API*) dan memunculkan *banner toast* visual dengan teks eksplisit bagi pengguna tuli/rungu.
8. **Demo Misi Adaptif Inklusif (Layar 3):**
   - Buka Layar 3.
   - Tunjukkan ketiga varian misi (Varian A, B, dan C).
   - Putar panduan suara pada Varian C untuk menunjukkan bagaimana pengguna dengan hambatan visual/sensorik tetap dapat mengenali jenis plastik secara mandiri.
   - Selesaikan salah satu varian dan perhatikan bagaimana pengurangan HP boss (-120 HP) dan kontribusi squad (+1) bernilai sama persis untuk semua varian.

---

## 4. Asumsi Desain

1. **Lingkungan Penggunaan:** Mahasiswa atau pekerja muda di Indonesia yang tinggal di kos-kosan, asrama kampus, atau perumahan bersama.
2. **Data Bersifat Dummy:** Tidak memerlukan autentikasi login atau koneksi database backend. Seluruh status (HP boss, penyelesaian misi, statistik) disimpan di memori lokal peramban (*localStorage*).
3. **Device Form Factor:** Dioptimalkan untuk tampilan ponsel *mobile-first* (lebar 390px–420px) dan dibingkai elegan di layar desktop agar mudah dipresentasikan saat demonstrasi lomba.
4. **Keamanan & Privasi:** Tidak ada data medis atau pelabelan disabilitas yang disimpan; preferensi pengguna murni mengenai kenyamanan tampilan dan interaksi.
