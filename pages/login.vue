<template>
  <div
    class="h-screen w-screen flex align-items-center justify-content-center bg-primary-200 shadow-5"
  >
    <Pcard class="flex flex-column align-items-center justify-item-center w-30rem h-29rem">
      <template #header>
        <div >

          <div class="text-3xl font-bold p-4 text-primary-500">Welcome to ProCon!</div>
          <div class="text-center font-sans text-primary-300 mb-2">Let's get your projects done :)</div>
        </div>
      </template>
      <template #content>
        <div class="bg-primary-500 h-20rem w-20rem h-full border-round shadow-3">
            <div class="flex align-items-center justify-content-center h-full">

              <Pbutton
              class="mt-3 font-bold text-xl bg-white shadow-4 hover:shadow-5"
                type="button"
                label="Login with Google"
                icon="pi pi-google text-2xl"
                @click="login"
                text
              />
            </div>
        </div>
      </template>
    </Pcard>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/datastore";
import { createClient } from "@supabase/supabase-js";
const user = useSupabaseUser();
const { auth } = useSupabaseAuthClient();

// var user = null;
const runtimeConfig = useRuntimeConfig();
const supabase = createClient(
  runtimeConfig.public.SUPABASE_URL,
  runtimeConfig.public.SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

// const {
//   data: { user },
// } = await supabase.auth.getUser();
// console.log(user?.id);

const getURL = () => {
  let url =
    // process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    runtimeConfig?.public.NEXT_PUBLIC_SUPABASE_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  console.log("url", url);
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  console.log("url", url);
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  console.log("url", url);
  return url;
};

const login = async () => {
  const { data, error } = await auth.signInWithOAuth({ provider: "google" });
  console.log(data);
  if (error) createError(error);
};

watchEffect(() => {
  // if (user?.id) {
  //   navigateTo("/");
  // }
});
</script>

<style lang="scss" scoped></style>
