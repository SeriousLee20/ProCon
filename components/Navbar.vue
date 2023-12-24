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
          <Pdropdown
            id="project-ddlist"
            v-model="selectedProject"
            :options="project"
            optionLabel="project_name"
            optionValue="project_id"
            @change="onChangeSelectedProject($event)"
            :placeholder="ddplaceholder"
          >
          </Pdropdown>
        </ClientOnly>
        <Pbutton
          type="button"
          icon="pi pi-sliders-h"
          @click="toggle"
          aria-label="edit_project"
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
    <!-- <Pbutton type="submit" label="Test" @click="test"></Pbutton> -->
    <div class="col flex justify-content-end align-content-center gap-1">
      <div
        v-if="isShowButton"
        class="flex justify-content-end align-content-center gap-1"
      >
        <Pbutton
          type="button"
          icon="pi pi-chart-bar"
          @click="switchPage('ganttchart', 'Gantt Chart')"
        />
        <Pbutton type="button" icon="pi pi-comment" @click="toggleChatPanel" />
        <Poverlay-panel
          ref="chatPanel"
          appendTo="body"
          style="width: 24rem; height: 20rem"
        >
          <Pdataview
            v-if="chatPanelState == 'home'"
            :value="chatlist"
            optionValue="chatroom_id"
            class="h-17rem overflow-scroll"
            :pt="{ header: { class: 'p-0 pl-1 pb-2' } }"
          >
            <template #header>
              <div class="flex justify-content-between align-items-center">
                <div class="text-xl bg-primary-100 border-round w-full px-1">
                  Chat
                </div>
                <div
                  class="pi pi-users text-xl font-bold hover:bg-primary-200 hover:border-2 border-round cursor-pointer ml-2 p-1"
                  @click="openCreateGroupPanel"
                ></div>
              </div>
            </template>
            <template #empty>
              <div>No members' here yet.</div>
            </template>
            <template #list="slotProps">
              <div
                v-for="(item, index) in slotProps.items"
                class="flex justify-content-between pb-3 col-12 cursor-pointer hover:bg-primary-200 pl-2 pb-3 border-round border-none w-full"
                @click="openChatRoom(item)"
              >
                <div v-if="item.group_id" class="w-full">
                  <div class="flex justify-content-between w-full">
                    <div class="font-bold text-sm">
                      {{ item.group_info.group_name }}
                    </div>
                    <div class="font-light text-xs min-w-max">
                      {{ formatDate(item.last_update_time) }}
                    </div>
                  </div>
                  <div v-if="item.chatlog" class="flex font-normal text-xs">
                    <div class="pr-1">
                      {{ item.chatlog[item.chatlog.length - 1]?.sender_name }}:
                    </div>
                    <div
                      class="text-overflow-ellipsis white-space-nowrap overflow-hidden"
                      style="width: 100%"
                    >
                      {{ item.chatlog[item.chatlog.length - 1].text_content }}
                    </div>
                  </div>
                </div>
                <div v-else class="w-full">
                  <div class="flex justify-content-between">
                    <div class="font-bold text-sm">
                      {{ item.chat_target[0]?.name }}
                    </div>
                    <div
                      v-if="item.last_update_time"
                      class="font-light text-xs min-w-max"
                    >
                      {{ formatDate(item.last_update_time) }}
                    </div>
                  </div>
                  <div
                    v-if="item.chatlog"
                    class="font-normal text-xs text-overflow-ellipsis white-space-nowrap overflow-hidden"
                    style="width: 100%"
                  >
                    {{ item.chatlog[item.chatlog.length - 1]?.text_content }}
                  </div>
                </div>
              </div>
            </template>
          </Pdataview>
          <div v-if="chatPanelState == 'create_group'">
            <div class="flex justify-content-between align-items-center">
              <Pbutton
                class="text-primary text-sm cursor-pointer hover:bg-white"
                :pt="{
                  root: {
                    style: 'box-shadow:none; border: none; padding:0;',
                  },
                }"
                @click="cancelCreateGroup"
                text
                >Cancel</Pbutton
              >
              <div class="font-bold">Add Members</div>
              <Pbutton
                class="text-primary text-sm cursor-pointer"
                :pt="{
                  root: { style: 'box-shadow:none; border: none; padding:0;' },
                }"
                :disabled="!selectedGroupMember.length > 0"
                @click="doneSelectGroupMember"
                text
              >
                Next
              </Pbutton>
            </div>
            <div class="pt-2 h-17rem overflow-scroll">
              <div
                v-for="department of groupedUsers"
                :key="department"
                class="overflow-scroll"
              >
                <div class="font-bold pb-2">{{ department.department }}</div>
                <div
                  v-for="member in department.members"
                  :key="member.user_id"
                  class="pb-2"
                >
                  <Pcheckbox
                    v-model="selectedGroupMember"
                    :inputId="member.user_id"
                    name="member"
                    :value="member.user_id"
                  />
                  <label class="pl-2" :for="member.user_id">{{
                    member.username
                  }}</label>
                </div>
              </div>
            </div>
          </div>
          <div v-if="chatPanelState == 'enter_group_info'">
            <div class="flex justify-content-between align-items-center">
              <Pbutton
                class="text-primary text-sm cursor-pointer hover:bg-white"
                :pt="{
                  root: {
                    style: 'box-shadow:none; border: none; padding:0;',
                  },
                }"
                @click="backToSelectGroupMember"
                text
                >Back</Pbutton
              >
              <div class="font-bold">Add Members</div>
              <Pbutton
                class="text-primary text-sm cursor-pointer"
                :pt="{
                  root: { style: 'box-shadow:none; border: none; padding:0;' },
                }"
                :disabled="!chatGroupName?.length > 0"
                @click="createChatGroup"
                text
              >
                Done
              </Pbutton>
            </div>
            <div class="pt-5 w-full">
              <Pinputtext
                class="w-full"
                type="text"
                id="chatgroup-name"
                v-model="chatGroupName"
                placeholder="Group Name"
                aria-labelledby="chatgroup-name-help"
                required
              />
              <small id="chatgroup-name-help"
                >Enter a simple and precise group name.</small
              >
            </div>
          </div>
        </Poverlay-panel>
        <Pdialog
          v-model:visible="chatDialog"
          :style="{ width: '28rem', height: '15rem', shadow: 'none' }"
          position="bottomright"
          :draggable="false"
          class="border-round border-1 border-primary shadow-none bg-white h-max"
          :pt="{ transition: { class: 'transition-none' } }"
        >
          <template #container>
            <div class="w-full bg-primary-100 h-full">
              <div
                class="flex align-items-center justify-content-between bg-primary w-full px-2"
              >
                <span class="pi pi-chevron-down" @click="toggleChatroom"></span>
                <div class="flex h6 h-2rem align-items-center text-lg">
                  {{
                    selectedChatroom.chat_target
                      ? selectedChatroom.chat_target[0].name
                      : selectedChatroom.group_info.group_name
                  }}
                </div>
                <span
                  class="flex pi pi-times justify-content-end"
                  @click="closeChatRoom"
                ></span>
              </div>
              <div class="w-full" v-if="!collapseChatroom">
                <div class="overflow-scroll max-h-25rem h-25rem flex flex-column-reverse">

                  <div
                    v-if="selectedChatroom.chatlog"
                    class="w-full px-1 "
                  >
                    <div
                      v-for="message in selectedChatroom.chatlog"
                      class="w-full py-2"
                    >
                      <div
                        v-if="message.sender_id == user.id"
                        class="flex flex-column justify-content-end pl-8"
                      >
                        <div
                          class="font-normal text-base text-overflow-ellipsis white-space-wrap overflow-hidden border-1 border-white bg-white px-1"
                          style="border-radius: 0.5rem 0 0.5rem 0.5rem"
                        >
                          <div>
                            {{ message.text_content }}
                          </div>
                          <div class="text-xs font-mono text-right">
                            {{ formatDate(message.created_at) }}
                          </div>
                        </div>
                      </div>
                      <div v-else class="w-full h-full">
                        <div v-if="message.text_content" class="pr-8 py-3">
                          <div
                            class="font-bold text-sm text-overflow-ellipsis white-space-wrap overflow-hidden pb-1"
                          >
                            {{ message.sender_name }}
                          </div>
                          <div
                            class="font-light text- text-overflow-ellipsis white-space-wrap overflow-hidden border-1 border-white bg-white px-1"
                            style="border-radius: 0.5rem 0.5rem 0.5rem 0"
                          >
                            {{ message.text_content }}
                            <div class="text-xs font-mono text-right">
                              {{ formatDate(message.created_at) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex align-items-end w-full p-2">
                  <!-- <Pfileupload /> -->
                  <EmojiPicker
                    class="chat w-full"
                    :native="true"
                    v-model:text="chatInput"
                    picker-type="input"
                  />
                  <span
                    class="pi pi-send flex align-self-center text-lg pl-2 cursor-pointer"
                    @click="insert_chatlog"
                  ></span>
                </div>
              </div>
            </div>
          </template>
        </Pdialog>
        <Pbutton
          type="button"
          icon="pi pi-inbox"
          @click="toggleNotificationPanel"
          @refresh-notification="refreshNotification($event)"
          :pt="{ content: { class: 'w-20rem h-20rem' } }"
        />
        <Poverlay-panel
          ref="notificationPanel"
          appendTo="body"
          style="width: 24rem; height: 20rem"
        >
          <Pdataview
            :value="notificationList"
            optionValue="notification_id"
            class="h-17rem overflow-scroll"
            :pt="{ header: { class: 'p-0 pl-1 pb-2' } }"
          >
            <template #header>
              <div class="text-xl bg-primary-100 border-round pl-1">
                Notification
              </div>
            </template>
            <template #empty>
              <div>No Notifications</div>
            </template>
            <template #list="slotProps">
              <div
                v-for="(item, index) in slotProps.items"
                class="flex justify-content-between pb-3 col-12 cursor-pointer hover:bg-primary-200 pl-2 pb-3 border-round border-none"
              >
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
      <Pbutton
        type="button"
        icon="pi pi-user"
        @click="switchPage('/profile', 'Profile')"
      />
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
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

const { auth } = useSupabaseAuthClient();
const user = useSupabaseUser();
const dstore = useDataStore();
var ddplaceholder = ref(dstore.getCurrentPage);
var project = ref(dstore.getAllProjects);
var selectedProject = ref(dstore.getSelectedProject?.id);
// const { currentProject, setCurrentProject } = useCurrentProject();

const dateToday = useDateFormat(useNow(), "MMM DD, YYYY", {
  locales: "en-US",
});
const menu = ref();
const isShowButton = ref(
  selectedProject.value && selectedProject.value != -1 ? true : false
);
const menuItems = ref([]);

// const selectedProject = ref(currentProject);
const notificationPanel = ref(false);
const notificationList = ref();
const chatPanel = ref(false);
const chatlist = ref();
const chatDialog = ref(false);
const chatInput = ref();
const chatPanelState = ref("home");
const groupedUsers = ref();
const selectedGroupMember = ref([]);
const chatGroupName = ref();
const chatGroupDescription = ref();
const selectedChatroom = ref();
const collapseChatroom = ref(false);
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

const openCreateGroupPanel = () => {
  selectedGroupMember.value = [];
  chatPanelState.value = "create_group";
  groupedUsers.value = dstore.getManagementBoard;
  console.log("chat grouped users", groupedUsers.value);
};

const cancelCreateGroup = () => {
  selectedGroupMember.value = [];
  chatPanelState.value = "home";
};

const backToSelectGroupMember = () => {
  chatPanelState.value = "create_group";
};

const doneSelectGroupMember = () => {
  chatPanelState.value = "enter_group_info";
  console.log("selected group members", selectedGroupMember.value);
};

const createChatGroup = async () => {
  console.log("groupinfo", chatGroupName.value, chatGroupDescription);
  const { data: createGroupRes } = await useFetch("/api/create_group", {
    method: "POST",
    body: {
      group_name: chatGroupName.value,
      group_description: null,
      project_id: selectedProject.value,
      user_ids: selectedGroupMember.value,
    },
    headers: { "cache-control": "no-cache" },
  });

  if (createGroupRes.value.success) {
    chatlist.value = createGroupRes.value.response;
    chatPanelState.value = 'home'
  }
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

const openChatRoom = (chatroom) => {
  chatDialog.value = true;
  selectedChatroom.value = chatroom;
};

const closeChatRoom = () => {
  chatDialog.value = false;
};

const toggleChatroom = () => {
  collapseChatroom.value = !collapseChatroom.value;
};

function onSelectEmoji(emoji) {
  console.log(emoji);
  /*
    // result
    {
        i: "😚",
        n: ["kissing face"],
        r: "1f61a", // with skin tone
        t: "neutral", // skin tone
        u: "1f61a" // without tone
    }
    */
}

const insert_chatlog = async () => {
  console.log("chatinput", chatInput.value, selectedChatroom.value);
  if (chatInput.value) {
    let chatroom = selectedChatroom.value;

    var { data: insertChatlogRes } = await useFetch("/api/insert_chatlog", {
      method: "POST",
      body: {
        chatroom_id: chatroom.chatroom_id,
        project_id: selectedProject.value,
        receiver_id: chatroom.chat_target
          ? chatroom.chat_target[0].user_id
          : null,
        text_content: chatInput.value,
      },
      headers: { "cache-control": "no-cache" },
    });

    if (insertChatlogRes.value.success) {
      chatlist.value = insertChatlogRes.value.response;
      selectedChatroom.value = chatlist.value[0];
      chatInput.value = "";
    }
    console.log(
      "insertchatlogres",
      chatlist.value,
      insertChatlogRes.value,
      selectedChatroom.value
    );
  }
};

const toggleNotificationPanel = (event) => {
  notificationPanel.value.toggle(event);
};

const refreshNotification = (event) => {};

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
    getChatList();
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
  } else if (pageName == "Management" || pageName == "Gantt Chart") {
    navigateTo(routeName);
  } else if (pageName != "Overview" && pageName != "Management") {
    // pagename = Create project/Join Project
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
  menuItems.value = configEditMenuList().editMenu;
  console.log(selectedProject.value, ddplaceholder.value);
};

onNuxtReady(() => {
  if (selectedProject.value && selectedProject.value != -1) {
    getNotification();
    getChatList();
  }
  $listen("refresh-notification", (notifications) => {
    // TODO: insert new noti
    console.log("refresh noti", notifications);
    notificationList.value = notifications;
  });

  $listen("switch-page", (action) => {
    switchPage(action.routeName, action.pageName);
  });

  $listen("refresh-project-list", (action) => {
    project.value = dstore.getAllProjects;
  });
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

.chat.v3-input-picker-root > input.v3-emoji-picker-input {
  border-radius: 0.5rem;
}
</style>
