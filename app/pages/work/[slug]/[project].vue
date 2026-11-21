<script setup>
import { getTechDetails } from '~/utils/techIcons'

const { site, profile, nav } = usePortfolioConfig()
const portfolio = usePortfolio()
const route = useRoute()
const SITE = site.url
const catSlug = computed(() => route.params.slug)
const projectSlug = computed(() => route.params.project)

// Diambil di server: isi project ada di HTML pertama dan punya meta sendiri
const { data } = await useAsyncData(
  () => `project-${catSlug.value}-${projectSlug.value}`,
  () => portfolio.project(catSlug.value, projectSlug.value),
  { watch: [catSlug, projectSlug] }
)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const cat = computed(() => data.value?.cat || {})
const project = computed(() => data.value?.project || {})
const url = computed(() => `${SITE}/work/${catSlug.value}/${projectSlug.value}`)
const summary = computed(() => project.value.desc_short || `Project ${cat.value.name} by ${profile.name}.`)
const isImageCover = computed(() => !['youtube', 'drive'].includes(project.value.cover_type))
const extraImages = computed(() => (project.value.gallery || []).filter(u => u !== project.value.cover_url))
const isVideoFile = (u) => /\.(mp4|webm)(\?|$)/i.test(u || '')

const embedSrc = computed(() => {
  const u = project.value.cover_url || ''
  const d = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]
  if (d) return `https://drive.google.com/file/d/${d}/preview`
  const y = u.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]{11})/)?.[1]
  return y ? `https://www.youtube-nocookie.com/embed/${y}?rel=0` : ''
})

useSeoMeta({
  title: () => `${project.value.title} | ${profile.name}`,
  description: () => summary.value,
  ogTitle: () => project.value.title,
  ogDescription: () => summary.value,
  ogUrl: () => url.value,
  ogImage: () => (isImageCover.value && project.value.cover_url) || `${SITE}${site.ogImage}`,
  twitterCard: 'summary_large_image',
})
useHead({
  link: [{ rel: 'canonical', href: () => url.value }],
  script: [{
    type: 'application/ld+json',
    children: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.value.title,
      description: summary.value,
      url: url.value,
      image: isImageCover.value ? project.value.cover_url : undefined,
      keywords: (project.value.tech_stack || []).join(', '),
      author: { '@type': 'Person', name: profile.name, url: SITE },
      dateCreated: project.value.created_at,
    }),
  }],
})

