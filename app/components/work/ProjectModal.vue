<script setup>
import { ref } from 'vue'
// Mengambil fungsi dari app/utils/techIcons.js
import { getTechDetails } from '~/utils/techIcons'

const props = defineProps({
  activeProject: { type: Object, required: true },
  currentImageIndex: { type: Number, default: 0 }
})

const emit = defineEmits(['close', 'prev', 'next', 'set-image'])

const getSrc = (type, url) => {
  if (!url) return ''
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (match && match[1]) return `https://drive.google.com/file/d/${match[1]}/preview`
  }
  if (type === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)
    const videoId = match ? match[1] : url
    return `https://www.youtube.com/embed/${videoId}`
  }
  return url
}
</script>

<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#4A3548]/70 p-4 backdrop-blur-sm md:p-8" @click.self="emit('close')">
    <div class="relative flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-[32px] bg-[#FFF8F5] shadow-2xl md:flex-row md:items-stretch">

      <button aria-label="Close" @click="emit('close')" class="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#4A3548] shadow-lg transition-colors hover:bg-[#E8789F] hover:text-white md:right-6 md:top-6">
        <Icon name="ph:x" class="text-xl" />
      </button>

      <!-- KIRI: galeri -->
      <div class="hide-scrollbar flex w-full flex-shrink-0 flex-col overflow-y-auto bg-[#FFE3EC]/60 md:w-[60%]">
        <div class="group/slider relative flex aspect-video w-full shrink-0 items-center justify-center bg-[#FFE3EC]">
          <template v-if="activeProject.cover_type === 'youtube' || activeProject.cover_type === 'drive'">
            <iframe :src="getSrc(activeProject.cover_type, activeProject.cover_url)" allowfullscreen frameborder="0" loading="lazy" title="Video demonstration" class="h-full w-full border-none"></iframe>
          </template>
          <template v-else>
            <img :src="activeProject.gallery.length > 0 ? activeProject.gallery[currentImageIndex] : activeProject.cover_url" alt="Project cover image" class="h-full w-full object-cover" />
          </template>

          <div v-if="activeProject.gallery.length > 1" class="absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity duration-300 group-hover/slider:opacity-100">
            <button aria-label="Previous image" @click="emit('prev')" class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#4A3548] shadow-lg transition-colors hover:bg-[#E8789F] hover:text-white"><Icon name="ph:caret-left" class="text-xl" /></button>
            <button aria-label="Next image" @click="emit('next')" class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#4A3548] shadow-lg transition-colors hover:bg-[#E8789F] hover:text-white"><Icon name="ph:caret-right" class="text-xl" /></button>
          </div>
        </div>

        <div v-if="activeProject.gallery.length > 1" class="hide-scrollbar flex gap-2 overflow-x-auto p-5">
          <img v-for="(img, idx) in activeProject.gallery" :key="idx" :src="img" @click="emit('set-image', idx)" alt="Gallery thumbnail" class="h-16 w-24 shrink-0 cursor-pointer rounded-xl border-2 object-cover transition-all duration-300" :class="idx === currentImageIndex ? 'border-[#E8789F] opacity-100' : 'border-transparent opacity-50 hover:opacity-100'" />
        </div>
      </div>

      <!-- KANAN: detail -->
      <div class="hide-scrollbar relative flex w-full flex-col overflow-y-auto p-8 md:w-[40%] md:p-12 md:pt-16">
        <h2 class="f-display m-0 mb-6 text-3xl font-normal leading-tight md:text-5xl">{{ activeProject.title }}</h2>

        <p v-if="activeProject.desc_long" class="mb-8 whitespace-pre-line text-[14px] leading-[1.9] text-[#8B7385]">{{ activeProject.desc_long }}</p>
        <p v-else-if="activeProject.desc_short" class="mb-8 text-[14px] leading-[1.9] text-[#8B7385]">{{ activeProject.desc_short }}</p>

        <div class="mt-auto flex flex-col gap-8 border-t border-[#4A3548]/10 pt-8">
          <div v-if="activeProject.live_url || activeProject.github_url" class="w-full">
            <span class="mb-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#B24D74]">Actions</span>
            <div class="flex flex-wrap gap-3">
              <a v-if="activeProject.live_url" :href="activeProject.live_url" target="_blank" class="btn-pill btn-pink !px-7 !py-3 !text-[13px]">Visit Live Site <Icon name="ph:arrow-up-right" class="text-base" /></a>
              <a v-if="activeProject.github_url" :href="activeProject.github_url" target="_blank" class="btn-pill btn-ghost !px-7 !py-3 !text-[13px]"><Icon name="ph:github-logo" class="text-lg" /> Repository</a>
            </div>
          </div>

          <div v-if="activeProject.tech_stack && activeProject.tech_stack.length > 0" class="w-full">
            <span class="mb-4 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#B24D74]">Tools &amp; Skills</span>
            <div class="flex flex-wrap gap-2.5">
              <div v-for="t in activeProject.tech_stack" :key="t" class="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold shadow-sm">
                <div v-if="getTechDetails(t).type === 'svg'" v-html="getTechDetails(t).content" class="flex items-center justify-center"></div>
                <span>{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
