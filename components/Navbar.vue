<template>
  <div class="bg-bluegray-200 grid">
    <div class="col flex align-content-center">
      <div class="flex align-items-center">
        {{ dateToday }}
      </div>
    </div>
    <ClientOnly>
      <div class="col flex justify-content-center align-content-center">
        <div>
          <Pdropdown
            id="event-ddlit"
            v-model="selectedProject"
            :options="project"
            optionLabel="name"
            optionValue="id"
            @change="onChangeSelectedProject($event)"
            :placeholder="ddplaceholder"
          >
          </Pdropdown>
          <Pbutton
            type="button"
            icon="pi pi-sliders-h"
            @click="toggle"
            aria-label="edit_event"
            aria-haspopup="true"
            aria-controls="edit_menu"
          />
          <Pmenu
            ref="menu"
            id="edit_menu"
            :model="menuItems"
            :popup="true"
          ></Pmenu>
        </div>
      </div>
      <div class="col flex justify-content-end align-content-center gap-1">
        <div
          v-if="isShowButton"
          class="flex justify-content-end align-content-center gap-1"
        >
          <Pbutton type="button" icon="pi pi-chart-bar" />
          <Pbutton type="button" icon="pi pi-comment" />
          <Pbutton type="button" icon="pi pi-inbox" />
        </div>
        <Pbutton
          type="button"
          icon="pi pi-home"
          @click="navigateTo('/overview')"
        />
        <Pbutton
          type="button"
          icon="pi pi-user"
          @click="navigateTo('/profile')"
        />
        <Pbutton type="button" icon="pi pi-sign-out" @click="logout" />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
import { useNow, useDateFormat } from "@vueuse/core";
import { ref } from "vue";

const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
const route = useRoute();
const menu = ref();
const dateToday = useDateFormat(useNow(), "MMM DD, YYYY");
var ddplaceholder = ref(dstore.getCurrentPage);

var project = ref(dstore.getAllProjects);
var selectedProject = ref(dstore.getSelectedProject?.id);
console.log(project);
console.log(dstore.getAllProjects);
console.log("selected project:", selectedProject.value);

console.log(route.name);

const isEventPage = ![
  "index",
  "profile",
  "manageEvent",
  "manageAnnouncement",
  "overview",
].includes(route.name);

const isShowButton = ref(isEventPage);

console.log(isShowButton.value);
const configEditMenuList = () => {
  console.log("1", dstore.getSelectedProject);
  const editMenu = [];
  if (dstore.getSelectedProject?.role == "admin") {
    editMenu.push({
      label: "Edit Event",
      command: () => navigateTo("/editEvent"),
    });
  }
  editMenu.push(
    {
      label: "Create New Event",
      command: () => navigateTo("/createEvent"),
    },
    {
      label: "Join Event",
      command: () => navigateTo("/joinEvent"),
    }
  );
  return { editMenu };
};
const menuItems = ref(configEditMenuList().editMenu);
console.log(menuItems.value);

const toggle = (event) => {
  menu.value.toggle(event);
};

const onChangeSelectedProject = (event) => {
  console.log(event);
  dstore.setSelectedProject(event.value);
  console.log("2", dstore.getSelectedProject);

  console.log(selectedProject.value);
  menuItems.value = configEditMenuList().editMenu;
  isShowButton.value = isEventPage;

  if (!event.value) {
    ddplaceholder.value = dstore.getCurrentPage;
  } else {
    dstore.setCurrentPage("");
    ddplaceholder.value = "";
  }
  console.log(ddplaceholder.value);

  if (event.value == "-1") {
    navigateTo("/overview");
  } else {
    navigateTo(`/event/${event.value}`);
  }
};

watchEffect(() => {
  if (!useSupabaseUser().value) {
    navigateTo("/login");
  }
});

const logout = async () => {
  await auth.signOut();
  dstore.logout();
};
</script>

<style lang="css" scoped></style>
