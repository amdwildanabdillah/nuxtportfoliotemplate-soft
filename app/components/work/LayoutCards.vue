<script setup>
// Mengambil fungsi dari app/utils/techIcons.js
import { getTechDetails } from '~/utils/techIcons'

defineProps({
  projects: { type: Array, required: true },
  categoryName: { type: String, default: 'Projects' }
})
const emit = defineEmits(['open-modal'])
</script>

<template>
  <div class="flex flex-col gap-20 md:gap-28">
    <div v-for="(item, index) in projects" :key="item.id" class="flex flex-col items-center gap-10 md:flex-row md:gap-16" :class="{ 'md:flex-row-reverse': index % 2 !== 0 }">

      <!-- Cover dalam jendela lembut -->
      <div class="group relative w-full flex-1 cursor-pointer overflow-hidden rounded-[28px] border-[6px] border-white bg-white shadow-[0_26px_60px_-26px_rgba(232,120,159,0.55)]" @click="emit('open-modal', item)" data-aos="fade-up">
        <div class="flex h-9 items-center gap-2 bg-[#FFF1F5] px-4">
          <div class="h-2.5 w-2.5 rounded-full bg-[#FF9DB8]"></div>
          <div class="h-2.5 w-2.5 rounded-full bg-[#FFD58F]"></div>
          <div class="h-2.5 w-2.5 rounded-full bg-[#B5E3B5]"></div>
        </div>
        <NuxtImg :src="item.cover_url" :alt="item.title" loading="lazy" sizes="sm:100vw md:50vw lg:800px" class="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <div class="absolute inset-0 flex items-center justify-center bg-[#4A3548]/35 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <span class="rounded-full bg-white px-6 py-2.5 text-[13px] font-bold text-[#4A3548] shadow-lg">View Details</span>
        </div>
      </div>

      <!-- Teks + tech -->
      <div class="w-full flex-1 text-left" data-aos="fade-up" data-aos-delay="100">
        <span class="chip">{{ item.sub_categories?.name || categoryName }}</span>
        <h2 class="f-display m-0 mt-4 text-4xl font-light leading-tight md:text-5xl">{{ item.title }}</h2>
        <p class="mb-7 mt-4 leading-[1.8] text-[#8B7385]">{{ item.desc_short || 'Digital solution crafted with care.' }}</p>

        <div class="mb-8 flex flex-wrap gap-2.5">
          <div v-for="t in item.tech_stack" :key="t" class="flex cursor-default items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold shadow-sm">
            <div v-if="getTechDetails(t).type === 'svg'" v-html="getTechDetails(t).content" class="flex items-center justify-center"></div>
            <span>{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>