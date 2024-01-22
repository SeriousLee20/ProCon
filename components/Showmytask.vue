<template>
  <Pbutton
    class="no-shadow font-normal text-xs"
    :icon="setShowMyTaskIcon(showMyTaskOnly)"
    @click="handler"
    label="My Task Only"
    size="medium"
    text
  />
</template>

<script setup>
defineProps(["showMyTaskOnly", "handler"]);

const setShowMyTaskIcon = (show) => {
  return show ? "pi pi-check-circle" : "pi pi-circle";
};
</script>

<style lang="scss" scoped></style>
