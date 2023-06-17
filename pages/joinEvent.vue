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
          <Pbutton type="submit" label="Join" @click="joinEvent"></Pbutton>
        </div>
      </template>
    </Pcard>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDataStore } from "~/stores/datastore";

const eventCode = ref("");
const toast = useToast();
const { data: all_event } = await useFetch("/api/get_all_event");
const dstore = useDataStore();
const joinedEvent = dstore.getAllProjects;
console.log(all_event);

const joinEvent = async () => {
  console.log(eventCode.value);
  if (!eventCode.value) {
    console.log("yex");
    toast.add({
      severity: "error",
      summary: "Empty Code",
      detail: "Please paste your code.",
      lifetime: 100,
    });
  } else {
    const eventExist = all_event.value.filter(
      (event) => event.id == eventCode.value
    );
    const membership = joinedEvent.filter(
      (event) => event.id == eventCode.value
    );

    console.log(eventExist, membership);

    if (eventExist.length == 0) {
      console.log("2");
      toast.add({
        severity: "warn",
        summary: "Invalid Code",
        detail: "Please check your code.",
        lifetime: 1000,
      });
    } else {
      if (membership.length > 0) {
        console.log("3");
        toast.add({
          severity: "info",
          summary: "You joined this event.",
          detail: "Please check your event list for this event.",
          lifetime: 1000,
        });
      } else {
        console.log("4");
        toast.add({
          severity: "success",
          summary: "Yay!",
          detail: "You are added to the event.",
          lifetime: 1000,
        });

        var newProject = {
          id: eventExist[0].id,
          name: eventExist[0].name,
          role: "member",
          description: eventExist[0].description,
          creator_id: eventExist[0].creator_id,
          is_show_project_in_overview: true,
        };
        dstore.createProject(newProject);

        console.log(dstore.getAllProjects);
        const { data: response, projectList } = await useFetch(
          "api/map_user_event",
          {
            method: "POST",
            body: newProject,
            headers: { "cache-control": "no-cache" },
          }
        );
        console.log(response, projectList);
      }
    }
  }
};

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
