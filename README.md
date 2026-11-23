# Nuxt Portfolio Template — Soft Pastel

Template website portofolio bertema **pastel lembut** (pink, lilac, cream; bentuk membulat; terang) untuk **siapa saja**: kreator, desainer, fotografer, penulis, freelancer, studio, atau usaha kecil. Versi gelap dan tegas ada di <https://github.com/amdwildanabdillah/nuxtportfoliotemplate>.
Dibuat dengan **Nuxt 4 + Tailwind**. Semua isi (teks, project, kontak, sosmed) diatur lewat **satu file: `site.config.ts`**.

*An open-source portfolio template. Edit one config file, deploy for free. English notes are at the bottom.*

**Demo langsung: <https://nuxtportfoliotemplate-soft.vercel.app>**

---

## Pilih mode kamu

| | **Mode `local`** (disarankan pemula) | **Mode `supabase`** |
|---|---|---|
| Isi project diatur di | file `site.config.ts` | halaman `/admin` di websitemu |
| Butuh database | Tidak | Ya (Supabase, gratis) |
| Upload gambar | taruh file di folder `public/` | upload langsung dari admin |
| Tambah project | edit file lalu deploy ulang | klik tombol, langsung tayang |
| Cocok untuk | portofolio yang jarang berubah | yang sering menambah karya |

Pindah mode cukup ganti satu baris: `mode: 'local'` atau `mode: 'supabase'` di `site.config.ts`.

---

## Yang harus kamu install (sekali saja)

1. **Node.js 20 atau lebih baru**: unduh versi *LTS* di <https://nodejs.org>
2. **Git**: <https://git-scm.com> (untuk upload ke GitHub)
3. **Editor kode**: VS Code <https://code.visualstudio.com> (gratis)
4. Akun gratis: **GitHub** dan **Vercel** (untuk online-kan website). Mode supabase: tambah akun **Supabase**.

Cek di terminal: `node -v` harus menampilkan `v20` ke atas.

---

## Mulai cepat (mode local)

```bash
# 1. Ambil template (atau klik tombol "Use this template" di GitHub)
git clone https://github.com/amdwildanabdillah/nuxtportfoliotemplate-soft.git portfolio-ku
cd portfolio-ku

# 2. Install
npm install

# 3. Jalankan
npm run dev
```

Buka <http://localhost:3000>. Sekarang buka **`site.config.ts`**, ganti teksnya, simpan, dan halaman otomatis berubah.

### Apa saja yang ada di `site.config.ts`

| Bagian | Isinya |
|---|---|
| `mode` | `'local'` atau `'supabase'` |
| `site` | judul & deskripsi untuk Google, alamat website, gambar preview (OG), Google Analytics |
| `profile` | nama, kota, email, nomor WhatsApp |
| `nav` | logo teks di navbar, tombol Connect, link tambahan (CV, dll.) |
| `hero` | teks besar di halaman pertama + tombol |
| `featured` | judul bagian "Selected Work" |
| `about` | paragraf perkenalan, foto, dan ikon alat |
| `experience` | riwayat kerja, organisasi, pendidikan, sertifikat (bisa dimatikan dengan `show: false`) |
| `contact` | teks ajakan, email, link usaha/ventures |
| `socials` | ikon sosial media di footer |
| `categories` | kategori karya (bebas nama & jumlahnya, lihat bagian "Kategori karya") |
| `projects` | daftar project (mode local) |
| `watermark` | tulisan kecil "Template by..." di footer |

Setiap bagian sudah diberi komentar berbahasa Indonesia di dalam filenya.

### Mengganti gambar

Taruh gambar di folder **`public/`**, lalu tulis path-nya di config.

| File | Ukuran ideal | Dipakai untuk |
|---|---|---|
| `public/og-image.png` | 1200 x 630 | gambar preview saat link dibagikan (WhatsApp, Discord, dll.) |
| `public/favicon.ico`, `favicon-*.png`, `apple-touch-icon.png`, `android-chrome-*.png` | kotak | ikon tab browser. Buat dari <https://realfavicongenerator.net> |
| `public/placeholder/profile.webp` | 4:5 | foto di bagian About. Ganti path `about.photo` |
| `public/placeholder/cover-*.webp` | 16:10 | contoh cover project. Hapus kalau sudah pakai punyamu |

> Untuk gambar baru, simpan di `public/` (mis. `public/projects/toko.webp`), lalu tulis `'/projects/toko.webp'`.
> Disarankan format **.webp** dan lebar maksimal 1600 px supaya website ngebut.

### Menambah project (mode local)

Salin satu blok di `projects: [...]` lalu ubah isinya:

