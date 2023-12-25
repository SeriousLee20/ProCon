<template>
  <Pdialog
    v-model:visible="isOpenAnnouncementModal"
    header="Add Announcement"
    :modal="true"
    class="p-fluid"
    style="width: 80%"
  >
    <div class="field">
      <label for="title">Title</label>
      <Pinputtext id="title" v-model="announcementTitle" type="text" required />
    </div>

    <div class="field">
      <label for="description">Description</label>
      <Ptextarea
        id="description"
        v-model="announcementDesc"
        type="text"
        required
      />
    </div>

    <div class="field">
      <Pmultiselect
        v-model="announcementReceivers"
        :options="groupedUsers"
        optionLabel="username"
        optionValue="user_id"
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
    </div>

    <template #footer>
      <div class="flex gap-2 align-items-center w-full justify-content-endw">
        <Pbutton @click="addAnnouncement">Add</Pbutton>
        <Pbutton @click="closeAnnouncementModal()">Close</Pbutton>
      </div>
    </template>
  </Pdialog>

  <div>
    <div class="h-screen grid p-4 pt-2">
      <div class="col-8">
        <div class="flex justify-content-center">
          <div class="flex gap-5 w-full flex justify-content-between">
            <Pcalendar
              :disabled="disableDateFilter"
              :pt="{ input: { style: 'box-shadow:none; border: none;' } }"
              id="filter-task-duedate-range"
              v-model="filterTaskDueDateRange"
              selectionMode="range"
              dateFormat="M dd, y"
              placeholder="Filter Due Date(s)"
              :hideOnRangeSelection="true"
              class="min-w-max"
              showButtonBar
              @clear-click="getDefaultDueDateRange(true)"
              @hide="
                updateFilter(
                  'due_date_range',
                  filterTaskDueDateRange,
                  'main_task'
                )
              "
            />
            <!-- sort by importance rate, status -->
            <Sortoption
              :sort-options="mainTaskSortOptions"
              v-model="mainTaskSortOption"
              :handler="updateFilter"
              :filterName="'sort_option'"
              :boardName="'main_task'"
            />
            <Showcompleted
              :showCompleted="taskShowCompleted"
              :handler="toggleTaskShowCompleted"
            />
            <Showmytask
              :showMyTaskOnly="mainShowMyTaskOnly"
              :handler="toggleShowMyTaskOnly"
            />
          </div>

          <!-- <div class="flex gap-5">

          </div> -->
        </div>
        <div class="flex">
          <Pcard class="col-5 bg-primary-100 h-21rem flex-auto">
            <template #content>
              <Tasklist
                class="h-17rem overflow-scroll"
                :taskList="mainTaskList.q4"
                :pt="{
                  content: { class: 'bg-primary-100' },
                  column: { class: 'border-none' },
                  emptyMessage: { content: 'No Task' },
                }"
                @open-task-dialog="toggleTaskDialog($event, true)"
              />
            </template>
          </Pcard>
          <div
            class="col-1 bg-secondary h-21rem w-2rem flex align-items-center justify-content-center"
          >
            <div class="-rotate-90">IMPORTANT</div>
          </div>
          <Pcard class="col-5 bg-primary-100 h-21rem flex-auto">
            <template #content>
              <Tasklist
                class="h-17rem overflow-scroll"
                :taskList="mainTaskList.q1"
                :pt="{ content: { class: 'bg-primary-100' } }"
                @open-task-dialog="toggleTaskDialog($event, true)"
              />
            </template>
          </Pcard>
        </div>
        <div class="flex">
          <div
            class="col-5 bg-secondary h-2rem flex justify-content-center align-items-center flex-auto"
          >
            NOT URGENT
          </div>
          <div
            class="col-1 bg-secondary w-2rem h-2rem flex justify-content-center align-items-center flex-auto"
            v-if="isAdmin"
          >
            <Pbutton
              icon="pi pi-plus"
              @click="toggleTaskDialog(null, false)"
              rounded
            />
          </div>
          <div
            class="col-5 bg-secondary h-2rem flex justify-content-center align-items-center flex-auto"
          >
            URGENT
          </div>
        </div>
        <div class="flex">
          <Pcard class="col-5 bg-primary-100 h-21rem flex-auto">
            <template #content>
              <Tasklist
                class="h-17rem overflow-scroll"
                :taskList="mainTaskList.q3"
                :pt="{ content: { class: 'bg-primary-100' } }"
                @open-task-dialog="toggleTaskDialog($event, true)"
              />
            </template>
          </Pcard>
          <div
            class="col-1 bg-secondary h-21rem w-2rem flex align-items-center justify-content-center"
          >
            <div class="-rotate-90 w-21rem" style="white-space: nowrap">
              NOT IMPORTANT
            </div>
          </div>
          <Pcard class="col-5 bg-primary-100 h-21rem flex-auto">
            <template #content>
              <Tasklist
                class="h-17rem overflow-scroll"
                :taskList="mainTaskList.q2"
                :pt="{ content: { class: 'bg-primary-100' } }"
                @open-task-dialog="toggleTaskDialog($event, true)"
              />
            </template>
          </Pcard>
        </div>
      </div>

      <div class="col-4">
        <!-- right panel -->
        <div>
          <!-- TODO:edit card styling -->
          <Pcard
            class="border-round border-primary-200 border-2 bg-white w-full mb-2 h-24rem"
          >
            <template #title>
              <div class="text-center">
                <h5>My Tasks</h5>
              </div>
              <div class="grid justify-content-between -mt-5">
                <div
                  class="col-4 flex align-items-center justify-content-start"
                >
                  <Showcompleted
                    :showCompleted="myTaskShowCompleted"
                    :handler="toggleMyTaskShowCompleted"
                  />
                </div>

                <div class="col-4 flex justify-content-end align-items-center">
                  <Sortoption
                    :sort-options="myTaskSortOptions"
                    v-model="myTaskSortOption"
                    :handler="updateFilter"
                    :filterName="'sort_option'"
                    :boardName="'my_task'"
                  />
                </div>
              </div>
            </template>
            <template #content>
              <Tasklist
                class="h-15rem overflow-scroll"
                :taskList="myTaskList"
                @open-task-dialog="toggleTaskDialog($event, true)"
              />

              <Taskdialog
                v-model:visible="taskDialog"
                :taskDialog="taskDialog"
                :selectedTask="selectedTask"
                :groupedUsers="groupedUsers"
                :taskOptions="taskOptions"
                :isEditTask="isEditTask"
                :isAdmin="isAdmin"
                @update-task="updateTask()"
                @insert-task="insertTask()"
                @close-task-dialog="toggleTaskDialog(null, false)"
                @delete-task="deleteTask"
              />
            </template>
          </Pcard>

          <!-- TODO:change to Pcard -->
          <Pcard
            class="border-round border-primary-200 border-2 bg-white w-full h-22rem"
          >
            <template #title>
              <div class="grid justify-content-evenly">
                <div class="col-4 col-offset-4 text-center">
                  <h5>Announcements</h5>
                </div>

                <div class="col-4 flex justify-content-end align-self-center">
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
            </template>
            <template #content>
              <Announcementlist
                class="h-13rem overflow-scroll"
                :announcement-list="announcementList"
                :pt="{
                  column: { class: 'border-none' },
                }"
              />
            </template>
          </Pcard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";

