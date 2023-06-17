<template>
  <div>
    <div
      style="
        flex: 1;
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
      "
    >
      <iframe
        style="pointer-events: none; border: none"
        width="1000"
        height="700"
        src="https://embed.lottiefiles.com/animation/145811"
      ></iframe>
    </div>
    <Pbutton label="logout" @click="logout" />
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";

definePageMeta({
  middleware: ["auth", "initiate"],
  layout: "custom",
});

const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
const { data: userData } = await useFetch("/api/get_full_data");
const table = userData.value;

dstore.setSelectedProject("-1");

watchEffect(() => {
  if (!useSupabaseUser().value) {
    navigateTo("/login");
  }
});

const logout = async () => {
  await auth.signOut();
  dstore.logout();
};

console.log(useRoute());
</script>

<style lang="scss" scoped></style>
