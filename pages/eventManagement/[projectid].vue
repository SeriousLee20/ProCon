<template>
  <Ptoast />
  <Pconfirmpopup />
  <div id="member-table">
    <Pcard>
      <template #title>
        <div class="flex justify-content-between">
          <div>Management Board</div>
          <div>
            <Pbutton
              type="button"
              icon="pi pi-cog"
              @click="toggle"
              aria-label="edit_event"
              aria-haspopup="true"
              aria-controls="edit-board"
            />
            <Pmenu
              ref="boardMenu"
              id="edit-board"
              :model="editBoardMenu"
              :popup="true"
            ></Pmenu>
          </div>
        </div>
      </template>
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
              <Pbutton
                v-if="disableDeleteMember(slotProps.data)"
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="deleteMember($event, slotProps.data)"
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
              optionLabel="user_position"
            />
          </div>
          <div class="field">
            <label for="department">Department</label>
            <Pdropdown
              id="department"
              v-model="member.user_department"
              :options="departments"
              optionLabel="user_department"
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
        <Pdialog
          v-model:visible="addMemberDialog"
          :style="{ width: '28.5rem' }"
          header="Add Member"
          :modal="true"
          class="p-fluid"
        >
          <div class="footer2">
            Please enter the user id, press enter to separate them.
          </div>
          <div class="footer2">Remember to save.</div>
          <Pchips v-model="newMember"></Pchips>

          <div class="flex align-self-end w-8">
            <Pbutton
              label="Cancel"
              icon="pi pi-times"
              severity="danger"
              text
              @click="hideAddMemberDialog"
            />
            <Pbutton label="Save" icon="pi pi-check" text @click="addMember" />
          </div>
        </Pdialog>
        <Pdialog
          v-model:visible="departmentDialog"
          :style="{ width: '28.5rem' }"
          header="Manage Department"
          :modal="true"
          class="p-fluid"
        >
          <div class="footer2">
            Please enter the department name, press enter to separate them.
          </div>
          <div class="footer2">Remember to save.</div>
          <div class="flex flex-column gap-3">
            <Pchips v-model="newDepartment"></Pchips>

            <div class="flex align-self-end w-8">
              <Pbutton
                label="Cancel"
                icon="pi pi-times"
                severity="danger"
                text
                @click="hideDepartmentDialog"
              />
              <Pbutton
                label="Save"
                icon="pi pi-check"
                text
                @click="addDepartment"
              />
            </div>
            <Pdatatable :value="departments">
              <Pcolumn
                field="user_department"
                header="Department"
                style="min-width: 17.563rem"
                sortable
              >
              </Pcolumn>
              <Pcolumn>
                <template #body="slotProps" class="flex justify-content-end">
                  <!-- <Pbutton
                    icon="pi pi-pencil"
                    outlined
                    rounded
                    @click="editDepartment($event, slotProps.data)"
                  /> -->
                  <Pbutton
                    icon="pi pi-trash"
                    outlined
                    rounded
                    severity="danger"
                    @click="deleteDepartment($event, slotProps.data)"
                  />
                </template>
              </Pcolumn>
            </Pdatatable>
          </div>
        </Pdialog>
        <Pdialog
          v-model:visible="positionDialog"
          :style="{ width: '33.3rem' }"
          header="Manage Position"
          :modal="true"
          class="p-fluid"
        >
          <div class="footer2">
            Please enter the positions name, press enter to separate them.
          </div>
          <div class="footer2">Remember to save.</div>
          <div class="flex flex-column gap-3">
            <Pchips v-model="newPosition"></Pchips>

            <div class="flex align-self-end w-8">
              <Pbutton
                label="Cancel"
                icon="pi pi-times"
                severity="danger"
                text
                @click="hidePositionDialog"
              />
              <Pbutton
                label="Save"
                icon="pi pi-check"
                text
                @click="addPosition()"
              />
            </div>
            <Pdatatable :value="positions">
              <Pcolumn
                field="user_position"
                header="Position"
                style="min-width: 17.563rem"
                sortable
              >
              </Pcolumn>
              <Pcolumn>
                <template #body="slotProps" class="flex justify-content-end">
                  <!-- <Pbutton
                    icon="pi pi-pencil"
                    outlined
                    rounded
                    @click="editPosition($event, slotProps.data)"
                  /> -->
                  <Pbutton
                    icon="pi pi-trash"
                    outlined
                    rounded
                    severity="danger"
                    @click="deletePosition($event, slotProps.data)"
                  />
                </template>
              </Pcolumn>
            </Pdatatable>
          </div>
        </Pdialog>
      </template>
    </Pcard>
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const dstore = useDataStore();
const toast = useToast();
const confirm = useConfirm();
const { projectid } = useRoute().params;

