<template>
  <Pdataview :value="announcementList" :pt="pt">
    <template #list="slotProps">
      <div class="w-full flex align-items-center justify-content-between">
        <div class="flex gap-2 align-content-center">
          <p class="footnote-2">
            {{ slotProps.data.name ?? "" }}
          </p>
          <i
            class="footnote flex pi pi-info-circle text-base text-color-secondary align-items-center"
            v-tooltip.right="
              slotProps.data.description ?? 'No description provided'
            "
          ></i>
        </div>

        <p class="footnote">
          {{ formatDate(slotProps.data.creation_timestamp) ?? "" }}
        </p>
      </div>
    </template>
  </Pdataview>
</template>

<script setup>
defineProps(["announcementList", "pt"]);

const formatDate = (dateString) => {
  const formattedDate = useDateFormat(dateString, "MMM DD, YYYY HH:mm", {
    locales: "en-US",
  });
  return formattedDate.value;
};
</script>

<style lang="css" scoped>
.footnote-2 {
  font-weight: 600;
  font-size: 0.8rem;
  /* line-height: 15px; */
}

.footnote {
  font-weight: 400;
  font-size: 0.75rem;
}
</style>
