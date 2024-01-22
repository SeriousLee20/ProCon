<template>
  <Pdropdown
    :pt="{
      input: {
        class:'text-xs flex align-self-center',
        style:
          'box-shadow:none; border: none; color:var(--primary-500);',
      },
      trigger:{
        class:'text-xs flex align-self-center',
        style:'display:none; width: 0.8rem; height:0.8rem;'
      }
    }"
    style="box-shadow: none; border: none"
    :options="props.sortOptions"
    optionLabel="desc"
    optionValue="id"
    @change="handler(filterName, $event.value, boardName)"
    class="w-9rem"
  >
  <template #dropdownicon>
    <!-- <div class="min-w-0"></div> -->
  </template>
  </Pdropdown>
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
