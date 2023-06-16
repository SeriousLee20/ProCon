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
            placeholder=" "
          >
            <!-- <template #value="slotProps">
              <div v-if="slotProps.value">
                <div>{{ slotProps.value.name }}</div>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
            <template #option="slotProps">
              <div>
                <div>
                  {{ slotProps.option.name }}
                </div>
              </div>
            </template> -->
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
        <Pbutton v-if="isShowButton" type="button" icon="pi pi-chart-bar" />
        <Pbutton v-if="isShowButton" type="button" icon="pi pi-comment" />
        <Pbutton v-if="isShowButton" type="button" icon="pi pi-inbox" />
        <Pbutton type="button" icon="pi pi-home" />
        <Pbutton type="button" icon="pi pi-user" />
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

// onMounted(() => {
//   var ddlist = document.getElementById("event-ddlist");
//   if (window.location.href && window.location.href.indexOf("?") > -1) {
//     var get = window.location.href.substr(
//       window.location.href.indexOf("?") + 1
//     );
//     if (ddlist && get.length > 0) {
//       var src = ddlist.src;
//       src = src.indexOf("?") > -1 ? src + "&" + get : src + "?" + get;
//       ddlist.src = src;
//     }
//   }
// });

var project = ref(dstore.getAllProjects);
var selectedProject = ref(dstore.getSelectedProject?.id);
console.log(project);
console.log(dstore.getAllProjects);
console.log("selected project:", selectedProject.value);

console.log(route.name);

const isShowButton = ![
  "index",
  "profile",
  "manageEvent",
  "manageAnnouncement",
].includes(route.name);

const configEditMenuList = () => {
  console.log("1", dstore.getSelectedProject);
  const editMenu = [];
  if (dstore.getSelectedProject?.role == "admin") {
    editMenu.push({ label: "Edit Event", command: "" });
  }
  editMenu.push(
    {
      label: "Create New Event",
      command: "",
    },
    {
      label: "Join Event",
      command: "",
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
  console.log(dstore.getSelectedProject);
  menuItems.value = configEditMenuList().editMenu;
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
