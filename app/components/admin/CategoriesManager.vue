<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

const supabase = useSupabaseClient()
const mainCategories = ref([])
const isLoading = ref(true)

// State buat Modal Edit Cover
const showModal = ref(false)
const isSaving = ref(false)
const editingCategory = ref(null)
const selectedFile = ref(null)
const coverPreview = ref(null)

const swalConfig = { background: '#0a0a0a', color: '#fff', confirmButtonColor: '#b084ff', borderRadius: '0px' }

// Fetch Data Kategori Utama
const fetchMainCategories = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false }) 
      
    if (error) throw error
    mainCategories.value = data || []
  } catch (error) {
    console.error(error)
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Error Fetching Data', text: error.message })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => { fetchMainCategories() })

// Buka Modal Edit
const openEditModal = (category) => {
  editingCategory.value = { ...category }
  selectedFile.value = null
  coverPreview.value = category.bento_image_url || null
  showModal.value = true
}

// Tutup Modal
const closeModal = () => {
  if (isSaving.value) return
  showModal.value = false
  editingCategory.value = null
  if (selectedFile.value) {
    URL.revokeObjectURL(coverPreview.value)
  }
}

// Handle Pilih File
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

// Simpan Cover Baru ke Supabase
const saveCategoryCover = async () => {
  if (!editingCategory.value) return
  isSaving.value = true
  
  try {
    let finalUrl = editingCategory.value.bento_image_url

    if (selectedFile.value) {
      const ext = selectedFile.value.name.split('.').pop()
      const filename = `bento/${editingCategory.value.slug}-${Date.now()}.${ext}`
      
      const { error: upErr } = await supabase.storage
        .from('portfolio-images')
        .upload(filename, selectedFile.value)
        
      if (upErr) throw upErr
      
      finalUrl = supabase.storage.from('portfolio-images').getPublicUrl(filename).data.publicUrl
    }

    const { error } = await supabase
      .from('main_categories')
      .update({ bento_image_url: finalUrl })
      .eq('id', editingCategory.value.id)

    if (error) throw error

    Swal.fire({ ...swalConfig, icon: 'success', title: 'Cover Updated!', showConfirmButton: false, timer: 1500 })
    closeModal()
    fetchMainCategories() 
  } catch (error) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Upload Failed', text: error.message })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <!-- Dibuat simple, gak pakai h-full atau flex-1 yang bikin nyangkut -->
  <div class="w-full pb-32 p-4 md:p-6">
    
    <!-- HEADER -->
    <div class="mb-10">
      <h1 class="text-3xl font-['Clash_Display'] tracking-wide text-white mb-2">Category Manager.</h1>
      <p class="text-[#aaa] text-[10px] uppercase tracking-[0.2em]">Manage Bento Grid Cover & Sub-categories</p>
    </div>

    <div v-if="isLoading" class="flex items-center gap-3 text-[#b084ff] text-xs uppercase tracking-widest">
      <Icon name="ph:spinner-gap" class="animate-spin text-xl" /> Fetching Data...
    </div>

    <!-- MAIN CATEGORY (BENTO GRID) TABLE -->
    <div v-else class="bg-[#0a0a0a] border border-white/10 rounded-none overflow-hidden mb-12 shadow-2xl">
      <div class="p-4 md:p-6 border-b border-white/10 bg-[#111]">
        <h2 class="text-xs text-white uppercase tracking-[0.2em] font-bold">Main Categories (Bento Grid)</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-white/5 border-b border-white/10 text-[9px] font-bold text-[#aaa] uppercase tracking-[0.2em]">
            <tr>
              <th class="p-5 pl-6 w-16 text-center">Order</th>
              <th class="p-5 w-24">Cover</th>
              <th class="p-5">Name & Slug</th>
              <th class="p-5">Layout Type</th>
              <th class="p-5 pr-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10 text-[#ccc]">
            <tr v-for="item in mainCategories" :key="item.id" class="hover:bg-white/5 transition-colors group">
              <td class="p-5 pl-6 text-center">
                <span class="bg-[#111] border border-white/10 text-white px-3 py-1 text-xs font-mono">{{ item.sort_order || '-' }}</span>
              </td>
              <td class="p-5">
                <img v-if="item.bento_image_url" :src="item.bento_image_url" 
                     class="w-20 h-12 object-cover border border-white/10 bg-black grayscale-[50%] group-hover:grayscale-0 transition-all" 
                     alt="Cover" />
                <div v-else class="w-20 h-12 border border-white/10 bg-[#111] flex flex-col items-center justify-center text-[#444]">
                     <Icon name="ph:image" class="text-lg" />
                </div>
              </td>
              <td class="p-5">
                <div class="font-bold text-white text-base font-['Clash_Display'] tracking-wide">{{ item.name }}</div>
                <div class="text-[10px] text-[#666] mt-1 tracking-widest">/{{ item.slug }}</div>
              </td>
              <td class="p-5">
                <span class="px-3 py-1 bg-[#b084ff]/10 text-[#b084ff] border border-[#b084ff]/30 text-[9px] uppercase tracking-widest">{{ item.layout_type }}</span>
              </td>
              <td class="p-5 pr-6 text-right">
                <button @click="openEditModal(item)" class="px-4 py-2 bg-[#111] border border-white/20 text-[#aaa] hover:text-white hover:border-[#b084ff] hover:bg-[#b084ff]/10 text-[9px] uppercase tracking-widest transition-all">
                  Edit Cover
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL EDIT COVER BRUTALIST -->
    <ClientOnly>
      <Teleport to="body">
        <div v-if="showModal" class="fixed inset-0 z-[99999] bg-[#050505]/95 backdrop-blur-md flex items-center justify-center p-4" @click.self="closeModal">
          <div class="bg-[#0a0a0a] border border-white/10 w-full max-w-xl shadow-2xl flex flex-col rounded-none relative">
            
            <div class="p-6 border-b border-white/10 bg-[#111] flex justify-between items-center">
              <div>
                <h2 class="text-xl font-['Clash_Display'] text-white">Update Cover.</h2>
                <p class="text-[9px] text-[#b084ff] uppercase tracking-widest mt-1">{{ editingCategory?.name }}</p>
              </div>
              <button @click="closeModal" class="text-[#666] hover:text-[#ff5f56] transition"><Icon name="ph:x" class="text-xl" /></button>
            </div>

            <div class="p-8">
              <div class="border border-white/10 bg-[#111] p-2 mb-6">
                <div class="w-full aspect-[16/10] bg-black relative flex items-center justify-center overflow-hidden border border-white/5">
                  <img v-if="coverPreview" :src="coverPreview" class="w-full h-full object-cover" />
                  <div v-else class="text-[#444] flex flex-col items-center">
                    <Icon name="ph:image" class="text-4xl mb-2" />
                    <span class="text-[9px] uppercase tracking-widest mt-2">No Cover Selected</span>
                  </div>
                </div>
              </div>

              <input type="file" id="bento-cover-upload" accept="image/*" @change="handleFileSelect" class="hidden">
              <label for="bento-cover-upload" class="cursor-pointer w-full bg-white hover:bg-[#b084ff] text-black px-5 py-4 font-bold text-[10px] uppercase tracking-widest transition-colors flex justify-center items-center gap-2 border border-white hover:border-[#b084ff]">
                <Icon name="ph:upload-simple" class="text-base" /> Pilih Gambar Baru
              </label>
              <p class="text-center text-[9px] text-[#666] mt-3 uppercase tracking-widest">Format: JPG, PNG, WEBP (Max 2MB)</p>
            </div>

            <div class="p-6 border-t border-white/10 bg-[#111] flex justify-end gap-4">
              <button @click="closeModal" :disabled="isSaving" class="text-[#666] font-bold text-[10px] uppercase tracking-widest px-6 py-3 hover:text-white transition-colors">Cancel</button>
              <button @click="saveCategoryCover" :disabled="isSaving || (!selectedFile && !editingCategory?.bento_image_url)" class="bg-[#b084ff] hover:bg-white hover:text-black text-white px-8 py-3 font-bold text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center">
                <Icon v-if="isSaving" name="ph:spinner-gap" class="animate-spin text-lg mr-2" /> 
                {{ isSaving ? 'Uploading...' : 'Save Cover' }}
              </button>
            </div>

          </div>
        </div>
      </Teleport>
    </ClientOnly>

  </div>
</template>