const { projectid } = useRoute().params;
const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
const userId = dstore.getUserId;
dstore.setSelectedProject(projectid);
dstore.setCurrentPage("");

const emit = defineEmits(["refresh-notification"]);
const { $emit } = useNuxtApp();
const toast = useToast();
let announcements = [];
// let filteredAnnouncements = [];
let userOptions = [];

const selectedProject = dstore.getSelectedProject;
const isAdmin = ref(dstore.getSelectedProject?.role == "Admin");
const { data: parameters } = await useFetch("/api/get_parameters");
var { data: filters } = await useFetch("/api/get_filters");
var { data: tasksRes } = await useFetch("/api/get_task_by_project", {
  method: "POST",
  body: { project_id: projectid },
  headers: { "cache-control": "no-cache" },
});
const { data: projectMemberRes } = await useFetch("/api/get_grouped_members", {
  method: "POST",
  body: { project_id: projectid },
  headers: { "cache-control": "no-cache" },
});
var { data: projectAnnouncementRes } = await useFetch("/api/get_announcement", {
  method: "POST",
  body: { project_id: projectid },
  headers: { "cache-control": "no-cache" },
});

const getSortOptions = (listName) => {
  return parameters.value.response.filter(
    (param) => param.param_name == listName
  )[0].param_list;
};

