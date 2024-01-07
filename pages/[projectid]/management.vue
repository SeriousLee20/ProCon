<template>
  <Ptoast />
  <Pconfirmpopup />
  <div id="member-table" class="m-2">
    <Pcard class="border-1 border-gray-200 h-25rem">
      <template #title>
        <div class="flex justify-content-between align-items-center">
          <div class="flex flex-column mt-1 gap-1">
            <div>Management Board</div>
            <footer v-if="isAdmin" class="flex align-items-center">
              <div class="text-gray-300">Project ID: {{ projectid }}</div>
              <ClientOnly>
                <span
                  class="pi pi-copy cursor-pointer pl-2"
                  v-if="isSupported"
                  @click="copy(projectid)"
                ></span>
              </ClientOnly>
              <div v-if="copied" class="text-primary">Copied!</div>
            </footer>
            <footer>
              <ClientOnly>
                <div>{{ selectedProject?.description }}</div>
              </ClientOnly>
            </footer>
          </div>
          <div v-if="isAdmin" class="flex gap-1">
            <div>
              <Pbutton
                type="button"
                icon="pi pi-cog"
                @click="toggle"
                aria-label="edit_project"
                aria-haspopup="true"
                aria-controls="edit-board"
                text
              />
              <Pmenu
                ref="boardMenu"
                id="edit-board"
                :model="editBoardMenu"
                :popup="true"
              ></Pmenu>
            </div>
            <div>
              <Pbutton
                class="font-bold"
                type="button"
                icon="pi pi-question-circle"
                severity="warning"
                @click="toggleGuide"
                text
              />
              <Poverlay-panel
                ref="guidePanel"
                appendTo="body"
                style="width: 36rem; height: 40rem"
                :showCloseIcon="true"
              >
                <Pcarousel
                  :value="steps"
                  :numVisible="1"
                  :numScroll="1"
                  circular
                >
                  <template #item="slotProps">
                    <div
                      class="border-1 surface-border border-round m-2 text-center py-5 px-3"
                    >
                      <div class="mb-3">
                        <nuxt-img
                          :src="`/${slotProps.data.image}`"
                          :alt="slotProps.data.name"
                          class="shadow-2"
                          :width="slotProps.data.width"
                          :height="slotProps.data.height"
                        />
                      </div>
                      <div>
                        <h4 class="mb-1">{{ slotProps.data.name }}</h4>
                        <h6 class="mt-0 mb-3 text-left">
                          {{ slotProps.data.description }}
                        </h6>
                      </div>
                    </div>
                  </template>
                </Pcarousel>
              </Poverlay-panel>
            </div>
            <div>
              <Pbutton
                v-if="isCreator"
                type="button"
                icon="pi pi-trash"
                @click="deleteProject"
                severity="danger"
                text
                v-tooltip.bottom="{
                  value: 'Dispose Project',
                  pt: { text: 'bg-red-500 text-xs font-medium text-center' },
                }"
              />
            </div>
            <Pdialog
              v-model:visible="deleteProjectDialog"
              :style="{ width: '28.5rem' }"
              header="Confirm Dispose Project"
              :modal="true"
              class="p-fluid"
            >
              <div>
                <div class="text-md mb-3">
                  Disposing project will remove all information of this project
                  from the system.
                </div>
                <div class="text-md font-bold text-red-500">
                  You cannot undo this action.
                </div>
              </div>
              <template #footer>
                <div class="w-full flex justify-content-end">
                  <div class="w-8">
                    <Pbutton
                      label="Cancel"
                      icon="pi pi-times"
                      text
                      @click="deleteProjectDialog = false"
                    />
                    <Pbutton
                      label="Confirm"
                      icon="pi pi-check"
                      severity="danger"
                      text
                      @click="confirmDeleteProject"
                    />
                  </div>
                </div>
              </template>
            </Pdialog>
          </div>
          <div v-if="!isCreator">
            <Pbutton
              icon="pi pi-minus-circle"
              severity="danger"
              text
              v-tooltip.bottom="{
                  value: 'Quit Project',
                  pt: { text: 'bg-red-500 text-xs font-medium text-center' },
                }"
                @click="quitProject"
            />
            <Pdialog
              v-model:visible="quitProjectDialog"
              :style="{ width: '28.5rem' }"
              header="Confirm Quit Project"
              :modal="true"
              class="p-fluid"
            >
              <div>
                <div class="text-md mb-3">
                  You will no longer see any information about this project if you quit.
                </div>
                <div class="text-md font-bold text-red-500">
                  Please think again.
                </div>
              </div>
              <template #footer>
                <div class="w-full flex justify-content-end">
                  <div class="w-8">
                    <Pbutton
                      label="Cancel"
                      icon="pi pi-times"
                      text
                      @click="quitProjectDialog = false"
                    />
                    <Pbutton
                      label="Confirm"
                      icon="pi pi-check"
                      severity="danger"
                      text
                      @click="confirmQuitProject"
                    />
                  </div>
                </div>
              </template>
            </Pdialog>
          </div>
        </div>
      </template>
      <template #content>
        <Pdatatable
          :value="board"
          rowGroupMode="rowspan"
          groupRowsBy="user_department"
          sortMode="single"
          sortField="user_department"
          scrollHeight="23rem"
          scrollable
          size="small"
        >
          <Pcolumn
            field="user_department"
            header="Department"
            width="10%"
          ></Pcolumn>
          <Pcolumn
            field="username"
            header="Name"
            width="25%"
            sortable
          ></Pcolumn>
          <Pcolumn
            field="position"
            header="Position"
            width="10%"
            sortable
          ></Pcolumn>
          <Pcolumn
            field="user_role"
            header="Role"
            width="10%"
            sortable
          ></Pcolumn>
          <Pcolumn
            field="user_id"
            header="ID"
            width="10%"
            :pt="{ column: { style: 'width:10rem' } }"
          ></Pcolumn>
          <Pcolumn width="10%" header="Edit/Delete Member">
            <template #body="slotProps">
              <Pbutton
                icon="pi pi-pencil"
                outlined
                rounded
                severity="warn"
                size="small"
                @click="editMember(slotProps.data)"
              />
              <Pbutton
                v-if="disableDeleteMember(slotProps.data)"
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                size="small"
                @click="deleteMember($event, slotProps.data)"
                class="ml-2"
              />
            </template>
          </Pcolumn>
          <template #groupheader="slotProps">
            <div>
              <div class="font-bold">{{ slotProps.data.user_department }}</div>
            </div>
          </template>
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
              v-model="member.department_id"
              :options="departments"
              optionLabel="user_department"
              optionValue="department_id"
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
          <div class="footer2">Press ENTER to separate items.</div>
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
          <div class="footer2">Press ENTER to separate items.</div>
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
          <div class="footer2">Press ENTER to separate items.</div>
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
        <Pdialog
          v-model:visible="editProjInfoDialog"
          :style="{ width: '33.3rem' }"
          header="Update Project Information"
          :modal="true"
          class="p-fluid"
        >
          <div class="flex flex-column gap-3">
            <div class="w-full">
              <div class="flex justify-content-between">
                <label for="project-name">Project Name</label>
                <small
                  v-if="!selectedProject.name"
                  id="invalid-proj-name"
                  class="text-red-500"
                  >*Required</small
                >
              </div>
              <Pinputtext
                id="project-name"
                class="w-full"
                :class="{ 'p-invalid': !projectName }"
                v-model="projectName"
                type="text"
                required
                aria-labelledby="invalid-proj-name"
              />
            </div>
            <div>
              <label for="project-desc">Description</label>
              <Ptextarea
                id="project-desc"
                v-model="projectDescription"
                type="text"
                autoResize
                rows="5"
                cols="30"
              />
            </div>
            <label for="telegram-id">Telegram Announcement Chat ID</label>
            <Pinputtext
              id="telegram-id"
              class="w-full"
              v-model="telegramId"
              type="text"
            />
          </div>
          <template #footer>
            <div class="w-full text-right pt-3">
              <Pbutton
                label="Save"
                icon="pi pi-check"
                severity="success"
                text
                @click="updateProjInfo"
              />
              <Pbutton
                label="Cancel"
                icon="pi pi-times"
                text
                @click="closeProjInfoDialog"
              />
            </div>
          </template>
        </Pdialog>
      </template>
    </Pcard>

    <Pcard class="border-1 border-gray-200 mt-3 h-21rem">
      <template #title>
        <div class="flex align-items-center mt-1">
          <div>Resource Links</div>
        </div>
      </template>
      <template #content>
        <Pdatatable
          v-model:editingRows="editingResources"
          :value="resources"
          dataKey="department_id"
          size="small"
          scrollHeight="23rem"
          editMode="row"
          @row-edit-save="saveResourceUpdate"
          :pt="{
            table: { style: 'min-width: 50rem' },
            column: {
              bodycell: ({ state }) => ({
                style:
                  state['d_editing'] &&
                  'padding-top: 0.6rem; padding-bottom: 0.6rem',
              }),
            },
          }"
        >
          <Pcolumn
            field="user_department"
            header="Department"
            style="width: 50%"
          >
            <template #editor="{ data, field }">
              <Pinputtext
                v-model="data[field]"
                class="w-full"
                :pt="{ root: { style: 'border:none; opacity:1; padding:0;' } }"
                disabled
              />
            </template>
          </Pcolumn>

          <Pcolumn field="resource" header="Link" style="width: 40%">
            <template #body="{ data, field }">
              <a
                :href="data.resource"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Pbutton
                  :label="data.resource ? 'Click to Open' : 'Please Add Link'"
                  :href="data.resource"
                  link
                  :disabled="data.resource == '' || data.resource == null"
                ></Pbutton>
              </a>
            </template>
            <template #editor="{ data, field }">
              <Pinputtext v-model="data[field]" class="w-full" />
            </template>
          </Pcolumn>
          <Pcolumn
            :rowEditor="true"
            style="width: 10%; min-width: 8rem"
            bodyStyle="text-align:center"
            header="Edit & Save"
          ></Pcolumn>
        </Pdatatable>
      </template>
    </Pcard>
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useClipboard, usePermission } from "@vueuse/core";

