<script setup>
const { profile, categories } = usePortfolioConfig()
const props = defineProps({ error: { type: Object, required: true } })

const code = computed(() => String(props.error?.statusCode || 500))
const is404 = computed(() => code.value === '404')
const label = computed(() => (is404.value ? 'Oops, page not found.' : 'Something broke.'))
const message = computed(() => (is404.value
  ? 'The link you opened does not exist, or the project has moved.'
  : 'Something went wrong on our side. Please try again shortly.'))

useSeoMeta({ title: () => `${code.value} | ${profile.name}`, robots: 'noindex' })

const goTo = (path) => clearError({ redirect: path })
const links = [
  { label: 'Home', path: '/' },
  ...categories.map(c => ({ label: c.name, path: `/work/${c.slug}` })),
]
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF8F5] px-6 text-[#4A3548]">
    <div class="blob blob-pink -left-32 -top-24 h-[560px] w-[560px]"></div>
    <div class="blob blob-lilac -bottom-32 -right-32 h-[560px] w-[560px]"></div>

    <main class="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
      <span class="chip chip-lilac mb-4">error {{ code }}</span>

      <h1 class="f-display m-0 select-none text-[7rem] font-semibold leading-none tracking-tight sm:text-[10rem] md:text-[13rem]">
        <span class="text-gradient">{{ code }}</span>
      </h1>

      <p class="f-script mb-4 mt-2 text-4xl font-semibold text-[#E8789F] md:text-6xl">{{ label }}</p>
      <p class="mb-10 max-w-md text-sm leading-relaxed text-[#8B7385] md:text-base">{{ message }}</p>

      <nav aria-label="Available pages" class="flex flex-wrap items-center justify-center gap-3">
        <button v-for="(l, i) in links" :key="l.path" type="button" class="btn-pill" :class="i === 0 ? 'btn-pink' : 'btn-ghost'" @click="goTo(l.path)">{{ l.label }}</button>
      </nav>
    </main>
  </div>
</template>
