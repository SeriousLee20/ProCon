<template>
  <Pdataview :value="announcementList" :pt="pt">
    <template #list="slotProps">
      <div
        v-for="(item, index) in slotProps.items"
        class="w-full col-12 hover:shadow-2 shadow-1 mb-3 p-2 pb-3 cursor-pointer border-1 border-round border-primary-400 border-top-none border-left-none"
        @click="openAnnouncementDialog(item)"
      >
        <div class="flex align-items-center justify-content-between mb-2">
          <div class="text-sm font-semibold">
            {{ item.name ?? "" }}
          </div>
          <div class="text-xs font-light">
            {{ formatDate(item.creation_timestamp) ?? "" }}
          </div>
        </div>
        <div
          class="text-xs font-normal max-h-1rem text-overflow-ellipse overflow-hidden"
        >
          {{ item.description }}
        </div>
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