const { $emit } = useNuxtApp();
const dstore = useDataStore();
const toast = useToast();
const confirm = useConfirm();
const { projectid } = useRoute().params;
const { text, copy, copied, isSupported } = useClipboard();

dstore.setManagementBoardByProject(projectid);
const userId = dstore.getUserId;
const guidePanel = ref(false);
const board = ref();
const positions = ref([]);
const departments = ref();
const resources = ref();
const roles = ref(["Admin", "Member"]);
const member = ref({});
const selectedProject = ref(dstore.getSelectedProject);
const projectName = ref(selectedProject.value?.name);
const projectDescription = ref(selectedProject.value?.description);
const telegramId = ref(selectedProject.value?.telegram_id);
const isAdmin = ref(selectedProject.value?.role == "Admin");
const boardDialog = ref(false);
const editProjInfoDialog = ref(false);
const departmentDialog = ref(false);
const positionDialog = ref(false);
const addMemberDialog = ref(false);
const deleteProjectDialog = ref(false);
const quitProjectDialog = ref(false);
const editingResources = ref([]);
const disableRole = ref(false);
const boardMenu = ref();
const newDepartment = ref();
const newPosition = ref();
const newMember = ref();
const newResource = ref();
const isCreator = ref(selectedProject.value?.creator_id == dstore.getUserId);
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
  {
    label: "Update Project Information",
    command: () => (editProjInfoDialog.value = true),
  },
]);

