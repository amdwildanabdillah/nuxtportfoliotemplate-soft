<script setup>
const { scrollToSection } = useStackScroll()
const { hero, profile } = usePortfolioConfig()
const waLink = profile.whatsapp ? `https://wa.me/${String(profile.whatsapp).replace(/\D/g, '')}` : ''
const tags = computed(() => String(hero.tagline || '').split('|').map(t => t.trim()).filter(Boolean).slice(0, 3))
</script>

<template>
  <header id="hero-section" class="relative w-full min-h-[100svh] overflow-hidden px-5 pt-28 pb-16 md:px-10 md:pt-32 flex items-center">
    <!-- latar -->
    <div class="blob blob-pink w-[520px] h-[520px] -top-24 -left-32"></div>
    <div class="blob blob-lilac w-[560px] h-[560px] top-1/3 -right-40"></div>
    <div class="blob blob-peach w-[420px] h-[420px] -bottom-24 left-1/4"></div>

    <div class="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-8">

      <!-- Teks -->
      <div class="order-2 text-center md:order-1 md:text-left">
        <span class="chip fade-in-down">{{ hero.eyebrow }}</span>

        <h1 class="f-display m-0 mt-6 text-[2.9rem] font-light leading-[1.08] tracking-tight sm:text-6xl md:text-[4.4rem]">
          <span class="block fade-in-up">{{ hero.line1 }}</span>
          <span class="f-script text-gradient block pt-1 text-[3.6rem] font-semibold leading-[1.1] sm:text-7xl md:text-[5.6rem] fade-in-up delay-1">{{ hero.line2 }}</span>
        </h1>

        <p class="fade-in-up delay-2 mx-auto mt-6 max-w-lg text-base leading-[1.8] text-[#8B7385] md:mx-0 md:text-[17px]">{{ hero.description }}</p>

        <div class="fade-in-up delay-3 mt-9 flex flex-col items-center gap-3 sm:flex-row md:justify-start justify-center">
          <button type="button" class="btn-pill btn-pink" @click="scrollToSection('featured-section')">
            {{ hero.primaryButton }} <Icon name="ph:arrow-down" class="text-base" />
          </button>
          <a v-if="waLink" :href="waLink" target="_blank" rel="noopener noreferrer" class="btn-pill btn-ghost">
            <Icon name="ph:whatsapp-logo" class="text-lg" /> {{ hero.secondaryButton }}
          </a>
        </div>

        <ul v-if="tags.length" class="fade-in-up delay-4 m-0 mt-9 flex list-none flex-wrap items-center justify-center gap-2 p-0 md:justify-start">
          <li v-for="(t, i) in tags" :key="t" class="chip" :class="{ 'chip-lilac': i % 2 === 1 }">{{ t }}</li>
        </ul>
      </div>

      <!-- Foto dalam lengkung -->
      <div class="order-1 mx-auto w-full max-w-[300px] md:order-2 md:max-w-[380px] fade-in-up delay-1">
        <div class="relative">
          <div class="absolute -inset-3 rotate-3 rounded-t-[999px] rounded-b-[44px] bg-gradient-to-br from-[#FFD3E2] to-[#DCCFFF]"></div>
          <div class="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[40px] border-[6px] border-white bg-white shadow-[0_30px_70px_-25px_rgba(232,120,159,0.6)]">
            <NuxtImg :src="hero.photo" :alt="profile.name" width="760" height="950" sizes="sm:80vw md:380px" format="webp" fetchpriority="high" class="h-full w-full object-cover" />
          </div>
          <!-- stiker kecil -->
          <span class="floaty absolute -left-4 top-[18%] flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-[#E8789F] shadow-lg" style="--r:-8deg"><Icon name="ph:heart-fill" /></span>
          <span class="floaty absolute -right-3 top-[42%] flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg text-[#9F85E8] shadow-lg" style="--r:8deg; animation-delay:1.2s"><Icon name="ph:sparkle-fill" /></span>
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-[#4A3548] shadow-xl">
            <span class="mr-2 inline-block h-2 w-2 rounded-full bg-[#E8789F]"></span>{{ profile.name }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
