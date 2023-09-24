<template>
  <form
    @submit="addAnnouncement()"
    v-if="isOpenAnnouncementModal"
    class="fixed top-0 left-0 w-screen h-screen disabled-div bg-black-alpha-70 z-5 flex justify-content-center align-items-center"
  >
    <div
      class="form-modal bg-white flex flex-column gap-6 px-4 py-5 align-items-center"
    >
      <div class="py-2"><h3>Add Announcement</h3></div>
      <span class="p-float-label">
        <Pinputtext
          id="title"
          v-model="announcementTitle"
          type="text"
          required
        />
        <label for="title">Title</label>
      </span>
      <span class="p-float-label">
        <Ptextarea
          id="description"
          v-model="announcementDesc"
          type="text"
          required
        />
        <label for="description">Description</label>
      </span>
      <Pmultiselect
        v-model="announcementReceivers"
        :options="groupedUsers"
        optionLabel="username"
        optionGroupLabel="department"
        filter
        optionGroupChildren="users"
        display="chip"
        placeholder="Select members to notify"
        class="w-full md:w-20rem"
      >
        <template #optiongroup="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.department }}</div>
          </div>
        </template>
      </Pmultiselect>
      <div class="flex gap-2 align-items-center">
        <Pbutton type="submit">Add</Pbutton>
        <Pbutton @click="closeAnnouncementModal()">Close</Pbutton>
      </div>
    </div>
  </form>

  <Pdialog
    v-model:visible="isEditTask"
    style="width: 80%"
    header="Edit Task"
    :modal="true"
    class="p-fluid"
  >
    <div class="flex flex-column gap-3">
      <span>
        <label for="task-name">Task</label>
        <Pinputtext id="task-name" v-model="taskName" type="text"></Pinputtext>
      </span>
      <span>
        <label for="task-desc">Description</label>
        <Peditor id="task-desc" v-model="taskDesc" class="min-h-full"></Peditor>
      </span>
      <div class="flex justify-content-between">
        <span>
          <label for="task-due-datetime">Due Datetime</label>
          <Pcalendar
            id="task-due-datetime"
            v-model="taskDueDatetime"
            showTime
            hourFormat="24"
          ></Pcalendar>
        </span>
        <span>
          <label for="task-urgent-date">Urgent Date</label>
          <Pcalendar id="task-urgent-date" v-model="taskUrgentDate"></Pcalendar>
        </span>
        <span>
          <label for="task-importance">Importance</label>
          <Pdropdown
            id="task-importance"
            v-model="taskImportance"
            :options="importanceOptions"
            optionLabel="desc"
            optionValue="id"
            class="w-12rem"
          ></Pdropdown>
        </span>
        <span>
          <label for="task-status">Status</label>
          <Pdropdown
            id="task-status"
            v-model="taskStatus"
            :options="statusOptions"
            optionLabel="status_name"
            optionValue="status_code"
            class="w-12rem"
          ></Pdropdown>
        </span>
        <span>
          <label for="task-importanceRate">Importance Rate</label>
          <Prating v-model="taskImportanceRate" :cancel="false" :stars="4">
            <template #onicon>
              <i class="pi pi-exclamation-triangle pt-2" style="color: red"></i>
            </template>
            <template #officon>
              <i class="pi pi-exclamation-triangle pt-2"></i>
            </template>
          </Prating>
        </span>
      </div>
      <span>
        <label for="task-owner">Assign To</label>
        <Pmultiselect
          id="task-owner"
          v-model="taskOwner"
          :options="groupedUsers"
          optionLabel="username"
          optionValue="user_id"
          optionGroupLabel="department"
          filter
          optionGroupChildren="users"
          display="chip"
          placeholder="Select members"
          class="w-full"
        >
          <template #optiongroup="slotProps">
            <div class="flex align-items-center">
              <div>{{ slotProps.option.department }}</div>
            </div>
          </template>
        </Pmultiselect>
      </span>
      <div class="flex gap-2 align-self-end">
        <Pbutton
          label="Save"
          icon="pi pi-check"
          text
          @click="upsertTask"
        ></Pbutton>
        <Pbutton
          label="Cancel"
          severity="danger"
          icon="pi pi-times"
          text
          @click="toggleEditTask"
        ></Pbutton>
      </div>
    </div>
  </Pdialog>
  <div>
    <div class="h-screen grid p-4 pt-2">
      <div class="col-8">
        <div>Completed</div>
      </div>

      <div class="col-4">
        <!-- right panel -->
        <div>
          <div
            class="mainpage-card border-primary-200 border-2 bg-white w-full mb-2"
          >
            <div class="grid justify-content-evenly">
              <div class="col-4 flex align-items-center justify-content-start">
                <Pbutton
                  class="no-shadow"
                  :icon="setShowCompletedIcon(myTaskShowCompleted)"
                  @click="toggleMyTaskShowCompleted"
                  label="Completed"
                  size="small"
                  text
                ></Pbutton>
              </div>
              <div class="col-3 text-center"><h5>My Tasks</h5></div>
              <div class="col-3 flex justify-content-end align-items-center">
                <Pdropdown
                  style="box-shadow: none; border: none"
                  v-model="myTaskSortOption"
                  :options="myTaskSortOptions"
                  optionLabel="desc"
                  optionValue="id"
                ></Pdropdown>
              </div>
            </div>
            <div class="h-24rem">
              <Pdataview :value="myTaskList().filteredList">
                <template #list="slotProps">
                  <div
                    class="col-12 cursor-pointer hover:bg-primary-100 pb-1 pl-1"
                    @click="toggleEditTask(slotProps)"
                  >
                    <div class="">
                      <p class="footnote-2 mb-0">
                        {{ slotProps.data.task_name }}
                      </p>
                      <div class="flex gap-1">
                        <Ptag
                          v-if="slotProps.data.status"
                          :value="slotProps.data.status"
                          rounded
                          :icon="slotProps.data.status_icon"
                          :severity="slotProps.data.status_severity"
                          class="max-h-1rem"
                        />
                        <Ptag
                          v-if="slotProps.data.due_date_time"
                          :value="formatDate(slotProps.data.due_date_time)"
                          rounded
                          icon="pi pi-stopwatch"
                          class="max-h-1rem"
                        />
                        <Ptag
                          v-if="slotProps.data.importance"
                          :value="slotProps.data.importance"
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
          </div>
          <div
            class="mainpage-card border-primary-200 border-2 bg-white w-full"
          >
            <div class="grid justify-content-evenly">
              <div class="col-3 col-offset-5 text-center">
                <h5>Announcements</h5>
              </div>

              <div class="col-3 flex justify-content-end align-self-center">
                <Pbutton
                  v-if="isAdmin"
                  @click="openAnnouncementModal()"
                  icon="pi pi-plus"
                  rounded
                  outlined
                  aria-label="Filter"
                  size="small"
                />
              </div>
            </div>
            <ClientOnly>
              <div v-if="filteredAnnouncements.length > 0">
                <div class="px-2 py-2 overflow-y-scroll line-height-1 h-12rem">
                  <div
                    v-for="announcement in filteredAnnouncements"
                    :key="announcement.id"
                  >
                    <div
                      class="w-full flex align-items-center justify-content-between"
                    >
                      <div class="flex gap-2 align-content-center">
                        <p class="footnote-2">
                          {{ announcement.name ?? "" }}
                        </p>
                        <i
                          class="pi pi-info-circle text-base text-color-secondary"
                          v-tooltip.top="
                            announcement.description ??
                            'No description provided'
                          "
                        ></i>
                      </div>

                      <p class="footnote">
                        {{ formatDate(announcement.creation_timestamp) ?? "" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex align-items-center justify-content-center h-12rem"
                v-if="
                  filteredAnnouncements.length === 0 || !filteredAnnouncements
                "
              >
                <p class="footnote">No Announcements!</p>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
import { useNow, useDateFormat } from "@vueuse/core";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";

const { projectid } = useRoute().params;
const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
const userId = dstore.getUserId;

const toast = useToast();
const groupedUsers = ref([]);
let announcements = [];
// let filteredAnnouncements = [];
let userOptions = [];

dstore.setSelectedProject(projectid);
dstore.setCurrentPage("");
const { data: parameters } = await useFetch("/api/get_parameters");
const isEditTask = ref(false);
const taskInfo = ref();
const taskName = ref("");
const taskDesc = ref("");
const taskDueDatetime = ref();
const taskUrgentDate = ref();
const taskImportance = ref(1);
const taskStatus = ref(1);
const taskImportanceRate = ref();
const taskOwner = ref();
const { data: tasksRes } = await useFetch("/api/get_task_by_project", {
  method: "POST",
  body: { project_id: projectid },
  headers: { "cache-control": "no-cache" },
});
const importanceOptions = parameters.value.response.filter(
  (param) => param.param_name == "importance"
)[0].param_list;
const statusOptions = parameters.value.response.filter(
  (param) => param.param_name == "task_status"
)[0].param_list;
const myTaskSortOptions = ref(
  parameters.value.response.filter(
    (param) => param.param_name == "sort_option"
  )[0].param_list
);
const isOpenAnnouncementModal = ref(false);
const announcementTitle = ref(null);
const announcementDesc = ref(null);
const announcementReceivers = ref([]);
const announcementReceiverArr = ref([]);
const isAdmin = ref(dstore.getSelectedProject?.role == "Admin");

console.log("param", parameters);

console.log("task", tasksRes);
console.log("current projectid", projectid);
console.log("isAdmin", dstore.getSelectedProject, isAdmin);

const { data: projectAnnouncementRes } = await useFetch(
  "/api/get_announcement",
  {
    method: "POST",
    body: { project_id: projectid },
    headers: { "cache-control": "no-cache" },
  }
);

const { data: projectMemberRes } = await useFetch("/api/get_management_board", {
  method: "POST",
  body: { project_id: projectid },
  headers: { "cache-control": "no-cache" },
});

const projectMember = projectMemberRes.value.response;
const filteredAnnouncements = projectAnnouncementRes.value.response;

const setShowCompletedIcon = (show) => {
  return show ? "pi pi-eye" : "pi pi-eye-slash";
};

const myTaskList = () => {
  const filteredList = tasksRes.value.response.filter(
    (task) => task.creator_id == userId || task.owner_ids.include(userId)
  );
  return { filteredList: filteredList };
};
console.log("mytask", tasksRes.value.response, myTaskList);
const myTaskSortOption = ref(1);
const myTaskShowCompleted = ref(false);
// const myTaskShowCompletedIcon = ref("");
// setShowCompletedIcon(false, "myTask");

const toggleMyTaskShowCompleted = () => {
  myTaskShowCompleted.value = !myTaskShowCompleted.value;
  // setShowCompletedIcon(myTaskShowCompleted.value, "myTask");
};

const toggleEditTask = (props) => {
  isEditTask.value = !isEditTask.value;

  if (isEditTask.value) {
    console.log("mytask props", props);
    taskInfo.value = props.data;
    taskName.value = props.data.task_name;
    taskDesc.value = props.data.task_desc;
    taskDueDatetime.value = props.data.due_date_time
      ? new Date(props.data.due_date_time)
      : "";
    taskUrgentDate.value = props.data.urgent_date
      ? new Date(props.data.urgent_date)
      : "";
    taskImportance.value = props.data.importance;
    taskImportanceRate.value = props.data.importance_rate;
    taskStatus.value = props.data.status_code;
    taskOwner.value = props.data.owner_ids;
  }
};

const upsertTask = async () => {
  // const { data: upsertTaskRes } = await useFetch("/api/upsert_task", {
  //   method: "POST",
  //   body: {
  //     task_id: taskInfo.value.task_id,
  //     task_name: taskName.value,
  //     task_desc: taskDesc.value,
  //     creator_id: taskInfo.value.creator_id,
  //     owner_ids: taskOwner.value,
  //     due_date_time: taskDueDatetime.value,
  //     urgent_date: taskUrgentDate.value,
  //     project_id: projectid,
  //     importance: taskImportance.value,
  //     importance_rate: taskImportanceRate.value,
  //     status_code: taskStatus.value,
  //     modified_at: useNow(),
  //   },
  //   headers: { "cache-control": "no-cache" },
  // });

  // console.log("upserttask", upsertTaskRes);
  console.log(
    taskInfo.value.task_id,
    taskName.value,
    taskDesc.value,
    taskInfo.value.creator_id,
    taskOwner.value,
    taskDueDatetime.value,
    taskUrgentDate.value,
    projectid,
    taskImportance.value,
    taskImportanceRate.value,
    taskStatus.value,
    useNow()
  );

  //TODO:input validation
};

const groupMember = projectMember.reduce((result, item) => {
  const department = item.user_department;

  if (!result[department]) {
    result[department] = [];
  }

  const itemWithoutDepartment = { ...item };
  delete itemWithoutDepartment.user_department;

  result[department].push(itemWithoutDepartment);

  return result;
}, {});

const formattedData = Object.keys(groupMember).map((department) => ({
  department,
  users: groupMember[department],
}));

console.log("groupmember", groupMember, formattedData);

console.log("groupedUsers", groupedUsers);
console.log("projectmember", projectMember);

if (Array.isArray(projectMember)) {
  userOptions = projectMember.map((user) => ({
    label: user.username,
    value: user.user_id,
  }));
} else {
  userOptions = {
    label: projectMember.usernme,
    value: projectMember.user_id,
  };
}

console.log("useroption", userOptions);
// groupedUsers.value.push({
//   label: "All Users",
//   items: userOptions,
// });

groupedUsers.value = [...formattedData];

console.log(announcementReceivers);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const year = date.getFullYear();
  const hours = date.toLocaleString("default", { hour: "2-digit" });
  const minutes = date.toLocaleString("default", { minutes: "2-digit" });
  const ampm = hours >= 12 ? "PM" : "AM";
  // return `${minutes}`;
  // return date.toLocaleDateString("en-us", {
  //   year: "numeric",
  //   month: "short",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false,
  // });

  const formattedDate = useDateFormat(dateString, "MMM DD, YYYY HH:mm");
  return formattedDate.value;
};

watchEffect(() => {
  if (!useSupabaseUser().value) {
    navigateTo("/login");
  }
  announcementReceiverArr.value = [];
  if (announcementReceivers.value.length !== 0) {
    for (const user of announcementReceivers.value) {
      announcementReceiverArr.value.push(user.value);
    }

    console.log(
      announcementReceiverArr.value,
      typeof announcementReceiverArr.value
    );
  }
});

async function addAnnouncement() {
  console.log(announcementReceiverArr.value);
  const { data: addAnnouncementRes } = await useFetch(
    "/api/insert_announcement",
    {
      method: "POST",
      body: {
        name: announcementTitle.value,
        description: announcementDesc.value,
        project_id: projectid,
        creation_timestamp: new Date(),
        receiver_ids: announcementReceiverArr.value,
      },
      headers: { "cache-control": "no-cache" },
    }
  );

  if (addAnnouncementRes.value.success) {
    toast.add({
      severity: "success",
      summary: "Hurray!",
      detail: "Profile Updated Successfully",
      life: 50000,
    });
  }
}

function closeAnnouncementModal() {
  isOpenAnnouncementModal.value = false;
}

function openAnnouncementModal() {
  isOpenAnnouncementModal.value = true;
}

const logout = async () => {
  await auth.signOut();
  dstore.logout();
};

definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style lang="css" scoped>
.show-completed-button {
  font-size: 0.75rem;
  border: none;
}

.no-shadow {
  box-shadow: none;
}

.show-completed-cont {
  display: flex;
  align-items: center;
  justify-content: center;
}

h5 {
  font-weight: 700;
  font-size: 0.938rem;
}

.mainpage-card {
  filter: drop-shadow(4px 6px 4px rgba(39, 35, 67, 0.25));
  border-radius: 30px;
}

.footnote-2 {
  font-weight: 700;
  font-size: 12px;
  /* line-height: 15px; */
}

.footnote {
  font-weight: 400;
  font-size: 12px;
}

.form-modal {
  min-width: 500px;
  border-radius: 8px;
}
</style>
