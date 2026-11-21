<script setup>
import SettingsManager from '~/components/admin/SettingsManager.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})
</script>

<template>
  <SettingsManager />
</template>