<template>
  <Pbutton
    class="no-shadow font-normal text-xs"
    :icon="setShowUnscheduledIcon(showUnscheduled)"
    @click="handler"
    label="Unscheduled"
    size="medium"
    text
  />
</template>

<script setup>
defineProps(["showUnscheduled", "handler"]);

const setShowUnscheduledIcon = (show) => {
  return show ? "pi pi-eye" : "pi pi-eye-slash";
};
</script>

<style lang="scss" scoped></style>
