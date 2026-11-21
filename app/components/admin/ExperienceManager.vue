<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'

// Pengelola data Experience (tabel `experiences`). Tabel dibuat lewat supabase/schema.sql.
// Beranda hanya menampilkan entri yang dicentang "Tampilkan". Bila tabel belum ada, beranda memakai data contoh di site.config.ts.
const supabase = useSupabaseClient()
const { experience: expCfg } = usePortfolioConfig()

const swalConfig = {
  toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
  background: '#b084ff', color: '#000',
  customClass: { container: 'z-[999999]', popup: 'rounded-none font-["Clash_Display"] tracking-wider border border-black' }
}

const items = ref([])
const isLoading = ref(true)
const tableMissing = ref(false)
const isSaving = ref(false)
const showModal = ref(false)
const editId = ref(null)

const emptyForm = () => ({
  kind: 'work', title: '', organization: '', location: '',
  period_start: '', period_end: '', is_current: false,
  description: '', link_url: '', image_url: '', logo_url: '', sort_order: 0, is_visible: true,
})
const form = ref(emptyForm())

const kindLabel = (k) => EXPERIENCE_KINDS.find(x => x.value === k)?.label || k
const nextOrder = computed(() => (items.value.reduce((m, e) => Math.max(m, e.sort_order || 0), 0)) + 10)

// <input type="month"> memakai "YYYY-MM"; database memakai tanggal penuh
const toMonth = (d) => (d ? String(d).slice(0, 7) : '')
const toDate = (m) => (m ? `${m}-01` : null)

const fetchItems = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase.from('experiences').select('*')
      .order('sort_order', { ascending: true })
      .order('period_start', { ascending: false, nullsFirst: false })
    if (error) throw error
    items.value = data || []
    tableMissing.value = false
  } catch (e) {
    tableMissing.value = true
    items.value = []
  } finally {
    isLoading.value = false
  }
}

const openAdd = () => {
  editId.value = null
  form.value = { ...emptyForm(), sort_order: nextOrder.value }
  showModal.value = true
}
const openEdit = (e) => {
  editId.value = e.id
  form.value = {
    kind: e.kind, title: e.title || '', organization: e.organization || '', location: e.location || '',
    period_start: toMonth(e.period_start), period_end: toMonth(e.period_end), is_current: !!e.is_current,
    description: e.description || '', link_url: e.link_url || '', image_url: e.image_url || '', logo_url: e.logo_url || '', sort_order: e.sort_order || 0, is_visible: e.is_visible !== false,
  }
  showModal.value = true
}

// Unggah gambar bukti ke storage yang sama dengan galeri project
const uploadProof = async (ev, field = 'image_url') => {
  const file = ev.target.files?.[0]
  if (!file) return
  try {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `experience/${Date.now()}-${safe}`
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file)
    if (error) throw error
    form.value[field] = supabase.storage.from('portfolio-images').getPublicUrl(path).data.publicUrl
  } catch (err) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal mengunggah', text: err.message })
  }
}

const save = async () => {
  if (!form.value.title.trim()) return Swal.fire({ ...swalConfig, icon: 'warning', title: 'Judul wajib diisi' })
  isSaving.value = true
  try {
    const f = form.value
    const payload = {
      kind: f.kind, title: f.title.trim(), organization: f.organization.trim() || null, location: f.location.trim() || null,
      period_start: toDate(f.period_start), period_end: f.is_current ? null : toDate(f.period_end), is_current: f.is_current,
      description: f.description.trim() || null, link_url: f.link_url.trim() || null, image_url: f.image_url.trim() || null, logo_url: f.logo_url.trim() || null,
      sort_order: Number(f.sort_order) || 0, is_visible: f.is_visible,
    }
    // Kolom image_url baru ada setelah SQL terbaru dijalankan; jangan kirim bila kosong
    const prev = items.value.find(x => x.id === editId.value) || {}
    if (!payload.image_url && !prev.image_url) delete payload.image_url
    if (!payload.logo_url && !prev.logo_url) delete payload.logo_url
    const q = editId.value
      ? supabase.from('experiences').update(payload).eq('id', editId.value)
      : supabase.from('experiences').insert([payload])
    const { error } = await q
    if (error) throw error
    showModal.value = false
    Swal.fire({ ...swalConfig, icon: 'success', title: 'Tersimpan' })
    await fetchItems()
  } catch (e) {
    Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal menyimpan', text: e.message })
  } finally {
    isSaving.value = false
  }
}

