<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import { getTechDetails } from '~/utils/techIcons'

const supabase = useSupabaseClient()
const projects = ref([])
const mainCategories = ref([])
const subCategories = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const isGenerating = ref(false)

const activeFilter = ref('all')
const showModal = ref(false)
const isEditing = ref(false)
const editId = ref(null)

const subCategoryInput = ref('')
const mediaList = ref([])
const draggedItemIndex = ref(null)
const dragOverItemIndex = ref(null)

const coverFileName = ref('') 
const coverInputText = ref('') 
const bulkCoverFiles = ref([])

const availableStacks = [
  'Android', 'AOS', 'AppSheet', 'Bootstrap', 'CSS', 'Dart', 'Firebase', 'Flutter',
  'Framer Motion', 'Git', 'GitHub', 'GSAP', 'HTML', 'JavaScript', 'Laravel',
  'Lucide', 'Next.js', 'Node.js', 'Nuxt.js', 'Pinia', 'PostgreSQL', 'PWA', 'Python',
  'Radix UI', 'React', 'shadcn/ui', 'Supabase', 'Svelte', 'Tailwind CSS', 'TanStack',
  'Vercel', 'Vite', 'VS Code', 'Vue.js', 'Xubuntu',
  'Adobe After Effects', 'Adobe Illustrator', 'Adobe Lightroom', 
  'Adobe Photoshop', 'Adobe Premiere Pro', 'Canva', 'DJI', 
  'Figma', 'Sony Alpha'
]

const swalConfig = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  background: '#b084ff', 
  color: '#000',
  customClass: {
    container: 'z-[999999]',
    popup: 'rounded-none font-["Clash_Display"] tracking-wider border border-black'
  }
}

const defaultForm = {
  main_category_id: '',
  sub_category_id: null,
  title: '',
  slug: '',
  client_name: '',
  desc_short: '',
  desc_long: '',
  cover_type: 'image', 
  cover_url: '',
  cover_file: null, 
  cover_preview: '',
  tech_stack: [],
  live_url: '',
  github_url: '',
  is_archived: false, // Ganti is_pinned jadi is_archived
  is_featured: false, // Tampil di "Selected Work" beranda 
  sort_order: 0
}

const form = ref({ ...defaultForm })

const extractYouTubeID = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

const getAdminThumbnail = (item) => {
  if (item.cover_type === 'youtube') {
    const id = extractYouTubeID(item.cover_url);
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : 'https://placehold.co/600x400/111/444?text=Video';
  }
  if (item.cover_type === 'drive' || (item.cover_url && item.cover_url.includes('drive.google.com'))) {
    return 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png';
  }
  if ((item.cover_type === 'image' || item.cover_type === 'video') && item.cover_url) {
    return item.cover_url;
  }
  if (item.project_media && item.project_media.length > 0) {
    return item.project_media.sort((a,b) => a.sort_order - b.sort_order)[0].media_url;
  }
  return 'https://placehold.co/600x400/111/444?text=No+Cover';
}

const selectedCategoryName = computed(() => {
  const cat = mainCategories.value.find(c => c.id === form.value.main_category_id)
  return cat ? cat.name.toLowerCase() : ''
})
// Perilaku form mengikuti tata letak kategori (cards / video / gallery), bukan namanya
const selectedLayout = computed(() => layoutOf(mainCategories.value.find(c => c.id === form.value.main_category_id)))
const isDev = computed(() => selectedLayout.value === 'cards')
const isVideo = computed(() => selectedLayout.value === 'video')
const isPhoto = computed(() => selectedLayout.value === 'gallery')

const processCoverFiles = async (files) => {
  if (!files || files.length === 0) return
  coverInputText.value = ''
  
  if (isPhoto.value && files.length > 1) {
    bulkCoverFiles.value = files
    form.value.cover_type = 'image'
    form.value.cover_file = null
    coverFileName.value = `${files.length} Photos ready for Bulk Upload!`
    form.value.cover_preview = URL.createObjectURL(files[0])
  } else {
    bulkCoverFiles.value = []
    const file = files[0]
    form.value.cover_file = file
    form.value.cover_url = ''
    coverFileName.value = file.name

    if (file.type.startsWith('video/')) {
      form.value.cover_type = 'video'
      try {
        const canvas = document.createElement('canvas')
        const video = document.createElement('video')
        video.autoplay = true; video.muted = true; video.src = URL.createObjectURL(file)
        await new Promise((resolve) => {
          video.onloadeddata = () => {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            video.currentTime = Math.min(1, video.duration / 2)
          }
          video.onseeked = () => resolve()
        })
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        form.value.cover_preview = canvas.toDataURL('image/jpeg')
        URL.revokeObjectURL(video.src)
      } catch (e) {
        form.value.cover_preview = '' 
      }
    } else {
      form.value.cover_type = 'image'
      form.value.cover_preview = URL.createObjectURL(file)
    }
  }
}

const handleCoverDrop = (e) => {
  const files = Array.from(e.dataTransfer.files)
  processCoverFiles(files)
}

const handleCoverSelect = (e) => {
  const files = Array.from(e.target.files)
  processCoverFiles(files)
}

