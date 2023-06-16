<template>
  <div></div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
import { useNow, useDateFormat } from "@vueuse/core";
const client = useSupabaseClient();
const dateToday = useDateFormat(useNow(), "MMM DD, YYYY");
</script>

<style lang="scss" scoped></style>
