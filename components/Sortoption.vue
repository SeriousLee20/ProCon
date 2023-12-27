<template>
  <Pdropdown
  :pt="{ input: { style: 'box-shadow:none; border: none; color:var(--primary-500); font-size:0.9rem' } }"
    style="box-shadow: none; border: none"
    :options="props.sortOptions"
    optionLabel="desc"
    optionValue="id"
    @change="handler(filterName, $event.value, boardName)"
    class="w-12rem"
  />
</template>

<script setup>
const props = defineProps([
  "sortOptions",
  "sortOption",
  "handler",
  "filterName",
  "boardName",
]);
</script>

<style lang="scss" scoped></style>
