<script setup>
import CategoriesManager from '~/components/admin/CategoriesManager.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})
</script>

<template>
  <CategoriesManager />
</template>