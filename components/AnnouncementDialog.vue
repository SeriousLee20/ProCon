<template>
  <Pdialog
    v-if="props.announcementDialog"
    style="width: 50%"
    header="Announcement"
    :modal="true"
    class="p-fluid"
    dismissableMask
  >
    <div>
      <div class="mb-5">
        <div class="font-bold mb-2">
          {{ props.selectedAnnouncement?.name }}
        </div>

        <div>
          {{ props.selectedAnnouncement?.description }}
        </div>
      </div>
      <div class="flex align-items-center justify-content-between">

          <div class="flex text-sm text-gray-300 gap-1">
            <div>Created at</div>
            <div>
              {{ formatDate(props.selectedAnnouncement?.creation_timestamp) }}
            </div>
          </div>
          <div v-if="props.isCreator">
            <Pconfirmpopup />
            <Pbutton
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              text
              @click="deleteAnnouncement($event)"
            />
          </div>
      </div>
    </div>
  </Pdialog>
</template>

<script setup>
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();

const props = defineProps({
  announcementDialog: {
    type: Boolean,
    required: true,
    default: false,
  },
  selectedAnnouncement: {},
  isCreator: {},
});

const emit = defineEmits(['delete-announcement']);

const formatDate = (dateString) => {
  const formattedDate = useDateFormat(dateString, "MMM DD, YYYY HH:mm", {
    locales: "en-US",
  });
  return formattedDate.value;
};

const deleteAnnouncement = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: "Delete this announcement?",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      console.log("confirm dlt announcement");
      emit("delete-announcement", props.selectedAnnouncement);
    },
    reject: () => {},
  });
};
</script>

<style lang="css" scoped></style>
