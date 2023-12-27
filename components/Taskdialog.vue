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
        aria-labelledby="invalid-task-name"
      />
      <small
        v-if="!props.selectedTask.task_name"
        id="invalid-task-name"
        class="text-red-500 text-xs"
        >*Required</small
      >
    </div>
    <div class="field overflow-scroll h-20rem">
      <label for="task-desc">Description</label>
      <Peditor
        id="task-desc"
        v-model="props.selectedTask.task_desc"
        class="h-15rem"
      ></Peditor>
    </div>

    <div class="flex justify-content-between">
      <div class="field">
        <label for="task-start-date">Start Datetime</label>
        <Pcalendar
          id="task-start-date"
          :class="{ 'p-invalid': invalidStartDate }"
          v-model="props.selectedTask.start_date_time"
          showTime
          hourFormat="24"
          dateFormat="M dd, yy"
          :selectOtherMonths="true"
          :disabled="!props.isAdmin"
          showButtonBar
          @hide="checkValidDates"
        ></Pcalendar>
      </div>
      <div class="field">
        <label for="task-due-datetime">Due Datetime</label>

        <Pcalendar
          id="task-due-datetime"
          :class="{ 'p-invalid': invalidDueDate }"
          v-model="props.selectedTask.due_date_time"
          showTime
          hourFormat="24"
          dateFormat="M dd, yy"
          showButtonBar
          :min="props.selectedTask.start_date_time"
          :overlayVisible="true"
          :selectOtherMonths="true"
          :disabled="!props.isAdmin || disableDueDate"
          aria-labelledby="invalid-due-date"
          @hide="checkValidDates($event)"
        ></Pcalendar>
        <small
          v-if="invalidDueDate"
          id="invalid-due-date"
          class="text-red-500 text-xs"
          >{{ invalidDueDateMessage }}</small
        >
      </div>
      <div class="field">
        <label for="task-urgent-date">Urgent Date</label>
        <Pcalendar
          id="task-urgent-date"
          :class="{ 'p-invalid': invalidUrgentDate }"
          v-model="props.selectedTask.urgent_date"
          dateFormat="M dd, yy"
          :maxDate="props.selectedTask.due_date_time"
          :selectOtherMonths="true"
          :disabled="!props.isAdmin || disableUrgentDate"
          showButtonBar
          @update:model-value="checkValidDates"
        ></Pcalendar>
        <small
          v-if="invalidUrgentDate"
          id="invalid-urgent-date"
          class="text-red-500 text-xs"
          >{{ invalidUrgentDateMessage }}</small
        >
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
        optionGroupChildren="members"
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
        <Pconfirmpopup />

        <div class="w-full text-right pt-3">
          <Pbutton
            label="Save"
            icon="pi pi-check"
            severity="success"
            text
            @click="saveTask"
          />
          <Pbutton
            label="Cancel"
            icon="pi pi-times"
            text
            @click="closeTaskDialog"
          />

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
    </template>
  </Pdialog>
</template>

<script setup>
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
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
const invalidDueDate = ref(false);
const invalidStartDate = ref(false);
const invalidUrgentDate = ref(false);
const invalidDueDateMessage = ref();
const invalidUrgentDateMessage = ref();
const disableDueDate = ref(false);
const disableUrgentDate = ref(false);

console.log("dialog", isEditTask, props.taskDialog);

const formatDate = (dateString) => {
  const formattedDate = useDateFormat(dateString, "MMM DD, YYYY HH:mm", {
    locales: "en-US",
  });
  return formattedDate.value;
};

const setSecondToZero = (timestamp) => {
  return new Date(timestamp.setSeconds(0, 0));
};

const checkValidDates = () => {
  console.log("check dates", props.selectedTask);
  if (props.selectedTask.due_date_time && props.selectedTask.start_date_time) {
    let sdt = setSecondToZero(props.selectedTask.start_date_time);
    let edt = setSecondToZero(props.selectedTask.due_date_time);
    let ud = props.selectedTask.urgent_date;

    console.log(sdt, edt, ud);
    invalidStartDate.value = ud && ud < new Date(sdt.toDateString()) || sdt >= edt;
    invalidDueDate.value =
      sdt >= edt || (ud && ud > new Date(edt.toDateString()));
    invalidUrgentDate.value = ud && ud < new Date(sdt.toDateString()) || ud && ud > new Date(edt.toDateString());
    invalidDueDateMessage.value =
      sdt >= edt ? "Due Datetime must after Start Datetime" : null;
    invalidUrgentDateMessage.value =
      ud < new Date(sdt.toDateString())
        ? "Urgent Date must after Start Date"
        : ud > new Date(edt.toDateString())
        ? "Urgent Date must before Due Date"
        : null;
  }
  disableUrgentDate.value =
    !props.selectedTask.start_date_time || !props.selectedTask.due_date_time;
  disableDueDate.value = !props.selectedTask.start_date_time;
  props.selectedTask.urgent_date = disableUrgentDate.value
    ? null
    : props.selectedTask.urgent_date;
  props.selectedTask.due_date_time = disableDueDate.value
    ? null
    : props.selectedTask.due_date_time;
  console.log(
    invalidStartDate.value,
    invalidDueDate.value,
    invalidUrgentDate.value
  );
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

const saveTask = () => {
  if (
    !invalidDueDate.value &&
    !invalidStartDate.value &&
    !invalidUrgentDate.value &&
    props.selectedTask.task_name
  ) {
    if (props.isEditTask) {
      emit("update-task");
      console.log("update", props.selectedTask);
    } else {
      emit("insert-task");
      console.log("insert", props.selectedTask);
    }
  }
};

const deleteTask = () => {
  console.log("dlt", props.selectedTask);
  confirm.require({
    target: event.currentTarget,
    message: "Delete this task?",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      console.log("confirm dlt task");
      emit("delete-task", props.selectedTask);
    },
    reject: () => {},
  });
  // emit("delete-task", props.selectedTask);
};
</script>

<style lang="css" scoped>
.footnote {
  font-weight: 400;
  font-size: 0.9rem;
}
</style>