```ts
{
  title: 'Toko Online Kopi',
  slug: 'toko-online-kopi',        // tanpa spasi, huruf kecil, unik
  category: 'projects',            // sama dengan slug kategori
  subCategory: 'Branding',
  cover: '/projects/toko.webp',
  coverType: 'image',
  short: 'Ringkasan 1-2 kalimat untuk kartu.',
  long: 'Cerita lengkap project untuk halaman detail.',
  techStack: ['Strategi', 'Desain'],  // tag bebas
  liveUrl: 'https://tokokopi.com',
  githubUrl: '',
  client: 'Kopi Senja',
  featured: true,                  // tampil di bagian Selected Work
  gallery: ['/projects/toko-2.webp'],
}
```

- **Video**: taruh di kategori ber-layout `video`, dengan `coverType: 'youtube'` dan `cover: 'https://youtube.com/watch?v=...'`.
- **Foto / desain**: taruh di kategori ber-layout `gallery` dan isi `gallery` dengan gambarnya.
- `techStack` adalah daftar tag bebas (alat, skill, topik). Boleh kosong.

### Experience (riwayat)

Bagian ini menampilkan pengalaman kerja, organisasi, pendidikan, dan sertifikat dalam satu timeline.
Isi lewat `experience.items` di `site.config.ts`:

```ts
{ kind: 'work',            // work | organization | education | certificate
  title: 'Product Designer',
  organization: 'Nama Perusahaan',
  location: 'Jakarta · Hybrid',
  start: '2024-06',        // tahun-bulan
  current: true,           // masih berjalan → tampil "NOW"  (kalau sudah selesai: current: false + end: '2025-12')
  logo: '/logos/perusahaan.png',   // opsional; kosong = monogram otomatis
  link: 'https://...',             // opsional (link verifikasi)
  image: '/certs/sertifikat.webp', // opsional (gambar sertifikat, tampil sebagai pop-up)
  description: 'Satu atau dua kalimat.' }
```

Kelompok yang kosong otomatis disembunyikan, dan judul tiap kelompok bisa diganti di `experience.kinds`.
Tidak mau bagian ini? Set `experience.show: false`; link di navbar ikut hilang.

### Kategori karya (bebas!)

Di `categories` kamu menentukan sendiri kategorinya, misalnya *Branding, Packaging, Tulisan*, atau *Rumah, Interior*.
Tiap kategori punya `layout`:

| layout | Tampilan | Cocok untuk |
|---|---|---|
| `cards` | kartu besar + halaman detail per project | studi kasus, produk, website, tulisan, arsitektur |
| `video` | daftar video YouTube | film, reels, motion, wawancara |
| `gallery` | kisi foto ala Pinterest | fotografi, desain, ilustrasi, seni |

Tepat **3 kategori** memberi tampilan "bento" di beranda (kartu pertama besar); jumlah lain tampil sebagai kisi rata. 1 sampai 6 kategori paling pas.

### Daftar ikon alat

Di `about.techGroups` (bagian ikon di About), tulis salah satu kata kunci ini agar logonya muncul:
`vite, react, vue, nuxt, next, tailwind, flutter, dart, android, node, supabase, firebase, postgres, html, css, js, figma, github, git, vercel, vscode, premiere, sony, dji, pwa, pinia, gsap, bootstrap, framer, shadcn, lucide`.
Kata lain tetap bisa dipakai, tapi akan tampil dengan ikon umum. Tidak butuh bagian ini? Kosongkan `techGroups: []`.

---

## Online-kan website (Vercel, gratis)

1. Upload folder ini ke repo GitHub milikmu.
2. Buka <https://vercel.com> → **Add New → Project** → pilih repo-mu → **Deploy**. Selesai, kamu dapat alamat `xxx.vercel.app`.
3. Mau domain sendiri? Vercel → Settings → Domains.
4. **Penting**: setelah punya alamat final, isi `site.url` di `site.config.ts` dan baris `Sitemap:` di `public/robots.txt` supaya Google dan preview link benar.

---

## Mode Supabase (admin panel + database)

Ikuti urut. Total sekitar 10 menit.

**1. Buat project Supabase**
- Daftar di <https://supabase.com> → **New project**. Isi nama, password database (simpan), pilih region terdekat (mis. Singapore).

**2. Buat tabel & storage**
- Menu **SQL Editor → New query**.
- Buka file `supabase/schema.sql` di repo ini, salin semua isinya, tempel, klik **Run**.
- Ini membuat tabel, aturan keamanan, bucket gambar `portfolio-images`, dan 3 kategori awal.

**3. Ambil kunci API**
- **Project Settings → API**. Salin **Project URL** dan **anon public key**.

