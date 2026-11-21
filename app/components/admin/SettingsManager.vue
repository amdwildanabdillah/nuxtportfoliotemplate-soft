<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

const supabase = useSupabaseClient()

const isLoading = ref(true)
const isSaving = ref(false)

// Konfigurasi SweetAlert serasi dengan ProjectsManager
const swalConfig = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  background: '#b084ff',
  color: '#000',
  customClass: {
    container: 'z-[999999]',
    popup: 'rounded-none font-["Clash_Display"] tracking-wider border border-black'
  }
}

// State Site Settings
const form = ref({
  contact_email: '',
  contact_whatsapp: '',
  portfolio_url: ''
})

// State Social Links
const socialLinks = ref([])
const showSocialModal = ref(false)
const isEditingSocial = ref(false)
const editSocialId = ref(null)

const socialForm = ref({
  platform: '',
  url: '',
  svg_icon: '',
  is_active: true,
  sort_order: 0
})

const fetchData = async () => {
  isLoading.value = true
  try {
    // 1. Ambil site_settings
    const { data: settingsData, error: settingsErr } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (settingsErr) throw settingsErr
    if (settingsData) {
      form.value = {
        contact_email: settingsData.contact_email || '',
        contact_whatsapp: settingsData.contact_whatsapp || '',
        portfolio_url: settingsData.portfolio_url || ''
      }
    }

    // 2. Ambil social_links
    const { data: socialsData, error: socialsErr } = await supabase
      .from('social_links')
      .select('*')
      .order('sort_order', { ascending: true })

    if (socialsErr) throw socialsErr
    socialLinks.value = socialsData || []
  } catch (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Error Fetching Settings', text: error.message })
  } finally {
    isLoading.value = false
  }
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 1,
        contact_email: form.value.contact_email,
        contact_whatsapp: form.value.contact_whatsapp,
        portfolio_url: form.value.portfolio_url,
        updated_at: new Date().toISOString()
      })

    if (error) throw error
    Swal.fire({ ...swalConfig, icon: 'success', title: 'Settings Saved!' })
  } catch (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Save Failed', text: error.message })
  } finally {
    isSaving.value = false
  }
}

// Modal & CRUD Social Links
const openAddSocialModal = () => {
  isEditingSocial.value = false
  editSocialId.value = null
  socialForm.value = {
    platform: '',
    url: '',
    svg_icon: '',
    is_active: true,
    sort_order: socialLinks.value.length
  }
  showSocialModal.value = true
}

const openEditSocialModal = (item) => {
  isEditingSocial.value = true
  editSocialId.value = item.id
  socialForm.value = { ...item }
  showSocialModal.value = true
}

const toggleSocialActive = async (item) => {
  try {
    const { error } = await supabase
      .from('social_links')
      .update({ is_active: !item.is_active })
      .eq('id', item.id)

    if (error) throw error
    item.is_active = !item.is_active
    Swal.fire({ ...swalConfig, icon: 'success', title: 'Status Updated!' })
  } catch (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Update Failed', text: error.message })
  }
}

const saveSocialLink = async () => {
  try {
    if (isEditingSocial.value) {
      const { error } = await supabase
        .from('social_links')
        .update(socialForm.value)
        .eq('id', editSocialId.value)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('social_links')
        .insert([socialForm.value])
      if (error) throw error
    }

    Swal.fire({ ...swalConfig, icon: 'success', title: isEditingSocial.value ? 'Link Updated!' : 'Link Added!' })
    showSocialModal.value = false
    fetchData()
  } catch (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Action Failed', text: error.message })
  }
}

