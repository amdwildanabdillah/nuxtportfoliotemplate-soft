// Tautan seperti "/#work-section" hanya perlu untuk lompat sekali. Kalau hash-nya
// dibiarkan di URL, refresh akan selalu melompat lagi ke bagian itu walau pembaca
// sudah scroll ke atas. Setelah lompatan selesai, hash dibuang dari URL.
export default defineNuxtPlugin((nuxtApp) => {
  const strip = () => {
    if (!window.location.hash) return
    const clean = window.location.pathname + window.location.search
    window.history.replaceState(window.history.state, '', clean)
  }
  nuxtApp.hook('page:finish', () => {
    if (window.location.hash) setTimeout(strip, 900)
  })
  nuxtApp.hook('app:mounted', () => {
    if (window.location.hash) setTimeout(strip, 1500)
  })
})
