<template>
  <Pdataview :value="announcementList" :pt="pt">
    <template #list="slotProps">
      <div
        v-for="(item, index) in slotProps.items"
        class="w-full flex align-items-center justify-content-between hover:bg-primary-100 border-round border-none mb-2 px-3 pb-3"
        @click="openAnnouncementDialog(item)"
      >
        <div class="flex gap-2 align-content-center">
          <p class="footnote-2">
            {{ item.name ?? "" }}
          </p>

        </div>

        <p class="footnote">
          {{ formatDate(item.creation_timestamp) ?? "" }}
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

const emit = defineEmits(["open-announcement-dialog"]);
const openAnnouncementDialog = (props) => {
  console.log("openannouncementdialog");
  emit("open-announcement-dialog", props);
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
