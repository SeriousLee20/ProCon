<template>
  <div
    class="h-screen w-screen flex align-items-center justify-content-center bg-bluegray-200"
  >
    <Pcard class="flex flex-column align-items-center justify-item-center">
      <template #header>
        <h3>Welcome to ProCon</h3>
      </template>
      <template #content>
        <Pcard class="surface-100">
          <template #content>
            <Pbutton
              type="button"
              label="Login with Google"
              icon="pi pi-google"
              @click="login"
            />
          </template>
        </Pcard>
      </template>
    </Pcard>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/datastore";
import { createClient } from "@supabase/supabase-js";
// const user = useSupabaseUser();
// const { auth } = useSupabaseAuthClient();

var user = null;
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
    runtimeConfig?.public.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

const login = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getURL(),
    },
  });

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
