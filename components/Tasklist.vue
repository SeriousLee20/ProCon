<template>
  <div>
    <Pdataview :value="props.taskList" :pt="props.pt">
      <template #empty>
        <div></div>
      </template>
      <template #list="slotProps">
        <div
          v-for="(item, index) in slotProps.items"
          class="col-12 hover:shadow-2 shadow-1 mb-3 p-2 cursor-pointer border-1 border-round border-primary-400 border-top-none border-left-none"
          :class="{'border-primary-400': isMainTaskList}"
          @click="openTaskDialog(item)"
        >
          <div
            class=""

          >
            <p class="text-sm font-semibold mb-0 mt-0">
              {{ item.task_name }}
            </p>

            <div class="flex justify-content-between" style="min-height: 2rem">
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
                  :class="{ 'bg-red-500': item.due }"
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
              <div>
                <Pavatargroup>
                  <div v-for="dpt in item.dept_abbr">
                    <Pavatar
                      :label="dpt.department_abbr"
                      size="small"
                      shape="circle"
                      style="
                        font-size: x-small;
                        background-color: var(--primary-500);
                        border-color: var(--primary-500);
                        color: white;
                      "
                      v-tooltip.left="{
                        value: dpt.department_name,
                        pt: {
                          text: 'bg-primary-500 text-xs font-medium text-center',
                        },
                      }"
                    />
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
const props = defineProps(["taskList", "pt", "listName"]);
const isMainTaskList = props.listName == 'main_task'
console.log("tasklist", props.taskList, props.taskList?.length);

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
