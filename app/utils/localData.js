// Mengubah isi site.config.ts (mode 'local') menjadi bentuk data yang SAMA dengan
// baris tabel Supabase, supaya komponen tidak perlu tahu data datang dari mana.
export const buildLocalData = (cfg) => {
  const categories = (cfg.categories || []).map((c, i) => ({
    id: c.slug,
    slug: c.slug,
    name: c.name,
    layout_type: c.layout,
    bento_image_url: c.image || null,
    description: c.description || '',
    sort_order: i,
  }))

  const projects = (cfg.projects || []).map((p, i) => ({
    id: p.slug || `p-${i}`,
    slug: p.slug,
    title: p.title,
    main_category_id: p.category,
    category_slug: p.category,
    sub_categories: p.subCategory ? { name: p.subCategory } : null,
    desc_short: p.short || '',
    desc_long: p.long || '',
    cover_url: p.cover || '',
    cover_type: p.coverType || 'image',
    tech_stack: p.techStack || [],
    live_url: p.liveUrl || '',
    github_url: p.githubUrl || '',
    client_name: p.client || '',
    is_featured: !!p.featured,
    is_archived: !!p.archived,
    sort_order: i,
    created_at: p.date || null,
    project_media: (p.gallery || []).map((u, n) => ({ media_url: u, sort_order: n })),
  })).filter(p => !p.is_archived)

  return { categories, projects }
}
