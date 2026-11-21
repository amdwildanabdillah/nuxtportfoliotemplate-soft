<script setup>
import ExperienceManager from '~/components/admin/ExperienceManager.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})
</script>

<template>
  <ExperienceManager />
</template>
