<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import LayoutCards from '~/components/work/LayoutCards.vue'
import LayoutVideo from '~/components/work/LayoutVideo.vue'
import LayoutGallery from '~/components/work/LayoutGallery.vue'
import ProjectModal from '~/components/work/ProjectModal.vue'

const { site, profile } = usePortfolioConfig()
const portfolio = usePortfolio()
const route = useRoute()
const slug = computed(() => route.params.slug)

// --- MESIN PINTAR MEDIA (YT, MP4, WEBM) ---
const getVideoInfo = (url) => {
  if (!url) return { type: 'unknown', url: '' }
  // Kalau YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)
    const id = (match && match[2].length === 11) ? match[2] : url
    return { 
      type: 'youtube', 
      id: id, 
      embedUrl: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=0`,
      thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    }
  }
  // Kalau File Video Mentah
  if (url.endsWith('.webm') || url.endsWith('.mp4')) return { type: 'video', url: url }
  // Fallback Link Biasa
  return { type: 'link', url: url }
}


const SITE = site.url

const isScrolled = ref(false)

// Data diambil di server (SSR): daftar karya sudah ada di HTML pertama,
// terbaca Google, dan halaman terasa jauh lebih cepat.
const loadCategoryData = async () => {
  const res = await portfolio.categoryWithProjects(slug.value)
  const list = res.projects.map(p => {
    const media = [...(p.project_media || [])].sort((a, b) => a.sort_order - b.sort_order)
    const vInfo = getVideoInfo(p.cover_url)
    return { ...p, gallery: media.map(m => m.media_url), videoInfo: vInfo,
      thumbnail: vInfo.type === 'youtube' ? vInfo.thumbnail : p.cover_url }
  })
  // Susunan acak ala Pinterest khusus foto
  if (layoutOf(res.currentCategory) === 'gallery') list.sort(() => Math.random() - 0.5)
  return { ...res, projects: list }
}

const { data: pageData, pending } = await useAsyncData(
  () => `work-${slug.value}`,
  loadCategoryData,
  { watch: [slug] }
)

if (!pageData.value?.currentCategory) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
}

const categories = computed(() => pageData.value?.categories || [])
const currentCategory = computed(() => pageData.value?.currentCategory || {})
const projects = computed(() => pageData.value?.projects || [])
const isLoading = computed(() => pending.value && !pageData.value)

const defaultDescs = {
  cards: 'A curated selection of projects and case studies.',
  video: 'Moving images and sound, one story at a time.',
  gallery: 'Single frames that say more than words can.',
}
const categoryDesc = computed(() =>
  currentCategory.value?.description || defaultDescs[layoutOf(currentCategory.value)] || 'A curated collection of works.')

const handleScroll = () => { isScrolled.value = window.scrollY > 60 }


useSeoMeta({
  title: () => `${currentCategory.value.name} | ${profile.name}`,
  description: () => categoryDesc.value,
  ogTitle: () => `${currentCategory.value.name} | ${profile.name}`,
  ogDescription: () => categoryDesc.value,
  ogUrl: () => `${SITE}/work/${slug.value}`,
  ogImage: `${SITE}${site.ogImage}`,
  twitterCard: 'summary_large_image',
})
useHead({ link: [{ rel: 'canonical', href: () => `${SITE}/work/${slug.value}` }] })

// Modal Logic
const activeProject = ref(null)
const currentImageIndex = ref(0)
const openModal = (project) => {
  // Kategori 'cards' punya halaman detail sendiri (URL tetap, bisa dibagikan dan diindeks)
  if (layoutOf(currentCategory.value) === 'cards' && project.slug) {
    return navigateTo(`/work/${slug.value}/${project.slug}`)
  }
  activeProject.value = project; currentImageIndex.value = 0; document.body.style.overflow = 'hidden'
}
const closeModal = () => { activeProject.value = null; document.body.style.overflow = 'auto' }
const nextImage = () => { if (activeProject.value?.gallery.length > 0) currentImageIndex.value = (currentImageIndex.value + 1) % activeProject.value.gallery.length }
const prevImage = () => { if (activeProject.value?.gallery.length > 0) currentImageIndex.value = (currentImageIndex.value - 1 + activeProject.value.gallery.length) % activeProject.value.gallery.length }
const setImage = (index) => { currentImageIndex.value = index }

const handleKeydown = (e) => {
  if (!activeProject.value) return
  if (e.key === 'Escape') closeModal()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  // Tautan lama / dari beranda (?p=<id>): buka detail proyek yang dimaksud
  const wanted = route.query.p
  if (wanted) {
    const target = projects.value.find(x => String(x.id) === String(wanted))
    if (target) openModal(target)
  }
})
onUnmounted(() => { 
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-[#FFF8F5] text-[#4A3548]">
    <div class="blob blob-pink -left-40 top-0 h-[520px] w-[520px]"></div>
    <div class="blob blob-lilac -right-40 top-1/3 h-[520px] w-[520px]"></div>

    <header class="fixed left-1/2 top-4 z-[1000] w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-full border border-white/80 bg-white/75 px-4 py-2.5 shadow-[0_14px_40px_-18px_rgba(232,120,159,0.55)] backdrop-blur-xl md:px-6">
      <div class="flex items-center justify-between gap-3">
        <NuxtLink to="/#work-section" class="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#FFE3EC] px-4 py-2 text-[13px] font-bold text-[#B24D74] transition-colors hover:bg-[#E8789F] hover:text-white">
          <Icon name="ph:arrow-left" class="text-base transition-transform group-hover:-translate-x-0.5" />
          <span class="hidden sm:inline">Back to Home</span><span class="sm:hidden">Back</span>
        </NuxtLink>

        <div class="hide-scrollbar flex gap-1.5 overflow-x-auto">
          <NuxtLink v-for="cat in categories" :key="cat.id" :to="`/work/${cat.slug}`" class="cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-300" :class="slug === cat.slug ? 'bg-gradient-to-r from-[#E8789F] to-[#f08fb0] text-white shadow-md' : 'text-[#8B7385] hover:bg-[#FFE3EC] hover:text-[#B24D74]'">
            {{ cat.name }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="relative z-10 mx-auto w-full max-w-6xl px-5 pb-32 pt-36 md:px-10 md:pt-44">
      <div class="mb-14 border-b border-[#4A3548]/10 pb-10 md:mb-20 md:pb-12" data-aos="fade-up">
        <h1 class="f-display m-0 mb-4 text-5xl font-light tracking-tight md:text-[5.5rem]">
          {{ isLoading ? 'Loading...' : (currentCategory.name || 'Category') }}<span class="f-script text-gradient font-semibold">.</span>
        </h1>
        <p class="m-0 max-w-lg text-base leading-relaxed text-[#8B7385]">{{ categoryDesc }}</p>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <span class="animate-pulse text-sm font-bold text-[#E8789F]">Loading...</span>
      </div>

      <div v-else-if="projects.length > 0">
        <LayoutCards v-if="layoutOf(currentCategory) === 'cards'" :projects="projects" @open-modal="openModal" />
        <LayoutVideo v-else-if="layoutOf(currentCategory) === 'video'" :projects="projects" @open-modal="openModal" />
        <LayoutGallery v-else-if="layoutOf(currentCategory) === 'gallery'" :projects="projects" @open-modal="openModal" />
      </div>

      <div v-else class="py-20 text-center text-sm text-[#8B7385]">Nothing here yet.</div>
    </main>

    <Transition name="fade">
      <ProjectModal
        v-if="activeProject"
        :active-project="activeProject"
        :current-image-index="currentImageIndex"
        @close="closeModal"
        @next="nextImage"
        @prev="prevImage"
        @set-image="setImage"
      />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
