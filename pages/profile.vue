<template>
  <Ptoast />
  <div class="flex align-items-center justify-content-center mt-8">
    <Avatar />
  </div>
  <form
    @submit="updateProfile"
    class="flex flex-column gap-5 align-items-center justify-content-center mt-3"
    style="font-family: sans-serif"
  >
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
        <Pinputmask
          id="starttime"
          v-model="starttime"
          type="text"
          placeholder="00:00:00"
          mask="99:99:99"
          required
        />
        <label for="starttime">Start Working Time</label>
      </span>
    </div>

    <div>
      <span class="p-float-label">
        <Pinputmask
          id="endtime"
          v-model="endtime"
          type="text"
          placeholder="23:59:59"
          mask="99:99:99"
          required
        />
        <label for="endtime">End Working Time</label>
      </span>
    </div>
    <div>
      <Pbutton :loading="loading" type="submit" label="Save" />
    </div>
  </form>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "primevue/usetoast";
// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://xlurkqcyxhrbxxtnrcdk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdXJrcWN5eGhyYnh4dG5yY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY1NTcyNTEsImV4cCI6MjAwMjEzMzI1MX0.AZESK8885YEqTl197Mkm3cn-UGRcQRnCjguiXeQi6Pc"
);

const toast = useToast();
const dstore = useDataStore();
const loading = ref(false);
const user = dstore.getUser;
var name = ref(user.name);
var email = ref(user.email);
var phone = ref(user.contact_number);
var starttime = ref(user.start_working_hour);
var endtime = ref(user.end_working_hour);

console.log("profile ori user", user);

const updateProfile = async () => {
  loading.value = true;
  var userId = dstore.getUserId;
  var nname = name.value ? name.value : user.name;
  var nphone = phone.value ? phone.value : user.contact_number;
  var nemail = email.value ? email.value : user.email;
  var startTime = starttime.value ? starttime.value : user.start_working_hour;
  var endTime = endtime.value ? endtime.value : user.end_working_hour;

  const newProfile = {
    id: userId,
    name: nname,
    email: nemail,
    contact_number: nphone,
    start_working_time: startTime,
    end_working_time: endTime,
    avatar_url: "",
  };

  dstore.createUser(newProfile);

  try {
    const { error } = await supabase
      .from("user")
      .update({
        id: userId,
        name: nname,
        email: nemail,
        contact_number: nphone,
        start_working_hour: startTime,
        end_working_hour: endTime,
      })
      .eq("id", userId);

    toast.add({
      severity: "success",
      summary: "Hurray!",
      detail: "Profile Updated Successfully",
      life: 50000,
    });

    console.log(error);
    loading = false;
  } catch (error) {
    console.log(error);
  }
};

dstore.setSelectedProject(null);
dstore.setCurrentPage("Profile");
definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});
</script>

<style lang="scss" scoped></style>
