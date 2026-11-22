# Silva Yunisa Portfolio (React + Vite)

Migrasi dari site HTML/CSS/JS lama ke React, lalu didesain ulang.

**Status: Fase 4 selesai** — tampilan baru sudah jadi dan semua isi/link/PDF
dari site lama tetap ada. Site lama (HTML biasa) tidak diubah, jadi bisa
dipakai kalau mau kembali.

## Menjalankan di komputer

```bash
cd portfolio-react   # masuk dulu ke foldernya
npm install
npm run dev          # buka alamat yang muncul (biasanya http://localhost:5173)
npm run build        # hasil build ada di folder dist/
npm run preview      # coba hasil build secara lokal
```

Butuh Node.js 20.19+ atau 22.12+. Kalau `npm install` menampilkan saran
`npm audit fix --force`, abaikan saja.

## Struktur

```
index.html               cangkang halaman + script mode gelap (harus tetap di sini)
public/                  file yang ditayangkan apa adanya (foto, gambar, PDF, favicon)
src/data/                SEMUA isi konten: profil, project, skills, menu
src/components/layout/   Navbar, ThemeToggle, SkipLink
src/components/sections/ About, Projects, Skills, Contact
src/components/projects/ ProjectCard (satu baris project), ProjectModal (popup View Details)
src/components/ui/       Reveal, SplitTitle (judul muncul huruf per huruf), CursorFollower
                         (pixel cursor), ScrollProgress, BackToTop, ikon
src/hooks/               useTheme, useScroll, useActiveSection, useCursorFollow,
                         useTilt (foto miring), useMagnetic (tombol "tertarik" kursor)
src/styles/              CSS per bagian; urutan impornya diatur di index.css
extras/                  TIDAK ikut tayang: CV, preview_center.jpg, foto lama
```

Mengubah teks/link? Edit file di `src/data/` saja. Popup "View Details" ikut
berubah otomatis karena isinya dibaca dari data yang sama dengan barisnya.

## Tampilan (fase 4)

- **Warna** — dua tema yang sama-sama biru. Day: latar `#AEE1F5`, kursor
  `#1F6FA8`. Night: latar `#1F6FA8`, kursor `#AEE1F5`. Semua warna ada di
  `src/styles/tokens.css` (nama berdasarkan fungsi: `--surface` = latar,
  `--ink` = teks, `--accent`, `--cursor`, dst.); mode gelap hanya mengganti
  nilainya. Pindah tema berlangsung halus (warna bergeser, tidak loncat).
- **Font** — Anton untuk nama dan semua judul, Inter untuk teks. Keduanya
  ikut dalam project (paket `@fontsource`), tidak minta ke Google Fonts.
- **About** — foto di kanan, nama di kiri (di mobile: foto, nama, bio rata
  kiri, tombol, ikon sosial). Foto miring mengikuti mouse; klik/tap nama
  membuat hurufnya melompat bergelombang; tap foto membuatnya bergoyang.
- **Projects** — daftar baris. Di desktop, label "View Details" mengikuti
  kursor di dalam baris. Di layar sentuh, baris yang ada di tengah layar
  menyala saat di-scroll.
- **Pixel cursor** — kursor panah pixel, berubah jadi tangan pixel di atas
  link/tombol, mengecil saat ditekan. Di layar sentuh muncul di bawah jari
  sebentar. Kursor asli sistem baru disembunyikan setelah kursor pixel benar-
  benar muncul (setelah mouse pertama kali digerakkan).
- **Skills** — termasuk "QA Testing (Basics)" (versi dasar saja).

## Perilaku

- **Animasi muncul** — bungkus elemen dengan `<Reveal>`; judul section pakai
  `<SplitTitle>`. Semua animasi mati kalau pengunjung memilih "reduce motion"
  di sistemnya.
- **Popup detail** — klik di mana saja pada baris project (kecuali link
  aslinya). Esc / klik latar / tombol × menutup; Tab tidak keluar dari popup;
  fokus kembali ke tombol yang membukanya.
- **Menu aktif** — link navbar untuk bagian yang sedang di tengah layar
  diberi penanda.

## Deploy ke Vercel

Vercel mendeteksi Vite otomatis: Framework Preset **Vite**, Build Command
`npm run build`, Output Directory `dist`. Tidak perlu pengaturan lain.

## Catatan

- `public/Data_Analytics_Project.pdf` berukuran sekitar 25 MB.
- CV tidak ditaut di mana pun dan tidak ada di `public/`, jadi tidak bisa
  diakses lewat URL setelah deploy.
- Field `layout: 'full'` di `src/data/projects.js` tidak dipakai lagi oleh
  desain baru (semua project satu baris); dibiarkan supaya data tetap utuh.
