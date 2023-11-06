<template>
  <Pbutton
    class="no-shadow"
    :icon="setShowCompletedIcon(showCompleted)"
    @click="handler"
    label="Completed"
    size="small"
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