const board = ref();
const positions = ref([]);
const departments = ref([]);
const roles = ref(["Admin", "Member"]);
const member = ref({});
const boardDialog = ref(false);
const departmentDialog = ref(false);
const positionDialog = ref(false);
const addMemberDialog = ref(false);
const disableRole = ref(false);
const boardMenu = ref();
const newDepartment = ref();
const newPosition = ref();
const newMember = ref();
const editBoardMenu = ref([
  {
    label: "Add Member",
    command: () => (addMemberDialog.value = true),
  },
  {
    label: "Manage Positions",
    command: () => (positionDialog.value = true),
  },
  {
    label: "Manage Departments",
    command: () => (departmentDialog.value = true),
  },
]);

console.log("manage event-projectid", projectid);

const toggle = (event) => {
  boardMenu.value.toggle(event);
};

const { data: projectMemberList } = await useFetch(
  "/api/get_management_board",
  {
    method: "POST",
    body: { project_id: projectid },
    headers: { "cache-control": "no-cache" },
  }
);

const { data: boardComponent } = await useFetch("/api/get_board_component", {
  method: "POST",
  body: { project_id: projectid },
  headers: { "cache-control": "no-cache" },
});

board.value = projectMemberList.value.data;

if (boardComponent.value.data.departments)
  departments.value.push(...boardComponent.value.data.departments);
if (boardComponent.value.data.positions)
  positions.value.push(...boardComponent.value.data.positions);
console.log("projectmemberlist", projectMemberList.value.data);
console.log("board value", board.value);
console.log("boardcomponent", boardComponent);
console.log("department, position", departments.value, positions.value);

const editMember = (clickedMember) => {
  member.value = { ...clickedMember };
  member.value.user_position = { user_position: clickedMember.user_position };
  member.value.user_department = {
    user_department: clickedMember.user_department,
  };
  boardDialog.value = true;
  console.log("click", member.value, clickedMember);
  disableRole.value =
    dstore.getSelectedProject.creator_id == clickedMember.user_id;
  console.log(dstore.getSelectedProject, clickedMember.user_id);
};

const disableDeleteMember = (memberData) => {
  return dstore.getSelectedProject.creator_id !== memberData.user_id;
};

const hideDialog = () => {
  boardDialog.value = false;
};

const saveMemberDetails = async () => {
  boardDialog.value = false;
  console.log("save member details", member.value);

  let udpatedMember = member.value;

  // data table in manage department and position require field name
  // departments and positions array are object arrays
  // selection from edit member details affect value stored in main board
  udpatedMember.user_position = udpatedMember.user_position.user_position;
  udpatedMember.user_department = udpatedMember.user_department.user_department;

  const updatedData = {
    project_id: projectid,
    user_id: udpatedMember.user_id,
    role: udpatedMember.user_role ? udpatedMember.user_role : "",
    department: udpatedMember.user_department
      ? udpatedMember.user_department
      : "",
    position: udpatedMember.user_position ? udpatedMember.user_position : "",
  };
  const { data: mapMemberRes } = await useFetch("/api/update_event_user_map", {
    method: "POST",
    body: updatedData,
    headers: { "cache-control": "no-cache" },
  });

  if (mapMemberRes.value.success) {
    let editedMember = board.value.findIndex((member) => {
      return member.user_id == udpatedMember.user_id;
    });
    console.log("edited member", editedMember, udpatedMember);
    board.value[editedMember] = udpatedMember;
    console.log("updated board", board.value);
  }
};

const deleteMember = (event, clickedMember) => {
  console.log("dlt member", clickedMember.use_id);
  confirm.require({
    target: event.currentTarget,
    message: "Do you want to delete this member?",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      console.log(
        "member index",
        board.value.findIndex(
          (member) => member.user_id == clickedMember.user_id
        )
      );
      board.value.splice(
        board.value.findIndex(
          (member) => member.user_id == clickedMember.user_id
        ),
        1
      );
      updateDbDepartment();
      console.log("dlt member", board.value);

      const { data: deleteMemberRes } = await useFetch("/api/delete_member", {
        method: "POST",
        body: { user_id: clickedMember.user_id, project_id: projectid },
        headers: { "cache-control": "no-cache" },
      });
      console.log(deleteMemberRes.value);
    },
    reject: () => {},
  });
};
const hideAddMemberDialog = () => {
  addMemberDialog.value = false;
};

