<template>
  <Pdialog
    v-if="props.taskDialog"
    style="width: 80%"
    :header="header"
    :modal="true"
    class="p-fluid"
  >
    <div class="field">
      <label for="task-name">Task</label>
      <Pinputtext
        type="text"
        id="task-name"
        v-model="props.selectedTask.task_name"
        :disabled="!props.isAdmin"
        required
      />
    </div>
    <div class="field overflow-scroll h-25rem">
      <label for="task-desc">Description</label>
      <Peditor
        id="task-desc"
        v-model="props.selectedTask.task_desc"
        class="h-20rem"
      ></Peditor>
    </div>
    <div class="flex justify-content-between">
      <div class="field">
        <label for="task-due-datetime">Due Datetime</label>
        <Pcalendar
          id="task-due-datetime"
          v-model="props.selectedTask.due_date_time"
          showTime
          hourFormat="24"
          dateFormat="M dd, yy"
          showButtonBar
          :overlayVisible="true"
          :selectOtherMonths="true"
          :disabled="!props.isAdmin"
        ></Pcalendar>
      </div>
      <div class="field">
        <label for="task-urgent-date">Urgent Date</label>
        <Pcalendar
          id="task-urgent-date"
          v-model="props.selectedTask.urgent_date"
          dateFormat="M dd, yy"
          :maxDate="props.selectedTask.due_date_time"
          :selectOtherMonths="true"
          :disabled="!props.isAdmin"
          showButtonBar
        ></Pcalendar>
      </div>
      <div class="field">
        <label for="task-status">Status</label>
        <Pdropdown
          id="task-status"
          v-model="props.selectedTask.status_code"
          :options="props.taskOptions.status"
          optionLabel="status_name"
          optionValue="status_code"
          class="w-12rem"
        ></Pdropdown>
      </div>
      <div class="field">
        <label for="task-importance">Importance</label>
        <Pdropdown
          id="task-importance"
          v-model="props.selectedTask.importance"
          :options="props.taskOptions.importance"
          optionLabel="desc"
          optionValue="id"
          class="w-12rem"
          :disabled="!props.isAdmin"
        ></Pdropdown>
      </div>
      <div class="field" v-if="props.selectedTask.importance == 1">
        <label for="task-importanceRate">Importance Rate</label>
        <Prating
          v-model="props.selectedTask.importance_rate"
          :stars="4"
          :disabled="!props.isAdmin"
        >
          <template #onicon>
            <i class="pi pi-exclamation-triangle pt-2" style="color: red"></i>
          </template>
          <template #officon>
            <i class="pi pi-exclamation-triangle pt-2"></i>
          </template>
          <template #cancelicon>
            <i class="pi pi-times pt-2"></i>
          </template>
        </Prating>
      </div>
    </div>
    <div>
      <Pmultiselect
        v-model="props.selectedTask.owner_ids"
        :options="props.groupedUsers"
        optionLabel="username"
        optionValue="user_id"
        optionGroupLabel="department"
        filter
        optionGroupChildren="users"
        display="chip"
        placeholder="Assign Task to"
        class="w-full"
        :disabled="!props.isAdmin"
      >
        <template #optiongroup="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.department }}</div>
          </div>
        </template>
      </Pmultiselect>
    </div>
    <template #footer>
      <div class="w-full flex justify-content-between align-items-end">
        <div class="w-full text-left footnote text-xs" v-if="props.isEditTask">
          <div>
            Created by {{ props.selectedTask.creator_name }} at
            {{ formatDate(props.selectedTask.creation_timestamp) }}
          </div>
          <div>
            Modified by {{ props.selectedTask.modifier_name }} at
            {{ formatDate(props.selectedTask.modified_at) }}
          </div>
        </div>
        <div class="w-full text-right pt-3">
          <Pbutton
            label="Save"
            icon="pi pi-check"
            severity="success"
            text
            @click="saveTaskUpdate"
          />
          <Pbutton
            label="Cancel"
            icon="pi pi-times"
            text
            @click="closeTaskDialog"
          />

          <!-- TODO: confirm delete dialog -->
          <Pbutton
            v-if="props.isEditTask"
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            text
            @click="deleteTask"
          />
        </div>
      </div>

      <!-- TODO:add delete button, with confirm dialog -->
    </template>
  </Pdialog>
</template>

<script setup>
const props = defineProps({
  taskDialog: {
    type: Boolean,
    required: true,
    default: false,
  },
  selectedTask: {},
  groupedUsers: {},
  taskOptions: {},
  isEditTask: {},
  isAdmin: {},
});

// const taskDialogRef = toRef(props, "taskDialog");
// watch(taskDialogRef, (value) => {
//   props.taskDialog = value;
// });
const isEditTask = props.isEditTask;
const header = props.isEditTask ? "Edit Task" : "Add Task";
console.log("dialog", isEditTask, props.taskDialog);

const formatDate = (dateString) => {
  const formattedDate = useDateFormat(dateString, "MMM DD, YYYY HH:mm", {
    locales: "en-US",
  });
  return formattedDate.value;
};

const emit = defineEmits([
  "close-task-dialog",
  "update-task",
  "insert-task",
  "delete-task",
]);

const closeTaskDialog = () => {
  emit("close-task-dialog");
};

const saveTaskUpdate = () => {
  if (props.isEditTask) {
    emit("update-task");
    console.log("update", props.selectedTask);
  } else {
    emit("insert-task");
    console.log("insert", props.selectedTask);
  }
};

const deleteTask = () => {
  console.log("dlt", props.selectedTask);
  emit("delete-task", props.selectedTask);
};
</script>

<style lang="css" scoped>
.footnote {
  font-weight: 400;
  font-size: 0.9rem;
}
</style>
