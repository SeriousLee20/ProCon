<template>
  <form
    @submit="addAnnouncement()"
    v-if="isOpenAnnouncementModal"
    class="fixed top-0 left-0 w-screen h-screen disabled-div"
    style="
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <div
      class="bg-white"
      style="
        min-width: 500px;
        font-family: sans-serif;
        border-radius: 8px;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 40px;
        padding-top: 24px;
        padding-bottom: 24px;
        padding-left: 32px;
        padding-right: 32px;
      "
    >
      <div style="padding-top: 20px; padding-bottom: 20px">
        Add Announcement
      </div>
      <span class="p-float-label">
        <Pinputtext id="title" v-model="title" type="text" required />
        <label for="title" style="text-align: center">Title</label>
      </span>
      <span class="p-float-label">
        <Ptextarea
          id="description"
          v-model="description"
          type="text"
          required
        />
        <label for="description" style="text-align: center">Description</label>
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
      <div style="display: flex; gap: 10px; align-items: center">
        <Pbutton type="submit">Add</Pbutton>
        <Pbutton @click="closeAnnouncementAnnouncementModal()">Close</Pbutton>
      </div>
    </div>
  </form>

  <div>
    <div
      style="
        display: grid;
        height: 100%;
        /* grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 2rem; */
        padding: 20px;
      "
      class="h-screen grid"
      class="h-screen grid"
    >
      <div class="col-8">
        <div>Completed</div>

        <!-- <div
          style="
            display: grid;
            height: 100%;
            grid-template-rows: repeat(2, minmax(0, 1fr));
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-column: span 2 / span 2;
            gap: 1.25rem;
            background-color: #4a9292;
          "
        >
          <div style="background-color: blue"></div>

          <div style="background-color: coral"></div>
          <div style="background-color: blue"></div>

          <div style="background-color: coral"></div> -->

        <!-- </div> -->
      </div>

      <div
        style="
          display: grid;
          height: 100%;
          /* /* grid-template-rows: repeat(2, minmax(0, 1fr)); */ */
          /* /* grid-row: span 1 / span 1; */
          /* grid-column-start: 3; */ */
          /* grid-column-start: 3; */
          gap: 1.25rem;
        "
        class="col-4"
        class="col-4"
      >
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          "
        >
          <div
            style="
              border: 5px solid #bae8e8;
              filter: drop-shadow(4px 6px 4px rgba(39, 35, 67, 0.25));
              border-radius: 30px;
              width: 100%;
              background-color: white;
            "
          >
            <div>
              <div class="show-completed-cont">
                <Ptogglebutton
                  v-model="showMyTaskCompleted"
                  onLabel="Completed"
                  offLabel="Completed"
                  onIcon="pi pi-eye"
                  offIcon="pi pi-eye-slash"
                  class="show-completed-button"
                  text
                ></Ptogglebutton>
              </div>
              <div>
                <h5
                  style="
                    font-family: 'Montserrat';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 15px;
                    text-align: center;
                  "
                >
                  My Tasks
                </h5>
              </div>

              <div>
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    justify-content: end;
                    align-self: center;
                  "
                >
                  <Pdropdown />
                </div>
              </div>
            </div>
            <ClientOnly>
              <div v-if="filteredAnnouncements.length > 0">
                <div
                  style="
                    padding-left: 8px;
                    padding-right: 8px;
                    padding-top: 12px;
                    padding-bottom: 12px;
                    overflow-y: scroll;
                    height: 200px;
                  "
                >
                  <div
                    v-for="announcement in filteredAnnouncements"
                    :key="announcement.id"
                  >
                    <div
                      style="
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      "
                    >
                      <div
                        style="display: flex; gap: 12px; align-items: center"
                      >
                        <p
                          style="
                            font-family: 'Montserrat';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 12px;
                            line-height: 15px;
                            display: flex;
                            align-items: center;
                          "
                        >
                          {{ announcement.name ?? "" }}
                        </p>
                        <i
                          class="pi pi-info-circle"
                          v-tooltip.top="
                            announcement.description ??
                            'No description provided'
                          "
                          style="font-size: 1rem; color: #4a9292"
                        ></i>
                      </div>

                      <p
                        style="
                          font-family: 'Montserrat';
                          font-style: normal;
                          font-weight: 400;
                          font-size: 12px;
                          line-height: 15px;
                          display: flex;
                          align-items: center;
                        "
                      >
                        {{ formatDate(announcement.creation_timestamp) ?? "" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  filteredAnnouncements.length === 0 || !filteredAnnouncements
                "
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 200px;
                "
              >
                <p
                  style="
                    font-family: 'Montserrat';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 15px;
                    display: flex;
                    align-items: center;
                  "
                >
                  No Tasks!
                </p>
              </div>
            </ClientOnly>
          </div>
        </div>

        <!-- announcement -->
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          "
        >
          <div
            style="
              border: 5px solid #bae8e8;
              filter: drop-shadow(4px 6px 4px rgba(39, 35, 67, 0.25));
              border-radius: 30px;
              width: 100%;
              background-color: white;
            "
          >
            <div>
              <div style="grid-column: span 1 / span 1"></div>
              <div style="grid-column: span 1 / span 1">
                <h5
                  style="
                    font-family: 'Montserrat';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 15px;
                    text-align: center;
                  "
                >
                  Announcements
                </h5>
              </div>

              <div style="height: 100%; padding: 15px">
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    justify-content: end;
                    align-self: center;
                  "
                >
                  <Pbutton
                    v-if="isAdmin"
                    @click="openAnnouncementModal()"
                    icon="pi pi-plus"
                    rounded
                    outlined
                    aria-label="Filter"
                  />
                </div>
              </div>
            </div>
            <ClientOnly>
              <div v-if="filteredAnnouncements.length > 0">
                <div
                  style="
                    padding-left: 8px;
                    padding-right: 8px;
                    padding-top: 12px;
                    padding-bottom: 12px;
                    overflow-y: scroll;
                    height: 200px;
                  "
                >
                  <div
                    v-for="announcement in filteredAnnouncements"
                    :key="announcement.id"
                  >
                    <div
                      style="
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      "
                    >
                      <div
                        style="display: flex; gap: 12px; align-items: center"
                      >
                        <p
                          style="
                            font-family: 'Montserrat';
                            font-style: normal;
                            font-weight: 700;
                            font-size: 12px;
                            line-height: 15px;
                            display: flex;
                            align-items: center;
                          "
                        >
                          {{ announcement.name ?? "" }}
                        </p>
                        <i
                          class="pi pi-info-circle"
                          v-tooltip.top="
                            announcement.description ??
                            'No description provided'
                          "
                          style="font-size: 1rem; color: #4a9292"
                        ></i>
                      </div>

                      <p
                        style="
                          font-family: 'Montserrat';
                          font-style: normal;
                          font-weight: 400;
                          font-size: 12px;
                          line-height: 15px;
                          display: flex;
                          align-items: center;
                        "
                      >
                        {{ formatDate(announcement.creation_timestamp) ?? "" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="announcements.length === 0 || !announcements"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 200px;
                "
              >
                <p
                  style="
                    font-family: 'Montserrat';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 15px;
                    display: flex;
                    align-items: center;
                  "
                >
                  No Announcements!
                </p>
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

const { eventid } = useRoute().params;
const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
const { data: userData } = await useFetch("/api/get_full_data");
const table = userData.value;
const toast = useToast();
dstore.setSelectedProject(projectid);
dstore.setCurrentPage("");

const showMyTaskCompleted = ref(true);

const isOpenAnnouncementModal = ref(false);
const title = ref(null);
const description = ref(null);
const selectedUsers = ref([]);
const valueArr = ref([]);

console.log("data from db-userid", table[0].user_id);
console.log("current eventid", eventid);

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://xlurkqcyxhrbxxtnrcdk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdXJrcWN5eGhyYnh4dG5yY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY1NTcyNTEsImV4cCI6MjAwMjEzMzI1MX0.AZESK8885YEqTl197Mkm3cn-UGRcQRnCjguiXeQi6Pc"
);

const { data: announcementData, error: announcementError } = await supabase
  .from("announcement")
  .select();

let { data: eventMember, error: getEventError } = await supabase.rpc(
  "get_users_by_event_id",
  {
    n_event_id: eventid,
  }
);

if (getEventError) console.error(getEventError);
else console.log(eventMember);

announcements = announcementData;
console.log(announcements);

for (let i = 0; i < announcements.length; i++) {
  const announcement = announcements[i];
  if (
    announcement.event_id === eventid &&
    announcement.receiver_ids.includes(table[0].user_id)
  ) {
    filteredAnnouncements.push(announcement);
  }
  console.log("announcement fetching");
  // console.log(announcement);
  // console.log(announcement.event_id);
  // console.log(eventid);
  // console.log(announcement.event_id === eventid);

  // console.log(announcement.receiver_ids);
  // console.log(table[0].user_id);
  // console.log(announcement.receiver_ids.includes(table[0].user_id));
}

// console.log(typeof filteredAnnouncements[0]);
// console.log(typeof eventMember);

if (Array.isArray(eventMember)) {
  userOptions = eventMember.map((user) => ({
    label: user.name,
    value: user.id,
  }));
} else {
  userOptions = {
    label: eventMember.name,
    value: eventMember.id,
  };
}

const groupedUsers = ref([
  {
    label: "All Users",
    items: [userOptions],
  },
]);
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

    console.log(typeof valueArr.value);
  }
});

async function addAnnouncement() {
  let payload = {
    name: title.value,
    description: description.value,
    event_id: eventid,
    creator_id: table[0].user_id,
    creation_timestamp: new Date(),
    receiver_ids: valueArr.value,
  };
  console.log(payload);
  try {
    const { data, error } = await supabase.from("announcement").insert(payload);

    toast.add({
      severity: "success",
      summary: "Hurray!",
      detail: "Profile Updated Successfully",
      life: 50000,
    });

    console.log(data);
    loading = false;
  } catch (error) {
    console.log(error);
  }
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

dstore.setSelectedProject(eventid);
dstore.setCurrentPage("");
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

.show-completed-button.p-togglebutton.p-button:not(.p-disabled).p-focus {
  box-shadow: none;
}
.show-completed-cont {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
