// Menggulir ke sebuah bagian di beranda dan menentukan bagian yang sedang dibaca.
// (Nama berkas dipertahankan agar komponen lain tidak perlu berubah.)
const OFFSET = 88 // tinggi navbar melayang + sedikit jarak

export const useStackScroll = () => {
  const scrollToSection = (id) => {
    if (id === 'hero-section') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET + 1
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // Bagian yang sedang "dipegang" pembaca: yang awalnya sudah lewat 40% tinggi layar
  const activeSectionId = (ids) => {
    const line = window.innerHeight * 0.4
    let active = ids[0]
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top <= line) active = id
    }
    return active
  }

  return { scrollToSection, activeSectionId }
}
