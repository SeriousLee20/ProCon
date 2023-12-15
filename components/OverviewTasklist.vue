<template>
  <div v-if="showList">
    <Pdataview :value="props.taskList" :pt="props.pt">
      <template #empty>
        <div></div>
      </template>
      <template #list="slotProps">
        <div
          v-for="(item, index) in slotProps.items"
          :key="index"
          class="col-12 cursor-pointer hover:bg-primary-100 border-round border-none mb-2 shadow-2 px-3 pb-3"
          @click="openTaskDialog(item)"
        >
          <div class="">
            <p class="mb-0 font-semibold font-lg pb-4">
              {{ item.task_name }}
            </p>

            <div class="flex gap-1">
              <Ptag
                v-if="item.status_name"
                :value="item.status_name"
                rounded
                :icon="item.status_icon"
                :severity="item.status_severity"
                class="max-h-1rem"
              />
              <Ptag
                v-if="item.due_date_time"
                :value="formatDate(item.due_date_time)"
                rounded
                icon="pi pi-stopwatch"
                class="max-h-1rem"
              />
              <Ptag
                v-if="item.importance_desc"
                :value="item.importance_desc"
                rounded
                icon="pi pi-exclamation-triangle"
                class="max-h-1rem"
              />
              <Ptag
                v-if="item.importance_rate"
                :value="item.importance_rate"
                rounded
                icon="pi pi-flag"
                class="max-h-1rem"
              />
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

const emit = defineEmits(["open-ov-task-dialog"]);
const openTaskDialog = (props) => {
  console.log("opentaskdialog");
  emit("open-ov-task-dialog", props);
};
</script>

<style lang="scss" scoped></style>
