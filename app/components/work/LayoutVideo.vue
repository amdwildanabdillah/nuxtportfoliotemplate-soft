<script setup>
import { reactive } from 'vue'

defineProps({
  projects: { type: Array, required: true }
})

// EMIT FOR OPEN MODAL
const emit = defineEmits(['open-modal'])

const ytId = (url) => {
  const m = (url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]{11})/)
  return m ? m[1] : ''
}
const driveId = (url) => (url || '').match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || ''

// Embed hanya dibuat saat kartu diklik. Sebelumnya setiap kartu langsung memuat
// satu pemutar YouTube/Drive penuh, itulah yang membuat halaman ini lama.
const getSrc = (url, autoplay = false) => {
  if (!url) return ''
  const d = driveId(url)
  if (d) return `https://drive.google.com/file/d/${d}/preview`
  const y = ytId(url)
  if (y) return `https://www.youtube-nocookie.com/embed/${y}?rel=0${autoplay ? '&autoplay=1' : ''}`
  return url
}

// Gambar mini ringan (16:9) sebagai pengganti pemutar
const thumbFor = (url) => {
  const y = ytId(url)
  if (y) return `https://i.ytimg.com/vi/${y}/mqdefault.jpg`
  const d = driveId(url)
  if (d) return `https://drive.google.com/thumbnail?id=${d}&sz=w640`
  return ''
}

const playing = reactive({})
const play = (id) => { playing[id] = true }
</script>

<template>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
    <div v-for="video in projects" :key="video.id" class="card-soft group flex flex-col overflow-hidden p-3" data-aos="fade-up">

      <!-- PEMUTAR: gambar mini dulu, iframe baru dimuat saat diklik -->
      <div class="relative w-full overflow-hidden rounded-[20px] bg-[#FFE3EC] pb-[56.25%]">
        <iframe v-if="playing[video.id]" :src="getSrc(video.cover_url, true)" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen frameborder="0" title="Video preview" class="absolute inset-0 z-10 h-full w-full"></iframe>
        <button v-else type="button" :aria-label="`Play video ${video.title}`" class="group/play absolute inset-0 z-10 h-full w-full cursor-pointer" @click="play(video.id)">
          <img v-if="thumbFor(video.cover_url)" :src="thumbFor(video.cover_url)" :alt="video.title" loading="lazy" decoding="async" width="320" height="180" class="absolute inset-0 h-full w-full object-cover" />
          <span class="absolute inset-0 flex items-center justify-center bg-[#4A3548]/10 transition-colors group-hover/play:bg-[#4A3548]/25">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-[#E8789F] shadow-xl transition-transform duration-300 group-hover/play:scale-110">
              <Icon name="ph:play-fill" class="ml-0.5" />
            </span>
          </span>
        </button>
      </div>

      <div class="flex flex-1 flex-col px-3 pb-4 pt-5">
        <h3 class="f-display m-0 mb-2 text-2xl font-normal">{{ video.title }}</h3>
        <p class="mb-6 text-[13px] font-semibold text-[#E8789F]">{{ video.desc_short || 'Visual Story' }}</p>
        <button @click="emit('open-modal', video)" class="btn-pill btn-ghost mt-auto self-start !px-6 !py-2.5 !text-[13px]">Read Details</button>
      </div>
    </div>
  </div>
</template>