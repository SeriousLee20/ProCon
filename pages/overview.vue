<template>
  <div>
    <div>
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
    <div>
      <!-- <Tasklist
                :taskList=""
                :pt="{ content: { class: 'bg-primary-100' } }"
                @open-task-dialog="toggleTaskDialog($event, true)"
              /> -->
    </div>
  </div>
</template>

<script setup>
// import currentProject from "~/composables/useProject";
import { useDataStore } from "~/stores/datastore";

const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
dstore.setCurrentPage("Overview");
dstore.setSelectedProject("-1");
// currentProject().setCurrentProject("-1");
console.log("ov selected project", dstore.getSelectedProject);

const { data: parameters } = await useFetch("/api/get_parameters");
var { data: filters } = await useFetch("/api/get_filters");
var { data: all_project_tasks } = await useFetch("/api/get_task_by_user");

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
  const taskList = all_project_tasks.value.response;
  let taskGroupedByProject = taskList.reduce((groupedList, task) => {
    const project = task.project_name;
    (groupedList[project] = groupedList[project] || []).push(task);
    return groupedList;
  }, {});

  let groupedTaskList = Object.keys(taskGroupedByProject).map((project) => ({
    project,
    tasks: taskGroupedByProject[project],
  }));
  return { groupedTaskList };
};
console.log("groupedtasklist", sortTasks().groupedTaskList);

const showCompletedTask = ref(getFilter("overview").thisFilter.show_completed);
const showMyTaskOnly = ref(getFilter("overview").thisFilter.show_my_task_only);
const overviewSortOption = ref(getFilter("overview").thisFilter.sort_option);
const overviewSortOptions = getSortOptions("sort_option");

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

  console.log("updatedfilter", updateFilterRes, updatedFilter);
};

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
