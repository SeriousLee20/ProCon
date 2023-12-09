<template>
  <div class="bg-bluegray-200 grid px-2 pt-1">
    <div class="col flex align-content-center">
      <div class="flex align-items-center">
        {{ dateToday }}
      </div>
    </div>
    <div class="col flex justify-content-center align-content-center">
      <div>
        <ClientOnly>
          <Pdropdown id="project-ddlist" v-model="selectedProject" :options="project" optionLabel="name" optionValue="id"
            @change="onChangeSelectedProject($event)" :placeholder="ddplaceholder">
          </Pdropdown>
        </ClientOnly>
        <Pbutton type="button" icon="pi pi-sliders-h" @click="toggle" aria-label="edit_project" aria-haspopup="true"
          aria-controls="edit_menu" />
        <Pmenu ref="menu" id="edit_menu" :model="menuItems" :popup="true"></Pmenu>
      </div>
    </div>
    <!-- <Pbutton type="submit" label="Test" @click="test"></Pbutton> -->
    <div class="col flex justify-content-end align-content-center gap-1">
      <div v-if="isShowButton" class="flex justify-content-end align-content-center gap-1">
        <Pbutton type="button" icon="pi pi-chart-bar" @click="switchPage('ganttchart', 'Gantt Chart')" />
        <Pbutton type="button" icon="pi pi-comment" @click="toggleChatPanel" />
        <Poverlay-panel ref="chatPanel" appendTo="body" style="width: 24rem; height: 20rem">
          <Pdataview :value="chatlist" optionValue="chatroom_id" class="h-17rem overflow-scroll"
            :pt="{ header: { class: 'p-0 pl-1 pb-2' } }">
            <template #header>
              <div class="text-xl bg-primary-100 border-round pl-1">Chat</div>
            </template>
            <template #empty>
              <div>Start a chat.</div>
            </template>
            <template #list="slotProps">
              <div v-for="(item, index) in slotProps.items"
                class="flex justify-content-between pb-3 col-12 cursor-pointer hover:bg-primary-200 pl-2 pb-3 border-round border-none w-full">
                <div v-if="item.group_id" class="w-full">
                  <div class="flex justify-content-between w-full">
                    <div class="font-bold text-sm">
                      {{ item.group_info.group_name }}
                    </div>
                    <div class="font-light text-xs min-w-max">
                      {{ formatDate(item.last_update_time) }}
                    </div>
                  </div>
                  <div v-if="item.chatlog[0]" class="flex font-normal text-xs">
                    <div class="pr-1">{{ item.chatlog[0].sender_name }}:</div>
                    <div class="text-overflow-ellipsis white-space-nowrap overflow-hidden" style="width:100%">
                      {{ item.chatlog[0].text_content }}
                    </div>
                  </div>
                </div>
                <div v-else class="w-full">
                  <div class="flex justify-content-between">
                    <div class="font-bold text-sm">
                      {{ item.chat_target[0]?.name }}
                    </div>
                    <div class="font-light text-xs min-w-max">
                      {{ formatDate(item.last_update_time) }}
                    </div>
                  </div>
                  <div class="font-normal text-xs text-overflow-ellipsis white-space-nowrap overflow-hidden"
                    style="width:100%">
                    {{ item.chatlog[0]?.text_content }}
                  </div>
                </div>
              </div>
            </template>
          </Pdataview>
        </Poverlay-panel>
        <Pbutton type="button" icon="pi pi-inbox" @click="toggleNotificationPanel"
          @refresh-notification="refreshNotification($event)" :pt="{ content: { class: 'w-20rem h-20rem' } }" />
        <Poverlay-panel ref="notificationPanel" appendTo="body" style="width: 24rem; height: 20rem">
          <Pdataview :value="notificationList" optionValue="notification_id" class="h-17rem overflow-scroll"
            :pt="{ header: { class: 'p-0 pl-1 pb-2' } }">
            <template #header>
              <div class="text-xl bg-primary-100 border-round pl-1">
                Notification
              </div>
            </template>
            <template #empty>
              <div>No Notifications</div>
            </template>
            <template #list="slotProps">
              <div v-for="(item, index) in slotProps.items"
                class="flex justify-content-between pb-3 col-12 cursor-pointer hover:bg-primary-200 pl-2 pb-3 border-round border-none">
                <div>
                  <div class="font-bold text-sm">{{ item.title }}</div>
                  <div class="font-light text-xs text-overflow-ellipsis">
                    {{ item.content }}
                  </div>
                </div>
                <div class="font-light text-xs min-w-max">
                  {{ formatDate(item.created_at) }}
                </div>
              </div>
            </template>
          </Pdataview>
        </Poverlay-panel>
      </div>
      <!-- <Pbutton
          type="button"
          icon="pi pi-home"
          @click="switchPage('/overview', 'Overview')"
        /> -->
      <Pbutton type="button" icon="pi pi-user" @click="switchPage('/profile', 'Profile')" />
      <Pbutton type="button" icon="pi pi-sign-out" @click="logout" />
    </div>
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
var ddplaceholder = ref(dstore.getCurrentPage);
var project = ref(dstore.getAllProjects);
var selectedProject = ref(dstore.getSelectedProject?.id);
// const { currentProject, setCurrentProject } = useCurrentProject();

