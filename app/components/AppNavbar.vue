<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const { nav, experience } = usePortfolioConfig()
// Data Experience sudah diambil di halaman beranda (kunci 'experiences'); tampilkan link hanya bila ada isinya
const { data: expItems } = useNuxtData('experiences')
const showExperience = computed(() => experience.show && (expItems.value?.length || 0) > 0)
const portfolio = usePortfolio()
const activeSection = ref('hero-section')
const isMobileMenuOpen = ref(false)
const portfolioUrl = ref('') 

const fetchSettings = async () => {
  try {
    const s = await portfolio.settings()
    if (s.portfolio_url) portfolioUrl.value = s.portfolio_url
  } catch (err) {
    console.error('Failed to load settings:', err)
  }
}

const { scrollToSection: jumpTo, activeSectionId } = useStackScroll()
const links = computed(() => [
  { id: 'hero-section', label: 'Home' },
  { id: 'featured-section', label: 'Projects' },
  { id: 'work-section', label: 'Work' },
  ...(showExperience.value ? [{ id: 'experience-section', label: 'Experience' }] : []),
  { id: 'about-section', label: 'About' },
])
const sectionIds = computed(() => [...links.value.map(l => l.id), 'contact-section'])

const scrollToSection = (id) => {
  jumpTo(id)
  isMobileMenuOpen.value = false
}

let ticking = false
const handleScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    const nearBottom = window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 150
    activeSection.value = nearBottom ? 'contact-section' : activeSectionId(sectionIds.value)
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  fetchSettings()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div>
    <nav class="fixed left-1/2 top-4 z-[1000] flex w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-full border border-white/80 bg-white/75 px-5 py-2.5 shadow-[0_14px_40px_-18px_rgba(232,120,159,0.55)] backdrop-blur-xl md:px-7">

      <!-- Logo -->
      <a href="#" @click.prevent="scrollToSection('hero-section')" class="f-script text-[36px] font-normal leading-none text-[#E8789F]">{{ nav.logo }}</a>

      <!-- Menu desktop -->
      <ul class="m-0 hidden list-none items-center gap-1 p-0 md:flex">
        <li v-for="item in links" :key="item.id">
          <a href="#" @click.prevent="scrollToSection(item.id)" class="rounded-full px-4 py-2 text-[14px] font-semibold text-[#8B7385] transition-colors duration-300 hover:text-[#E8789F]" :class="{ '!bg-[#FFE3EC] !text-[#B24D74]': activeSection === item.id }">{{ item.label }}</a>
        </li>
        <li v-for="l in nav.extraLinks" :key="l.url">
          <a :href="l.url" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 rounded-full px-4 py-2 text-[14px] font-semibold text-[#9F85E8] transition-colors hover:text-[#E8789F]">{{ l.label }} <Icon name="ph:arrow-up-right-bold" class="text-[11px]" /></a>
        </li>
        <li v-if="portfolioUrl">
          <a :href="portfolioUrl" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 rounded-full px-4 py-2 text-[14px] font-semibold text-[#9F85E8] transition-colors hover:text-[#E8789F]">Deck <Icon name="ph:arrow-up-right-bold" class="text-[11px]" /></a>
        </li>
      </ul>

      <!-- Tombol Connect -->
      <a href="#" @click.prevent="scrollToSection('contact-section')" class="hidden rounded-full bg-gradient-to-r from-[#E8789F] to-[#f08fb0] px-6 py-2.5 text-[14px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(232,120,159,0.8)] transition-transform duration-300 hover:-translate-y-0.5 md:block">{{ nav.connectLabel }}</a>

      <!-- Toggle mobile -->
      <button aria-label="Open Navigation Menu" class="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE3EC] text-2xl text-[#B24D74] md:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <Icon :name="isMobileMenuOpen ? 'ph:x' : 'ph:list'" />
      </button>
    </nav>

    <!-- Menu mobile -->
    <div v-if="isMobileMenuOpen" class="fixed left-1/2 top-[76px] z-[999] flex w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 flex-col gap-1 rounded-[28px] border border-white/80 bg-white/95 p-3 shadow-[0_24px_60px_-20px_rgba(232,120,159,0.55)] backdrop-blur-xl md:hidden">
      <a v-for="item in links" :key="item.id" href="#" @click.prevent="scrollToSection(item.id)" class="rounded-2xl px-5 py-3.5 text-[15px] font-semibold text-[#8B7385]" :class="{ 'bg-[#FFE3EC] !text-[#B24D74]': activeSection === item.id }">{{ item.label }}</a>
      <a v-for="l in nav.extraLinks" :key="l.url" :href="l.url" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between rounded-2xl px-5 py-3.5 text-[15px] font-semibold text-[#9F85E8]">{{ l.label }} <Icon name="ph:arrow-up-right-bold" /></a>
      <a v-if="portfolioUrl" :href="portfolioUrl" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between rounded-2xl px-5 py-3.5 text-[15px] font-semibold text-[#9F85E8]">Portfolio Deck <Icon name="ph:arrow-up-right-bold" /></a>
      <a href="#" @click.prevent="scrollToSection('contact-section')" class="btn-pill btn-pink mt-1">{{ nav.connectLabel }}</a>
    </div>
  </div>
</template>
