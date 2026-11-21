<script setup>
// Proyek unggulan: yang ditandai featured (urutan sort_order).
const { featured: cfg } = usePortfolioConfig()
const portfolio = usePortfolio()
const { data: projects } = await useAsyncData('featured-dev', portfolio.featured, { default: () => [] })
const { data: cats } = await useAsyncData('work-categories', portfolio.categories, { default: () => [] })
const allLink = computed(() => cats.value?.[0]?.slug ? `/work/${cats.value[0].slug}` : '/')
const linkFor = (p) => p.slug ? `/work/${p.category_slug}/${p.slug}` : `/work/${p.category_slug}`

const stack = (p) => (Array.isArray(p.tech_stack) ? p.tech_stack : String(p.tech_stack || '').split(','))
  .map((t) => String(t).trim()).filter(Boolean).slice(0, 4)
</script>

<template>
  <section id="featured-section" class="relative w-full overflow-hidden px-5 py-20 md:px-10 md:py-28">
    <div class="blob blob-lilac -right-40 top-10 h-[460px] w-[460px]"></div>

    <div class="relative z-10 mx-auto w-full max-w-6xl">
      <!-- Judul -->
      <div class="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between" data-aos="fade-up">
        <div>
          <span class="chip chip-lilac">{{ cfg.eyebrow }}</span>
          <h2 class="f-display m-0 mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {{ cfg.titleBefore }} <span class="f-script text-gradient text-[1.4em] font-semibold">{{ cfg.titleHighlight }}</span>
          </h2>
        </div>
        <NuxtLink :to="allLink" class="btn-pill btn-ghost shrink-0 self-start md:self-auto">
          {{ cfg.linkLabel }} <Icon name="ph:arrow-up-right-bold" class="text-base" />
        </NuxtLink>
      </div>

      <!-- Kartu -->
      <div v-if="projects.length" class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <NuxtLink v-for="(p, i) in projects" :key="p.id" :to="linkFor(p)" class="card-soft group flex flex-col p-3 transition-transform duration-500 hover:-translate-y-1.5" data-aos="fade-up" :data-aos-delay="i * 100">
          <div class="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#FFE3EC]">
            <NuxtImg v-if="p.cover_url" :src="p.cover_url" :alt="p.title" width="640" sizes="sm:100vw md:400px" loading="lazy" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span v-if="p.sub_categories?.name" class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#B24D74] backdrop-blur">{{ p.sub_categories.name }}</span>
          </div>
          <div class="flex flex-1 flex-col gap-3 px-3 pb-4 pt-5">
            <h3 class="f-display m-0 text-2xl font-normal leading-tight">{{ p.title }}</h3>
            <p v-if="p.desc_short" class="m-0 line-clamp-2 text-[14px] leading-[1.7] text-[#8B7385]">{{ p.desc_short }}</p>
            <ul v-if="stack(p).length" class="m-0 mt-auto flex list-none flex-wrap gap-1.5 p-0 pt-2">
              <li v-for="t in stack(p)" :key="t" class="chip chip-lilac !px-3 !py-1 !text-[11px]">{{ t }}</li>
            </ul>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="card-soft p-10 text-center text-sm text-[#8B7385]">
        {{ cfg.emptyText }}
        <NuxtLink :to="allLink" class="font-bold text-[#E8789F] underline underline-offset-4">View all</NuxtLink>
      </div>
    </div>
  </section>
</template>