const isScrolled = ref(false)
const onScroll = () => { isScrolled.value = window.scrollY > 60 }
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-[#FFF8F5] text-[#4A3548]">
    <div class="blob blob-pink -left-40 top-0 h-[520px] w-[520px]"></div>
    <div class="blob blob-lilac -right-40 top-1/3 h-[520px] w-[520px]"></div>

    <header class="fixed left-1/2 top-4 z-[1000] w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-full border border-white/80 bg-white/75 px-4 py-2.5 shadow-[0_14px_40px_-18px_rgba(232,120,159,0.55)] backdrop-blur-xl md:px-6">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink :to="`/work/${catSlug}`" class="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FFE3EC] px-4 py-2 text-[13px] font-bold text-[#B24D74] transition-colors hover:bg-[#E8789F] hover:text-white">
          <Icon name="ph:arrow-left" class="text-base transition-transform group-hover:-translate-x-0.5" />
          <span>{{ cat.name }}</span>
        </NuxtLink>
        <NuxtLink to="/" class="f-script text-[36px] font-normal leading-none text-[#E8789F]">{{ nav.logo }}</NuxtLink>
      </div>
    </header>

    <main class="relative z-10 mx-auto w-full max-w-5xl px-5 pb-32 pt-36 md:px-10 md:pt-44">
      <article>
        <!-- Judul -->
        <div class="mb-10 md:mb-14" data-aos="fade-up">
          <span class="chip">{{ project.sub_categories?.name || cat.name }}</span>
          <h1 class="f-display m-0 my-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{{ project.title }}</h1>
          <p v-if="project.desc_short" class="m-0 max-w-2xl text-base leading-relaxed text-[#8B7385]">{{ project.desc_short }}</p>

          <div v-if="project.live_url || project.github_url" class="mt-8 flex flex-wrap gap-3">
            <a v-if="project.live_url" :href="project.live_url" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pink">Visit Live Site <Icon name="ph:arrow-up-right-bold" class="text-base" /></a>
            <a v-if="project.github_url" :href="project.github_url" target="_blank" rel="noopener noreferrer" class="btn-pill btn-ghost"><Icon name="ph:github-logo" class="text-lg" /> Repository</a>
          </div>
        </div>

        <!-- Cover -->
        <div class="relative mb-12 overflow-hidden rounded-[28px] border-[6px] border-white bg-white shadow-[0_30px_70px_-30px_rgba(232,120,159,0.55)] md:mb-16">
          <div class="flex h-9 items-center gap-2 bg-[#FFF1F5] px-4">
            <div class="h-2.5 w-2.5 rounded-full bg-[#FF9DB8]"></div><div class="h-2.5 w-2.5 rounded-full bg-[#FFD58F]"></div><div class="h-2.5 w-2.5 rounded-full bg-[#B5E3B5]"></div>
          </div>
          <NuxtImg v-if="isImageCover && project.cover_url" :src="project.cover_url" :alt="project.title" width="1200" sizes="sm:100vw md:1000px" fetchpriority="high" class="h-auto w-full" />
          <div v-else-if="embedSrc" class="relative w-full pb-[56.25%]">
            <iframe :src="embedSrc" loading="lazy" allowfullscreen title="Demo project" class="absolute inset-0 h-full w-full border-none"></iframe>
          </div>
        </div>

        <div class="grid gap-10 md:grid-cols-[1fr_260px] md:gap-16">
          <!-- Cerita project -->
          <div>
            <h2 class="m-0 mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#B24D74]">About this project</h2>
            <p v-if="project.desc_long" class="m-0 whitespace-pre-line text-[15px] leading-[1.9] text-[#8B7385]">{{ project.desc_long }}</p>
            <p v-else class="m-0 text-sm text-[#8B7385]">{{ summary }}</p>
          </div>

          <!-- Tech stack + klien -->
          <aside class="flex flex-col gap-8">
            <div v-if="project.tech_stack?.length">
              <h2 class="m-0 mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#B24D74]">Tools &amp; Skills</h2>
              <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
                <li v-for="t in project.tech_stack" :key="t" class="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold shadow-sm">
                  <span v-if="getTechDetails(t).type === 'svg'" v-html="getTechDetails(t).content" class="flex items-center"></span>
                  <span>{{ t }}</span>
                </li>
              </ul>
            </div>
            <div v-if="project.client_name">
              <h2 class="m-0 mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#B24D74]">Client</h2>
              <p class="m-0 text-[15px] font-semibold">{{ project.client_name }}</p>
            </div>
          </aside>
        </div>

        <!-- Galeri -->
        <section v-if="extraImages.length" class="mt-16 md:mt-24">
          <h2 class="m-0 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#B24D74]">Gallery</h2>
          <div class="grid gap-5 sm:grid-cols-2">
            <template v-for="(img, i) in extraImages" :key="img">
              <video v-if="isVideoFile(img)" :src="img" controls playsinline preload="metadata" class="h-auto w-full rounded-[24px] border-[5px] border-white bg-black shadow-lg sm:col-span-2"></video>
              <NuxtImg v-else :src="img" :alt="`${project.title} — image ${i + 1}`" width="800" sizes="sm:100vw md:500px" loading="lazy" class="h-auto w-full rounded-[24px] border-[5px] border-white bg-white shadow-[0_18px_44px_-22px_rgba(232,120,159,0.5)]" />
            </template>
          </div>
        </section>

        <div class="mt-20 border-t border-[#4A3548]/10 pt-8">
          <NuxtLink :to="`/work/${catSlug}`" class="btn-pill btn-ghost">
            <Icon name="ph:arrow-left" class="text-lg" /> All {{ cat.name }}
          </NuxtLink>
        </div>
      </article>
    </main>
  </div>
</template>
