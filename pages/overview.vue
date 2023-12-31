<template>
  <div>
    <div
      class="flex justify-content-end gap-4 vertical-align-middle py-2 w-full"
    >
      <Showcompleted
        :showCompleted="showCompletedTask"
        :handler="toggleTaskShowCompleted"
      />

      <Showmytask
        :showMyTaskOnly="showMyTaskOnly"
        :handler="toggleShowMyTaskOnly"
      />

      <Sortoption
        :sortOptions="overviewSortOptions"
        v-model="overviewSortOption"
        :handler="updateSortOption"
        :filterName="'sort_option'"
        :boardName="'overview'"
      />
    </div>
    <div class="flex justify-content-between p-2">
      <div v-for="list in overviewTaskLists" class="w-12 px-2">
        <div class="font-semibold text-lg bg-white pb-3">
          {{ list.project_name }}
        </div>
        <OverviewTasklist
          :taskList="list.tasks"
          :pt="{ content: { class: 'p-0' }, column: { class: 'border-none' } }"
          @open-ov-task-dialog="toggleTaskDialog($event, true)"
        />
      </div>
    </div>
    <Taskdialog
      v-model:visible="taskDialog"
      :taskDialog="taskDialog"
      :selectedTask="selectedTask"
      :groupedUsers="groupedUsers"
      :taskOptions="taskOptions"
      :isEditTask="isEditTask"
      :isAdmin="isAdmin"
      @update-task="updateTask()"
      @close-task-dialog="toggleTaskDialog(null, false)"
      @delete-task="deleteTask"
    />
  </div>
</template>

<script setup>
// import currentProject from "~/composables/useProject";
import { useDataStore } from "~/stores/datastore";

const dstore = useDataStore();
dstore.setCurrentPage("Overview");
dstore.setSelectedProject("-1");
// currentProject().setCurrentProject("-1");
console.log("ov selected project", dstore.getSelectedProject);

const { $emit } = useNuxtApp();
const userId = dstore.getUserId;
const projectid = ref(dstore.getSelectedProject?.id);
const { data: parameters } = await useFetch("/api/get_parameters");

var { data: filters } = await useFetch("/api/get_filters");
var { data: projectMemberAndTaskRes } = await useFetch(
  "/api/get_management_boards"
);

const projectMember = projectMemberAndTaskRes.value.response;
// TODO: ***add new api, return grouped members for all project
// TODO: new api, return project with sorted tasklist
console.log("ov param", parameters.value.response);
console.log(
  "grouped_member",
  projectMemberAndTaskRes.value.response,
  projectMember
);

const getSortOptions = (listName) => {
  return parameters.value.response.filter(
    (param) => param.param_name == listName
  )[0].param_list;
};

const getFilter = (listName) => {
  const thisFilter = filters.value.response.filter(
    (item) => item.board_name == listName
  )[0]?.filter;
  console.log("sortoption", thisFilter);
  return { thisFilter };
};

const sortTasks = () => {
  let taskList = projectMemberAndTaskRes.value.response.reduce(
    (result, project) => {
      result.push({
        project_id: project.project_id,
        project_name: project.project_name,
        tasks: project.task_list,
      });
      return result;
    },
    []
  );

  console.log("ov tasklist", taskList);
  let filters = getFilter("overview").thisFilter;
  const sortOption = getSortOptions("sort_option")?.filter(
    (op) => op.id == filters.sort_option
  )[0]?.col;

  console.log("ov filter, sort option", sortOption);

  taskList.forEach((list) => {
    console.log("filter sort", list.project_name, list.tasks);
    list.tasks = filters.show_completed
      ? list.tasks
      : list.tasks?.filter((item) => item.status_name != "Completed");
    console.log("show complte", list.tasks);

    list.tasks = filters.show_my_task_only
      ? list.tasks?.filter((task) => task.owner_ids?.includes(userId))
      : list.tasks;
    console.log("show mytask", list.tasks);
    // sort list
    list.tasks =
      sortOption == "due_date_time"
        ? list.tasks?.sort((t1, t2) =>
            new Date(t1[sortOption]) < new Date(t2[sortOption])
              ? 1
              : new Date(t1[sortOption]) > new Date(t2[sortOption])
              ? -1
              : 0
          )
        : "importance_rate"
        ? list.tasks?.sort((t1, t2) =>
            t1[sortOption] < t2[sortOption]
              ? 1
              : t1[sortOption] > t2[sortOption]
              ? -1
              : 0
          )
        : list.tasks?.sort((t1, t2) =>
            t1[sortOption] > t2[sortOption]
              ? 1
              : t1[sortOption] < t2[sortOption]
              ? -1
              : 0
          );

    list.tasks = list.tasks ? list.tasks : [];
    console.log("sort", list.tasks);
  });

  console.log("ov sort task", taskList);
  return { taskList };
};
console.log("groupedtasklist", sortTasks().taskList);

