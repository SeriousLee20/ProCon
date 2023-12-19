<template>
  <div v-if="showList">
    <Pdataview :value="props.taskList" :pt="props.pt">
      <template #list="slotProps">
        <div class="col-12 cursor-pointer hover:bg-primary-100 border-round border-none mb-2 shadow-2 px-3 pb-3"
          @click="openTaskDialog(slotProps)">
          <div class="">
            <p class="mb-0 font-semibold font-lg pb-4">
              {{ slotProps.data?.task_name }}
            </p>

            <div class="flex gap-1">
              <Ptag v-if="slotProps.data?.status" :value="slotProps.data?.status" rounded
                :icon="slotProps.data?.status_icon" :severity="slotProps.data?.status_severity" class="max-h-1rem" />
              <Ptag v-if="slotProps.data?.due_date_time" :value="formatDate(slotProps.data?.due_date_time)" rounded
                icon="pi pi-stopwatch" class="max-h-1rem" />
              <Ptag v-if="slotProps.data?.importance_desc" :value="slotProps.data?.importance_desc" rounded
                icon="pi pi-exclamation-triangle" class="max-h-1rem" />
              <Ptag v-if="slotProps.data?.importance_rate" :value="slotProps.data?.importance_rate" rounded
                icon="pi pi-flag" class="max-h-1rem" />
            </div>
          </div>
        </div>
      </template>
    </Pdataview>
  </div>
</template>

<script setup>
const props = defineProps(["taskList", "pt"]);
console.log("tasklist", props.taskList, props.taskList.length);
const showList = ref(props.taskList.length > 0);

const formatDate = (dateString) => {
  const formattedDate = useDateFormat(dateString, "MMM DD, YYYY HH:mm", {
    locales: "en-US",
  });
  return formattedDate.value;
};

const emit = defineEmits(["open-task-dialog"]);
const openTaskDialog = (props) => {
  emit("open-task-dialog", props);
};
</script>

<style lang="scss" scoped></style>

