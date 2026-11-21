// Pengganti AOS (data-aos="fade-up" dst. tetap dipakai di template).
// Hanya elemen yang masih di bawah layar yang disembunyikan lalu dimunculkan saat
// terlihat; isi di layar pertama dan HTML dari server tidak pernah disembunyikan.
// Posisi dibaca sekaligus (batch) supaya tidak memicu forced reflow berulang.
export default defineNuxtPlugin((nuxtApp) => {
  if (typeof IntersectionObserver === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.setAttribute('data-aos-state', 'in')
        io.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -80px 0px' }
  )

  const queue = []
  let scheduled = false

  const flush = () => {
    scheduled = false
    const items = queue.splice(0).filter((el) => el.isConnected)
    const limit = window.innerHeight - 80
    const tops = items.map((el) => el.getBoundingClientRect().top) // hanya membaca
    items.forEach((el, i) => {
      // Muat pertama (HTML dari server): yang sudah di layar jangan disembunyikan (LCP).
      // Setelah itu (pindah halaman / konten baru): semuanya dianimasikan, termasuk yang
      // langsung terlihat, supaya efek reveal terasa di setiap halaman.
      if (tops[i] < limit && !el.__aosAll) return
      el.style.setProperty('--aos-delay', `${el.dataset.aosDelay || 0}ms`)
      el.style.setProperty('--aos-duration', `${el.dataset.aosDuration || 800}ms`)
      el.setAttribute('data-aos-state', 'out')
      io.observe(el)
    })
  }

  let initialScanDone = false
  const scan = () => {
    const animateAll = initialScanDone
    initialScanDone = true
    document.querySelectorAll('[data-aos]:not([data-aos-seen])').forEach((el) => {
      el.setAttribute('data-aos-seen', '')
      el.__aosAll = animateAll
      queue.push(el)
    })
    if (queue.length && !scheduled) {
      scheduled = true
      requestAnimationFrame(flush)
    }
  }

  nuxtApp.hook('app:mounted', () => {
    scan()
    // Elemen yang muncul belakangan (setelah data dimuat atau pindah halaman)
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true })
  })
})
