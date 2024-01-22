// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // devtools: { enabled: true }

  plugins: [
    "~/plugins/event-bus.ts",
    { src: "~/plugins/primevue.ts", ssr: false },
    "~/plugins/ganttastic.client.ts"
  ],
  modules: [
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image"
  ],
  image:{
    dir:"assets/images/"
  },
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
    cookies: {
      lifetime: 60 * 60 * 8, // 8 hours
    },
    redirect: {
      login: "/login",
      callback: "/",
    },
  },
  runtimeConfig: {
    public: {
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
  },
  // components: false,
});
