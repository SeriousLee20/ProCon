<template>
  <div class="h-screen w-screen flex align-items-center justify-content-center bg-bluegray-200">
    <Pcard class="flex flex-column align-items-center justify-item-center">
      <template #header>
        <h3>Welcome to ProCon</h3>
      </template>
      <template #content>
        <Pcard class="surface-100">
          <template #content>
            <Pbutton type="button" label="Login with Github" icon="pi pi-github" @click="login" />
          </template>
        </Pcard>
      </template>
    </Pcard>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/datastore";
const user = useSupabaseUser();
const { auth } = useSupabaseAuthClient();

watchEffect(() => {
  if (user.value) {
    navigateTo("/");
  }
});

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  console.log(url)
  return url
}

const login = async () => {
  const { data, error } = await auth.signInWithOAuth({
    provider: "github", options: {
      redirectTo: getURL(),
    },
  });
  console.log(data);
  if (error) createError(error);
};
</script>

<style lang="scss" scoped></style>
