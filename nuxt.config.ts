import siteConfig from './site.config'

const isSupabase = siteConfig.mode === 'supabase'
const { site, profile, socials } = siteConfig
const ogImage = site.ogImage.startsWith('http') ? site.ogImage : site.url + site.ogImage
const gaId = site.googleAnalyticsId

// Domain gambar yang diizinkan (Supabase Storage dibaca dari .env)
const supabaseHost = (() => {
  try { return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).host : '' } catch { return '' }
})()

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    // Modul Supabase hanya aktif di mode 'supabase' → mode 'local' tidak butuh .env apa pun
    ...(isSupabase ? ['@nuxtjs/supabase'] : []),
    '@nuxtjs/sitemap',
    '@nuxt/image',
    '@nuxt/icon',
    '@vercel/speed-insights/nuxt',
    '@vercel/analytics',
    'nuxt-gtag',
  ],

  // Google Analytics: aktif hanya kalau site.googleAnalyticsId diisi. Dimuat setelah pengunjung berinteraksi.
  gtag: {
    enabled: !!gaId,
    id: gaId || undefined,
    initMode: 'manual',
  },

  router: {
    options: { scrollBehaviorType: 'instant' },
  },

  // Ikon Phosphor sebagai SVG inline (tanpa CDN). Nama ikon yang ditulis dinamis harus didaftarkan di sini.
  icon: {
    serverBundle: 'local',
    clientBundle: {
      scan: true,
      icons: [
        'ph:x', 'ph:list', 'ph:squares-four', 'ph:code', 'ph:camera', 'ph:film-strip',
        'ph:archive-box-fill', 'ph:eye', 'ph:spinner-gap', 'ph:magic-wand-fill',
        'ph:check-circle-fill', 'ph:circle', 'ph:push-pin', 'ph:push-pin-fill', 'ph:dots-six-vertical',
        // ikon sosial media (dipakai site.config.ts → socials)
        'ph:github-logo', 'ph:instagram-logo', 'ph:linkedin-logo', 'ph:youtube-logo', 'ph:behance-logo',
        'ph:discord-logo', 'ph:x-logo', 'ph:tiktok-logo', 'ph:facebook-logo', 'ph:telegram-logo',
        'ph:whatsapp-logo', 'ph:dribbble-logo', 'ph:twitch-logo', 'ph:spotify-logo', 'ph:medium-logo',
      ],
    },
  },

  image: {
    domains: [supabaseHost, 'images.unsplash.com', 'img.youtube.com', 'i.ytimg.com'].filter(Boolean),
    format: ['avif', 'webp'],
  },

  site: { url: site.url },
  sitemap: {
    exclude: ['/admin/**'],
    sources: ['/api/__sitemap__/urls'],
    urls: ['/', ...siteConfig.categories.map(c => `/work/${c.slug}`)],
  },

  // Di mode 'local', halaman /admin dihapus (404) karena tidak ada database untuk dikelola
  hooks: {
    'pages:extend'(pages) {
      if (isSupabase) return
      for (let i = pages.length - 1; i >= 0; i--) {
        if (pages[i].path.startsWith('/admin')) pages.splice(i, 1)
      }
    },
  },

  ...(isSupabase ? { supabase: { redirect: false, types: false } } : {}),

  runtimeConfig: {
    // Opsional: kunci Gemini untuk tombol "Auto Generate AI" di admin (mode supabase)
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },

  app: {
    head: {
      htmlAttrs: { lang: site.language },
      title: site.title,
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: site.description },
        { name: 'author', content: profile.name },
        { name: 'theme-color', content: site.themeColor },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: site.url + '/' },
        { property: 'og:title', content: site.title },
        { property: 'og:description', content: site.description },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: site.title },
        { name: 'twitter:description', content: site.description },
        { name: 'twitter:image', content: ogImage },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
      noscript: [
        { innerHTML: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Luxurious+Script&display=swap">' },
      ],
      script: [
        // CSS font disisipkan lewat skrip supaya tidak memblokir render
        { innerHTML: "(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Luxurious+Script&display=swap';document.head.appendChild(l)})()", tagPosition: 'head' },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profile.name,
            url: site.url,
            image: ogImage,
            jobTitle: profile.jobTitle,
            description: site.description,
            sameAs: socials.map(s => s.url),
          }),
        },
      ],
    },
  },
})