console.log("manage project-projectid", projectid);

const toggle = (event) => {
  boardMenu.value.toggle(event);
};

const toggleGuide = (event) => {
  guidePanel.value.toggle(event);
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

board.value = projectMemberList.value.response;

if (boardComponent.value.response)
  departments.value = boardComponent.value.response[0]?.departments;
positions.value = boardComponent.value.response[0]?.positions;
resources.value = boardComponent.value.response[0]?.departments;

console.log("projectmemberlist", projectMemberList.value.response);
console.log("board value", board.value);
console.log("boardcomponent", boardComponent);
console.log("department, position", departments.value, positions.value);

const sendNotification = async (action, title, content, target) => {
  console.log(action);

  const { data: notificationRes } = await useFetch("/api/insert_notification", {
    method: "POST",
    body: {
      title: title,
      content: content,
      target: target,
      project_id: projectid,
      telegram_chat_id: selectedProject.value.telegram_id,
    },
    headers: { "cache-control": "no-cache" },
  });

  if (notificationRes.value.success) {
    console.log("refresh noti", notificationRes.value.response);
    // emit("refresh-notification", announcementNotificationRes.value.response);
    $emit("refresh-notification", notificationRes.value.response);
    return true;
  }
};

const deleteProject = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: "Delete this project?",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      deleteProjectDialog.value = true;
    },
    reject: () => {},
  });
};

