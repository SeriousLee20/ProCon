<template>
  <Ptoast />
  <div
    id="join-project"
    class="flex flex-column align-items-center justify-content-center w-screen h-screen"
  >
    <h3>Join Project</h3>
    <Pcard
      class="card flex flex-column align-items-center justify-content-center"
    >
      <template #content>
        <div class="flex flex-column align-items-center">
          <Pinputtext
            type="text"
            v-model="projectCode"
            placeholder="Code"
          ></Pinputtext>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-column align-items-center gap-3">
          <div>Paste your project code here.</div>
          <Pbutton
            type="submit"
            label="Join"
            @click="joinProject"
            :loading="loading"
          ></Pbutton>
        </div>
      </template>
    </Pcard>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDataStore } from "~/stores/datastore";
import { refreshDatastore } from "./index.vue";

const { $emit } = useNuxtApp();
const loading = ref(false);
const projectCode = ref("");
const toast = useToast();
const dstore = useDataStore();
const joinedProject = dstore.getAllProjects;
const { data: all_project } = await useFetch("/api/get_all_project");

console.log(all_project);

// TODO: generate default filter in sql script
const joinProject = async () => {
  console.log(projectCode.value);
  if (!projectCode.value) {
    toast.add({
      severity: "error",
      summary: "Empty Code",
      detail: "Please paste your code.",
      lifetime: 100,
    });
  } else {
    const projectExist = all_project.value.response.find(
      (project) => project.id == projectCode.value
    );
    const membership = joinedProject.find(
      (project) => project.id == projectCode.value
    );

    console.log("joinproject", projectExist, membership);

    if (!projectExist) {
      toast.add({
        severity: "warn",
        summary: "Invalid Code",
        detail: "Please check your code.",
        lifetime: 1000,
      });
    } else {
      if (membership) {
        toast.add({
          severity: "info",
          summary: "You joined this project.",
          detail: "Please check your project list for this project.",
          lifetime: 1000,
        });
      } else {
        loading.value = true;
        var newProject = {
          user_id: dstore.getUserId,
          id: projectExist.id,
          name: projectExist.name,
          role: "Member",
          description: projectExist.description,
          creator_id: projectExist.creator_id,
          is_show_project_in_overview: true,
        };
        dstore.createProject(newProject);

        newProject["project_id"] = projectExist.id;

        newProject["project_id"] = projectExist.id;
        const { data: response } = await useFetch("api/map_user_project", {
          method: "POST",
          body: newProject,
          headers: { "cache-control": "no-cache" },
        });

        if (response.value.success) {
          toast.add({
            severity: "success",
            summary: "Yay!",
            detail: "You are added to the project.",
            lifetime: 1000,
          });

          const doneRefresh = await refreshDatastore("", projectExist.id);
          console.log("donrefresh ds", doneRefresh);
          if (doneRefresh.doneRefreshDs) {
            console.log("ds after refresh", dstore.getFullData());
            loading.value = false;
            // navigateTo(`/project/${newProject.id}`);
            // dstore.setSelectedProject(createdProject.id);
            $emit("switch-page", {
              routeName: `${newProject.id}/task`,
              pageName: "Task",
            });
          }
        } else {
          toast.add({
            severity: "danger",
            summary: "Oops",
            detail: "Error in joining project. Please try again later.",
            lifetime: 1000,
          });
        }
      }
    }
  }
};

dstore.setSelectedProject(null);
dstore.setCurrentPage("Join project");
definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style lang="css" scoped>
.body {
  margin: 0;
}
</style>