const addMember = async () => {
  let hasNewMember = false;
  let existedMember = [];
  let addedMember = [];
  let userName = "";
  let invalidUser = [];

  const { data: getUserRes } = await useFetch("/api/get_user", {
    method: "POST",
    body: { user_id: newMember },
    headers: { "cache-control": "no-cache" },
  });

  console.log(
    "newmember",
    newMember.value,
    newMember.value.length,
    getUserRes.value
  );

  if (newMember && newMember.value.length > 0) {
    newMember.value.forEach(async (newMb) => {
      console.log("curr member", newMb);

      const validateUser = getUserRes.value.data.find(
        (user) => user.id == newMb
      );
      if (validateUser) {
        userName = validateUser.name;

        if (
          !board.value.find((oldMember) => {
            return oldMember.user_id == newMb;
          })
        ) {
          const newMemberData = {
            user_department: null,
            user_id: newMb,
            user_position: "Member",
            user_role: "Member",
            username: userName,
          };

          board.value.push(newMemberData);

          newMemberData["project_id"] = projectid;
          newMemberData["user_id"] = newMb;
          newMemberData["role"] = "Member";

          console.log("newmemberdata", newMemberData);

          const { data: addMemberRes } = await useFetch("/api/map_user_event", {
            method: "POST",
            body: newMemberData,
            headers: { "cache-control": "no-cache" },
          });

          console.log("addmemberres", addMemberRes.value);
          hasNewMember = true;
          addedMember.push(userName);
          console.log("updated board", board.value);
        } else {
          existedMember.push(userName);
        }
      } else {
        invalidUser.push(userName);
      }
    });

    if (existedMember.length > 0) {
      toast.add({
        severity: "warn",
        summary: "Member joined.",
        detail: `${existedMember.join(", ")} already joined this project.`,
        life: 50000,
      });
    }
    if (hasNewMember) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: `Added ${addedMember.join(", ")} to the project.`,
        life: 50000,
      });
    }
    if (invalidUser.length > 0) {
      toast.add({
        severity: "warn",
        summary: "User not found.",
        detail: `${invalidUser.join(
          ", "
        )} cannot be found. Please check the id again.`,
        life: 50000,
      });
    }

    newMember.value = null;
  }
};

const updateDbMapMember = async (updatedData) => {
  const { data: mapResponse } = await useFetch("/api/update_event_user_map", {
    method: "POST",
    body: updatedData,
    headers: { "cache-control": "no-cache" },
  });

  return { mapMemberRes: mapResponse };
};

const hideDepartmentDialog = () => {
  departmentDialog.value = false;
};

const addDepartment = async () => {
  let hasNewDeprtment = false;
  let existedDepartment = [];
  let addedDepartment = [];
  if (newDepartment.value.length > 0) {
    newDepartment.value.forEach((newDept) => {
      console.log("dept exist", newDept);
      if (
        !departments.value.find((oldDept) => oldDept.user_department == newDept)
      ) {
        hasNewDeprtment = true;
        departments.value.push({ user_department: newDept });
        addedDepartment.push(newDept);
      } else {
        existedDepartment.push(newDept);
      }
    });

    if (existedDepartment.length > 0) {
      toast.add({
        severity: "warn",
        summary: "Redundant Department!",
        detail: `${existedDepartment.join(", ")} already existed.`,
        life: 50000,
      });
    }
    if (hasNewDeprtment) {
      const { data: insertDepartmentRes } = await useFetch(
        "/api/insert_department",
        {
          method: "POST",
          body: { project_id: projectid, departments: departments.value },
          headers: { "cache-control": "no-cache" },
        }
      );
      console.log("updatedepartment", insertDepartmentRes);

      if (insertDepartmentRes.value.success) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: `Added ${addedDepartment.join(", ")} to the project.`,
          life: 50000,
        });
      }
    }

    newDepartment.value = null;
    console.log("updated department", departments.value);
  }
};

const editDepartment = (department) => {
  console.log("edit dept", department);
};

const deleteDepartment = (event, department) => {
  console.log("dlt dept", department);
  confirm.require({
    target: event.currentTarget,
    message: "Do you want to delete this department?",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      console.log(
        "dept index",
        departments.value.findIndex(
          (dept) => dept.user_department == department.user_department
        )
      );
      departments.value.splice(
        departments.value.findIndex(
          (dept) => dept.user_department == department.user_department
        ),
        1
      );
      const { data: updateDepartmentRes } = await useFetch(
        "/api/insert_department",
        {
          method: "POST",
          body: { project_id: projectid, departments: departments.value },
          headers: { "cache-control": "no-cache" },
        }
      );
      console.log("updatedepartment", updateDepartmentRes);
      console.log("dlt dept", departments.value, updateDepartmentRes);

      if (updateDepartmentRes.value.success) {
        const affectedMember = findComponentIndex(
          board.value,
          "user_department",
          department.user_department
        );

        affectedMember.forEach(async (index) => {
          let memberDetails = board.value[index];
          board.value[index].user_department = null;
          console.log("memberdetails", memberDetails);
          let updatedData = {
            project_id: projectid,
            department: null,
            user_id: memberDetails.user_id,
            position: memberDetails.user_position,
            role: memberDetails.user_role,
          };
          const { data: mapResponse } = await useFetch(
            "/api/update_event_user_map",
            {
              method: "POST",
              body: updatedData,
              headers: { "cache-control": "no-cache" },
            }
          );
          console.log(
            "affectedmember department",
            affectedMember,
            mapResponse.value
          );
        });
      }
    },
    reject: () => {},
  });
};