**4. Isi `.env`**
- Salin `.env.example` menjadi `.env`, isi `SUPABASE_URL` dan `SUPABASE_KEY`.
- Di Vercel: **Settings → Environment Variables** → tambahkan dua variabel yang sama, lalu **Redeploy**.

**5. Buat akun admin**
- Supabase: **Authentication → Users → Add user → Create new user**. Isi email + password-mu, centang *Auto Confirm*.
- Lalu **Authentication → Sign In / Providers → Email**: matikan **Allow new users to sign up** supaya orang lain tidak bisa mendaftar.

**6. Aktifkan mode**
- Di `site.config.ts` ubah menjadi `mode: 'supabase'`, jalankan `npm run dev`.
- Buka <http://localhost:3000/admin/login>, masuk dengan akun tadi.

**7. Isi konten**
- `/admin` → tambah project, upload gambar, pin ke Home (*Featured*).
- `/admin/experience` → kelola riwayat (Experience). Tabel kosong = bagian ini tidak tampil sampai kamu menambah entri; tombol *Impor dari site.config.ts* mengisi contoh sekaligus.
- `/admin/categories` → ganti gambar kategori. `/admin/settings` → email kontak, link sosial.
- Mau menambah / mengganti nama kategori? Lewat SQL Editor, contoh:
  ```sql
  insert into main_categories (name, slug, layout_type, sort_order)
  values ('Branding', 'branding', 'cards', 3);
  ```
  (`layout_type` = `cards`, `video`, atau `gallery`). Samakan juga daftar `categories` di `site.config.ts` supaya halaman error dan sitemap ikut benar.
- Teks hero, about, dan watermark tetap diatur di `site.config.ts`.

*(Opsional)* Tombol **Auto Generate AI** di form project butuh `GEMINI_API_KEY` (gratis di <https://aistudio.google.com/apikey>).

---

## Masalah umum

| Gejala | Solusi |
|---|---|
| `npm install` error | pastikan Node 20+ (`node -v`), hapus folder `node_modules` lalu ulangi |
| Gambar tidak muncul | cek penulisan path; harus diawali `/` dan file ada di `public/` |
| Halaman `/admin` 404 | itu normal di mode `local`; ganti ke `mode: 'supabase'` |
| Mode supabase: halaman kosong | cek `.env` terisi, dan `schema.sql` sudah di-Run |
| Gagal login admin | pastikan user dibuat di Supabase Auth dan dicentang *Auto Confirm* |
| Gagal upload gambar | bucket `portfolio-images` belum ada, jalankan ulang `schema.sql` |
| Preview link (WhatsApp/Discord) masih lama | cache platform; tunggu beberapa jam atau pakai `?v=2` di akhir link |
| Ikon sosial tidak muncul | nama `platform` harus salah satu dari daftar di `site.config.ts` |

---

## Struktur folder

```
site.config.ts      ← file yang kamu edit
public/              ← gambar, favicon, og-image
supabase/schema.sql  ← SQL untuk mode supabase
app/components/      ← bagian-bagian halaman
app/pages/           ← halaman (beranda, /work/..., /admin)
app/composables/usePortfolio.js  ← pengambil data (local / supabase)
```

---

## Lisensi & watermark

Dirilis dengan lisensi **MIT**: bebas dipakai, diubah, bahkan untuk project klien / komersial. Syaratnya hanya
file `LICENSE` ikut disertakan.

Di footer ada tulisan kecil *"Template by Wildan · Vixel Creative"*. Kami senang kalau dibiarkan, tapi
kalau mau dihapus cukup `watermark.show: false` di `site.config.ts`.

Font: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) dan [Luxurious Script](https://fonts.google.com/specimen/Luxurious+Script) (Google Fonts, lisensi OFL) untuk tampilan publik; [Clash Display](https://www.fontshare.com) (Fontshare, gratis untuk penggunaan pribadi dan komersial) untuk panel admin. Ikon: Phosphor.

Dibuat oleh **Ahmad Wildan Abdillah** · [idanabdll.me](https://idanabdll.me)

---

## English summary

1. `npm install` → `npm run dev`.
2. Edit **`site.config.ts`**: hero, about, contact, socials, categories, projects. Put images in `public/`.
3. `mode: 'local'` needs no database. For an admin panel, set `mode: 'supabase'`, run `supabase/schema.sql` in the Supabase SQL editor, copy `.env.example` to `.env`, create an admin user in Supabase Auth.
4. Deploy to Vercel, then set `site.url` to your final domain.
5. MIT licensed. The footer watermark can be removed with `watermark.show: false`.