const remove = async (e) => {
  const ok = await Swal.fire({ title: 'Hapus data ini?', text: e.title, icon: 'warning', showCancelButton: true, confirmButtonText: 'Hapus', background: '#111', color: '#fff', confirmButtonColor: '#ff5f56' })
  if (!ok.isConfirmed) return
  const { error } = await supabase.from('experiences').delete().eq('id', e.id)
  if (error) return Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal menghapus', text: error.message })
  await fetchItems()
}

const toggleVisible = async (e) => {
  const { error } = await supabase.from('experiences').update({ is_visible: !e.is_visible }).eq('id', e.id)
  if (error) return Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal', text: error.message })
  e.is_visible = !e.is_visible
}

// Isi tabel dengan entri contoh dari site.config.ts, sekali jalan
const importDefaults = async () => {
  const seed = experienceFromConfig(expCfg.items)
  const ok = await Swal.fire({ title: 'Impor dari site.config.ts?', text: `${seed.length} entri akan ditambahkan.`, icon: 'question', showCancelButton: true, confirmButtonText: 'Impor', background: '#111', color: '#fff', confirmButtonColor: '#b084ff' })
  if (!ok.isConfirmed) return
  const rows = seed.map(({ id, ...r }) => r)
  const { error } = await supabase.from('experiences').insert(rows)
  if (error) return Swal.fire({ ...swalConfig, icon: 'error', title: 'Gagal impor', text: error.message })
  Swal.fire({ ...swalConfig, icon: 'success', title: 'Data awal masuk' })
  await fetchItems()
}

onMounted(fetchItems)

const inputCls = 'w-full bg-[#111] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#b084ff] rounded-none placeholder-[#444]'
const labelCls = 'text-[9px] text-[#666] uppercase tracking-[0.2em] block font-bold mb-2'
</script>

