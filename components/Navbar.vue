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
            id="event-ddlist"
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
          @click="switchPage('/overview', 'Overview')"
        />
        <Pbutton
          type="button"
          icon="pi pi-user"
          @click="switchPage('/profile', 'Profile')"
        />
        <Pbutton type="button" icon="pi pi-sign-out" @click="logout" />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup type="module">
import { useDataStore } from "~/stores/datastore";
import { useNow, useDateFormat } from "@vueuse/core";
import { ref } from "vue";

const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
const dateToday = useDateFormat(useNow(), "MMM DD, YYYY");
// const menu = ref();
// const isShowButton = ref(false);
// const menuItems = ref([]);
// var ddplaceholder = ref(dstore.getCurrentPage);
// var project = ref(dstore.getAllProjects);
// var selectedProject = ref(dstore.getSelectedProject?.id);

// console.log("all project", project);
// console.log("all project", dstore.getAllProjects);
// console.log("selected project:", selectedProject.value);

// function configEditMenuList() {
//   console.log("1", dstore.getSelectedProject);
//   const editMenu = [];
//   if (dstore.getSelectedProject?.role == "Admin") {
//     editMenu.push({
//       label: "Edit Event",
//       command: () => switchPage("/eventManagement", "Edit Event"),
//     });
//   }
//   editMenu.push(
//     {
//       label: "Create New Event",
//       command: () => switchPage("/createEvent", "Create Event"),
//     },
//     {
//       label: "Join Event",
//       command: () => switchPage("/joinEvent", "Join Event"),
//     }
//   );
//   return { editMenu };
// }
// menuItems.value = configEditMenuList().editMenu;
// console.log(menuItems.value);

const toggle = (event) => {
  menu.value.toggle(event);
};

// function onChangeSelectedProject(event) {
//   if (event.value == "-1") {
//     isShowButton.value = false;
//     navigateTo("/overview");
//   } else {
//     isShowButton.value = true;
//     navigateTo(`/event/${event.value}`);
//   }

//   dstore.setSelectedProject(event.value);
//   menuItems.value = configEditMenuList().editMenu;
//   dstore.setCurrentPage(event.value);

//   console.log("changed event", event);
//   console.log("updated selected project", dstore.getSelectedProject);
//   console.log(
//     "selectedproject value",
//     selectedProject.value,
//     "showbutton",
//     isShowButton.value
//   );
//   console.log("placeholder", ddplaceholder.value);
// }

// function switchPage(routeName, pageName) {
//   console.log(routeName, pageName);
//   if (pageName == "Edit Event") {
//     console.log("split route name", routeName.split("/"));
//     const projectId = routeName.split("/")[2];
//     console.log(projectId);
//     if (projectId) {
//       selectedProject.value = projectId;
//       ddplaceholder.value = "";
//       project.value = dstore.getAllProjects;
//       console.log(
//         "redirect to event management",
//         projectId,
//         selectedProject.value,
//         ddplaceholder.value,
//         project.value
//       );
//       navigateTo(routeName);
//     } else {
//       var finalRouteName = routeName + "/" + selectedProject?.value;
//       navigateTo(finalRouteName);
//     }
//   } else if (pageName != "Overview" && pageName != "Edit Event") {
//     ddplaceholder.value = pageName;
//     dstore.setCurrentPage(pageName);
//     selectedProject.value = null;
//     dstore.setSelectedProject("");
//     navigateTo(routeName);
//   } else {
//     selectedProject.value = "-1";
//     dstore.setSelectedProject("-1");
//     ddplaceholder.value = "";
//     dstore.setCurrentPage("");
//     navigateTo(routeName);
//   }
//   isShowButton.value = false;
//   console.log(selectedProject.value, ddplaceholder.value);
// }

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

<script>
const dstore = useDataStore();
const menu = ref();
const isShowButton = ref(false);
const menuItems = ref([]);
var ddplaceholder = ref(dstore.getCurrentPage);
var project = ref(dstore.getAllProjects);
var selectedProject = ref(dstore.getSelectedProject?.id);

export const switchPage = (routeName, pageName) => {
  console.log(routeName, pageName);
  if (pageName == "Edit Event") {
    console.log("split route name", routeName.split("/"));
    const projectId = routeName.split("/")[2];
    console.log(projectId);
    if (projectId) {
      selectedProject.value = projectId;
      ddplaceholder.value = "";
      project.value = dstore.getAllProjects;
      console.log(
        "redirect to event management",
        projectId,
        selectedProject.value,
        ddplaceholder.value,
        project.value
      );
      navigateTo(routeName);
    } else {
      var finalRouteName = routeName + "/" + selectedProject?.value;
      navigateTo(finalRouteName);
    }
  } else if (pageName != "Overview" && pageName != "Edit Event") {
    ddplaceholder.value = pageName;
    dstore.setCurrentPage(pageName);
    selectedProject.value = null;
    dstore.setSelectedProject("");
    navigateTo(routeName);
  } else {
    selectedProject.value = "-1";
    dstore.setSelectedProject("-1");
    ddplaceholder.value = "";
    dstore.setCurrentPage("");
    navigateTo(routeName);
  }
  isShowButton.value = false;
  console.log(selectedProject.value, ddplaceholder.value);
};

export const onChangeSelectedProject = (event) => {
  if (event.value == "-1") {
    isShowButton.value = false;
    navigateTo("/overview");
  } else {
    isShowButton.value = true;
    navigateTo(`/event/${event.value}`);
  }

  dstore.setSelectedProject(event.value);
  menuItems.value = configEditMenuList().editMenu;
  dstore.setCurrentPage(event.value);

  console.log("changed event", event);
  console.log("updated selected project", dstore.getSelectedProject);
  console.log(
    "selectedproject value",
    selectedProject.value,
    "showbutton",
    isShowButton.value
  );
  console.log("placeholder", ddplaceholder.value);
};

const configEditMenuList = () => {
  console.log("1", dstore.getSelectedProject);
  const editMenu = [];
  if (dstore.getSelectedProject?.role == "Admin") {
    editMenu.push({
      label: "Edit Event",
      command: () => switchPage("/eventManagement", "Edit Event"),
    });
  }
  editMenu.push(
    {
      label: "Create New Event",
      command: () => switchPage("/createEvent", "Create Event"),
    },
    {
      label: "Join Event",
      command: () => switchPage("/joinEvent", "Join Event"),
    }
  );
  return { editMenu };
};
menuItems.value = configEditMenuList().editMenu;
console.log(menuItems.value);
</script>

<style lang="css" scoped>
#event-ddlist {
  max-width: 80%;
}
</style>
