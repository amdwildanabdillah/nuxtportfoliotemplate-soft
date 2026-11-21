<script setup>
// SEO global: semua nilainya diambil dari site.config.ts
const { site } = usePortfolioConfig()
const img = site.ogImage.startsWith('http') ? site.ogImage : site.url + site.ogImage

useSeoMeta({
  title: site.title,
  description: site.description,
  ogType: 'website',
  ogUrl: site.url + '/',
  ogTitle: site.title,
  ogDescription: site.description,
  ogImage: img,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterTitle: site.title,
  twitterDescription: site.description,
  twitterImage: img,
})
</script>

<template>
  <NuxtLoadingIndicator color="#E8789F" height="3" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* 1. TEMA "SOFT": pastel, terang, lembut
   Semua warna utama ada di sini; ubah variabel untuk mengganti suasana. */
:root {
  --bg: #FFF8F5;       /* krem hangat */
  --blush: #FFE3EC;    /* pink muda */
  --lilac: #EBE3FF;    /* lilac muda */
  --ink: #4A3548;      /* teks utama (plum tua, bukan hitam) */
  --muted: #8B7385;    /* teks pendukung */
  --pink: #E8789F;     /* aksen utama */
  --violet: #9F85E8;   /* aksen kedua */
  --line: rgba(74, 53, 72, 0.12);
  --shadow: 0 18px 50px -20px rgba(232, 120, 159, 0.45);
}
html { scroll-padding-top: 88px; }
body {
  background-color: var(--bg);
  color: var(--ink);
  font-family: 'Nunito', system-ui, sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}
/* Huruf: judul serif lembut, aksen tulisan tangan */
.f-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
.f-script { font-family: 'Dancing Script', cursive; }

/* 2. LATAR: gumpalan warna lembut (gradien radial, ringan) */
.blob { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; }
.blob-pink { background: radial-gradient(circle, rgba(255, 190, 212, 0.75) 0%, transparent 68%); }
.blob-lilac { background: radial-gradient(circle, rgba(199, 180, 255, 0.6) 0%, transparent 68%); }
.blob-peach { background: radial-gradient(circle, rgba(255, 214, 190, 0.7) 0%, transparent 68%); }

/* Teks bergradasi pink -> lilac */
.text-gradient { background: linear-gradient(100deg, var(--pink), var(--violet)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; display: inline-block; }

/* Kartu putih dengan bayangan pink lembut */
.card-soft { background: #fff; border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 28px; box-shadow: var(--shadow); }

/* Tombol berbentuk pil */
.btn-pill { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 30px; border-radius: 999px; font-size: 14px; font-weight: 700; letter-spacing: .02em; transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease, color .25s ease; cursor: pointer; }
.btn-pink { background: linear-gradient(100deg, var(--pink), #f08fb0); color: #fff; box-shadow: 0 12px 30px -10px rgba(232, 120, 159, .7); }
.btn-pink:hover { transform: translateY(-2px); box-shadow: 0 16px 34px -10px rgba(232, 120, 159, .85); }
.btn-ghost { background: rgba(255, 255, 255, .7); color: var(--ink); border: 1.5px solid rgba(74, 53, 72, .15); }
.btn-ghost:hover { background: #fff; border-color: var(--pink); color: var(--pink); }

/* Label kecil berbentuk pil */
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: var(--blush); color: #B24D74; font-size: 12px; font-weight: 700; letter-spacing: .04em; }
.chip-lilac { background: var(--lilac); color: #6E55C4; }

/* Animasi masuk di layar pertama (CSS murni, jalan sebelum JavaScript siap) */
.fade-in-up { opacity: 0; animation: fadeInUp 1s forwards; }
.fade-in-down { opacity: 0; animation: fadeInDown 1s forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-26px); } to { opacity: 1; transform: translateY(0); } }
.delay-1 { animation-delay: 0.2s; } .delay-2 { animation-delay: 0.4s; } .delay-3 { animation-delay: 0.6s; } .delay-4 { animation-delay: 0.8s; }
@keyframes floaty { 0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); } 50% { transform: translateY(-10px) rotate(var(--r, 0deg)); } }
.floaty { animation: floaty 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .floaty { animation: none; } }

/* 3. MUNCUL SAAT DIGULIR (dipicu plugins/reveal.client.js; atribut data-aos tetap dipakai) */
[data-aos-state] {
  transition:
    opacity var(--aos-duration, 900ms) cubic-bezier(0.25, 0.8, 0.25, 1),
    transform var(--aos-duration, 900ms) cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-delay: var(--aos-delay, 0ms);
}
[data-aos-state="out"] { opacity: 0; will-change: opacity, transform; }
[data-aos="fade-up"][data-aos-state="out"] { transform: translate3d(0, 36px, 0); }
[data-aos="fade-down"][data-aos-state="out"] { transform: translate3d(0, -36px, 0); }
[data-aos="fade-right"][data-aos-state="out"] { transform: translate3d(-36px, 0, 0); }
[data-aos="zoom-in"][data-aos-state="out"] { transform: scale(0.94); }
:where([data-aos-state="in"]) { opacity: 1; transform: none; }
</style>
