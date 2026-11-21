<script setup>
import { ref } from 'vue'

// Matiin layout default (biar navbar porto ga muncul) dan pasang satpam
definePageMeta({
  layout: false,
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error
    
    // Kalau sukses, langsung arahin ke dashboard admin
    navigateTo('/admin')
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
    
    <!-- Efek Background Glow -->
    <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#b084ff] mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

    <div class="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 md:p-12 relative z-10 shadow-2xl">
      
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-['Clash_Display'] text-white tracking-widest mb-2">RESTRICTED.</h1>
        <p class="text-[10px] text-[#aaa] uppercase tracking-[0.2em]">Admin Portal</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-4 text-center tracking-wide">
          {{ errorMsg }}
        </div>

        <div class="space-y-2">
          <label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full bg-[#111] border border-white/10 p-4 text-sm text-white outline-none focus:border-[#b084ff] transition-colors rounded-none placeholder-[#444]"
            placeholder="you@example.com"
          >
        </div>

        <div class="space-y-2">
          <label class="text-[9px] text-[#666] uppercase tracking-[0.2em]">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full bg-[#111] border border-white/10 p-4 text-sm text-white outline-none focus:border-[#b084ff] transition-colors rounded-none placeholder-[#444]"
            placeholder="••••••••"
          >
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-white text-black border border-white hover:bg-[#b084ff] hover:border-[#b084ff] hover:text-white transition-colors duration-300 p-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          <Icon v-if="isLoading" name="ph:spinner-gap" class="animate-spin text-lg" />
          {{ isLoading ? 'Authenticating...' : 'Access Portal' }}
        </button>

      </form>

      <NuxtLink to="/" class="mt-8 block text-center text-[#666] hover:text-white transition-colors text-[10px] uppercase tracking-widest">
        &larr; Return to Public Site
      </NuxtLink>
    </div>
  </div>
</template>