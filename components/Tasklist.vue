<template>
  <div>
    <Pdataview :value="props.taskList" :pt="props.pt">
      <template #empty>
        <div></div>
      </template>
      <template #list="slotProps">
        <div
          v-for="(item, index) in slotProps.items"
          class="col-12 cursor-pointer hover:bg-primary-200 pl-2 pb-1 border-round border-none"
          @click="openTaskDialog(item)"
        >
          <div class="border-bottom-1 border-gray-200 border-round pb-1">
            <p class="footnote-2 mb-0 vertical-align-middle">
              {{ item.task_name }}
            </p>

            <div class="flex justify-content-between">

              <div class="flex gap-1 align-self-end">
                <Ptag
                  v-if="item.status_name"
                  :value="item.status_name"
                  rounded
                  :icon="item.status_icon"
                  :severity="item.status_severity"
                  class="max-h-1rem font-normal"
                />
                <Ptag
                  v-if="item.due_date_time"
                  :value="formatDate(item.due_date_time)"
                  rounded
                  icon="pi pi-stopwatch"
                  class="max-h-1rem font-normal"
                />
                <Ptag
                  v-if="item.importance == 1"
                  :value="item.importance_rate"
                  rounded
                  icon="pi pi-exclamation-triangle"
                  class="max-h-1rem font-normal"
                />

                <!-- TODO: add avatar for department assigned -->
              </div>
              <div >
                <Pavatargroup>
                  <div v-for="dpt in item.dept_abbr">
                    <Pavatar :label="dpt" size="small" shape="circle" style="font-size:x-small; background-color: var(--primary-500); border-color:var(--primary-500); color:white;" />
                  </div>
                </Pavatargroup>
              </div>
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

<style lang="css" scoped>
.footnote-2 {
  font-weight: 500;
  font-size: 0.8rem;
  /* line-height: 15px; */
}
</style>
