<template>
  <div class="bg-bluegray-200 grid px-2 pt-1">
    <div class="col flex align-content-center">
      <div class="flex align-items-center">
        {{ dateToday }}
      </div>
    </div>
    <ClientOnly>
      <div class="col flex justify-content-center align-content-center">
        <div>
          <Pdropdown id="project-ddlist" v-model="selectedProject" :options="project" optionLabel="name" optionValue="id"
            @change="onChangeSelectedProject($event)" :placeholder="ddplaceholder">
          </Pdropdown>
          <Pbutton type="button" icon="pi pi-sliders-h" @click="toggle" aria-label="edit_project" aria-haspopup="true"
            aria-controls="edit_menu" />

          <Pmenu ref="menu" id="edit_menu" :model="menuItems" :popup="true"></Pmenu>
        </div>
      </div>
      <!-- <Pbutton type="submit" label="Test" @click="test"></Pbutton> -->
      <div class="col flex justify-content-end align-content-center gap-1">
        <div v-if="isShowButton" class="flex justify-content-end align-content-center gap-1">
          <Pbutton type="button" icon="pi pi-chart-bar" />
          <Pbutton type="button" icon="pi pi-comment" />
          <Pbutton type="button" icon="pi pi-inbox" />
        </div>
        <!-- <Pbutton
          type="button"
          icon="pi pi-home"
          @click="switchPage('/overview', 'Overview')"
        /> -->
        <Pbutton type="button" icon="pi pi-user" @click="switchPage('/profile', 'Profile')" />
        <Pbutton type="button" icon="pi pi-sign-out" @click="logout" />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup type="module">
import { useDataStore } from "~/stores/datastore";
import { useNow, useDateFormat } from "@vueuse/core";
import useCurrentProject from "~/composables/useProject";
import { ref } from "vue";
import { createClient } from "@supabase/supabase-js";

const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
// const { currentProject, setCurrentProject } = useCurrentProject();
const dateToday = useDateFormat(useNow(), "MMM DD, YYYY", {
  locales: "en-US",
});
// const menu = ref();
// const isShowButton = ref(false);
// const menuItems = ref([]);
// var ddplaceholder = ref(dstore.getCurrentPage);
// var project = ref(dstore.getAllProjects);
// var selectedProject = ref(dstore.getSelectedProject?.id);
// const selectedProject = ref(currentProject);

const supabase = createClient(
  "https://xlurkqcyxhrbxxtnrcdk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdXJrcWN5eGhyYnh4dG5yY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY1NTcyNTEsImV4cCI6MjAwMjEzMzI1MX0.AZESK8885YEqTl197Mkm3cn-UGRcQRnCjguiXeQi6Pc"
);

console.log(supabase);

const worker = new Worker('/worker.js');
console.log(worker)
worker.postMessage("test sw");

Notification.requestPermission();


const test = async () => {
  console.log("hello world");
  Notification.requestPermission().then((perm) => {
    if (perm === "granted") {
      new Notification("New Changes!", { body: "Tasks updated!" });
    }
  });
};

console.log("all project", project);
console.log("all project", dstore.getAllProjects);
console.log("selected project:", selectedProject.value);

function configEditMenuList() {
  console.log("1", dstore.getSelectedProject);
  const editMenu = [];
  if (dstore.getSelectedProject?.role == "Admin") {
    editMenu.push({
      label: "Edit Project",
      command: () => switchPage("/projectManagement", "Edit Project"),
    });
  }
  editMenu.push(
    {
      label: "Create New Project",
      command: () => switchPage("/createProject", "Create Project"),
    },
    {
      label: "Join Project",
      command: () => switchPage("/joinProject", "Join Project"),
    }
  );
  return { editMenu };
}
menuItems.value = configEditMenuList().editMenu;
console.log(menuItems.value);

const toggle = (event) => {
  menu.value.toggle(event);
};

function onChangeSelectedProject(event) {
  if (event.value == "-1") {
    isShowButton.value = false;
    navigateTo("/overview");
  } else {
    isShowButton.value = true;
    navigateTo(`/project/${event.value}`);
  }

  // setCurrentProject(event.value);
  // console.log("state currentproject", currentProject);

  dstore.setSelectedProject(event.value);
  menuItems.value = configEditMenuList().editMenu;
  dstore.setCurrentPage(event.value);

  console.log("changed Project", event);
  console.log("updated selected project", dstore.getSelectedProject);
  console.log(
    "selectedproject value",
    selectedProject.value,
    "showbutton",
    isShowButton.value
  );
  console.log("placeholder", ddplaceholder.value);
}

function switchPage(routeName, pageName) {
  console.log(routeName, pageName);
  if (pageName == "Edit Project") {
    console.log("split route name", routeName.split("/"));
    const projectId = routeName.split("/")[2];
    console.log(projectId);
    if (projectId) {
      selectedProject.value = projectId;
      ddplaceholder.value = "";
      project.value = dstore.getAllProjects;
      console.log(
        "redirect to project management",
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
  } else if (pageName != "Overview" && pageName != "Edit Project") {
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
}

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
//TODO: avoid pinia error when refresh create
const dstore = useDataStore();
const menu = ref();
const isShowButton = ref(false);
const menuItems = ref([]);
var ddplaceholder = ref(dstore.getCurrentPage);
var project = ref(dstore.getAllProjects);
var selectedProject = ref(dstore.getSelectedProject?.id);

export const switchPage = (routeName, pageName) => {
  console.log(routeName, pageName);
  if (pageName == "Edit Project" || pageName == "Project") {
    console.log("split route name", routeName.split("/"));
    const projectId = routeName.split("/")[2];
    console.log(projectId);
    if (projectId) {
      selectedProject.value = projectId;
      ddplaceholder.value = "";
      project.value = dstore.getAllProjects;
      console.log(
        "redirect to project management",
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
  } else if (pageName != "Overview" && pageName != "Edit Project") {
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

// export const onChangeSelectedProject = (event) => {
//   if (event.value == "-1") {
//     isShowButton.value = false;
//     navigateTo("/overview");
//   } else {
//     isShowButton.value = true;
//     navigateTo(`/project/${event.value}`);
//   }

//   dstore.setSelectedProject(event.value);
//   menuItems.value = configEditMenuList().editMenu;
//   dstore.setCurrentPage(event.value);

//   console.log("changed project", event);
//   console.log("updated selected project", dstore.getSelectedProject);
//   console.log(
//     "selectedproject value",
//     selectedProject.value,
//     "showbutton",
//     isShowButton.value
//   );
//   console.log("placeholder", ddplaceholder.value);
// };

// const configEditMenuList = () => {
//   console.log("1", dstore.getSelectedProject);
//   const editMenu = [];
//   if (dstore.getSelectedProject?.role == "Admin") {
//     editMenu.push({
//       label: "Edit Project",
//       command: () => switchPage("/projectManagement", "Edit Project"),
//     });
//   }
//   editMenu.push(
//     {
//       label: "Create New Project",
//       command: () => switchPage("/createProject", "Create Project"),
//     },
//     {
//       label: "Join Project",
//       command: () => switchPage("/joinProject", "Join Project"),
//     }
//   );
//   return { editMenu };
// };
// menuItems.value = configEditMenuList().editMenu;
// console.log(menuItems.value);
</script>

<style lang="css" scoped>
#project-ddlist {
  max-width: 80%;
}
</style>