watch(coverInputText, (newVal) => {
  if (!newVal) {
    if (!form.value.cover_file && bulkCoverFiles.value.length === 0) {
      form.value.cover_preview = ''; coverFileName.value = ''; form.value.cover_url = ''
    }
    return
  }
  
  form.value.cover_file = null
  bulkCoverFiles.value = []
  form.value.cover_url = newVal
  coverFileName.value = newVal

  const ytId = extractYouTubeID(newVal)
  if (ytId && ytId !== newVal) {
    form.value.cover_type = 'youtube'
    form.value.cover_preview = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
  } else if (newVal.includes('drive.google.com')) {
    form.value.cover_type = 'drive'
    form.value.cover_preview = 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png' 
  } else {
    if (newVal.endsWith('.mp4') || newVal.endsWith('.webm')) form.value.cover_type = 'video'
    else form.value.cover_type = 'image'
    form.value.cover_preview = newVal 
  }
})

watch(() => form.value.main_category_id, (id) => {
  // Ganti kategori saat membuat project baru: urutan ikut menyesuaikan kategorinya
  if (showModal.value && !isEditing.value) form.value.sort_order = nextSortOrder(id)
})

const fetchData = async () => {
  isLoading.value = true
  try {
    const { data: mc } = await supabase.from('main_categories').select('*').order('sort_order')
    mainCategories.value = mc || []
    
    const { data: sc } = await supabase.from('sub_categories').select('*').order('sort_order')
    subCategories.value = sc || []

    const { data: prj, error } = await supabase
      .from('projects')
      .select('*, main_categories(name), sub_categories(name), project_media(*)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      
    if (error) throw error
    projects.value = prj || []
  } catch (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Error Fetching Data', text: error.message })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())

const filteredProjects = computed(() => {
  const list = activeFilter.value === 'all'
    ? projects.value
    : projects.value.filter(p => p.main_categories?.name.toLowerCase() === activeFilter.value)
  // Yang diarsipkan otomatis turun ke bawah (urutan lain tetap)
  return [...list.filter(p => !p.is_archived), ...list.filter(p => p.is_archived)]
})

// --- Susun urutan dengan drag & drop (per kategori, sama seperti galeri) ---
const rowDragId = ref(null)
const rowOverId = ref(null)
const canReorder = computed(() => activeFilter.value !== 'all')

const rowDragStart = (e, item) => {
  if (!canReorder.value) { e.preventDefault(); return }
  rowDragId.value = item.id
  e.dataTransfer.effectAllowed = 'move'
  try { e.dataTransfer.setData('text/plain', item.id) } catch { /* abaikan */ }
}
const rowDragEnter = (item) => { if (rowDragId.value) rowOverId.value = item.id }
const rowDragEnd = () => { rowDragId.value = null; rowOverId.value = null }

const rowDrop = async (target) => {
  const fromId = rowDragId.value
  rowDragEnd()
  if (!canReorder.value || !fromId || fromId === target.id) return

  const list = [...filteredProjects.value]
  const from = list.findIndex(p => p.id === fromId)
  const to = list.findIndex(p => p.id === target.id)
  if (from < 0 || to < 0) return
  const [moved] = list.splice(from, 1)
  list.splice(to, 0, moved)

  // Nomor urut dirapikan 0..n-1 sesuai susunan baru; hanya yang berubah yang disimpan
  const changes = []
  list.forEach((p, i) => { if (p.sort_order !== i) changes.push({ p, from: p.sort_order, to: i }) })
  if (!changes.length) return

  changes.forEach(c => { c.p.sort_order = c.to })
  projects.value = [...projects.value].sort((a, b) =>
    (a.sort_order - b.sort_order) || (new Date(b.created_at) - new Date(a.created_at)))

  const results = await Promise.all(changes.map(c =>
    supabase.from('projects').update({ sort_order: c.to }).eq('id', c.p.id)))
  const failed = results.find(r => r.error)
  if (failed) {
    changes.forEach(c => { c.p.sort_order = c.from })
    projects.value = [...projects.value].sort((a, b) =>
      (a.sort_order - b.sort_order) || (new Date(b.created_at) - new Date(a.created_at)))
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal menyimpan urutan', text: failed.error.message })
  } else {
    Swal.fire({ ...swalConfig, icon: 'success', title: 'Urutan tersimpan' })
  }
}

const filteredSubCategories = computed(() => {
  return subCategories.value.filter(sc => sc.main_category_id === form.value.main_category_id)
})

const generateSlug = () => {
  if (!isEditing.value && form.value.title) {
    const cleanTitle = form.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const randomHash = Math.random().toString(36).substring(2, 6)
    form.value.slug = `${cleanTitle}-${randomHash}`
  }
}

const generateDescriptions = async () => {
  if (!form.value.title) {
    Swal.fire({ ...swalConfig, icon: 'warning', title: 'Oops!', text: 'Isi Title project dulu bos!' })
    return
  }
  
  isGenerating.value = true
  try {
    const payload = {
      title: form.value.title,
      category: selectedCategoryName.value,
      subCategory: subCategoryInput.value,
      techStack: form.value.tech_stack.join(', ')
    }

    const data = await $fetch('/api/generate-desc', {
      method: 'POST',
      body: payload
    })

    form.value.desc_short = data.shortDescription
    form.value.desc_long = data.longDescription
    
    Swal.fire({ ...swalConfig, icon: 'success', title: 'Magic Applied! ✨' })
  } catch (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal Generate', text: error.message })
  } finally {
    isGenerating.value = false
  }
}


// Urutan default project baru = paling belakang di kategorinya (bukan 0)
const nextSortOrder = (catId) => {
  const orders = projects.value
    .filter(p => p.main_category_id === catId)
    .map(p => Number(p.sort_order) || 0)
  return orders.length ? Math.max(...orders) + 1 : 0
}

const openAddModal = () => {
  isEditing.value = false
  editId.value = null
  mediaList.value = []
  subCategoryInput.value = ''
  coverInputText.value = ''
  coverFileName.value = ''
  bulkCoverFiles.value = []
  const firstCat = mainCategories.value[0]?.id || ''
  form.value = { ...defaultForm, main_category_id: firstCat, sort_order: nextSortOrder(firstCat) }
  showModal.value = true
}

const openEditModal = (p) => {
  isEditing.value = true
  editId.value = p.id
  bulkCoverFiles.value = []
  form.value = { ...p, cover_file: null, tech_stack: p.tech_stack || [] }
  
  const matchedSub = subCategories.value.find(sc => sc.id === p.sub_category_id)
  subCategoryInput.value = matchedSub ? matchedSub.name : ''
  
  coverFileName.value = p.cover_url || ''
  coverInputText.value = '' 
  if (p.cover_type === 'youtube') form.value.cover_preview = `https://img.youtube.com/vi/${extractYouTubeID(p.cover_url)}/maxresdefault.jpg`
  else if (p.cover_type === 'drive') form.value.cover_preview = 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png'
  else form.value.cover_preview = p.cover_url

  if (p.project_media && p.project_media.length > 0) {
    mediaList.value = p.project_media.sort((a, b) => a.sort_order - b.sort_order).map((m) => ({ id: 'old-' + m.id, type: 'existing', url: m.media_url, preview: m.media_url, db_id: m.id }))
  } else { mediaList.value = [] }
  
  showModal.value = true
}

const closeModal = () => {
  if (isSaving.value) return
  mediaList.value.forEach(m => { if (m.type === 'new') URL.revokeObjectURL(m.preview) })
  if (form.value.cover_file && form.value.cover_type === 'image') URL.revokeObjectURL(form.value.cover_preview)
  if (bulkCoverFiles.value.length > 0) URL.revokeObjectURL(form.value.cover_preview)
  showModal.value = false
}

// Nama berkas untuk label thumbnail. Berkas baru: nama asli dari komputer.
// Berkas yang sudah tersimpan: bagian terakhir dari URL storage.
const mediaName = (m) => {
  if (m.type === 'new') return m.file?.name || 'berkas baru'
  try { return decodeURIComponent((m.url || '').split('?')[0].split('/').pop() || '') } catch { return (m.url || '').split('/').pop() }
}
// Nama asli ikut disimpan di path storage supaya nanti mudah dikenali
const safeName = (name) => (name || '').replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)

const handleGallerySelect = (e) => {
  const files = Array.from(e.target.files)
  files.forEach(file => { mediaList.value.push({ id: 'new-' + Date.now() + Math.random(), type: 'new', file: file, preview: URL.createObjectURL(file) }) })
  e.target.value = ''
}
const removeMedia = (index) => {
  const media = mediaList.value[index]
  if (media.type === 'new') URL.revokeObjectURL(media.preview)
  mediaList.value.splice(index, 1)
}
const handleDragStart = (e, index) => { draggedItemIndex.value = index; e.dataTransfer.effectAllowed = 'move' }
const handleDragEnter = (index) => { if (draggedItemIndex.value !== null) dragOverItemIndex.value = index }
const handleDrop = (index) => {
  if (draggedItemIndex.value === null || draggedItemIndex.value === index) return handleDragEnd()
  const itemToMove = mediaList.value[draggedItemIndex.value]
  mediaList.value.splice(draggedItemIndex.value, 1)
  mediaList.value.splice(index, 0, itemToMove)
  handleDragEnd()
}
const handleDragEnd = () => { draggedItemIndex.value = null; dragOverItemIndex.value = null }
const moveMedia = (index, direction) => {
  if (index + direction < 0 || index + direction >= mediaList.value.length) return
  const temp = mediaList.value[index]
  mediaList.value[index] = mediaList.value[index + direction]
  mediaList.value[index + direction] = temp
}

const saveProject = async () => {
  isSaving.value = true
  try {
    let finalSubCategoryId = form.value.sub_category_id

    if (subCategoryInput.value && subCategoryInput.value.trim() !== '') {
      const typedName = subCategoryInput.value.trim()
      const existingSub = subCategories.value.find(sc => sc.name.toLowerCase() === typedName.toLowerCase() && sc.main_category_id === form.value.main_category_id)
      if (existingSub) { finalSubCategoryId = existingSub.id } 
      else {
        const newSlug = typedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        const { data: newSubData, error: newSubErr } = await supabase.from('sub_categories').insert([{ main_category_id: form.value.main_category_id, name: typedName, slug: newSlug, is_active: true, sort_order: subCategories.value.length + 1 }]).select('id').single()
        if (newSubErr) throw newSubErr
        finalSubCategoryId = newSubData.id
        const { data: sc } = await supabase.from('sub_categories').select('*').order('sort_order')
        subCategories.value = sc || []
      }
    } else { finalSubCategoryId = null }

    const baseTitle = form.value.title || (isPhoto.value ? `Photo Capture` : `Untitled Project`)
    const baseSlug = form.value.slug || (isPhoto.value ? `photo-${Date.now()}` : `untitled-${Date.now()}`)

    if (isPhoto.value && bulkCoverFiles.value.length > 1) {
      for (let i = 0; i < bulkCoverFiles.value.length; i++) {
        const file = bulkCoverFiles.value[i]
        const ext = file.name.split('.').pop()
        const filename = `covers/${Date.now()}-${i}-${safeName(file.name)}.${ext}`
        
        const { error: upErr } = await supabase.storage.from('portfolio-images').upload(filename, file)
        if (upErr) throw upErr
        
        const publicUrl = supabase.storage.from('portfolio-images').getPublicUrl(filename).data.publicUrl

        const projectPayload = {
          main_category_id: form.value.main_category_id,
          sub_category_id: finalSubCategoryId,
          title: `${baseTitle} 0${i + 1}`,
          slug: `${baseSlug}-${i + 1}`,
          client_name: form.value.client_name,
          desc_short: form.value.desc_short,
          desc_long: form.value.desc_long,
          cover_type: 'image',
          cover_url: publicUrl,
          is_archived: form.value.is_archived,
          sort_order: form.value.sort_order + i 
        }

        const { error: insErr } = await supabase.from('projects').insert([projectPayload])
        if (insErr) throw insErr
      }
    } else {
      let finalCoverUrl = form.value.cover_url
      if (form.value.cover_file) {
        const ext = form.value.cover_file.name.split('.').pop()
        const filename = `covers/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('portfolio-images').upload(filename, form.value.cover_file)
        if (upErr) throw upErr
        finalCoverUrl = supabase.storage.from('portfolio-images').getPublicUrl(filename).data.publicUrl
      }

      const projectPayload = {
        main_category_id: form.value.main_category_id,
        sub_category_id: finalSubCategoryId,
        title: baseTitle,
        slug: baseSlug,
        client_name: form.value.client_name,
        desc_short: form.value.desc_short,
        desc_long: form.value.desc_long,
        cover_type: form.value.cover_type, 
        cover_url: finalCoverUrl,
        tech_stack: form.value.tech_stack,
        live_url: form.value.live_url,
        github_url: form.value.github_url,
        is_archived: form.value.is_archived,
        is_featured: !!form.value.is_featured,
        sort_order: form.value.sort_order
      }

      let savedProjectId = editId.value

      if (isEditing.value) {
        const { error } = await supabase.from('projects').update(projectPayload).eq('id', editId.value)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('projects').insert([projectPayload]).select('id').single()
        if (error) throw error
        savedProjectId = data.id
      }

      await supabase.from('project_media').delete().eq('project_id', savedProjectId)
      const mediaInserts = []
      for (let i = 0; i < mediaList.value.length; i++) {
        const item = mediaList.value[i]
        let mediaUrl = item.url
        if (item.type === 'new') {
          const ext = item.file.name.split('.').pop()
          const filename = `gallery/${savedProjectId}-${Date.now()}-${i}-${safeName(item.file.name)}.${ext}`
          const { error: upErr } = await supabase.storage.from('portfolio-images').upload(filename, item.file)
          if (upErr) throw upErr
          mediaUrl = supabase.storage.from('portfolio-images').getPublicUrl(filename).data.publicUrl
        }
        mediaInserts.push({ project_id: savedProjectId, media_type: 'image', media_url: mediaUrl, sort_order: i })
      }
      if (mediaInserts.length > 0) {
        const { error: medErr } = await supabase.from('project_media').insert(mediaInserts)
        if (medErr) throw medErr
      }
    }

    Swal.fire({ ...swalConfig, icon: 'success', title: isEditing.value ? 'Project Updated!' : 'Project Published!' })
    closeModal()
    fetchData()
  } catch (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Save Failed', text: error.message })
  } finally {
    isSaving.value = false
  }
}

// Fungsi Toggle Arsip Langsung dari Tabel Admin
const toggleArchive = async (item) => {
  const newStatus = !item.is_archived
  const { error } = await supabase.from('projects').update({ is_archived: newStatus }).eq('id', item.id)
  if (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal Update', text: error.message })
  } else {
    item.is_archived = newStatus
    Swal.fire({ ...swalConfig, icon: 'success', title: newStatus ? 'Project Di-arsipkan 📦' : 'Project Dipublikasikan ✨' })
  }
}

// Pin = tampil di "Selected Work" beranda (kategori mana pun). Jumlah yang tampil diatur featured.maxItems di site.config.ts.
const isDevProject = () => true

const togglePin = async (item) => {
  const next = !item.is_featured
  const { error } = await supabase.from('projects').update({ is_featured: next }).eq('id', item.id)
  if (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal pin', text: /is_featured/.test(error.message) ? 'Kolom is_featured belum ada. Jalankan SQL-nya dulu di Supabase.' : error.message })
    return
  }
  item.is_featured = next
  const pinned = projects.value.filter(p => p.is_featured && isDevProject(p) && !p.is_archived).length
  if (next && pinned > 3) {
    Swal.fire({ ...swalConfig, icon: 'info', title: `Sudah ${pinned} pin`, text: 'Di Home hanya beberapa teratas (menurut urutan) yang tampil.' })
  } else {
    Swal.fire({ ...swalConfig, icon: 'success', title: next ? 'Dipin ke Home 📌' : 'Pin dilepas' })
  }
}

const deleteProject = async (id) => {
  const res = await Swal.fire({
    title: 'Hapus Project?',
    text: "Data yang dihapus tidak bisa dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
    background: '#0a0a0a',
    color: '#fff',
    confirmButtonColor: '#ff5f56',
    cancelButtonColor: '#222',
    customClass: {
      container: 'z-[999999]',
      popup: 'rounded-none font-["Clash_Display"] tracking-wider border border-white/20'
    }
  })
  
  if (res.isConfirmed) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal Hapus', text: error.message })
    } else {
      Swal.fire({ ...swalConfig, icon: 'success', title: 'Project Berhasil Dihapus!' })
      fetchData()
    }
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col h-full relative overflow-y-auto">
    
    <div class="sticky top-0 z-20 flex flex-col">
      <div class="mb-6">
        <h1 class="text-3xl font-['Clash_Display'] tracking-wide text-white mb-2">Projects Manager.</h1>
        <p class="text-[#aaa] text-[10px] uppercase tracking-[0.2em]">Manage all your brutalist digital crafts</p>
      </div>

      <div class="flex gap-2 overflow-x-auto hide-scrollbar mb-8 border-b border-white/10 pb-4">
        <button @click="activeFilter = 'all'" :class="['px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors whitespace-nowrap', activeFilter === 'all' ? 'bg-[#b084ff] text-black border-[#b084ff]' : 'bg-transparent text-[#666] border-white/10 hover:border-white hover:text-white']">All</button>
        <button v-for="c in mainCategories" :key="c.id" @click="activeFilter = c.name.toLowerCase()" :class="['px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors whitespace-nowrap', activeFilter === c.name.toLowerCase() ? 'bg-[#b084ff] text-black border-[#b084ff]' : 'bg-transparent text-[#666] border-white/10 hover:border-white hover:text-white']">{{ c.name }}</button>
      </div>
    </div>

    <div v-if="isLoading" class="py-20 text-center flex flex-col items-center">
      <Icon name="ph:spinner-gap" class="text-4xl animate-spin text-[#b084ff] mb-4" />
      <p class="text-[10px] uppercase tracking-widest font-bold text-[#aaa]">Loading Database...</p>
    </div>
    
    <div v-else class="bg-[#0a0a0a] border border-white/10 overflow-x-auto shadow-2xl rounded-none pb-32">
      <p class="px-8 pt-5 m-0 text-[10px] uppercase tracking-[0.2em] text-[#666]">
        <template v-if="canReorder"><Icon name="ph:hand-grabbing-fill" class="text-[#b084ff]" /> Tahan lalu geser baris untuk mengatur urutan</template>
        <template v-else>Pilih satu kategori di atas untuk mengatur urutan dengan drag</template>
      </p>
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead class="bg-white/5 border-b border-white/10 text-[9px] font-bold text-[#aaa] uppercase tracking-[0.2em]">
          <tr>
            <th class="p-5 pl-8 text-center w-20">Status</th> <!-- Ganti Pin jadi Status Archive -->
            <th class="p-5 w-24">Preview</th>
            <th class="p-5">Title & Client</th>
            <th class="p-5">Category</th>
            <th class="p-5 text-center">Order</th>
            <th class="p-5 pr-8 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-[#ccc]">
          <tr
            v-for="item in filteredProjects"
            :key="item.id"
            :draggable="canReorder"
            @dragstart="rowDragStart($event, item)"
            @dragenter.prevent="rowDragEnter(item)"
            @dragover.prevent
            @drop.prevent="rowDrop(item)"
            @dragend="rowDragEnd"
            :class="['transition-colors group', item.is_archived ? 'opacity-40 bg-white/[02%]' : 'hover:bg-white/5', canReorder ? 'cursor-grab' : '', rowDragId === item.id ? '!opacity-30' : '', rowOverId === item.id && rowDragId !== item.id ? 'bg-[#b084ff]/15 outline outline-1 -outline-offset-1 outline-[#b084ff]/60' : '']"
          >
            <!-- Tombol Status Archive Langsung di Tabel -->
            <td class="p-5 pl-8 text-center">
              <div class="flex items-center justify-center gap-3">
              <button v-if="isDevProject(item)" type="button" @click="togglePin(item)" :title="item.is_featured ? 'Dipin di Home. Klik untuk lepas pin' : 'Pin ke Home (Selected Work)'" class="cursor-pointer">
                <Icon :name="item.is_featured ? 'ph:push-pin-fill' : 'ph:push-pin'" :class="item.is_featured ? 'text-[#00d2ff]' : 'text-[#555] hover:text-[#00d2ff]'" class="text-xl transition-colors" />
              </button>
              <button @click="toggleArchive(item)" :title="item.is_archived ? 'Archived (Hidden from FE). Click to Unarchive' : 'Active. Click to Archive'" class="cursor-pointer">
                <Icon :name="item.is_archived ? 'ph:archive-box-fill' : 'ph:eye'" :class="item.is_archived ? 'text-[#ff5f56]' : 'text-[#b084ff]'" class="text-xl" />
              </button>
              </div>
            </td>
            <td class="p-5"><img :src="getAdminThumbnail(item)" class="w-16 h-10 object-cover border border-white/10 bg-black" alt="Thumb" /></td>
            <td class="p-5">
              <div class="font-bold text-white text-base font-['Clash_Display'] flex items-center gap-2">
                {{ item.title }}
                <span v-if="item.is_archived" class="text-[8px] bg-[#ff5f56]/20 text-[#ff5f56] px-1.5 py-0.5 border border-[#ff5f56]/30 uppercase">Archived</span>
              </div>
              <div class="text-[10px] text-[#666] mt-1">{{ item.client_name || '-' }}</div>
            </td>
            <td class="p-5">
              <span class="px-2 py-1 bg-white/5 text-[9px] uppercase border border-white/10 font-bold text-[#aaa] mr-2">{{ item.main_categories?.name }}</span>
              <span v-if="item.sub_categories?.name" class="text-[9px] text-[#b084ff]">/ {{ item.sub_categories?.name }}</span>
            </td>
            <td class="p-5 text-center font-mono text-xs">
              <span class="inline-flex items-center gap-2">
                <Icon v-if="canReorder" name="ph:dots-six-vertical" class="text-lg text-[#b084ff]" />
                {{ item.sort_order }}
              </span>
            </td>
            <td class="p-5 pr-8 text-right">
              <button @click="openEditModal(item)" class="w-8 h-8 bg-transparent border border-white/20 text-[#aaa] hover:text-[#b084ff] hover:border-[#b084ff] inline-flex items-center justify-center mr-2 transition-colors"><Icon name="ph:pencil-simple" class="text-lg" /></button>
              <button @click="deleteProject(item.id)" class="w-8 h-8 bg-transparent border border-white/20 text-[#aaa] hover:text-[#ff5f56] hover:border-[#ff5f56] inline-flex items-center justify-center transition-colors"><Icon name="ph:trash" class="text-lg" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[90] flex items-center gap-3">
      <button @click="openAddModal" class="h-14 px-8 bg-white text-black border border-white flex items-center justify-center font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-[#b084ff] hover:border-[#b084ff] hover:text-white transition-all rounded-none">
        <Icon name="ph:plus" class="text-lg mr-2" /><span>New Project</span>
      </button>
    </div>


    <ClientOnly>
      <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-[99999] bg-[#050505]/95 backdrop-blur-md flex items-center justify-center p-0 md:p-6 overflow-hidden" @click.self="closeModal">
          <div class="bg-[#0a0a0a] border border-white/10 w-full h-full md:h-[90vh] md:max-w-5xl shadow-2xl flex flex-col rounded-none relative overflow-hidden">
            
            <div class="p-5 md:p-6 border-b border-white/10 flex justify-between items-center bg-[#111] shrink-0 z-20">
              <h2 class="text-xl md:text-2xl font-['Clash_Display'] font-bold text-white">{{ isEditing ? 'Edit Project.' : 'New Project.' }}</h2>
              <button @click="closeModal" class="text-[#666] hover:text-[#ff5f56] hover:bg-[#ff5f56]/10 transition border border-transparent hover:border-[#ff5f56]/30 p-2 cursor-pointer"><Icon name="ph:x" class="text-xl" /></button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar min-h-0">
              <form class="space-y-8" @submit.prevent>
                
                <!-- Kategori & Status Arsip di Modal -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-white/10 pb-8">
                  <div class="space-y-2">
                    <label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Main Category</label>
                    <select v-model="form.main_category_id" class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] appearance-none rounded-none">
                      <option v-for="c in mainCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </div>
                  
                  <div class="space-y-2">
                    <label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Sub Category</label>
                    <input type="text" v-model="subCategoryInput" list="subcategories-list" placeholder="Ketik atau pilih..." class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none placeholder-[#444]">
                    <datalist id="subcategories-list"><option v-for="sc in filteredSubCategories" :key="sc.id" :value="sc.name" /></datalist>
                  </div>

                  <div class="flex items-end">
                    <label class="flex items-center gap-3 cursor-pointer w-full bg-[#111] border border-white/10 p-3 hover:border-[#b084ff] transition-colors h-[46px]">
                      <input type="checkbox" v-model="form.is_featured" class="hidden">
                      <div :class="['w-4 h-4 border flex items-center justify-center transition-colors', form.is_featured ? 'bg-[#b084ff] border-[#b084ff]' : 'border-white/30']">
                        <Icon v-if="form.is_featured" name="ph:check-bold" class="text-black text-xs" />
                      </div>
                      <span class="text-[10px] uppercase tracking-widest text-[#aaa]">Featured di Home</span>
                    </label>
                  </div>

                  <div class="flex items-end">
                    <label class="flex items-center gap-3 cursor-pointer w-full bg-[#111] border border-white/10 p-3 hover:border-[#ff5f56] transition-colors h-[46px]">
                      <input type="checkbox" v-model="form.is_archived" class="hidden">
                      <div :class="['w-4 h-4 border flex items-center justify-center transition-colors', form.is_archived ? 'bg-[#ff5f56] border-[#ff5f56]' : 'border-white/30']">
                        <Icon v-if="form.is_archived" name="ph:check-bold" class="text-black text-xs" />
                      </div>
                      <span class="text-[10px] uppercase tracking-widest text-[#aaa]">Archive (Hide from FE)</span>
                    </label>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Title <span v-if="isPhoto" class="text-[#b084ff]">(Opsional)</span></label>
                    <input v-model="form.title" @input="generateSlug" class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none">
                  </div>
                  <div v-if="isDev" class="space-y-2"><label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Client Name</label><input v-model="form.client_name" class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none"></div>
                  <div class="space-y-2"><label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Sort Order (0 = First)</label><input type="number" v-model="form.sort_order" class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none font-mono"></div>
                </div>

                <div class="grid grid-cols-1 gap-6">
                  <div class="flex justify-between items-center border-b border-white/10 pb-4 mt-4">
                    <h3 class="text-[10px] font-bold text-[#b084ff] uppercase tracking-[0.2em]">Story & Details</h3>
                    <button @click="generateDescriptions" :disabled="isGenerating" type="button" class="bg-[#b084ff]/10 hover:bg-[#b084ff] text-[#b084ff] hover:text-black border border-[#b084ff]/30 px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                      <Icon :name="isGenerating ? 'ph:spinner-gap' : 'ph:magic-wand-fill'" :class="{ 'animate-spin': isGenerating }" />
                      {{ isGenerating ? 'Generating...' : 'Auto Generate AI ✨' }}
                    </button>
                  </div>

                  <div class="space-y-2">
                    <label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Short Description <span v-if="isPhoto" class="text-[#b084ff]">(Opsional)</span></label>
                    <textarea v-model="form.desc_short" rows="2" class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none resize-none"></textarea>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Long Description <span v-if="isPhoto" class="text-[#b084ff]">(Opsional)</span></label>
                    <textarea v-model="form.desc_long" rows="4" class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none custom-scrollbar"></textarea>
                  </div>
                </div>

                <div class="border-t border-white/10 pt-8">
                  <label class="text-[10px] text-[#b084ff] font-bold uppercase tracking-[0.2em] mb-4 block">
                     Cover Media (Smart Detect: Upload / Drag / Link)
                  </label>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col gap-4">
                      <input v-model="coverInputText" placeholder="Paste link YouTube / Google Drive / URL di sini..." class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none">
                      
                      <div class="flex items-center gap-4">
                        <span class="text-[#666] text-xs font-bold uppercase">OR</span>
                        <input type="file" id="cover-upload" accept="image/*,video/*" :multiple="isPhoto" @change="handleCoverSelect" class="hidden">
                        <label for="cover-upload" class="cursor-pointer bg-[#111] hover:bg-[#b084ff] hover:text-black text-white px-5 py-3 border border-white/10 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 flex-1">
                          <Icon name="ph:upload-simple" class="text-base" /> Upload File (Img/Vid)
                        </label>
                      </div>

                      <div v-if="coverFileName" class="mt-2 text-[10px] uppercase tracking-widest text-[#b084ff] truncate border border-[#b084ff]/30 bg-[#b084ff]/10 p-2">
                        <Icon name="ph:check-circle" class="mr-1" /> {{ coverFileName }}
                      </div>
                    </div>

                    <div @dragover.prevent @drop.prevent="handleCoverDrop" class="w-full h-32 md:h-full min-h-[120px] bg-[#050505] border-2 border-dashed border-white/20 hover:border-[#b084ff] transition-colors relative flex items-center justify-center group overflow-hidden">
                      <div v-if="form.cover_preview" class="absolute inset-0 z-10 bg-black">
                        <img :src="form.cover_preview" class="w-full h-full object-cover opacity-80" />
                        <div class="absolute inset-0 flex items-center justify-center">
                          <span class="bg-black/80 text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1 border border-white/20">
                            {{ form.cover_type }} Preview
                          </span>
                        </div>
                      </div>
                      <div v-else class="text-center text-[#666] group-hover:text-white transition-colors z-0">
                        <Icon name="ph:image" class="text-3xl mb-1" />
                        <p class="text-[9px] uppercase font-bold tracking-widest">Drag & Drop Here</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="isDev" class="border-t border-white/10 pt-8">
                  <label class="text-[10px] text-[#b084ff] font-bold uppercase tracking-[0.2em] mb-4 block">Project Details</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="space-y-2"><label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Live URL</label><input v-model="form.live_url" class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none"></div>
                    <div class="space-y-2"><label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">GitHub URL</label><input v-model="form.github_url" class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none"></div>
                  </div>
                  
                  <div class="flex flex-wrap gap-2 bg-[#111] p-4 border border-white/10 max-h-[150px] overflow-y-auto custom-scrollbar">
                    <label v-for="t in availableStacks" :key="t" class="flex items-center gap-2 cursor-pointer group py-1.5 px-3 bg-[#0a0a0a] border border-white/10 hover:border-[#b084ff] transition-colors">
                      <input type="checkbox" :value="t" v-model="form.tech_stack" class="hidden">
                      <div :class="['w-3 h-3 border flex items-center justify-center transition-colors shrink-0', form.tech_stack.includes(t) ? 'bg-[#b084ff] border-[#b084ff]' : 'border-white/30']"></div>
                      <div v-if="getTechDetails(t).type === 'svg'" v-html="getTechDetails(t).content" class="flex items-center justify-center grayscale-0 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      <span class="text-[9px] font-bold text-[#aaa] group-hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap">{{ t }}</span>
                    </label>
                  </div>
                </div>

                <div v-if="!isVideo && (!isPhoto || bulkCoverFiles.length <= 1)" class="border-t border-white/10 pt-8">
                  <div class="flex justify-between items-end mb-4">
                    <div>
                      <label class="text-[10px] text-[#b084ff] font-bold uppercase tracking-[0.2em] block">Project Gallery</label>
                      <p class="text-[9px] text-[#666] mt-1"><Icon name="ph:hand-grabbing-fill" class="text-[#b084ff]" /> Drag & Drop to reorder</p>
                    </div>
                    <input type="file" multiple accept="image/*" id="gallery-upload" @change="handleGallerySelect" class="hidden">
                    <label for="gallery-upload" class="cursor-pointer bg-transparent hover:bg-white text-[#aaa] hover:text-black px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 border border-white/20">
                      <Icon name="ph:plus" class="text-sm" /> Add Images
                    </label>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#111] p-4 border border-white/10 min-h-[160px]">
                    <div v-if="mediaList.length === 0" class="col-span-full flex flex-col items-center justify-center py-8 text-[#444]">
                      <Icon name="ph:images" class="text-3xl mb-2" />
                      <span class="text-[9px] font-bold uppercase tracking-widest">No gallery images yet</span>
                    </div>
                    <div v-for="(media, idx) in mediaList" :key="media.id" draggable="true" @dragstart="handleDragStart($event, idx)" @dragenter.prevent="handleDragEnter(idx)" @dragover.prevent @drop.prevent="handleDrop(idx)" @dragend="handleDragEnd" :class="['relative group border bg-black overflow-hidden aspect-video cursor-grab active:cursor-grabbing transition-all duration-200', draggedItemIndex === idx ? 'opacity-40 scale-95 border-transparent' : 'border-white/10', dragOverItemIndex === idx && draggedItemIndex !== idx ? 'border-[#b084ff] ring-2 ring-[#b084ff]/50' : '']">
                      <img :src="media.preview" class="w-full h-full object-cover pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />
                      <span class="absolute top-1 left-1 z-10 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 pointer-events-none">{{ idx + 1 }}</span>
                      <span v-if="media.type === 'new'" class="absolute top-1 right-1 z-10 bg-[#b084ff] text-black text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider pointer-events-none">Baru</span>
                      <div class="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/90 to-transparent px-2 pt-6 pb-1.5 pointer-events-none">
                        <p class="text-[9px] text-white/90 leading-tight truncate" :title="mediaName(media)">{{ mediaName(media) }}</p>
                      </div>
                      <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                        <button @click.prevent="moveMedia(idx, -1)" :disabled="idx === 0" class="w-8 h-8 bg-black hover:bg-[#b084ff] hover:text-black text-white flex items-center justify-center border border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><Icon name="ph:caret-left" class="text-lg" /></button>
                        <button @click.prevent="removeMedia(idx)" class="w-8 h-8 bg-black hover:bg-[#ff5f56] text-white flex items-center justify-center border border-white/20 transition-colors"><Icon name="ph:trash" class="text-lg" /></button>
                        <button @click.prevent="moveMedia(idx, 1)" :disabled="idx === mediaList.length - 1" class="w-8 h-8 bg-black hover:bg-[#b084ff] hover:text-black text-white flex items-center justify-center border border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><Icon name="ph:caret-right" class="text-lg" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div class="p-5 md:p-6 border-t border-white/10 bg-[#111] flex justify-end gap-4 shrink-0 z-25">
              <button @click="closeModal" :disabled="isSaving" class="text-[#666] font-bold text-[10px] uppercase tracking-widest px-6 py-3 hover:text-white transition-colors">Cancel</button>
              <button @click="saveProject" :disabled="isSaving" class="bg-white hover:bg-[#b084ff] text-black px-8 py-3.5 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center border border-white hover:border-[#b084ff]">
                <Icon v-if="isSaving" name="ph:spinner-gap" class="animate-spin text-lg mr-2" /> {{ isSaving ? 'Processing DB...' : (isEditing ? 'Update Project' : 'Publish Project') }}
              </button>
            </div>

          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 0px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #b084ff; }
</style>