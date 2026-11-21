// Daftar URL dinamis untuk sitemap: halaman detail project.
// Mode 'local'    → dari site.config.ts
// Mode 'supabase' → dari database (anon key, hanya data publik)
import siteConfig from '../../../site.config'

export default defineCachedEventHandler(async () => {
  if (siteConfig.mode !== 'supabase') {
    const cats = new Set(siteConfig.categories.map(c => c.slug))
    return siteConfig.projects
      .filter(p => p.slug && cats.has(p.category) && !p.archived)
      .map(p => ({ loc: `/work/${p.category}/${p.slug}` }))
  }

  const { createClient } = await import('@supabase/supabase-js')
  const { url, key } = useRuntimeConfig().public.supabase || {}
  if (!url || !key) return []
  try {
    const supabase = createClient(url, key)
    const { data } = await supabase
      .from('projects')
      .select('slug, created_at, main_categories(slug)')
      .eq('is_archived', false)
    return (data || [])
      .filter(p => p.slug && p.main_categories?.slug)
      .map(p => ({ loc: `/work/${p.main_categories.slug}/${p.slug}`, lastmod: p.created_at }))
  } catch {
    return []
  }
}, { maxAge: 60 * 60 })