const showCompletedTask = ref(getFilter("overview").thisFilter.show_completed);
const showMyTaskOnly = ref(getFilter("overview").thisFilter.show_my_task_only);
const overviewSortOption = ref(getFilter("overview").thisFilter.sort_option);
const overviewSortOptions = getSortOptions("sort_option");
const selectedTask = ref();
const groupedUsers = ref([]);
const isAdmin = ref(false);
const isEditTask = ref(false);
const taskDialog = ref(false);
const taskOptions = {
  importance: getSortOptions("importance"),
  status: getSortOptions("task_status"),
};
var overviewTaskLists = ref(sortTasks().taskList);

const toggleTaskShowCompleted = () => {
  showCompletedTask.value = !showCompletedTask.value;
  updateFilter("show_completed", showCompletedTask.value, "overview");
};

const toggleShowMyTaskOnly = () => {
  showMyTaskOnly.value = !showMyTaskOnly.value;
  updateFilter("show_my_task_only", showMyTaskOnly.value, "overview");
};

const updateSortOption = () => {
  updateFilter("sort_option", overviewSortOption, "overview");
};

const updateFilter = async (filterName, filterValue, boardName) => {
  let updatedFilter = {};

  updatedFilter["board_name"] = boardName;
  updatedFilter["filter"] = getFilter(boardName).thisFilter;
  updatedFilter.filter[filterName] = filterValue;
  const { data: updateFilterRes } = await useFetch("/api/update_filter", {
    method: "POST",
    body: updatedFilter,
    headers: { "cache-control": "no-cache" },
  });
  filters = updateFilterRes;

  overviewTaskLists.value = sortTasks().taskList;

  console.log("updatedfilter", updateFilterRes, updatedFilter);
};

const toggleTaskDialog = (props, isToEditTask) => {
  console.log("edit", props, taskDialog);
  isEditTask.value = isToEditTask;
  console.log(taskDialog.value, isToEditTask);

  // TODO: get members for all projects (param: list of projectid)
  if (!taskDialog.value) {
    groupedUsers.value = projectMember.filter(
      (project) => (project.project_id = props.project_id)
    )[0].grouped_members;
    isAdmin.value = dstore.getUserRoleByProject(props.project_id) == "Admin";
    console.log("ov taskdialog", groupedUsers.value, isAdmin.value);
    if (isToEditTask) {
      props = {
        ...props,
        due_date_time: props.due_date_time
          ? new Date(props.due_date_time)
          : null,
        due_date: props.due_date ? new Date(props.due_date) : null,
        urgent_date: props.urgent_date ? new Date(props.urgent_date) : null,
        start_date: props.start_date ? new Date(props.start_date) : null,
        start_date_time: props.start_date_time ? new Date(props.start_date_time) : null,
      };

      selectedTask.value = { ...props };
      console.log("selectedtask", selectedTask.value);

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
        due_date_time: null,
        urgent_date: null,
      };
    }
    console.log("mytask props", props, selectedTask.value);
  }
  taskDialog.value = !taskDialog.value;
};

const formatNotification = (content) => {
  const regex = /<[^>]*>/g;
  if (content) return (content = content.replace(regex, ""));
};

const sendNotification = async (action, title, content, target) => {
  console.log(action);

  const { data: notificationRes } = await useFetch("/api/insert_notification", {
    method: "POST",
    body: {
      title: title,
      content: content,
      target: target,
      project_id: selectedTask.value.project_id,
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

const updateTask = async () => {
  taskDialog.value = false;

  const updatedTask = selectedTask.value;
  updatedTask["project_id"] = updatedTask.project_id;
  updatedTask["modified_at"] = new Date();
  console.log(selectedTask.value, updatedTask);

  const { data: updateTaskRes } = await useFetch("/api/update_task_from_ov", {
    method: "POST",
    body: updatedTask,
    headers: { "cache-control": "no-cache" },
  });
  console.log("upserttask", updateTaskRes);

  if (updateTaskRes.value.success) {
    // TODO: replace old list with new list
    projectMemberAndTaskRes = updateTaskRes;

    console.log("update task list", projectMemberAndTaskRes);
    overviewTaskLists.value = sortTasks().taskList;
    sendNotification(
      "update_task",
      `${dstore.getProject(selectedTask.project_id).name}: Task Updates`,
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

const deleteTask = async () => {
  taskDialog.value = false;

  const { data: deleteTaskRes } = await useFetch("/api/delete_task_from_ov", {
    method: "POST",
    body: {
      task_id: selectedTask.value.task_id,
      project_id: selectedTask.value.project_id,
    },
    headers: { "cache-control": "no-cache" },
  });

  console.log("dlt task", deleteTaskRes.value, selectedTask.value);
  if (deleteTaskRes.value.success) {
    projectMemberAndTaskRes = deleteTaskRes;
    console.log(
      "after dlt update task list",
      projectMemberAndTaskRes.value.response
    );
    overviewTaskLists.value = sortTasks().taskList;
  }
};
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
//   users: groupMember[department],
// }));

// groupedUsers.value = [...formattedData];

watchEffect(() => {
  if (!useSupabaseUser().value) {
    navigateTo("/login");
  }
});

definePageMeta({
  middleware: ["auth", "initiate"],
  layout: "custom",
});
</script>

<style lang="scss" scoped></style>