const confirmDeleteProject = async () => {
  const { data: deleteProjectRes } = await useFetch("/api/delete_project", {
    method: "POST",
    body: {
      project_id: projectid,
    },
    headers: { "cache-control": "no-cache" },
  });
  console.log("deleteproject", deleteProjectRes);

  if (deleteProjectRes.value?.success) {
    board.value = null;
    console.log("deletedpt", board.value);
    $emit("switch-page", {
      routeName: `/overview`,
      pageName: "Overview",
    });
  }
};

const quitProject = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: "Quit this project?",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      quitProjectDialog.value = true;
    },
    reject: () => {},
  });
};

const confirmQuitProject = async () => {
  const { data: quitProjectRes } = await useFetch("/api/quit_project", {
    method: "POST",
    body: {
      project_id: projectid,
      user_id: userId
    },
    headers: { "cache-control": "no-cache" },
  });
  console.log("quitprojres", quitProjectRes);

  if (quitProjectRes.value?.success) {
    board.value = null;
    console.log("quitproj", board.value);
    $emit("switch-page", {
      routeName: `/overview`,
      pageName: "Overview",
    });
  }
};

const saveResourceUpdate = async (event) => {
  let { newData, index } = event;
  resources.value[index] = newData;
  console.log("new resource", newData, departments.value);

  const { data: updateResourceRes } = await useFetch(
    "/api/update_dpt_resource",
    {
      method: "POST",
      body: {
        project_id: selectedProject.value.id,
        resource: newData.resource,
        department_id: newData.department_id,
      },
      headers: { "cache-control": "no-cache" },
    }
  );

  console.log("updateresourceres", updateResourceRes.value);
};

const updateProjInfo = async () => {
  console.log("udpate proj info", selectedProject.value);
  if (projectName.value) {
    // TODO: api update project info
    let updatedData = {
      project_id: selectedProject.value.id,
      project_name: projectName.value,
      description: projectDescription.value,
      telegram_chat_id: telegramId.value,
    };
    const { data: updateProjRes } = await useFetch("/api/update_project", {
      method: "POST",
      body: updatedData,
      headers: { "cache-control": "no-cache" },
    });

    console.log("updateproject", updateProjRes.value);
    if (updateProjRes.value?.success) {
      editProjInfoDialog.value = false;
      let updatedProjectList = updateProjRes.value.response[0].user_projects;
      selectedProject.value = dstore.updateProjectList(updatedProjectList);
      $emit("refresh-project-list");
    }
  }
};

const closeProjInfoDialog = () => {
  editProjInfoDialog.value = false;
};

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
  udpatedMember.user_department = departments.value?.filter((dpt) => {
    return dpt.department_id == udpatedMember.department_id;
  })[0]?.user_department;

  const updatedData = {
    project_id: projectid,
    user_id: udpatedMember.user_id,
    role: udpatedMember.user_role ? udpatedMember.user_role : "",
    department: udpatedMember.user_department
      ? udpatedMember.user_department
      : "",
    position: udpatedMember.user_position ? udpatedMember.user_position : "",
    department_id: udpatedMember.department_id,
  };
  const { data: mapMemberRes } = await useFetch(
    "/api/update_project_user_map",
    {
      method: "POST",
      body: updatedData,
      headers: { "cache-control": "no-cache" },
    }
  );

  if (mapMemberRes.value.success) {
    // let editedMember = board.value.findIndex((member) => {
    //   return member.user_id == udpatedMember.user_id;
    // });
    // console.log("edited member", editedMember, udpatedMember);
    // board.value[editedMember] = udpatedMember;
    board.value = mapMemberRes.value.response;
    console.log("updated board", board.value);
  }
};

