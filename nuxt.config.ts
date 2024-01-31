// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  supabase: {
    cookieOptions: {
      maxAge: 60 * 60 * 8,
    },
  },
  modules: ["@nuxtjs/supabase", "nuxt-icon"],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