console.log("filters", filters);

const getFilter = (listName) => {
  const thisFilter = filters.value.response.filter(
    (item) => item.board_name == listName
  )[0]?.filter;
  console.log("sortoption", thisFilter);
  return { thisFilter };
};

const taskOptions = {
  importance: getSortOptions("importance"),
  status: getSortOptions("task_status"),
};

const groupedUsers = ref(projectMemberRes.value?.response[0].project_members);
const myTaskSortOptions = getSortOptions("sort_option");
const mainTaskSortOptions = getSortOptions("main_task_sort_option");
const taskDialog = ref(false);
const isEditTask = ref(false);
const selectedTask = ref();
const filterTaskDueDateRange = ref();
const disableDateFilter = ref(false);
const mainShowMyTaskOnly = ref(
  getFilter("main_task").thisFilter.show_my_task_only
);
const mainTaskSortOption = ref(getFilter("main_task").thisFilter.sort_option);
const taskDueDatetime = ref();
const taskUrgentDate = ref();
const mainTaskList = ref({ q1: [], q2: [], q3: [], q4: [] });
const myTaskList = ref();
const myTaskSortOption = ref(getFilter("my_task").thisFilter.sort_option);
const myTaskShowCompleted = ref(getFilter("my_task").thisFilter.show_completed);
const taskShowCompleted = ref(
  getFilter("main_task").thisFilter?.show_completed
);
const projectMember = projectMemberRes.value.response;
const isOpenAnnouncementModal = ref(false);
const announcementTitle = ref(null);
const announcementDesc = ref(null);
const announcementReceivers = ref();
var announcementList = ref(projectAnnouncementRes.value.response);
dstore.setManagementBoard(groupedUsers.value)

console.log("mytask", tasksRes.value.response, myTaskList);
console.log("param", parameters);
console.log("filters", filters);
console.log("task", tasksRes);
console.log("current projectid", projectid);
console.log("isAdmin", dstore.getSelectedProject, isAdmin);

// const groupMember = projectMember.reduce((result, item) => {
//   const department = item.user_department;

//   if (!result[department]) {
//     result[department] = [];
//   }

//   const itemWithoutDepartment = { ...item };
//   delete itemWithoutDepartment.user_department;

//   result[department].push(itemWithoutDepartment);

//   return result;
// }, {});

// const formattedData = Object.keys(groupMember).map((department) => ({
//   department,
//   members: groupMember[department],
// }));
// groupedUsers.value = [...formattedData];

// console.log("groupmember", groupMember, formattedData);
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

const toggleShowMyTaskOnly = () => {
  mainShowMyTaskOnly.value = !mainShowMyTaskOnly.value;
  updateFilter("show_my_task_only", mainShowMyTaskOnly.value, "main_task");
};

const toggleTaskShowCompleted = () => {
  taskShowCompleted.value = !taskShowCompleted.value;
  updateFilter("show_completed", taskShowCompleted.value, "main_task");
};
const toggleMyTaskShowCompleted = () => {
  myTaskShowCompleted.value = !myTaskShowCompleted.value;
  updateFilter("show_completed", myTaskShowCompleted.value, "my_task");
};

