<script setup>
const currentYear = new Date().getFullYear()
const { profile, contact, watermark } = usePortfolioConfig()
const portfolio = usePortfolio()
const waLink = profile.whatsapp ? `https://wa.me/${String(profile.whatsapp).replace(/\D/g, '')}` : ''

// Email: dari config; di mode Supabase bisa diubah lewat /admin/settings
const { data: settings } = await useAsyncData('site-settings', () => portfolio.settings(),
  { default: () => ({ contact_email: profile.email, socials: usePortfolioConfig().socials }) })
const contactEmail = computed(() => settings.value.contact_email)
// Tombol CTA selalu tampil: ke WhatsApp bila ada, kalau tidak ke email
const ctaHref = computed(() => waLink || `mailto:${contactEmail.value}`)
const ctaExternal = !!waLink
const socials = computed(() => settings.value.socials)

// Nama ikon sosial (Phosphor): github -> ph:github-logo
const socialIcon = (platform) => `ph:${String(platform).toLowerCase()}-logo`
</script>

<template>
  <section id="contact-section" class="relative w-full overflow-hidden px-5 pb-10 pt-20 md:px-10 md:pt-28">
    <div class="blob blob-pink -bottom-20 -left-32 h-[480px] w-[480px]"></div>
    <div class="blob blob-lilac -right-32 top-0 h-[460px] w-[460px]"></div>

    <div class="relative z-10 mx-auto w-full max-w-6xl">

      <!-- Kartu ajakan -->
      <div class="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#FFD3E2] via-[#F6DDF3] to-[#DCCFFF] px-6 py-14 text-center shadow-[0_30px_80px_-30px_rgba(232,120,159,0.6)] md:px-12 md:py-20" data-aos="fade-up">
        <span class="floaty absolute left-[8%] top-[14%] hidden text-4xl text-white/80 md:block" style="--r:-10deg"><Icon name="ph:heart-fill" /></span>
        <span class="floaty absolute right-[9%] bottom-[16%] hidden text-5xl text-white/80 md:block" style="--r:12deg; animation-delay:1s"><Icon name="ph:sparkle-fill" /></span>

        <span class="inline-block rounded-full bg-white/80 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#B24D74]">{{ contact.eyebrow }}</span>
        <h2 class="f-display m-0 mx-auto mt-5 max-w-3xl text-4xl font-light leading-[1.15] tracking-tight md:text-6xl">
          {{ contact.headingBefore }} <span class="f-script text-[1.15em] font-semibold text-[#E8789F]">{{ contact.headingHighlight }}</span>
        </h2>
        <a :href="ctaHref" :target="ctaExternal ? '_blank' : undefined" rel="noopener noreferrer" class="btn-pill mt-9 bg-white !px-9 !py-4 text-[#4A3548] shadow-[0_16px_36px_-14px_rgba(74,53,72,0.45)] hover:-translate-y-0.5 hover:text-[#E8789F]">
          {{ contact.ctaLabel }}
          <Icon v-if="!ctaExternal" name="ph:envelope-simple-fill" class="text-lg text-[#E8789F]" />
          <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967c-.273-.099-.471-.148-.67.15c-.197.297-.767.966-.94 1.164c-.173.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.018-.458.13-.606c.134-.133.298-.347.446-.52s.198-.298.298-.497c.099-.198.05-.371-.025-.52s-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51a13 13 0 0 0-.57-.01c-.198 0-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074s2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625c.712.227 1.36.195 1.871.118c.571-.085 1.758-.719 2.006-1.413s.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214l-3.741.982l.998-3.648l-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884c2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413"/></svg>
        </a>
      </div>

      <!-- Footer -->
      <div class="mt-14 flex flex-col justify-between gap-10 border-t border-[#4A3548]/10 pt-10 md:flex-row" data-aos="fade-in">
        <div class="flex flex-col gap-6 text-center md:text-left">
          <div>
            <h3 class="f-display m-0 text-2xl font-normal">{{ profile.name }}</h3>
            <p class="mx-auto m-0 mt-2 max-w-sm text-[14px] leading-[1.7] text-[#8B7385] md:mx-0">{{ contact.footerTagline }}</p>
          </div>

          <div>
            <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B24D74]">Email</span>
            <a :href="`mailto:${contactEmail}`" class="mt-2 flex items-center justify-center gap-2 text-[15px] font-semibold text-[#4A3548] transition-colors hover:text-[#E8789F] md:justify-start">
              <Icon name="ph:envelope-simple" class="text-lg text-[#E8789F]" /> {{ contactEmail }}
            </a>
          </div>

          <div v-if="contact.ventures.length">
            <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B24D74]">{{ contact.venturesLabel }}</span>
            <div class="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <a v-for="v in contact.ventures" :key="v.url" :href="v.url" target="_blank" rel="noopener noreferrer" class="chip chip-lilac transition-colors hover:!bg-[#9F85E8] hover:!text-white">
                {{ v.label }} <Icon name="ph:arrow-up-right-bold" class="text-[12px]" />
              </a>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-6 md:items-end md:justify-between">
          <div class="flex flex-wrap items-center justify-center gap-3 md:justify-end">
            <a v-for="s in socials" :key="s.url" :href="s.url" target="_blank" rel="noopener noreferrer" class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#8B7385] shadow-sm transition-all hover:-translate-y-1 hover:bg-[#E8789F] hover:text-white" :title="s.platform" :aria-label="s.platform">
              <Icon :name="socialIcon(s.platform)" class="text-[20px]" />
            </a>
          </div>
          <div class="text-center text-[12px] text-[#8B7385] md:text-right">
            <p class="m-0">&copy; {{ currentYear }} {{ profile.name }}.</p>
            <p class="m-0 mt-0.5">{{ contact.copyright }}</p>
            <p v-if="watermark.show" class="m-0 mt-2 text-[#B8A3B3]">
              {{ watermark.text }}
              <a :href="watermark.url" target="_blank" rel="noopener" class="font-semibold text-[#9F85E8] underline underline-offset-2 transition-colors hover:text-[#E8789F]">{{ watermark.label }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