const deleteSocialLink = async (id) => {
  const res = await Swal.fire({ ...swalConfig, title: 'Hapus Link?', icon: 'warning', showCancelButton: true })
  if (res.isConfirmed) {
    await supabase.from('social_links').delete().eq('id', id)
    fetchData()
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="flex-1 flex flex-col h-full relative overflow-y-auto custom-scrollbar p-6 md:p-10">
    
    <!-- HEADER -->
    <div class="mb-8 border-b border-white/10 pb-6">
      <h1 class="text-3xl font-['Clash_Display'] tracking-wide text-white mb-2">Settings Manager.</h1>
      <p class="text-[#aaa] text-[10px] uppercase tracking-[0.2em]">Manage global portfolio deck, direct contacts & social channels</p>
    </div>

    <!-- LOADING -->
    <div v-if="isLoading" class="py-20 text-center flex flex-col items-center">
      <Icon name="ph:spinner-gap" class="text-4xl animate-spin text-[#b084ff] mb-4" />
      <p class="text-[10px] uppercase tracking-widest font-bold text-[#aaa]">Loading Configuration...</p>
    </div>

    <div v-else class="space-y-12 max-w-5xl pb-32">
      
      <!-- SECTION 1: GLOBAL SITE SETTINGS -->
      <form @submit.prevent="saveSettings" class="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 space-y-6">
        <div class="border-b border-white/10 pb-4">
          <h2 class="text-sm font-['Clash_Display'] font-bold uppercase tracking-widest text-[#b084ff]">Global Deck & Inquiries</h2>
        </div>

        <div class="space-y-2">
          <label class="text-[9px] text-[#666] uppercase tracking-[0.2em] block font-bold">
            Portfolio Deck URL (Google Drive / Doc / Direct PDF)
          </label>
          <input 
            v-model="form.portfolio_url" 
            type="text" 
            placeholder="https://drive.google.com/file/d/... atau https://..."
            class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none font-mono placeholder-[#444]"
          />
          <span class="text-[10px] text-[#666] block">Tautan ini otomatis dipanggil saat tombol "View Portfolio Deck" di web dibuka.</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div class="space-y-2">
            <label class="text-[9px] text-[#666] uppercase tracking-[0.2em] block font-bold">Inquiry Email</label>
            <input 
              v-model="form.contact_email" 
              type="email" 
              placeholder="you@example.com"
              class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none font-mono placeholder-[#444]"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[9px] text-[#666] uppercase tracking-[0.2em] block font-bold">WhatsApp Hotline</label>
            <input 
              v-model="form.contact_whatsapp" 
              type="text" 
              placeholder="628xxxxxxxxxx"
              class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none font-mono placeholder-[#444]"
            />
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button 
            type="submit" 
            :disabled="isSaving"
            class="bg-white hover:bg-[#b084ff] text-black px-8 py-3.5 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center border border-white hover:border-[#b084ff] rounded-none cursor-pointer"
          >
            <Icon v-if="isSaving" name="ph:spinner-gap" class="animate-spin text-lg mr-2" />
            {{ isSaving ? 'Saving DB...' : 'Save Configuration' }}
          </button>
        </div>
      </form>

      <!-- SECTION 2: SOCIAL LINKS MANAGER -->
      <div class="bg-[#0a0a0a] border border-white/10 p-6 md:p-8">
        <div class="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 class="text-sm font-['Clash_Display'] font-bold uppercase tracking-widest text-[#b084ff]">Social Channels</h2>
            <p class="text-[#666] text-[10px] uppercase tracking-[0.15em] mt-1">Manage external links and SVG icons</p>
          </div>
          <button 
            @click="openAddSocialModal"
            class="bg-transparent hover:bg-white text-[#aaa] hover:text-black px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 border border-white/20 rounded-none cursor-pointer"
          >
            <Icon name="ph:plus" class="text-sm" /> Add Channel
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-white/5 border-b border-white/10 text-[9px] font-bold text-[#aaa] uppercase tracking-[0.2em]">
              <tr>
                <th class="p-4 w-12 text-center">Status</th>
                <th class="p-4 w-14 text-center">Icon</th>
                <th class="p-4">Platform</th>
                <th class="p-4">URL</th>
                <th class="p-4 text-center w-20">Order</th>
                <th class="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-[#ccc]">
              <tr v-if="socialLinks.length === 0">
                <td colspan="6" class="p-6 text-center text-[#555] text-xs uppercase tracking-widest">
                  Belum ada social links yang ditambahkan.
                </td>
              </tr>
              <tr v-for="item in socialLinks" :key="item.id" class="hover:bg-white/5 transition-colors">
                <td class="p-4 text-center">
                  <button @click="toggleSocialActive(item)" class="cursor-pointer">
                    <Icon :name="item.is_active ? 'ph:check-circle-fill' : 'ph:circle'" :class="item.is_active ? 'text-[#b084ff]' : 'text-[#444]'" class="text-lg" />
                  </button>
                </td>
                <td class="p-4 text-center">
                  <div v-if="item.svg_icon" v-html="item.svg_icon" class="w-5 h-5 mx-auto flex items-center justify-center fill-current text-white"></div>
                  <span v-else class="text-[#555] text-xs font-mono">-</span>
                </td>
                <td class="p-4 font-bold text-white font-['Clash_Display'] tracking-wider">{{ item.platform }}</td>
                <td class="p-4 text-xs font-mono text-[#888] truncate max-w-xs">{{ item.url }}</td>
                <td class="p-4 text-center font-mono text-xs">{{ item.sort_order }}</td>
                <td class="p-4 text-right pr-6">
                  <button @click="openEditSocialModal(item)" class="w-8 h-8 bg-transparent border border-white/20 text-[#aaa] hover:text-[#b084ff] hover:border-[#b084ff] inline-flex items-center justify-center mr-2 transition-colors cursor-pointer">
                    <Icon name="ph:pencil-simple" class="text-sm" />
                  </button>
                  <button @click="deleteSocialLink(item.id)" class="w-8 h-8 bg-transparent border border-white/20 text-[#aaa] hover:text-[#ff5f56] hover:border-[#ff5f56] inline-flex items-center justify-center transition-colors cursor-pointer">
                    <Icon name="ph:trash" class="text-sm" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- MODAL POPUP SOCIAL LINK -->
    <ClientOnly>
      <Teleport to="body">
        <div v-if="showSocialModal" class="fixed inset-0 z-[99999] bg-[#050505]/95 backdrop-blur-md flex items-center justify-center p-4" @click.self="showSocialModal = false">
          <div class="bg-[#0a0a0a] border border-white/10 w-full max-w-xl shadow-2xl flex flex-col rounded-none relative">
            
            <div class="p-5 border-b border-white/10 flex justify-between items-center bg-[#111]">
              <h2 class="text-xl font-['Clash_Display'] font-bold text-white">{{ isEditingSocial ? 'Edit Channel.' : 'New Channel.' }}</h2>
              <button @click="showSocialModal = false" class="text-[#666] hover:text-white p-2 cursor-pointer"><Icon name="ph:x" class="text-lg" /></button>
            </div>

            <form @submit.prevent="saveSocialLink" class="p-6 space-y-5">
              <div class="space-y-2">
                <label class="text-[9px] text-[#666] uppercase tracking-[0.2em] block font-bold">Platform Name</label>
                <input v-model="socialForm.platform" required placeholder="GitHub, LinkedIn, Instagram..." class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none">
              </div>

              <div class="space-y-2">
                <label class="text-[9px] text-[#666] uppercase tracking-[0.2em] block font-bold">Destination URL</label>
                <input v-model="socialForm.url" required placeholder="https://..." class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none font-mono">
              </div>

              <div class="space-y-2">
                <label class="text-[9px] text-[#666] uppercase tracking-[0.2em] block font-bold">SVG Icon (Raw SVG Code / Optional)</label>
                <textarea v-model="socialForm.svg_icon" rows="3" placeholder="<svg ...>...</svg>" class="w-full bg-[#111] border border-white/10 p-3 text-xs text-white outline-none focus:border-[#b084ff] rounded-none font-mono resize-none"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[9px] text-[#666] uppercase tracking-[0.2em] block font-bold">Sort Order</label>
                  <input v-model="socialForm.sort_order" type="number" class="w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none font-mono">
                </div>

                <div class="flex items-end">
                  <label class="flex items-center gap-3 cursor-pointer w-full bg-[#111] border border-white/10 p-3 hover:border-[#b084ff] transition-colors h-[46px]">
                    <input type="checkbox" v-model="socialForm.is_active" class="hidden">
                    <div :class="['w-4 h-4 border flex items-center justify-center transition-colors', socialForm.is_active ? 'bg-[#b084ff] border-[#b084ff]' : 'border-white/30']">
                      <Icon v-if="socialForm.is_active" name="ph:check-bold" class="text-black text-xs" />
                    </div>
                    <span class="text-[10px] uppercase tracking-widest text-[#aaa]">Visible on Site</span>
                  </label>
                </div>
              </div>

              <div class="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" @click="showSocialModal = false" class="text-[#666] font-bold text-[10px] uppercase tracking-widest px-5 py-3 hover:text-white">Cancel</button>
                <button type="submit" class="bg-white hover:bg-[#b084ff] text-black px-6 py-3 font-bold text-[10px] uppercase tracking-widest transition-all">
                  {{ isEditingSocial ? 'Update Channel' : 'Add Channel' }}
                </button>
              </div>
            </form>

          </div>
        </div>
      </Teleport>
    </ClientOnly>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 0px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #b084ff; }
</style>