const deleteMember = (event, clickedMember) => {
  console.log("dlt member", clickedMember.use_id);
  confirm.require({
    target: event.currentTarget,
    message: "Delete this member?",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      // updateDbDepartment();
      console.log("dlt member", board.value);

      const { data: deleteMemberRes } = await useFetch("/api/delete_member", {
        method: "POST",
        body: { user_id: clickedMember.user_id, project_id: projectid },
        headers: { "cache-control": "no-cache" },
      });
      console.log(deleteMemberRes.value);

      if (deleteMemberRes.value?.success) {
        board.value.splice(
          board.value.findIndex(
            (member) => member.user_id == clickedMember.user_id
          ),
          1
        );
        sendNotification(
          "delete_member",
          `${dstore.selectedProject.name}: Removed From Project`,
          `You are removed from ${selectedProject.value?.name}`,
          [clickedMember.user_id]
        );
      }
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
  let addedMemberId = [];
  let userName = "";
  let invalidUser = [];
  let addMemberResTemp = board.value;

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

      const validateUser = getUserRes.value.response.find(
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

          const { data: addMemberRes } = await useFetch(
            "/api/map_user_project",
            {
              method: "POST",
              body: newMemberData,
              headers: { "cache-control": "no-cache" },
            }
          );

          if (addMemberRes.value?.success) {
            hasNewMember = true;
            addedMember.push(userName);
            addedMemberId.push(newMb);
            addMemberResTemp = addMemberRes.value?.response;
          }
          console.log("addmemberres", addMemberRes.value);
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
        life: 5000,
      });
    }
    if (hasNewMember) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: `Added ${addedMember.join(", ")} to the project.`,
        life: 5000,
      });

      board.value = addMemberResTemp;

      sendNotification(
        "add_member",
        `Added to New Project`,
        `You are added to ${selectedProject.value?.name}`,
        addedMemberId
      );
    }
    if (invalidUser.length > 0) {
      toast.add({
        severity: "warn",
        summary: "User not found.",
        detail: `${invalidUser.join(
          ", "
        )} cannot be found. Please check the id again.`,
        life: 5000,
      });
    }

    newMember.value = null;
  }
};

