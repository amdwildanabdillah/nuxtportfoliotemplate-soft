<script setup>
import { ref, onMounted } from 'vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'

const isSidebarOpen = ref(false)

onMounted(() => {
  // Kalau di laptop/desktop, otomatis kebuka. Kalo di HP, otomatis ketutup.
  if (window.innerWidth >= 768) {
    isSidebarOpen.value = true
  }
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
    
    <!-- BACKGROUND GRID & GLOW -->
    <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
    <div class="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#b084ff] mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none z-0"></div>

    <!-- SIDEBAR -->
    <AdminSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
    
    <!-- OVERLAY KHUSUS MOBILE -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[40] md:hidden"></div>

    <!-- AREA KONTEN KANAN -->
    <main class="flex-1 flex flex-col h-screen relative z-10 min-w-0">
      
      <!-- TOPBAR / NAVBAR ADMIN -->
      <header class="flex items-center justify-between p-4 md:px-8 md:py-6 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl z-20 shrink-0">
         <div class="flex items-center gap-4">
           <!-- Tombol Toggle Sidebar -->
           <button @click="toggleSidebar" class="p-2.5 bg-white/5 border border-white/10 text-white hover:text-[#b084ff] hover:bg-white/10 transition-colors rounded-none cursor-pointer">
             <Icon name="ph:list" class="text-xl" />
           </button>
           
           <h2 class="md:hidden font-['Clash_Display'] text-xl tracking-widest text-white mt-1">ADMIN<span class="text-[#b084ff]">.</span></h2>
         </div>
      </header>

      <!-- ISI KONTEN -->
      <div class="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <slot />
      </div>

    </main>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 0px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #b084ff; }
</style>