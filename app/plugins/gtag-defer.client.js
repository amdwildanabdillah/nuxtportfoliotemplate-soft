// Google Analytics tidak lagi dimuat saat halaman pertama dibuka. Ia baru
// dimuat setelah pengunjung menyentuh halaman (scroll/klik/ketik) atau 5 detik,
// jadi tidak ikut membebani skor performa (TBT) di Lighthouse.
export default defineNuxtPlugin((nuxtApp) => {
  const events = ['pointerdown', 'keydown', 'scroll', 'touchstart']
  let started = false
  let timer

  const start = () => {
    if (started) return
    started = true
    clearTimeout(timer)
    events.forEach((e) => window.removeEventListener(e, start))
    try { useGtag().initialize() } catch { /* GA tidak kritis */ }
  }

  nuxtApp.hook('app:mounted', () => {
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }))
    timer = setTimeout(start, 5000)
  })
})
