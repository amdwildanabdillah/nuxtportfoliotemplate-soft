<script setup>
const supabase = useSupabaseClient()
const props = defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['close'])

const handleLogout = async () => {
  await supabase.auth.signOut()
  navigateTo('/admin/login')
}
</script>

<template>
  <aside 
    :class="[
      'fixed md:static inset-y-0 left-0 z-[50] w-64 bg-[#0a0a0a]/95 md:bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/10 flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out',
      isOpen ? 'translate-x-0 md:ml-0' : '-translate-x-full md:-ml-64'
    ]"
  >
    <div class="p-6 md:p-8 border-b border-white/10 flex items-center justify-between mt-1 md:mt-0">
      <h2 class="font-['Clash_Display'] text-2xl tracking-widest text-white">
        JOSJIS<span class="text-[#b084ff]">.</span>
      </h2>
      <button @click="emit('close')" class="md:hidden text-[#666] hover:text-white p-2">
        <Icon name="ph:x" class="text-xl" />
      </button>
    </div>
    
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <NuxtLink to="/admin" @click="emit('close')" class="flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-bold uppercase tracking-widest text-[#aaa] hover:bg-white/5 hover:text-white transition-colors border border-transparent hover:border-white/10" active-class="bg-[#b084ff]/10 text-[#b084ff] border-white/10">
        <Icon name="ph:briefcase" class="text-lg" /> Projects
      </NuxtLink>
      
      <NuxtLink to="/admin/categories" @click="emit('close')" class="flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-bold uppercase tracking-widest text-[#aaa] hover:bg-white/5 hover:text-white transition-colors border border-transparent hover:border-white/10" active-class="bg-[#b084ff]/10 text-[#b084ff] border-white/10">
        <Icon name="ph:squares-four" class="text-lg" /> Categories
      </NuxtLink>

      <NuxtLink to="/admin/experience" @click="emit('close')" class="flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-bold uppercase tracking-widest text-[#aaa] hover:bg-white/5 hover:text-white transition-colors border border-transparent hover:border-white/10">
        <Icon name="ph:path" class="text-lg" /> Experience
      </NuxtLink>

      <NuxtLink to="/admin/settings" @click="emit('close')" class="flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-bold uppercase tracking-widest text-[#aaa] hover:bg-white/5 hover:text-white transition-colors border border-transparent hover:border-white/10" active-class="bg-[#b084ff]/10 text-[#b084ff] border-white/10">
        <Icon name="ph:gear" class="text-lg" /> Settings
      </NuxtLink>
    </nav>
    
    <div class="p-4 border-t border-white/10">
      <button @click="handleLogout" class="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-none text-[10px] font-bold uppercase tracking-widest text-[#ff5f56] hover:bg-[#ff5f56]/10 border border-transparent hover:border-[#ff5f56]/30 transition-colors cursor-pointer">
        <Icon name="ph:sign-out" class="text-lg" /> Logout
      </button>
    </div>
  </aside>
</template>