<template>
  <div class="max-w-5xl">
    <div class="flex items-end justify-between gap-4 mb-8">
      <div>
        <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b084ff] block mb-2">Content</span>
        <h1 class="text-3xl md:text-4xl font-['Clash_Display'] font-light text-white m-0">Experience.</h1>
      </div>
      <button v-if="!tableMissing" @click="openAdd" class="bg-white hover:bg-[#b084ff] text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors">+ Tambah</button>
    </div>

    <div v-if="isLoading" class="text-[#666] text-sm">Memuat...</div>

    <!-- Tabel belum ada -->
    <div v-else-if="tableMissing" class="border border-[#ff5f56]/40 bg-[#ff5f56]/5 p-6 text-sm text-[#ddd] leading-relaxed">
      Tabel <code class="text-[#b084ff]">experiences</code> belum ada di Supabase. Jalankan isi file
      <code class="text-[#b084ff]">supabase/schema.sql</code> di SQL Editor, lalu muat ulang halaman ini.
      Sementara itu, beranda memakai data contoh dari site.config.ts.
    </div>

    <!-- Tabel kosong -->
    <div v-else-if="!items.length" class="border border-white/10 p-8 text-center text-[#aaa] text-sm">
      Belum ada data. Tambahkan lewat tombol di kanan atas, atau impor contoh dari site.config.ts.
      <div class="mt-4"><button @click="importDefaults" class="border border-[#b084ff] text-[#b084ff] hover:bg-[#b084ff] hover:text-black px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors">Impor dari site.config.ts (LinkedIn)</button></div>
    </div>

    <ul v-else class="list-none p-0 m-0 border-t border-white/10">
      <li v-for="e in items" :key="e.id" class="flex items-center gap-4 border-b border-white/10 py-4" :class="{ 'opacity-40': !e.is_visible }">
        <span class="hidden sm:block w-28 shrink-0 text-[9px] font-bold uppercase tracking-widest text-[#b084ff]">{{ kindLabel(e.kind) }}</span>
        <div class="flex-1 min-w-0">
          <div class="text-white text-sm font-medium truncate">{{ e.title }}</div>
          <div class="text-[#888] text-[11px] truncate">{{ e.organization }}<template v-if="formatPeriod(e)"> &middot; {{ formatPeriod(e) }}</template></div>
        </div>
        <span class="text-[10px] text-[#555] font-mono w-10 text-right">{{ e.sort_order }}</span>
        <button @click="toggleVisible(e)" :title="e.is_visible ? 'Sembunyikan' : 'Tampilkan'" class="w-8 h-8 border border-white/20 text-[#aaa] hover:text-white flex items-center justify-center"><Icon :name="e.is_visible ? 'ph:eye' : 'ph:eye-slash'" /></button>
        <button @click="openEdit(e)" class="w-8 h-8 border border-white/20 text-[#aaa] hover:text-[#b084ff] flex items-center justify-center"><Icon name="ph:pencil-simple" /></button>
        <button @click="remove(e)" class="w-8 h-8 border border-white/20 text-[#aaa] hover:text-[#ff5f56] flex items-center justify-center"><Icon name="ph:trash" /></button>
      </li>
    </ul>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" @click.self="showModal = false">
        <form class="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#0b0b0b] border border-white/10 p-6 md:p-8 space-y-5" @submit.prevent="save">
          <h2 class="m-0 text-2xl font-['Clash_Display'] font-light text-white">{{ editId ? 'Edit' : 'Tambah' }} entri.</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label :class="labelCls">Jenis</label>
              <select v-model="form.kind" :class="inputCls">
                <option v-for="k in EXPERIENCE_KINDS" :key="k.value" :value="k.value">{{ k.label }}</option>
              </select>
            </div>
            <div>
              <label :class="labelCls">Urutan (kecil = di atas)</label>
              <input v-model.number="form.sort_order" type="number" :class="inputCls" />
            </div>
          </div>

          <div><label :class="labelCls">Judul / posisi</label><input v-model="form.title" type="text" :class="inputCls" placeholder="Contoh: Posisi / nama sertifikat" required /></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label :class="labelCls">Organisasi / institusi</label><input v-model="form.organization" type="text" :class="inputCls" placeholder="Contoh: Nama organisasi" /></div>
            <div><label :class="labelCls">Lokasi</label><input v-model="form.location" type="text" :class="inputCls" placeholder="Contoh: Kota · Remote" /></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label :class="labelCls">Mulai / terbit</label><input v-model="form.period_start" type="month" :class="inputCls" /></div>
            <div><label :class="labelCls">Selesai</label><input v-model="form.period_end" type="month" :disabled="form.is_current" :class="[inputCls, form.is_current ? 'opacity-40' : '']" /></div>
          </div>
          <label class="flex items-center gap-3 text-sm text-[#ccc] cursor-pointer"><input v-model="form.is_current" type="checkbox" class="accent-[#b084ff]" /> Masih berjalan (tampil "NOW")</label>

          <div><label :class="labelCls">Deskripsi</label><textarea v-model="form.description" rows="4" :class="inputCls"></textarea></div>
          <div><label :class="labelCls">Link bukti / kredensial (opsional)</label><input v-model="form.link_url" type="url" :class="inputCls" placeholder="https://www.credly.com/... atau link verifikasi" /></div>
          <div>
            <label :class="labelCls">Logo organisasi (opsional, kosong = otomatis)</label>
            <input v-model="form.logo_url" type="url" :class="inputCls" placeholder="https://... (URL logo, atau unggah di bawah)" />
            <input type="file" accept="image/*" class="mt-2 block text-xs text-[#aaa]" @change="uploadProof($event, 'logo_url')" />
            <img v-if="form.logo_url" :src="form.logo_url" alt="" class="mt-3 h-14 w-auto border border-white/10 bg-white object-contain p-1" />
          </div>
          <div>
            <label :class="labelCls">Gambar sertifikat (opsional)</label>
            <input v-model="form.image_url" type="url" :class="inputCls" placeholder="https://... (tempel URL gambar, atau unggah di bawah)" />
            <input type="file" accept="image/*" class="mt-2 block text-xs text-[#aaa]" @change="uploadProof" />
            <img v-if="form.image_url" :src="form.image_url" alt="" class="mt-3 h-24 w-auto border border-white/10 object-cover" />
          </div>
          <label class="flex items-center gap-3 text-sm text-[#ccc] cursor-pointer"><input v-model="form.is_visible" type="checkbox" class="accent-[#b084ff]" /> Tampilkan di beranda</label>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="showModal = false" class="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#888] hover:text-white">Batal</button>
            <button type="submit" :disabled="isSaving" class="bg-white hover:bg-[#b084ff] text-black px-7 py-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">{{ isSaving ? 'Menyimpan...' : 'Simpan' }}</button>
          </div>
        </form>
      </div>
    </Teleport>
  </div>
</template>