const getDefaultDueDateRange = (isClearClick) => {
  let temp_list = tasksRes.value.response;
  let dateRange = new Array(2).fill(null);

  console.log("initial daterange", dateRange);

  let due_date_list = temp_list.reduce((result, task) => {
    if (task.due_date) {
      result.push(new Date(task.due_date));
    }
    return result;
  }, []);

  if (due_date_list.length == 0) {
    filterTaskDueDateRange.value = [...dateRange];
    disableDateFilter.value = true;
    return { dateRange };
  }

  dateRange = [
    new Date(Math.min.apply(null, due_date_list)),
    new Date(Math.max.apply(null, due_date_list)),
  ];

  // toDateString: get date only, ignore time
  filterTaskDueDateRange.value = [
    dateRange[0] ? dateRange[0] : null,
    dateRange[1] ? dateRange[1] : null,
  ];

  disableDateFilter.value = false;
  console.log("defaultdaterange filter", due_date_list, dateRange);

  if (isClearClick) {
    updateFilter("due_date_range", filterTaskDueDateRange, "main_task");
  }
  return { dateRange };
};

const sortList = (filteredList, listName, sortOptionName) => {
  const today = new Date();
  const filter = getFilter(listName).thisFilter;
  const sortOption = getSortOptions(sortOptionName)?.filter(
    (op) => op.id == filter.sort_option
  )[0]?.col;

  // convert date time field to date object
  filteredList = filteredList.map((task) => ({
    ...task,
    urgent_date: task?.urgent_date ? new Date(task?.urgent_date) : null,
    due_date_time: task?.due_date_time ? new Date(task?.due_date_time) : null,
    due_date: task?.due_date ? new Date(task?.due_date) : null,
    start_date_time: task?.start_date_time ? new Date(task?.start_date_time) : null,
    start_date: task?.start_date ? new Date(task?.start_date) : null,
  }));

  // filter show completed
  filteredList = filter.show_completed
    ? filteredList
    : filteredList.filter((item) => item.status != "Completed");

  // sort list
  filteredList =
    sortOption == "importance_rate"
      ? filteredList.sort((t1, t2) =>
          t1[sortOption] < t2[sortOption]
            ? 1
            : t1[sortOption] > t2[sortOption]
            ? -1
            : 0
        )
      : filteredList.sort((t1, t2) =>
          t1[sortOption] > t2[sortOption]
            ? 1
            : t1[sortOption] < t2[sortOption]
            ? -1
            : 0
        );

  if (listName == "main_task") {
    let dateRange = getDefaultDueDateRange().dateRange;
    console.log("default daterange", dateRange);
    // assign due date range
    if (filter.due_date_range && dateRange[0] && dateRange[1]) {
      // due date range from filter list
      let tempRange = [
        new Date(filter.due_date_range[0]),
        new Date(filter.due_date_range[1]),
      ];
      console.log("update range", tempRange);
      dateRange =
        tempRange[0] >= dateRange[0] && tempRange[1] <= dateRange[1]
          ? [...tempRange]
          : [...dateRange];
    }

    filterTaskDueDateRange.value = [
      dateRange[0] ? dateRange[0] : null,
      dateRange[1] ? dateRange[1] : null,
    ];
    console.log("filter", filteredList, dateRange);

    // TODO: show task w/o due date?
    filteredList = filteredList.filter((task) => {
      return (
        !task?.due_date ||
        (task?.due_date >= dateRange[0] && task?.due_date <= dateRange[1])
      );
    });
    console.log("filterlist2", filteredList);

    filteredList = filter.show_my_task_only
      ? filteredList.filter((task) => task.owner_ids?.includes(userId))
      : filteredList;

    console.log(mainTaskList.value);
    let tempTaskList = { q1: [], q2: [], q3: [], q4: [] };
    filteredList.forEach((task) => {
      // urgent
      if (task.urgent_date && task.urgent_date <= today) {
        if (task.importance == 1) {
          tempTaskList.q1.push(task);
        } else {
          tempTaskList.q2.push(task);
        }
      } else {
        // not urgent
        if (task.importance == 1) {
          tempTaskList.q4.push(task);
        } else {
          tempTaskList.q3.push(task);
        }
      }
    });
    mainTaskList.value = tempTaskList;

    console.log("maintasklist", mainTaskList.value);
  }

  return filteredList;
};

