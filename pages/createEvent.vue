<template>
  <Ptoast />
  <div class="create-project flex align-items-center justify-content-center">
    <div
      id="create-project-1"
      class="h-screen flex align-items-center justify-item-center"
    >
      <Pcard>
        <template #title>
          <div class="flex">
            <div class="flex justify-content-start">Project Details</div>
          </div>
        </template>
        <template #subtitle> Please enter details for your project. </template>
        <template #content>
          <div class="flex flex-column gap-5">
            <div>
              <span class="p-float-label">
                <Pinputtext
                  id="project-name"
                  class="w-full"
                  :class="{ 'p-invalid': invalidName }"
                  v-model="projectName"
                  type="text"
                  required
                  @blur="validate"
                />
                <label for="project-name">Title</label>
              </span>
              <div class="flex justify-content-between">
                <small>Short & unique is nice!</small>
                <small class="invalid-input" v-if="invalidName"
                  >Invalid :(</small
                >
              </div>
            </div>
            <div>
              <span class="p-float-label">
                <Ptextarea
                  id="project-desc"
                  v-model="projectDesc"
                  type="text"
                  autoResize
                  rows="5"
                  cols="30"
                />
                <label for="project-desc">Description</label>
              </span>
              <small>What is this project about?</small>
            </div>
          </div>
          <div class="flex justify-content-end align-content-end">
            <Pbutton
              :loading="loading"
              type="button"
              icon="pi pi-caret-right"
              aria-label="go-add-department"
              label="Create"
              @click="createProject"
            />
          </div>
        </template>
      </Pcard>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { switchPage } from "~/components/Navbar.vue";
import { useDataStore } from "~/stores/datastore";
import { refreshDatastore } from "./index.vue";

var projectName = ref();
var projectDesc = ref();
var invalidName = ref(false);
const toast = useToast();
var loading = ref(false);
const dstore = useDataStore();
const router = useRouter();

const validate = () => {
  console.log("entered project name", projectName.value);
  invalidName.value = projectName.value ? false : true;
  console.log("is invalid name", invalidName.value);
};

const createProject = async () => {
  loading.value = true;
  console.log("create new project", projectName.value);
  if (!projectName.value) {
    console.log("invalid project name");
    invalidName.value = true;
  } else {
    const createNewProject = {
      name: projectName.value,
      description: projectDesc.value ? projectDesc.value : "",
    };
    const { data: insertResponse } = await useFetch("api/new_project", {
      method: "POST",
      body: createNewProject,
      headers: { "cache-control": "no-cache" },
    });
    console.log("insert project response", insertResponse);

    const createdProject = insertResponse.value.data;
    if (insertResponse.value.success) {
      const { data: mapResponse } = await useFetch("api/map_user_event", {
        method: "POST",
        body: {
          id: createdProject.id,
          name: createdProject.name,
          role: "Admin",
        },
        headers: { "cache-control": "no-cache" },
      });

      console.log("map new event creator", mapResponse);

      if (mapResponse.value.success) {
        toast.add({
          severity: "success",
          summary: "Yay!",
          detail: "The event is created. Edit the details in management page.",
          lifetime: 1000,
        });

        const doneRefresh = await refreshDatastore("", createdProject.id);
        console.log("donrefresh ds", doneRefresh);
        if (doneRefresh.doneRefreshDs) {
          console.log("ds after refresh", dstore.getFullData());
          loading = false;
          //   navigateTo(`/eventManagement/${createdProject.id}`);
          // dstore.setSelectedProject(createdProject.id);
          switchPage(`/eventManagement/${createdProject.id}`, "Edit Event");
        }
      } else {
        toast.add({
          severity: "danger",
          summary: "Oops",
          detail: "Error in creating event. Please try again later.",
          lifetime: 1000,
        });
      }
    }
  }
};

dstore.setSelectedProject(null);
dstore.setCurrentPage("Create Event");
definePageMeta({
  middleware: ["auth", "initiate"],
  layout: "custom",
});
</script>

<style lang="css" scoped>
.invalid-input {
  color: #c81111;
}
</style>
