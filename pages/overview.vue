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

const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
dstore.setCurrentPage("Overview");
dstore.setSelectedProject("-1");
console.log("ov selected project", dstore.getSelectedProject);
watchEffect(() => {
  if (!useSupabaseUser().value) {
    navigateTo("/login");
  }
});

const logout = async () => {
  await auth.signOut();
  dstore.logout();
};

definePageMeta({
  middleware: ["auth", "initiate"],
  layout: "custom",
});
</script>

<style lang="scss" scoped></style>
