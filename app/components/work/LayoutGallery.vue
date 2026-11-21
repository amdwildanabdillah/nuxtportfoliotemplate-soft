<script setup>
defineProps({
  projects: { type: Array, required: true }
})
const emit = defineEmits(['open-modal'])
</script>

<template>
  <div class="columns-1 gap-5 space-y-5 sm:columns-2 md:columns-3">
    <div v-for="photo in projects" :key="photo.id" @click="emit('open-modal', photo)" class="group relative cursor-pointer break-inside-avoid overflow-hidden rounded-[24px] border-[5px] border-white bg-white shadow-[0_18px_44px_-22px_rgba(232,120,159,0.5)]" data-aos="fade-up">
      <div class="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-[#4A3548]/80 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-6">
        <h3 class="f-display m-0 mb-1 text-xl text-white">{{ photo.title }}</h3>
        <p v-if="photo.desc_short" class="m-0 mt-1 text-xs italic text-white/80">"{{ photo.desc_short }}"</p>
      </div>
      <NuxtImg :src="photo.thumbnail" :alt="photo.title || 'Photo'" loading="lazy" sizes="sm:100vw md:50vw lg:400px" class="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
  </div>
</template>