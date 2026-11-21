<script setup>
const { work: cfg } = usePortfolioConfig()
const portfolio = usePortfolio()

// Ikon kecil per tata letak kategori
const layoutIcon = { cards: 'ph:squares-four', video: 'ph:film-strip', gallery: 'ph:camera' }

// Diambil di server: kartu kategori sudah ada di HTML pertama (tanpa spinner).
const { data: categories } = await useAsyncData('work-categories', async () => {
  try {
    return await portfolio.categories()
  } catch (error) {
    console.error('Failed to load categories:', error)
    return []
  }
}, { default: () => [] })

// Tepat 3 kategori = tata letak "bento" (kartu pertama besar). Selain itu = kisi rata.
const isBento = computed(() => categories.value.length === 3)
const gridClass = computed(() => {
  if (isBento.value) return 'grid-cols-2 md:grid-cols-3 md:grid-rows-2 md:h-[min(60svh,520px)]'
  const n = categories.value.length
  if (n === 1) return 'grid-cols-1 max-w-2xl'
  if (n === 2) return 'grid-cols-1 sm:grid-cols-2'
  return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
})
const cardClass = (index) => {
  if (isBento.value) {
    return index === 0
      ? 'col-span-2 md:col-span-2 md:row-span-2 aspect-[16/10] md:aspect-auto'
      : 'col-span-1 aspect-square md:aspect-auto'
  }
  return 'aspect-[16/10]'
}
const fallbackImg = (index) => `/placeholder/cover-${(index % 3) + 1}.webp`
</script>

<template>
  <section id="work-section" class="relative w-full overflow-hidden px-5 py-20 md:px-10 md:py-28">
    <div class="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-transparent via-[#FFEFF4] to-transparent"></div>
    <div class="blob blob-pink -left-40 bottom-0 h-[480px] w-[480px]"></div>

    <div class="relative z-10 mx-auto w-full max-w-6xl">
      <div class="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between" data-aos="fade-up">
        <h2 class="f-display m-0 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          {{ cfg.titleBefore }} <span class="f-script text-gradient text-[1.4em] font-semibold">{{ cfg.titleHighlight }}</span>
        </h2>
        <!-- Nama kategori sebagai pil -->
        <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
          <li v-for="(cat, idx) in categories" :key="cat.id" class="chip" :class="{ 'chip-lilac': idx % 2 === 1 }">{{ cat.name }}</li>
        </ul>
      </div>

      <div class="grid gap-4 md:gap-6" :class="gridClass">
        <NuxtLink v-for="(cat, index) in categories" :key="cat.id" :to="`/work/${cat.slug}`" class="group relative overflow-hidden rounded-[28px] bg-[#FFE3EC] shadow-[0_18px_50px_-22px_rgba(232,120,159,0.55)]" :class="cardClass(index)" data-aos="fade-up" :data-aos-delay="150 + index * 100">
          <NuxtImg :src="cat.bento_image_url || fallbackImg(index)" width="900" sizes="sm:100vw md:600px" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" :alt="cat.name" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#4A3548]/75 via-[#4A3548]/10 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 md:p-7">
            <div>
              <h3 class="f-display m-0 font-normal capitalize leading-[1.05] text-white" :class="isBento && index === 0 ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'">{{ cat.name }}</h3>
              <span v-if="cat.total" class="mt-2 inline-block rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#B24D74]">{{ cat.total }} {{ cfg.worksLabel }}</span>
            </div>
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl text-[#E8789F] transition-transform duration-300 group-hover:rotate-45"><Icon :name="layoutIcon[layoutOf(cat)]" /></span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
