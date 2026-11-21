export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  
  // Kalau belum login dan maksa buka halaman admin (selain halaman login itu sendiri), tendang ke /admin/login
  if (!user.value && to.path.startsWith('/admin') && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
  
  // Kalau udah login tapi iseng buka halaman login lagi, arahin langsung ke dashboard
  if (user.value && to.path === '/admin/login') {
    return navigateTo('/admin')
  }
})