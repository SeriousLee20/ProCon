<template>
  <div class="grid w-screen h-sreen">
    <div class="col-2 flex align-items-center justify-content-center">
      this is task list
    </div>
    <div class="col-1 flex flex-column justify-content-around gep-3">
      <div id="mytask">this is my task list</div>
      <div id="announcement">this is announcement</div>
    </div>
  </div>
</template>

<script setup>
const { eventid } = useRoute().params;
</script>

<style lang="scss" scoped></style>
