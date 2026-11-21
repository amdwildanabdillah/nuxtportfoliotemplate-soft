<script setup>
// Data: site.config.ts (mode local) atau tabel `experiences` (mode supabase). Lihat usePortfolio().experiences
const { experience: cfg } = usePortfolioConfig()
const { data: items } = await useAsyncData('experiences', usePortfolio().experiences, { default: () => [] })

const groups = computed(() => EXPERIENCE_KINDS
  .map(k => ({ ...k, label: cfg.kinds?.[k.value] || k.label, rows: items.value.filter(e => e.kind === k.value) }))
  .filter(g => g.rows.length))

const pad = (n) => String(n).padStart(2, '0')

// Tautan yang menunjuk ke gambar dibuka sebagai pop-up (bukan tab baru)
const isImg = (u) => !!u && /\.(png|jpe?g|webp|gif|avif)(\?|#|$)/i.test(u) || /\/storage\/v1\/object\/public\//i.test(u || '')
const box = ref(null)
const openProof = (ev, url, title) => {
  if (!isImg(url)) return
  ev.preventDefault()
  box.value = { src: url, title }
}
const closeBox = () => { box.value = null }
const onKey = (e) => { if (e.key === 'Escape') closeBox() }
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
watch(box, (v) => { if (import.meta.client) document.body.style.overflow = v ? 'hidden' : '' })
</script>

<template>
  <section id="experience-section" class="relative w-full overflow-hidden px-5 py-20 md:px-10 md:py-28">
    <div class="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-transparent via-[#F3EEFF] to-transparent"></div>
    <div class="blob blob-lilac -left-40 top-20 h-[460px] w-[460px]"></div>

    <div class="relative z-10 mx-auto w-full max-w-4xl">
      <!-- Judul -->
      <div class="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between" data-aos="fade-up">
        <div>
          <span class="chip chip-lilac">{{ cfg.eyebrow }}</span>
          <h2 class="f-display m-0 mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {{ cfg.titleBefore }} <span class="f-script text-gradient text-[1.4em] font-semibold">{{ cfg.titleHighlight }}</span>
          </h2>
        </div>
        <a v-if="cfg.resumeUrl" :href="cfg.resumeUrl" target="_blank" rel="noopener noreferrer" class="btn-pill btn-ghost shrink-0 self-start md:self-auto">
          {{ cfg.resumeLabel }} <Icon name="ph:arrow-up-right-bold" class="text-base" />
        </a>
      </div>

      <!-- Kelompok: garis waktu vertikal -->
      <div v-for="g in groups" :key="g.value" class="mb-14 last:mb-0">
        <h3 class="m-0 mb-6 inline-block rounded-full bg-white px-5 py-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#B24D74] shadow-sm" data-aos="fade-right">{{ g.label }}</h3>

        <ol class="relative m-0 list-none p-0 pl-8 md:pl-10">
          <span class="absolute bottom-2 left-[11px] top-2 w-[2px] rounded-full bg-gradient-to-b from-[#FFC2D6] to-[#CDBDFF] md:left-[15px]"></span>

          <li v-for="(e, i) in g.rows" :key="e.id" class="relative mb-6 last:mb-0" data-aos="fade-up">
            <!-- titik garis waktu -->
            <span class="absolute -left-8 top-7 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-[#FFF8F5] bg-[#E8789F] shadow md:-left-10 md:h-8 md:w-8"></span>

            <div class="card-soft p-5 md:p-7">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="chip">{{ formatPeriod(e, cfg.nowLabel) }}</span>
                <span class="text-[12px] font-bold text-[#C8B7C4]">{{ pad(i + 1) }}</span>
              </div>

              <div class="mt-4 flex items-start gap-4">
                <!-- Logo / monogram -->
                <span class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#4A3548]/10 bg-[#FFF8F5] md:h-14 md:w-14" aria-hidden="true">
                  <NuxtImg v-if="experienceLogo(e).type === 'img'" :src="experienceLogo(e).src" alt="" width="96" loading="lazy" class="h-full w-full object-contain p-1.5" />
                  <span v-else class="flex h-full w-full items-center justify-center bg-[#EBE3FF] text-[14px] font-extrabold tracking-wide text-[#6E55C4]">{{ experienceLogo(e).text }}</span>
                </span>

                <div class="min-w-0 flex-1">
                  <h4 class="f-display m-0 text-xl font-normal leading-tight md:text-2xl">{{ e.title }}</h4>
                  <p v-if="e.organization || e.location" class="m-0 mt-1.5 text-[13px] font-semibold text-[#E8789F]">
                    {{ e.organization }}<template v-if="e.location"> &middot; {{ e.location }}</template>
                  </p>
                  <p v-if="e.description" class="m-0 mt-3 max-w-2xl whitespace-pre-line text-[14px] leading-[1.8] text-[#8B7385]">{{ e.description }}</p>

                  <!-- Bukti: gambar sertifikat dan/atau tautan -->
                  <div v-if="e.image_url || e.link_url" class="mt-4 flex flex-wrap items-center gap-4">
                    <a v-if="e.image_url" :href="e.image_url" target="_blank" rel="noopener noreferrer" @click="openProof($event, e.image_url, e.title)" class="group block overflow-hidden rounded-2xl border border-[#4A3548]/10 bg-white" :aria-label="`View image: ${e.title}`">
                      <NuxtImg :src="e.image_url" :alt="e.title" width="240" loading="lazy" class="block h-20 w-auto max-w-[200px] object-cover transition-transform duration-500 group-hover:scale-105 md:h-24" />
                    </a>
                    <a v-if="e.link_url" :href="e.link_url" target="_blank" rel="noopener noreferrer" @click="openProof($event, e.link_url, e.title)" class="inline-flex items-center gap-1.5 rounded-full bg-[#EBE3FF] px-4 py-2 text-[12px] font-bold text-[#6E55C4] transition-colors hover:bg-[#9F85E8] hover:text-white">
                      {{ e.kind === 'certificate' ? 'Verify' : 'Open link' }} <Icon name="ph:arrow-up-right-bold" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="box" class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#4A3548]/80 p-4 backdrop-blur-sm md:p-10" role="dialog" aria-modal="true" :aria-label="box.title" @click.self="closeBox">
        <button type="button" aria-label="Close" class="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#4A3548] shadow-lg transition-colors hover:bg-[#E8789F] hover:text-white md:right-8 md:top-8" @click="closeBox"><Icon name="ph:x" class="text-xl" /></button>
        <figure class="m-0 flex max-h-full max-w-5xl flex-col items-center gap-3">
          <img :src="box.src" :alt="box.title" class="max-h-[80svh] w-auto max-w-full rounded-2xl bg-white object-contain shadow-2xl" />
          <figcaption class="text-[12px] font-bold tracking-wider text-white/90">{{ box.title }}</figcaption>
        </figure>
      </div>
    </Teleport>
  </section>
</template>
