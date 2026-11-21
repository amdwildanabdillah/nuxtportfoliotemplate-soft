/**
 * ============================================================
 *  SITE CONFIG  —  satu-satunya file yang perlu kamu edit
 *  The ONLY file you need to edit to make this site yours.
 * ============================================================
 *
 *  Cara pakai (singkat):
 *  1. Ganti semua teks di bawah ini dengan milikmu.
 *  2. Taruh gambar di folder /public, lalu tulis path-nya (contoh: '/foto-saya.webp').
 *  3. Jalankan `npm run dev` untuk melihat hasilnya.
 *
 *  Panduan lengkap ada di README.md
 */

export default {
  // ──────────────────────────────────────────────────────────
  // 1. MODE DATA  (pilih salah satu)
  //
  //   'local'    → semua isi (project, kategori, kontak) dibaca dari file ini.
  //                Tidak perlu database / akun apa pun. Paling gampang.
  //
  //   'supabase' → project dikelola lewat halaman /admin dan disimpan di
  //                database Supabase (gratis). Perlu setup sekali, ikuti README.
  // ──────────────────────────────────────────────────────────
  mode: 'local' as 'local' | 'supabase',

  // ──────────────────────────────────────────────────────────
  // 2. INFO SITUS (untuk Google, WhatsApp, Discord, dll.)
  // ──────────────────────────────────────────────────────────
  site: {
    url: 'https://example.com', // alamat websitemu (tanpa garis miring di akhir)
    title: 'Your Name - Creative Portfolio',
    description: 'Portfolio of Your Name. Write one sentence about what you do.',
    language: 'en', // 'id' untuk Indonesia, 'en' untuk Inggris
    ogImage: '/og-image.png', // gambar preview saat link dibagikan (ukuran 1200x630)
    themeColor: '#FFF8F5',
    googleAnalyticsId: '', // contoh: 'G-XXXXXXXXXX' — kosongkan kalau tidak pakai
  },

  // ──────────────────────────────────────────────────────────
  // 3. PROFIL
  // ──────────────────────────────────────────────────────────
  profile: {
    name: 'Your Name',
    location: 'Your City',
    jobTitle: 'Your Job Title',
    email: 'hello@example.com',
    whatsapp: '', // format internasional tanpa + atau spasi, contoh: '6281234567890'. Kosong = tombol WA disembunyikan
  },

  // ──────────────────────────────────────────────────────────
  // 4. NAVBAR
  // ──────────────────────────────────────────────────────────
  nav: {
    logo: 'YOURNAME.',
    connectLabel: 'Connect',
    // Link tambahan di navbar (CV, deck, dll.). Hapus isinya kalau tidak perlu.
    extraLinks: [
      // { label: 'Resume', url: 'https://example.com/cv.pdf' },
    ] as { label: string; url: string }[],
  },

  // ──────────────────────────────────────────────────────────
  // 5. HERO (bagian paling atas)
  // ──────────────────────────────────────────────────────────
  hero: {
    eyebrow: 'Your Name · Your City',
    line1: 'Your Headline',
    line2: 'Goes Here.', // baris kedua yang diberi highlight
    description: 'Write one or two sentences about what you do and who you help.',
    primaryButton: 'See Projects', // menggulir ke bagian project
    secondaryButton: 'Let\'s Talk', // membuka WhatsApp (butuh profile.whatsapp)
    tagline: 'Your Role | Your Craft | Your Niche', // dipisah tanda | , tampil sebagai label kecil
    photo: '/placeholder/profile.webp', // foto di hero (rasio 4:5 paling pas)
  },

  // ──────────────────────────────────────────────────────────
  // 6. BAGIAN-BAGIAN HALAMAN
  // ──────────────────────────────────────────────────────────
  featured: {
    eyebrow: 'Selected Work',
    titleBefore: 'Featured',
    titleHighlight: 'work.',
    linkLabel: 'See all work',
    emptyText: 'No featured projects yet.',
    maxItems: 3,
  },

  work: {
    titleBefore: 'Explore',
    titleHighlight: 'my work.',
    worksLabel: 'works', // tulisan di samping jumlah karya, mis. "5 works"
  },

  about: {
    badge: 'Who Am I?',
    headingBefore: 'A little',
    headingHighlight: 'about me.',
    photo: '/placeholder/profile.webp', // ganti dengan fotomu (rasio 4:5 paling pas)
    // Tiap item = satu paragraf
    paragraphs: [
      'Hi, I\'m Your Name. Write a short introduction about yourself here: what you do, what you care about, and what drives your work.',
      'Add a second paragraph about your studio, your company, or how you like to work with clients.',
    ],
    // Ikon alat / skill (opsional). Hapus semua isinya `[]` kalau tidak mau menampilkannya.
    // `key` harus salah satu dari daftar di README (bagian "Daftar ikon alat"); kata lain tampil dengan ikon umum.
    techGroups: [
      { label: 'Tools', tools: [
        { key: 'figma', name: 'Figma' }, { key: 'github', name: 'GitHub' }, { key: 'vscode', name: 'VS Code' },
      ] },
    ] as { label: string; tools: { key: string; name: string }[] }[],
  },

  // ──────────────────────────────────────────────────────────
  // 6b. EXPERIENCE (pengalaman, organisasi, pendidikan, sertifikat)
  //     `show: false` = seluruh bagian dan link navbar-nya disembunyikan.
  //     Mode 'local'    → isi dari `items` di bawah.
  //     Mode 'supabase' → isi dari /admin/experience (items di bawah hanya contoh / bahan impor).
  // ──────────────────────────────────────────────────────────
  experience: {
    show: true,
    eyebrow: 'Experience',
    titleBefore: 'My',
    titleHighlight: 'journey.',
    nowLabel: 'NOW', // tulisan untuk entri yang masih berjalan
    resumeLabel: 'Resume', // tombol di kanan judul; kosongkan `resumeUrl` kalau tidak perlu
    resumeUrl: '',
    // Judul tiap kelompok. Kelompok tanpa isi otomatis disembunyikan.
    kinds: { work: 'Experience', organization: 'Organizations', education: 'Education', certificate: 'Certificates' },
    // kind    : 'work' | 'organization' | 'education' | 'certificate'
    // start/end: 'YYYY-MM'. Entri berjalan: current: true (end diabaikan)
    // logo    : path / URL logo organisasi (kosong = monogram otomatis)
    // link    : link bukti / verifikasi (opsional). image: gambar sertifikat (opsional)
    items: [
      { kind: 'work', title: 'Job Title', organization: 'Company Name', location: 'City · Hybrid',
        start: '2024-06', current: true, logo: '', link: '', image: '',
        description: 'One or two sentences about what you did, what you shipped, and the impact you had.' },
      { kind: 'work', title: 'Previous Role', organization: 'Another Company', location: 'City',
        start: '2022-01', end: '2024-05', current: false, logo: '', link: '', image: '',
        description: 'Describe the role briefly. Keep it concrete.' },
      { kind: 'organization', title: 'Volunteer / Community Role', organization: 'Organization Name', location: 'City',
        start: '2021-03', end: '2022-03', current: false, logo: '', link: '', image: '',
        description: '' },
      { kind: 'education', title: 'Degree or Program', organization: 'University / School Name', location: 'City',
        start: '2018-08', end: '2022-07', current: false, logo: '', link: '', image: '', description: '' },
      { kind: 'certificate', title: 'Certificate Name', organization: 'Issuing Organization', location: '',
        start: '2023-09', current: false, logo: '', link: 'https://example.com/verify', image: '', description: '' },
    ] as {
      kind: 'work' | 'organization' | 'education' | 'certificate'; title: string; organization?: string; location?: string
      start?: string; end?: string; current?: boolean; description?: string; logo?: string; link?: string; image?: string
    }[],
  },

  contact: {
    eyebrow: 'Get in touch',
    headingBefore: 'have a project in mind?',
    headingHighlight: 'let\'s talk.',
    ctaLabel: 'SAY HELLO', // tombol ke WhatsApp (kalau profile.whatsapp diisi) atau ke email
    footerTagline: 'Thanks for stopping by. Let\'s make something great together.',
    venturesLabel: 'My Ventures', // kosongkan `ventures` kalau tidak perlu
    ventures: [
      // { label: 'My Studio', url: 'https://example.com', color: '#00d2ff' },
    ] as { label: string; url: string; color?: string }[],
    copyright: 'All rights reserved.',
  },

  // Ikon sosial media di footer. `platform` = nama ikon (github, instagram, linkedin, youtube,
  // behance, discord, x, tiktok, facebook, telegram, whatsapp, dribbble, twitch, spotify, medium)
  socials: [
    { platform: 'github', url: 'https://github.com/your-username' },
    { platform: 'instagram', url: 'https://instagram.com/your-username' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/your-username' },
    // { platform: 'youtube', url: 'https://youtube.com/@your-username' },
  ] as { platform: string; url: string }[],

  // ──────────────────────────────────────────────────────────
  // 7. KATEGORI KARYA
  //    Kamu bebas menentukan nama dan jumlah kategori (1 sampai 6 paling pas).
  //    `layout` memilih tampilan halaman kategorinya:
  //      'cards'   → kartu besar + halaman detail tiap project (portofolio, studi kasus, produk, tulisan)
  //      'video'   → daftar video YouTube (cover = link YouTube)
  //      'gallery' → kisi foto ala Pinterest (foto, desain, ilustrasi)
  //    Tepat 3 kategori = tampilan "bento" di beranda. Jumlah lain = kisi rata.
  // ──────────────────────────────────────────────────────────
  categories: [
    { slug: 'projects', name: 'Projects', layout: 'cards', image: '/placeholder/cover-1.webp',
      description: 'A selection of things I have built and worked on.' },
    { slug: 'videos', name: 'Videos', layout: 'video', image: '/placeholder/cover-2.webp',
      description: 'Moving images and sound, one story at a time.' },
    { slug: 'gallery', name: 'Gallery', layout: 'gallery', image: '/placeholder/cover-3.webp',
      description: 'Single frames that say more than words can.' },
  ] as { slug: string; name: string; layout: 'cards' | 'video' | 'gallery'; image: string; description?: string }[],

  // ──────────────────────────────────────────────────────────
  // 8. PROJECT  (hanya dipakai di mode 'local')
  //    Salin satu blok { ... } untuk menambah project baru.
  //
  //    category   : harus sama dengan `slug` salah satu kategori di atas
  //    cover      : gambar (path di /public atau URL penuh). Untuk video: link YouTube.
  //    coverType  : 'image' | 'youtube'   (kategori 'video' biasanya 'youtube')
  //    techStack  : daftar tag / alat / skill (boleh kosong)
  //    gallery    : daftar gambar tambahan (opsional)
  //    featured   : true = tampil di bagian "Selected Work" di beranda (dari kategori mana pun)
  // ──────────────────────────────────────────────────────────
  projects: [
    {
      title: 'Sample Project One',
      slug: 'sample-project-one',
      category: 'projects',
      subCategory: 'Branding',
      cover: '/placeholder/cover-1.webp',
      coverType: 'image',
      short: 'A short one or two sentence summary shown on the project card.',
      long: 'A longer description for the project page.\nExplain the problem, your approach, and the result. Line breaks are kept.',
      techStack: ['Strategy', 'Design'], // tag / alat yang dipakai
      liveUrl: 'https://example.com',
      githubUrl: '', // link kedua (repo, file, dsb.)
      client: 'Client or Company Name',
      featured: true,
      gallery: [] as string[],
    },
    {
      title: 'Sample Project Two',
      slug: 'sample-project-two',
      category: 'projects',
      subCategory: 'Product',
      cover: '/placeholder/cover-2.webp',
      coverType: 'image',
      short: 'Another example project. Replace it with your own work.',
      long: '',
      techStack: ['Research', 'Prototype'],
      liveUrl: '',
      githubUrl: '',
      client: '',
      featured: true,
      gallery: [] as string[],
    },
    {
      title: 'Sample Project Three',
      slug: 'sample-project-three',
      category: 'projects',
      subCategory: 'Campaign',
      cover: '/placeholder/cover-3.webp',
      coverType: 'image',
      short: 'A third example so the featured row looks complete.',
      long: '',
      techStack: ['Writing'],
      liveUrl: '',
      githubUrl: '',
      client: '',
      featured: true,
      gallery: [] as string[],
    },
    {
      title: 'Sample Video',
      slug: 'sample-video',
      category: 'videos',
      subCategory: 'Film',
      cover: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', // ganti dengan link YouTube-mu
      coverType: 'youtube',
      short: 'Paste a YouTube link as the cover to show a video.',
      long: '',
      techStack: [] as string[],
      liveUrl: '',
      githubUrl: '',
      client: '',
      featured: false,
      gallery: [] as string[],
    },
    {
      title: 'Sample Photo',
      slug: 'sample-photo',
      category: 'gallery',
      subCategory: 'Series',
      cover: '/placeholder/cover-3.webp',
      coverType: 'image',
      short: 'Gallery categories use a masonry grid.',
      long: '',
      techStack: [] as string[],
      liveUrl: '',
      githubUrl: '',
      client: '',
      featured: false,
      gallery: [] as string[],
    },
  ],

  // ──────────────────────────────────────────────────────────
  // 9. FOOTER WATERMARK
  //    Terima kasih kalau kamu membiarkan ini menyala :)
  //    Lisensi MIT mengizinkanmu menghapusnya — set `show: false`.
  // ──────────────────────────────────────────────────────────
  watermark: {
    show: true,
    text: 'Template by',
    label: 'Wildan · Vixel Creative',
    url: 'https://idanabdll.me',
  },
}
