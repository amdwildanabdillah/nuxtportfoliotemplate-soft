// Tiga tata letak halaman kategori: 'cards' (kartu + halaman detail), 'video', 'gallery' (foto/masonry).
// Nama lama (development / videography / photography) tetap dikenali agar data lama tidak rusak.
const MAP = {
  cards: 'cards', development: 'cards',
  video: 'video', videography: 'video',
  gallery: 'gallery', photography: 'gallery',
}
export const layoutOf = (category) => MAP[category?.layout_type] || 'cards'
