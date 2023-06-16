<template>
  <div>
    <ClientOnly>
      <Navbar />
    </ClientOnly>
    <slot></slot>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";
export default {
  components: {
    Navbar,
  },
};
</script>

<style lang="scss" scoped></style>
