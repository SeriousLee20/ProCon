<template>
  <div class="range-timepicker">
    <el-time-picker
      v-model="start"
      is-range
      range-separator="To"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
    />
  </div>
</template>

<script setup>
const props = defineProps(["time", "placeholder"]);
const startTime = props.time[0];
const endTime = props.time[1];
const startPlaceholder = props.placeholder[0];
const endPlaceholder = props.placeholder[1];
</script>

<style lang="scss" scoped></style>
