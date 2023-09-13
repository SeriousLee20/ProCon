<template>
  <form
    @submit="addAnnouncement()"
    v-if="isOpenAnnouncementModal"
    class="fixed top-0 left-0 w-screen h-screen disabled-div bg-black-alpha-70 z-5 flex justify-content-center align-items-center"
  >
    <div
      class="form-modal bg-white flex flex-column gap-6 px-4 py-5 align-items-center"
    >
      <div class="py-2"><h3>Add Announcement</h3></div>
      <span class="p-float-label">
        <Pinputtext id="title" v-model="title" type="text" required />
        <label for="title">Title</label>
      </span>
      <span class="p-float-label">
        <Ptextarea
          id="description"
          v-model="description"
          type="text"
          required
        />
        <label for="description">Description</label>
      </span>
      <Pmultiselect
        v-model="selectedUsers"
        :options="groupedUsers"
        optionLabel="label"
        optionGroupLabel="label"
        filter
        optionGroupChildren="items"
        display="chip"
        placeholder="Select users to notify"
        class="w-full md:w-20rem"
      >
        <template #optiongroup="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.label }}</div>
          </div>
        </template>
      </Pmultiselect>
      <div class="flex gap-2 align-items-center">
        <Pbutton type="submit">Add</Pbutton>
        <Pbutton @click="closeAnnouncementModal()">Close</Pbutton>
      </div>
    </div>
  </form>

  <div>
    <div class="h-screen grid p-4 pt-2">
      <div class="col-8">
        <div>Completed</div>
      </div>

      <div class="col-4">
        <!-- announcement -->
        <div>
          <div
            class="mainpage-card border-primary-200 border-2 bg-white w-full mb-2"
          >
            <div class="grid justify-content-evenly">
              <div class="col-4 flex align-items-center justify-content-start">
                <Pbutton
                  class="no-shadow"
                  :icon="myTaskShowCompletedIcon"
                  @click="toggleMyTaskShowCompleted"
                  label="Completed"
                  size="small"
                  text
                ></Pbutton>
              </div>
              <div class="col-3 text-center"><h5>My Tasks</h5></div>
              <div class="col-3 flex justify-content-end align-items-center">
                <Pdropdown
                  style="box-shadow: none; border: none"
                  v-model="myTaskSortOption"
                  :options="myTaskSortOptions"
                  optionLabel="desc"
                  optionValue="id"
                ></Pdropdown>
              </div>
            </div>
            <div class="h-24rem">
              <div></div>
            </div>
          </div>
          <div
            class="mainpage-card border-primary-200 border-2 bg-white w-full"
          >
            <div class="grid justify-content-evenly">
              <div class="col-3 col-offset-5 text-center">
                <h5>Announcements</h5>
              </div>

              <div class="col-3 flex justify-content-end align-self-center">
                <Pbutton
                  v-if="isAdmin"
                  @click="openAnnouncementModal()"
                  icon="pi pi-plus"
                  rounded
                  outlined
                  aria-label="Filter"
                  size="small"
                />
              </div>
            </div>
            <ClientOnly>
              <div v-if="filteredAnnouncements.length > 0">
                <div class="px-2 py-2 overflow-y-scroll line-height-1 h-12rem">
                  <div
                    v-for="announcement in filteredAnnouncements"
                    :key="announcement.id"
                  >
                    <div
                      class="w-full flex align-items-center justify-content-between"
                    >
                      <div class="flex gap-2 align-content-center">
                        <p class="footnote-2">
                          {{ announcement.name ?? "" }}
                        </p>
                        <i
                          class="pi pi-info-circle text-base text-color-secondary"
                          v-tooltip.top="
                            announcement.description ??
                            'No description provided'
                          "
                        ></i>
                      </div>

                      <p class="footnote">
                        {{ formatDate(announcement.creation_timestamp) ?? "" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex align-items-center justify-content-center h-12rem"
                v-if="
                  filteredAnnouncements.length === 0 || !filteredAnnouncements
                "
              >
                <p class="footnote">No Announcements!</p>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";

const { projectid } = useRoute().params;
const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
const { data: userData } = await useFetch("/api/get_full_data");
const table = userData.value.response;
const toast = useToast();
const groupedUsers = ref([]);
let announcements = [];
// let filteredAnnouncements = [];
let userOptions = [];

dstore.setSelectedProject(projectid);
dstore.setCurrentPage("");

const isOpenAnnouncementModal = ref(false);
const title = ref(null);
const description = ref(null);
const selectedUsers = ref([]);
const valueArr = ref([]);
const isAdmin = ref(dstore.getSelectedProject?.role == "Admin");

console.log("data from db-userid", table[0].user_id);
console.log("current projectid", projectid);
console.log("isAdmin", dstore.getSelectedProject, isAdmin);

const { data: projectAnnouncementRes } = await useFetch(
  "/api/get_announcement",
  {
    method: "POST",
    body: { project_id: projectid },
    headers: { "cache-control": "no-cache" },
  }
);

const { data: projectMemberRes } = await useFetch(
  "/api/get_users_by_project_id",
  {
    method: "POST",
    body: { project_id: projectid },
    headers: { "cache-control": "no-cache" },
  }
);

const projectMember = projectMemberRes.value.response;
const filteredAnnouncements = projectAnnouncementRes.value.response;
const myTaskSortOptions = ref([
  { id: 1, desc: "Due Date" },
  { id: 2, desc: "Importance" },
  { id: 3, desc: "Status" },
  { id: 4, desc: "Assigner" },
]);

const setShowCompletedIcon = (show, listName) => {
  if (show) {
    if (listName == "myTask") myTaskShowCompletedIcon.value = "pi pi-eye";
    // else if (listName == "mainTask")
  } else {
    if (listName == "myTask") myTaskShowCompletedIcon.value = "pi pi-eye-slash";
  }
};

const myTaskSortOption = ref(1);
const myTaskShowCompleted = ref(false);
const myTaskShowCompletedIcon = ref("");
setShowCompletedIcon(false, "myTask");

const toggleMyTaskShowCompleted = () => {
  myTaskShowCompleted.value = !myTaskShowCompleted.value;
  setShowCompletedIcon(myTaskShowCompleted.value, "myTask");
};

// if (getEventError) console.error(getEventError);
// else
console.log(projectMember);

if (Array.isArray(projectMember)) {
  userOptions = projectMember.map((user) => ({
    label: user.name,
    value: user.id,
  }));
} else {
  userOptions = {
    label: projectMember.name,
    value: projectMember.id,
  };
}

console.log("useroption", userOptions);
groupedUsers.value.push({
  label: "All Users",
  items: userOptions,
});
console.log("groupedUsers", groupedUsers);
console.log(selectedUsers);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const year = date.getFullYear();
  const hours = date.toLocaleString("default", { hour: "2-digit" });
  const minutes = date.toLocaleString("default", { minutes: "2-digit" });
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${minutes} ${ampm}`;
};

watchEffect(() => {
  if (!useSupabaseUser().value) {
    navigateTo("/login");
  }
  valueArr.value = [];
  if (selectedUsers.value.length !== 0) {
    for (const user of selectedUsers.value) {
      valueArr.value.push(user.value);
    }

    console.log(valueArr.value, typeof valueArr.value);
  }
});

async function addAnnouncement() {
  console.log(valueArr.value);
  const { data: addAnnouncementRes } = await useFetch(
    "/api/insert_announcement",
    {
      method: "POST",
      body: {
        name: title.value,
        description: description.value,
        project_id: projectid,
        creator_id: table[0].user_id,
        creation_timestamp: new Date(),
        receiver_ids: valueArr.value,
      },
      headers: { "cache-control": "no-cache" },
    }
  );

  if (addAnnouncementRes.value.success) {
    toast.add({
      severity: "success",
      summary: "Hurray!",
      detail: "Profile Updated Successfully",
      life: 50000,
    });
  }

  // let payload = {
  //   name: title.value,
  //   description: description.value,
  //   project_id: projectid,
  //   creator_id: table[0].user_id,
  //   creation_timestamp: new Date(),
  //   receiver_ids: valueArr.value,
  // };
  // console.log(payload);
  // //TODO:add API to insert announcement
  // try {
  //   const { data, error } = await supabase.from("announcement").insert(payload);

  //   toast.add({
  //     severity: "success",
  //     summary: "Hurray!",
  //     detail: "Profile Updated Successfully",
  //     life: 50000,
  //   });

  //   console.log(data);
  // } catch (error) {
  //   console.log(error);
  // }
}

function closeAnnouncementModal() {
  isOpenAnnouncementModal.value = false;
}

function openAnnouncementModal() {
  isOpenAnnouncementModal.value = true;
}

const logout = async () => {
  await auth.signOut();
  dstore.logout();
};

definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style lang="css" scoped>
.show-completed-button {
  font-size: 0.75rem;
  border: none;
}

.no-shadow {
  box-shadow: none;
}

.show-completed-cont {
  display: flex;
  align-items: center;
  justify-content: center;
}

h5 {
  font-weight: 700;
  font-size: 0.938rem;
}

.mainpage-card {
  filter: drop-shadow(4px 6px 4px rgba(39, 35, 67, 0.25));
  border-radius: 30px;
}

.footnote-2 {
  font-weight: 700;
  font-size: 12px;
  /* line-height: 15px; */
}

.footnote {
  font-weight: 400;
  font-size: 12px;
}

.form-modal {
  min-width: 500px;
  border-radius: 8px;
}
</style>