const updateDbDepartment = async () => {
  const { data: updateDepartment } = await useFetch("/api/insert_department", {
    method: "POST",
    body: { project_id: projectid, departments: departments.value },
    headers: { "cache-control": "no-cache" },
  });
  console.log("updatedepartment", updateDepartment);

  return { updateDepartmentRes: updateDepartment };
};

const hidePositionDialog = () => {
  positionDialog.value = false;
};

const addPosition = async () => {
  console.log("add position open");
  let hasNewPosition = false;
  let existedPosition = [];
  let addedPosition = [];

  if (newPosition.value.length > 0) {
    console.log(newPosition.value);
    newPosition.value.forEach((newPos) => {
      if (!positions.value.find((oldPos) => oldPos.user_position == newPos)) {
        hasNewPosition = true;
        positions.value.push({ user_position: newPos });
        addedPosition.push(newPos);
      } else {
        existedPosition.push(newPos);
      }
    });

    if (existedPosition.length > 0) {
      toast.add({
        severity: "warn",
        summary: "Redundant Position.",
        detail: `${existedPosition.join(", ")} already existed.`,
        life: 50000,
      });
    }
    if (hasNewPosition) {
      const { data: insertPositionRes } = await useFetch(
        "/api/insert_positions",
        {
          method: "POST",
          body: { project_id: projectid, positions: positions.value },
          headers: { "cache-control": "no-cache" },
        }
      );

      console.log("insertpositionres", insertPositionRes.value);
      if (insertPositionRes.value.success) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: `Added ${addedPosition.join(", ")} to the project.`,
          life: 50000,
        });
      }
    }

    newPosition.value = null;
    console.log("updated position", positions.value);
  }
};

const editPosition = (position) => {
  console.log("clicked position", position);
};

const deletePosition = (event, position) => {
  console.log("dlt pos", position);
  confirm.require({
    target: event.currentTarget,
    message: "Do you want to delete this position?",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      console.log(
        "pos index",
        positions.value.findIndex(
          (pos) => pos.user_position == position.user_position
        )
      );
      positions.value.splice(
        positions.value.findIndex(
          (pos) => pos.user_position == position.user_position
        ),
        1
      );
      const { data: updatePosition } = await useFetch("/api/insert_positions", {
        method: "POST",
        body: { project_id: projectid, positions: positions.value },
        headers: { "cache-control": "no-cache" },
      });
      console.log("updatePosition", updatePosition);

      if (updatePosition.value.success) {
        const affectedMember = findComponentIndex(
          board.value,
          "user_position",
          position.user_position
        );

        affectedMember.forEach(async (index) => {
          let memberDetails = board.value[index];
          board.value[index].user_position = null;
          console.log("memberdetails", memberDetails);
          let updatedData = {
            project_id: projectid,
            department: memberDetails.user_department,
            user_id: memberDetails.user_id,
            position: memberDetails.user_position,
            role: memberDetails.user_role,
          };
          const { data: mapResponse } = await useFetch(
            "/api/update_event_user_map",
            {
              method: "POST",
              body: updatedData,
              headers: { "cache-control": "no-cache" },
            }
          );
          console.log(
            "affectedmember position",
            affectedMember,
            mapResponse.value
          );
        });
      }

      console.log("dlt pos", positions.value);
    },
    reject: () => {},
  });
};

const updateDbPosition = async () => {
  const { data: insertPosition } = await useFetch("/api/insert_positions", {
    method: "POST",
    body: { project_id: projectid, positions: positions.value },
    headers: { "cache-control": "no-cache" },
  });
  console.log("insertPosition", insertPosition);

  return { insertPositionRes: insertPosition };
};

const findComponentIndex = (arr, key, value) => {
  let indices = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] == value) {
      indices.push(i);
    }
  }
  console.log("findindex", indices);
  return indices;
};

dstore.setSelectedProject(projectid);
dstore.setCurrentPage("");
definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style lang="scss" scoped></style>
