<script setup>
import ProjectsManager from '~/components/admin/ProjectsManager.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})
</script>

<template>
  <ProjectsManager />
</template>