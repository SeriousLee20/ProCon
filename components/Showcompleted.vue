<template>
  <Pbutton
    class="no-shadow font-normal"
    :icon="setShowCompletedIcon(showCompleted)"
    @click="handler"
    label="Completed"
    size="medium"
    text
  />
</template>

<script setup>
defineProps(["showCompleted", "handler"]);

const setShowCompletedIcon = (show) => {
  return show ? "pi pi-eye" : "pi pi-eye-slash";
};
</script>

<style lang="scss" scoped></style>