const dateToday = useDateFormat(useNow(), "MMM DD, YYYY", {
  locales: "en-US",
});
const menu = ref();
const isShowButton = ref(selectedProject.value ? true : false);
const menuItems = ref([]);

// const selectedProject = ref(currentProject);
const notificationPanel = ref(false);
const notificationList = ref();
const chatPanel = ref(false);
const chatlist = ref();
// TODO: add notification list
// TODO: add chat member list
const { $listen } = useNuxtApp();

const supabase = createClient(
  "https://xlurkqcyxhrbxxtnrcdk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdXJrcWN5eGhyYnh4dG5yY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY1NTcyNTEsImV4cCI6MjAwMjEzMzI1MX0.AZESK8885YEqTl197Mkm3cn-UGRcQRnCjguiXeQi6Pc"
);

const getUserData = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  worker.postMessage(user.id);
};
getUserData();

const worker = new Worker("/worker.js");
console.log(worker);

console.log("all project", project);
console.log("all project", dstore.getAllProjects);
console.log("selected project:", selectedProject.value);

const formatDate = (dateString) => {
  const formattedDate = useDateFormat(dateString, "MMM DD, YYYY HH:mm", {
    locales: "en-US",
  });
  return formattedDate.value;
};

function configEditMenuList() {
  console.log("1", dstore.getSelectedProject);
  const editMenu = [];
  if (dstore.getSelectedProject?.role == "Admin") {
    editMenu.push({
      label: "Management",
      command: () => switchPage("management", "Management"),
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

const toggleChatPanel = (event) => {
  chatPanel.value.toggle(event);
};

const getChatList = async () => {
  var { data: chatlistRes } = await useFetch("/api/get_chatlist", {
    method: "POST",
    body: { project_id: selectedProject.value },
    headers: { "cache-control": "no-cache" },
  });

  chatlist.value = chatlistRes.value.response;
  console.log("chat", chatlistRes, chatlist.value);
};

const toggleNotificationPanel = (event) => {
  notificationPanel.value.toggle(event);
};

const refreshNotification = (event) => { };

const getNotification = async () => {
  var { data: notificationRes } = await useFetch("/api/get_notification", {
    method: "POST",
    body: { project_id: selectedProject.value },
    headers: { "cache-control": "no-cache" },
  });
  notificationList.value = notificationRes.value.response;
  console.log("noti", notificationRes, notificationList.value);
};

function onChangeSelectedProject(event) {
  if (event.value == "-1") {
    isShowButton.value = false;
    navigateTo("/overview");
  } else {
    isShowButton.value = true;
    navigateTo(`/${event.value}/task`);

    getNotification();
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

const switchPage = (routeName, pageName) => {
  console.log(routeName, pageName);
  if (pageName == "Task") {
    console.log("split route name", routeName.split("/"));
    const projectId = routeName.split("/")[0];
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
    }
  } else if (pageName == "Management") {
    navigateTo(routeName);
  } else if (pageName != "Overview" && pageName != "Management") {
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
  isShowButton.value = selectedProject.value ? true : false;
  console.log(selectedProject.value, ddplaceholder.value);
};

onNuxtReady(() => {
  $listen("refresh-notification", (notifications) => {
    // TODO: insert new noti
    console.log("refresh noti", notifications);
  });

  $listen("switch-page", (action) => {
    switchPage(action.routeName, action.pageName);
  });

  if (selectedProject.value) {
    getNotification();
    getChatList();
  }
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
</script>

<script>
//TODO: avoid pinia error when refresh create
// const dstore = useDataStore();
// const menu = ref();
// const isShowButton = ref(false);
// const menuItems = ref([]);
// var ddplaceholder = ref(dstore.getCurrentPage);
// var project = ref(dstore.getAllProjects);
// var selectedProject = ref(dstore.getSelectedProject?.id);

// export const switchPage = (routeName, pageName) => {
//   console.log(routeName, pageName);
//   if (pageName == "Edit Project" || pageName == "Project") {
//     console.log("split route name", routeName.split("/"));
//     const projectId = routeName.split("/")[2];
//     console.log(projectId);
//     if (projectId) {
//       selectedProject.value = projectId;
//       ddplaceholder.value = "";
//       project.value = dstore.getAllProjects;
//       console.log(
//         "redirect to project management",
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
//   } else if (pageName != "Overview" && pageName != "Edit Project") {
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
// };

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
