<template>
  <div
    v-if="isLoading"
    class="fixed top-0 left-0 w-screen h-screen disabled-div"
    style="
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <div
      class="bg-white"
      style="
        font-family: sans-serif;
        border-radius: 8px;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        padding-top: 24px;
        padding-bottom: 24px;
        padding-left: 32px;
        padding-right: 32px;
      "
    >
      <iframe
        style="border: none"
        src="https://embed.lottiefiles.com/animation/6893"
      ></iframe>
      <h3 style="">Meowing...</h3>
      <span>Paws for a moment, the cat is on its way! </span>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
  //   layout: "custom",
});

const isLoading = ref(true);
setTimeout(() => {
  isLoading.value = false;
  console.log(isLoading.value);
}, 3000);

watchEffect(() => {
  if (useSupabaseUser().value && !isLoading.value) {
    navigateTo("/overview");
  }
});
</script>

<style lang="scss" scoped></style>