const updateDbMapMember = async (updatedData) => {
  const { data: mapResponse } = await useFetch("/api/update_project_user_map", {
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
  if (newDepartment.value?.length > 0) {
    addedDepartment = newDepartment.value.filter((newDep) => {
      return !departments.value.some(
        (oldDep) => oldDep.user_department == newDep
      );
    });

    existedDepartment = newDepartment.value.filter((newDep) => {
      return departments.value.some(
        (oldDep) => oldDep.user_department == newDep
      );
    });

    if (existedDepartment.length > 0) {
      toast.add({
        severity: "warn",
        summary: "Redundant Department!",
        detail: `${existedDepartment.join(", ")} already existed.`,
        life: 5000,
      });
    }
    if (addedDepartment.length > 0) {
      const { data: insertDepartmentRes } = await useFetch(
        "/api/insert_department",
        {
          method: "POST",
          body: { project_id: projectid, departments: addedDepartment },
          headers: { "cache-control": "no-cache" },
        }
      );
      console.log("updatedepartment", insertDepartmentRes);

      if (insertDepartmentRes.value.success) {
        departments.value = insertDepartmentRes.value.response[0].departments;
        toast.add({
          severity: "success",
          summary: "Success",
          detail: `Added ${addedDepartment.join(", ")} to the project.`,
          life: 5000,
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
    message: "Delete this department?",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: async () => {
      console.log(
        "dept index",
        departments.value.findIndex(
          (dept) => dept.user_department == department.user_department
        )
      );

      const { data: deleteDepartmentRes } = await useFetch(
        "/api/delete_department",
        {
          method: "POST",
          body: {
            project_id: projectid,
            department: department.user_department,
            department_id: department.department_id,
          },
          headers: { "cache-control": "no-cache" },
        }
      );
      console.log("updatedepartment", deleteDepartmentRes);
      console.log("dlt dept", departments.value, deleteDepartmentRes);

      if (deleteDepartmentRes.value?.success) {
        board.value = deleteDepartmentRes.value.response;
        console.log("deletedpt", board.value);

        departments.value.splice(
          departments.value.findIndex(
            (dept) => dept.department_id == department.department_id
          ),
          1
        );
        // const affectedMember = findComponentIndex(
        //   board.value,
        //   "user_department",
        //   department.user_department
        // );

        // affectedMember.forEach(async (index) => {
        //   let memberDetails = board.value[index];
        //   board.value[index].user_department = null;
        //   console.log("memberdetails", memberDetails);
        //   let updatedData = {
        //     project_id: projectid,
        //     department: null,
        //     user_id: memberDetails.user_id,
        //     position: memberDetails.user_position,
        //     role: memberDetails.user_role,
        //   };
        //   const { data: mapResponse } = await useFetch(
        //     "/api/update_project_user_map",
        //     {
        //       method: "POST",
        //       body: updatedData,
        //       headers: { "cache-control": "no-cache" },
        //     }
        //   );
        //   console.log(
        //     "affectedmember department",
        //     affectedMember,
        //     mapResponse.value
        //   );
        // });
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

  console.log(newPosition.value);
  if (newPosition.value?.length > 0) {
    addedPosition = newPosition.value.filter((newPos) => {
      return !positions.value.some((oldPos) => oldPos.user_position == newPos);
    });

    existedPosition = newPosition.value.filter((newPos) => {
      return positions.value.some((oldPos) => oldPos.user_position == newPos);
    });

    if (existedPosition.length > 0) {
      toast.add({
        severity: "warn",
        summary: "Redundant Position.",
        detail: `${existedPosition.join(", ")} already existed.`,
        life: 5000,
      });
    }
    if (addedPosition.length > 0) {
      addedPosition = addedPosition.map((pos) => ({
        user_position: pos,
      }));
      positions.value.push(...addedPosition);
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
          life: 5000,
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
  console.log("dlt pos", event, position);
  confirm.require({
    target: event.currentTarget,
    message: "Delete this position?",
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
            "/api/update_project_user_map",
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

const steps = [
  {
    name: "Step 1",
    description:
      "Create a Telegram group and add all the members into the group and designate their roles properly(set members as admin), note that no members can be added later on and have their roles changed afterwards.",
    image: "1.jpeg",
    width: "150",
    height: "300",
  },
  {
    name: "Step 2",
    description:
      "After the group details has been finalized, go to Telegram search bar and type GetIDs Bot",
    image: "2.jpeg",
    width: "150",
    height: "300",
  },
  {
    name: "Step 3",
    description: "Tap on the top bar that shows the name GetIDs Bot",
    image: "3.jpeg",
    width: "150",
    height: "300",
  },
  {
    name: "Step 4",
    description: "Click Add to Group or Channel",
    image: "4.jpeg",
    width: "150",
    height: "300",
  },
  {
    name: "Step 5",
    description: "After that pick the Procon related channel and Add as Member",
    image: "5.jpeg",
    width: "150",
    height: "300",
  },
  {
    name: "Step 6",
    description:
      "Go back to the group you created and copy the id generated by the bot in the message",
    image: "6.jpeg",
    width: "150",
    height: "300",
  },
  {
    name: "Step 7",
    description: "Go to your project page in Procon and select Management",
    image: "7.jpeg",
    width: "186",
    height: "228",
  },
  {
    name: "Step 8",
    description:
      "Click the settings button in the top right corner and click Update Project Information",
    image: "8.jpeg",
    width: "120",
    height: "200",
  },
  {
    name: "Step 9",
    description:
      "Paste the ID copied into the Telegram Announcement Chat ID field",
    image: "9.jpeg",
    width: "136",
    height: "220",
  },
  {
    name: "Step 10",
    description:
      "Go back to Telegram, search Procon Helper and select the option with @procon_um_bot",
    image: "10.jpeg",
    width: "150",
    height: "300",
  },
  {
    name: "Step 11",
    description:
      "Click to view the details of this bot and add to the group similar to Step 5",
    image: "11.jpeg",
    width: "150",
    height: "300",
  },
  {
    name: "Step 12",
    description:
      "There you have it! Now you have connected the procon bot to your project and it will notify you when new tasks are added!",
    image: "12.jpeg",
    width: "200",
    height: "200",
  },
];

dstore.setSelectedProject(projectid);
dstore.setCurrentPage("Management");
$emit("refresh-project-list");
definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style lang="scss" scoped></style>
