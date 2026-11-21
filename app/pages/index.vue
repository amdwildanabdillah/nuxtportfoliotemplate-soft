<script setup>
const { site, profile, socials, hero } = usePortfolioConfig()
const portfolio = usePortfolio()
const featured = portfolio.featured
// Dimuat di server supaya project unggulan sudah ada di HTML pertama
await useAsyncData('featured-dev', featured, { default: () => [] })
// Experience: ditampilkan bila diaktifkan di config dan ada isinya
const { experience } = usePortfolioConfig()
const { data: expItems } = await useAsyncData('experiences', portfolio.experiences, { default: () => [] })
const showExperience = computed(() => experience.show && expItems.value.length > 0)

useHead({
  link: [{ rel: 'canonical', href: site.url }],
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: profile.name,
        url: site.url,
        image: site.url + site.ogImage,
        jobTitle: profile.jobTitle,
        sameAs: socials.map(s => s.url),
      },
    }),
  }],
})
</script>

<template>
  <div>
    <AppNavbar />

    <main class="relative">
      <HeroSection />
      <FeaturedProjects />
      <WorkSection />
      <ExperienceSection v-if="showExperience" />
      <AboutSection />
      <ContactSection />
    </main>
  </div>
</template>