const getMainTaskList = () => {
  const filteredList = sortList(
    tasksRes.value.response,
    "main_task",
    "main_task_sort_option"
  );
  console.log("daterange", filterTaskDueDateRange.value);
  console.log(filteredList);

  return { filteredList };
};
getMainTaskList();

const getMyTaskList = () => {
  var filteredList = tasksRes.value.response.filter((task) =>
    task.owner_ids?.includes(userId)
  );

  filteredList = sortList(filteredList, "my_task", "sort_option");
  console.log("sort", filteredList);
  return { filteredList };
};
myTaskList.value = getMyTaskList().filteredList;

const toggleTaskDialog = (props, isToEditTask) => {
  console.log("edit", props, taskDialog);
  isEditTask.value = isToEditTask;

  console.log(taskDialog.value, isToEditTask);
  if (!taskDialog.value) {
    if (isToEditTask) {
      selectedTask.value = { ...props };
      // taskDueDatetime.value = props.items[0].due_date_time
      //   ? new Date(props.items[0].due_date_time)
      //   : null;
      // taskUrgentDate.value = props.items[0].urgent_date
      //   ? new Date(props.items[0].urgent_date)
      //   : null;
    } else {
      selectedTask.value = {
        task_name: null,
        task_desc: null,
        status_code: 1,
        importance: 2,
        importance_rate: 1,
        owner_ids: null,
        start_date_time: null,
        due_date_time: null,
        urgent_date: null,
      };
    }
    console.log("mytask props", props, selectedTask.value);
  }
  taskDialog.value = !taskDialog.value;
};

const updateFilter = async (filterName, filterValue, boardName) => {
  let updatedFilter = {};
  console.log(myTaskSortOption.value);
  updatedFilter["board_name"] = boardName;
  updatedFilter["filter"] = getFilter(boardName).thisFilter;
  updatedFilter.filter[filterName] = filterValue;
  const { data: updateFilterRes } = await useFetch("/api/update_filter", {
    method: "POST",
    body: updatedFilter,
    headers: { "cache-control": "no-cache" },
  });
  filters = updateFilterRes;
  switch (boardName) {
    case "my_task":
      myTaskList.value = getMyTaskList().filteredList;
      break;

    case "main_task":
      getMainTaskList();
      break;
  }
  console.log(myTaskList.value);
  console.log("updatedfilter", updateFilterRes, updatedFilter);
};

const updateTask = async () => {
  taskDialog.value = false;

  const updatedTask = selectedTask.value;
  updatedTask["project_id"] = projectid;
  updatedTask["modified_at"] = new Date();
  updatedTask["due_date"] = updatedTask.due_date_time
    ? new Date(new Date(updatedTask.due_date_time).toDateString())
    : null;
  console.log(selectedTask.value, updatedTask);

  const { data: updateTaskRes } = await useFetch("/api/update_task", {
    method: "POST",
    body: updatedTask,
    headers: { "cache-control": "no-cache" },
  });
  console.log("upserttask", updateTaskRes);

  if (updateTaskRes.value.success) {
    tasksRes = updateTaskRes;
    myTaskList.value = getMyTaskList().filteredList;
    getMainTaskList();
    sendNotification(
      "update_task",
      `Task Updates`,
      "Task Updates: " +
        selectedTask.value.task_name +
        (selectedTask.value.task_desc
          ? " - " + formatNotification(selectedTask.value.task_desc)
          : ""),
      selectedTask.value.owner_ids ? selectedTask.value.owner_ids : []
    );
  }

  //TODO:input validation:required name, today<=urgent date<=duedate
};

const sendNotification = async (action, title, content, target) => {
  console.log(action);

  const { data: notificationRes } = await useFetch("/api/insert_notification", {
    method: "POST",
    body: {
      title: title,
      content: content,
      target: target,
      project_id: projectid,
      telegram_chat_id: selectedProject.telegram_id
    },
    headers: { "cache-control": "no-cache" },
  });

  if (notificationRes.value.success) {
    console.log("refresh noti", notificationRes.value.response);
    // emit("refresh-notification", announcementNotificationRes.value.response);
    $emit("refresh-notification", notificationRes.value.response);
    return true;
  }
};

