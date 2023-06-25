<template>
  <Ptoast />
  <div
    id="join-event"
    class="flex flex-column align-items-center justify-content-center w-screen h-screen"
  >
    <h3>Join Event</h3>
    <Pcard
      class="card flex flex-column align-items-center justify-content-center"
    >
      <template #content>
        <div class="flex flex-column align-items-center">
          <Pinputtext
            type="text"
            v-model="eventCode"
            placeholder="Code"
          ></Pinputtext>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-column align-items-center gap-3">
          <div>Paste your event code here.</div>
          <Pbutton
            type="submit"
            label="Join"
            @click="joinEvent"
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
import { switchPage } from "~/components/Navbar.vue";

const loading = ref(false);
const eventCode = ref("");
const toast = useToast();
const dstore = useDataStore();
const joinedEvent = dstore.getAllProjects;
const { data: all_event } = await useFetch("/api/get_all_event");

console.log(all_event);

const joinEvent = async () => {
  console.log(eventCode.value);
  if (!eventCode.value) {
    toast.add({
      severity: "error",
      summary: "Empty Code",
      detail: "Please paste your code.",
      lifetime: 100,
    });
  } else {
    const eventExist = all_event.value.find(
      (event) => event.id == eventCode.value
    );
    const membership = joinedEvent.find((event) => event.id == eventCode.value);

    console.log("joinevent", eventExist, membership);

    if (!eventExist) {
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
          summary: "You joined this event.",
          detail: "Please check your event list for this event.",
          lifetime: 1000,
        });
      } else {
        loading.value = true;
        var newProject = {
          user_id: dstore.getUserId,
          id: eventExist.id,
          name: eventExist.name,
          role: "Member",
          description: eventExist.description,
          creator_id: eventExist.creator_id,
          is_show_project_in_overview: true,
        };
        dstore.createProject(newProject);

        newProject["project_id"] = eventExist.id;

        newProject["project_id"] = eventExist.id;
        const { data: response } = await useFetch("api/map_user_event", {
          method: "POST",
          body: newProject,
          headers: { "cache-control": "no-cache" },
        });

        if (response.value.success) {
          toast.add({
            severity: "success",
            summary: "Yay!",
            detail: "You are added to the event.",
            lifetime: 1000,
          });

          const doneRefresh = await refreshDatastore("", eventExist.id);
          console.log("donrefresh ds", doneRefresh);
          if (doneRefresh.doneRefreshDs) {
            console.log("ds after refresh", dstore.getFullData());
            loading.value = false;
            // navigateTo(`/event/${newProject.id}`);
            // dstore.setSelectedProject(createdProject.id);
            switchPage(`/event/${newProject.id}`, "Event");
          }
        } else {
          toast.add({
            severity: "danger",
            summary: "Oops",
            detail: "Error in joining event. Please try again later.",
            lifetime: 1000,
          });
        }
      }
    }
  }
};

dstore.setSelectedProject(null);
dstore.setCurrentPage("Join Event");
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
