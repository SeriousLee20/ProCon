<template>
  <Ptoast />
  <div>
    <div class="flex align-items-center justify-content-center mt-8 mb-2">
      <Avatar />
    </div>

    <div class="flex justify-content-center">
      <Pfileupload
        mode="basic"
        name="profile[]"
        url="/api/upload"
        accept="image/*"
        :maxFileSize="3000000"
        @upload="uploadProfilePhoto"
        :auto="true"
        chooseLabel="Browse"
        style="max-height: 1rem"
        :pt="{chooseButton: {class:'text-xs bg-white border-none text-primary-700 hover:text-primary-400'}}"
      />
    </div>
  </div>
  <div
    class="flex flex-column gap-5 align-items-center justify-content-center mt-3"
    style="font-family: sans-serif"
  >
    <div class="flex mb-2">
      <div class="text-gray-300">User ID:</div>
      <div class="text-sm px-1 text-gray-300">{{ userId }}</div>
      <div
        class="pi pi-copy text-gray-500 cursor-pointer"
        @click="copy(userId)"
      ></div>
      <div v-if="copied" class="text-primary text-sm pl-1">Copied!</div>
    </div>
    <div>
      <span class="p-float-label">
        <Pinputtext id="name" v-model="name" type="text" required />
        <label for="name" style="text-align: center">Name</label>
      </span>
    </div>

    <div>
      <span class="p-float-label">
        <Pinputmask
          id="phone"
          v-model="phone"
          placeholder="+60 10-12345678"
          mask="+99 99-99999999?9999"
        />
        <label for="phone">Contact Number</label>
      </span>
    </div>

    <div>
      <span class="p-float-label">
        <Pinputtext id="email" v-model="email" type="email" disabled />
        <label for="email">Email</label>
      </span>
    </div>

    <div>
      <span class="p-float-label">
        <Pcalendar id="starttime" v-model="starttime" timeOnly />
        <label for="starttime">Start Working Time (24H System)</label>
      </span>
    </div>

    <div>
      <span class="p-float-label">
        <Pcalendar id="endtime" v-model="endtime" timeOnly />
        <label for="endtime">End Working Time (24H System)</label>
      </span>
    </div>
    <div>
      <Pbutton :loading="loading" @click="updateProfile" label="Save" text/>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "primevue/usetoast";
import { useClipboard, usePermission } from "@vueuse/core";
// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://xlurkqcyxhrbxxtnrcdk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdXJrcWN5eGhyYnh4dG5yY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY1NTcyNTEsImV4cCI6MjAwMjEzMzI1MX0.AZESK8885YEqTl197Mkm3cn-UGRcQRnCjguiXeQi6Pc"
);

const toast = useToast();
const dstore = useDataStore();
const loading = ref(false);
const user = dstore.getUser;
const userId = user.id;
var name = ref(user.name);
var email = ref(user.email);
var phone = ref(user.contact_number);
var starttime = ref(new Date(user.start_working_hour));
var endtime = ref(new Date(user.end_working_hour));
const { text, copy, copied, isSupported } = useClipboard();

console.log("profile ori user", user);

const updateProfile = async () => {
  loading.value = true;

  var startTime = starttime.value;
  var endTime = endtime.value;
  console.log(
    "startend time",
    starttime.value,
    endtime.value,
    startTime,
    endTime
  );

  const newProfile = {
    name: name.value ? name.value : user.name,
    email: email.value ? email.value : user.email,
    contact_number: phone.value ? phone.value : user.contact_number,
    start_working_hour: starttime.value,
    end_working_hour: endtime.value,
    avatar_url: "",
  };

  const { data: updateUserRes } = await useFetch("/api/update_user", {
    method: "POST",
    body: newProfile,
    headers: { "cache-control": "no-cache" },
  });

  console.log("updateuserres", updateUserRes.value, newProfile);
  if (updateUserRes.value.success) {
    dstore.createUser(updateUserRes.value.response);

    loading.value = false;
    toast.add({
      severity: "success",
      summary: "Hurray!",
      detail: "Profile Updated Successfully",
      life: 5000,
    });
  }
  // dstore.createUser(newProfile);
};

dstore.setSelectedProject(null);
dstore.setCurrentPage("Profile");
definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style lang="scss" scoped></style>
