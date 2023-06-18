<template>
  <div id="member-table">
    <Pcard>
      <template #title>Management Board</template>
      <template #content>
        <Pdatatable :value="board">
          <Pcolumn field="user_id" header="Id"></Pcolumn>
          <Pcolumn field="username" header="Name" sortable></Pcolumn>
          <Pcolumn field="user_position" header="Position" sortable></Pcolumn>
          <Pcolumn
            field="user_department"
            header="Department"
            sortable
          ></Pcolumn>
          <Pcolumn field="user_role" header="Role" sortable></Pcolumn>
          <Pcolumn>
            <template #body="slotProps">
              <Pbutton
                icon="pi pi-pencil"
                outlined
                rounded
                severity="warn"
                @click="editMember(slotProps.data)"
              />
            </template>
          </Pcolumn>
        </Pdatatable>
        <Pdialog
          v-model:visible="boardDialog"
          :style="{ width: '28.5rem' }"
          header="Member Details"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="username">Name</label>
            <Pinputtext
              type="text"
              id="username"
              v-model="member.username"
              disabled
            />
          </div>
          <div class="field">
            <label for="position">Position</label>
            <Pdropdown
              id="position"
              v-model="member.user_position"
              :options="positions"
            />
          </div>
          <div class="field">
            <label for="department">Department</label>
            <Pdropdown
              id="department"
              v-model="member.user_department"
              :options="departments"
            />
          </div>
          <div class="field">
            <label for="role">Role</label>
            <Pdropdown
              id="role"
              v-model="member.user_role"
              :options="roles"
              :disabled="disableRole"
            />
          </div>
          <template #footer>
            <Pbutton
              label="Cancel"
              icon="pi pi-times"
              text
              @click="hideDialog"
            />
            <Pbutton
              label="Save"
              icon="pi pi-check"
              text
              @click="saveMemberDetails"
            />
          </template>
        </Pdialog>
      </template>
    </Pcard>
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
const dstore = useDataStore();
const { eventid } = useRoute().params;
console.log("edit", eventid);
const board = ref();
const positions = ref([]);
const departments = ref([]);
const roles = ref([]);
const member = ref({});
const boardDialog = ref(false);
const disableRole = ref(false);

const { data: projectMemberList } = await useFetch(
  "/api/get_management_board",
  {
    method: "POST",
    body: { project_id: eventid },
    headers: { "cache-control": "no-cache" },
  }
);

board.value = projectMemberList.value.data;
console.log(projectMemberList.value.data);
console.log(board.value);

projectMemberList.value.data.forEach((member) => {
  if (!(member.user_position in positions.value))
    positions.value.push(member.user_position);
  if (!(member.user_department in positions.value))
    departments.value.push(member.user_department);
  if (!(member.user_role in positions.value))
    roles.value.push(member.user_role);
  console.log(positions.value, departments.value, roles.value);
});

const editMember = (clickedMember) => {
  member.value = { ...clickedMember };
  boardDialog.value = true;
  console.log("click", member.value, clickedMember);
  disableRole.value =
    dstore.getSelectedProject.creator_id == clickedMember.user_id;
  console.log(dstore.getSelectedProject, clickedMember.user_id);
};

const hideDialog = () => {
  boardDialog.value = false;
};

const saveMemberDetails = async () => {
  boardDialog.value = false;
  console.log("save", member.value);

  const udpatedMember = member.value;
  const { data: mapResponse } = await useFetch("/api/update_event_user_map", {
    method: "POST",
    body: {
      id: eventid,
      role: udpatedMember.user_role ? udpatedMember.user_role : "",
      department: udpatedMember.user_department
        ? udpatedMember.user_department
        : "",
      position: udpatedMember.user_position ? udpatedMember.user_position : "",
    },
    headers: { "cache-control": "no-cache" },
  });
};
definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style lang="scss" scoped></style>
