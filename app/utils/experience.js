// Jenis entri Experience. Label tampilannya bisa diganti di site.config.ts → experience.kinds
export const EXPERIENCE_KINDS = [
  { value: 'work', label: 'Experience' },
  { value: 'organization', label: 'Organizations' },
  { value: 'education', label: 'Education' },
  { value: 'certificate', label: 'Certificates' },
]

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const fmt = (d) => {
  if (!d) return ''
  const [y, m] = String(d).split('-')
  return `${MONTHS[(parseInt(m, 10) || 1) - 1]} ${y}`
}

// "AUG 2025 — NOW", "SEP 2024 — SEP 2025", atau satu tanggal untuk sertifikat
export const formatPeriod = (e, nowLabel = 'NOW') => {
  const start = fmt(e.period_start)
  const end = e.is_current ? nowLabel : fmt(e.period_end)
  if (start && end) return `${start} — ${end}`
  return start || end || ''
}

// Logo: logo_url bila ada, kalau tidak monogram dari huruf awal organisasi
export const experienceLogo = (e) => {
  if (e.logo_url) return { type: 'img', src: e.logo_url }
  const words = (e.organization || e.title || '?').replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean)
  const letters = (words.length > 1 ? words[0][0] + words[1][0] : (words[0] || '?').slice(0, 2)).toUpperCase()
  return { type: 'text', text: letters }
}

// Item di site.config.ts (start: '2025-08', end: '2026-01', current: true) → bentuk baris tabel
export const experienceFromConfig = (items = []) => items.map((x, i) => ({
  id: `cfg-${i}`,
  kind: x.kind || 'work',
  title: x.title,
  organization: x.organization || null,
  location: x.location || null,
  period_start: x.start ? `${x.start}-01` : null,
  period_end: x.end && !x.current ? `${x.end}-01` : null,
  is_current: !!x.current,
  description: x.description || null,
  link_url: x.link || null,
  image_url: x.image || null,
  logo_url: x.logo || null,
  sort_order: (i + 1) * 10,
  is_visible: true,
}))
