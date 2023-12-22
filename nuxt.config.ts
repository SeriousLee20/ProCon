// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  plugins: [
    "~/plugins/event-bus.ts",
    { src: "~/plugins/primevue.ts", ssr: false },
  ],
  modules: [
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@vee-validate/nuxt",
  ],

  css: [
    "@/assets/main.css",
    "primevue/resources/themes/mira/theme.css",
    "primevue/resources/primevue.css",
    "primeicons/primeicons.css",
    "primeflex/primeflex.css",
  ],
  build: {
    transpile: ["primevue"],
  },
  supabase: {
    cookieOptions: {
      maxAge: 60 * 60 * 8, // 8 hours
    },
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/",
    },
  },

  // components: false,
});