const formatNotification = (content) => {
  const regex = /<[^>]*>/g;
  if (content) return (content = content.replace(regex, ""));
};

const insertTask = async () => {
  console.trace("inserttask", selectedTask.value);

  taskDialog.value = false;
  let newTask = selectedTask.value;
  newTask["modified_at"] = new Date();
  newTask["project_id"] = projectid;
  newTask["due_date"] = newTask.due_date_time
    ? new Date(new Date(newTask.due_date_time).toDateString())
    : null;
  const { data: insertTaskRes } = await useFetch("/api/insert_task", {
    method: "POST",
    body: newTask,
    headers: { "cache-control": "no-cache" },
  });

  console.log("insertaskres", insertTaskRes);

  if (insertTaskRes.value.success) {
    tasksRes = insertTaskRes;
    myTaskList.value = getMyTaskList().filteredList;
    getMainTaskList();
    sendNotification(
      "insert_task",
      `${dstore.selectedProject.name}: New Task`,
      "New task: " +
        selectedTask.value.task_name +
        (selectedTask.value.task_desc
          ? " - " + formatNotification(selectedTask.value.task_desc)
          : ""),
      selectedTask.value.owner_ids ? selectedTask.value.owner_ids : []
    );
  }
};

const deleteTask = async () => {
  taskDialog.value = false;

  const { data: deleteTask } = await useFetch("/api/delete_task", {
    method: "POST",
    body: {
      task_id: selectedTask.value.task_id,
      project_id: projectid,
    },
    headers: { "cache-control": "no-cache" },
  });

  console.log("dlt task", deleteTask.value, selectedTask.value);
  if (deleteTask.value.success) {
    tasksRes = deleteTask;
    myTaskList.value = getMyTaskList().filteredList;
    getMainTaskList();
  }
};

async function addAnnouncement() {
  isOpenAnnouncementModal.value = false;
  console.log("announcementreceiver", announcementReceivers);
  const { data: addAnnouncementRes } = await useFetch(
    "/api/insert_announcement",
    {
      method: "POST",
      body: {
        name: announcementTitle.value,
        description: announcementDesc.value,
        project_id: projectid,
        creation_timestamp: new Date(),
        receiver_ids: announcementReceivers.value,
      },
      headers: { "cache-control": "no-cache" },
    }
  );

  if (addAnnouncementRes.value.success) {
    // toast.add({
    //   severity: "success",
    //   summary: "Hurray!",
    //   detail: "Profile Updated Successfully",
    //   life: 50000,
    // });
    const { data: announcementNotificationRes } = await useFetch(
      "/api/insert_notification",
      {
        method: "POST",
        body: {
          title: "New Announcement Added! " + announcementTitle.value,
          content:
            "New announcement: " +
            announcementTitle.value +
            (announcementDesc.value ? " - " + announcementDesc.value : ""),
          target: announcementReceivers.value,
          project_id: projectid,
        },
        headers: { "cache-control": "no-cache" },
      }
    );

    projectAnnouncementRes = addAnnouncementRes;
    announcementList.value = projectAnnouncementRes.value.response;
    console.log("announcementlist", announcementList.value);
  }
}

function closeAnnouncementModal() {
  isOpenAnnouncementModal.value = false;
}

function openAnnouncementModal() {
  isOpenAnnouncementModal.value = true;
}

defineExpose({
  editTaskDialog: taskDialog,
});

watchEffect(() => {
  if (!useSupabaseUser().value) {
    navigateTo("/login");
  }
});

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

.footnote-2 {
  font-weight: 600;
  font-size: 0.8rem;
  /* line-height: 15px; */
}

.footnote {
  font-weight: 400;
  font-size: 0.9rem;
}

.form-modal {
  min-width: 500px;
  border-radius: 8px;
}
</style>
