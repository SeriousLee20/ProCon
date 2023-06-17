<template>
  <div>
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
