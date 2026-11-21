<script setup>
const { about, profile } = usePortfolioConfig()
const techGroups = about.techGroups
</script>

<template>
  <section id="about-section" class="relative w-full overflow-hidden px-5 py-20 md:px-10 md:py-28">
    <div class="blob blob-peach -right-32 top-10 h-[480px] w-[480px]"></div>

    <div class="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">

      <!-- Foto -->
      <div class="mx-auto w-full max-w-[300px] md:max-w-[340px]" data-aos="zoom-in" data-aos-duration="900">
        <div class="relative">
          <div class="absolute -inset-3 -rotate-3 rounded-[44px] bg-gradient-to-br from-[#DCCFFF] to-[#FFD3E2]"></div>
          <div class="relative aspect-[4/5] overflow-hidden rounded-[40px] border-[6px] border-white bg-white shadow-[0_30px_70px_-25px_rgba(159,133,232,0.6)]">
            <NuxtImg :src="about.photo" :alt="profile.name" width="560" height="700" sizes="sm:90vw md:340px" format="webp" loading="lazy" class="h-full w-full object-cover" />
          </div>
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[13px] font-bold shadow-xl">
            {{ profile.name }}
          </div>
        </div>
      </div>

      <!-- Teks -->
      <div class="text-center md:text-left">
        <span class="chip" data-aos="fade-up">{{ about.badge }}</span>
        <h2 class="f-display m-0 mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl" data-aos="fade-up" data-aos-delay="80">
          {{ about.headingBefore }} <span class="f-script text-gradient text-[1.4em] font-semibold">{{ about.headingHighlight }}</span>
        </h2>
        <div class="mt-6 space-y-4 text-[15px] leading-[1.9] text-[#8B7385]" data-aos="fade-up" data-aos-delay="160">
          <p v-for="(para, i) in about.paragraphs" :key="i" class="m-0">{{ para }}</p>
        </div>

        <!-- Alat / skill -->
        <div v-if="techGroups.length" class="mt-8 flex flex-col gap-4" data-aos="fade-up" data-aos-delay="240">
          <div v-for="group in techGroups" :key="group.label" class="flex flex-col items-center gap-3 md:flex-row md:items-center">
            <span class="w-16 shrink-0 text-[12px] font-bold uppercase tracking-[0.18em] text-[#B24D74]">{{ group.label }}</span>
            <div class="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
              <div v-for="tool in group.tools" :key="tool.key" class="group relative flex items-center justify-center rounded-full bg-white px-3.5 py-2 shadow-sm [&_svg]:h-5" :title="tool.name">
                <span v-html="getTechDetails(tool.key).content" class="flex items-center"></span>
                <span class="pointer-events-none absolute -top-9 z-20 whitespace-nowrap rounded-full bg-[#4A3548] px-3 py-1 text-[11px] font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">{{ tool.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
