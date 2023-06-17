<template>
  <div class="flex align-items-center justify-content-center mt-5">
    <Avatar />
  </div>
  <form
    @submit="updateProfile"
    class="flex flex-column gap-5 align-items-center justify-content-center mt-3"
  >
    <div>
      <span class="p-float-label">
        <Pinputtext id="name" v-model="name" type="text" required />
        <label for="name">Name</label>
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
      <Pbutton type="submit" label="Save" />
    </div>
  </form>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";

definePageMeta({
  layout: "custom",
  middleware: ["auth", "initiate"],
});

const dstore = useDataStore();
dstore.setSelectedProject(null);
dstore.setCurrentPage("Profile");

const user = dstore.getUser;
console.log(user);

var name = ref(user.name);
var email = ref(user.email);
var phone = ref(user.contact_number);
var starttime = ref(user.start_working_hour);
var endtime = ref(user.end_working_hour);

console.log(name, email, phone, starttime, endtime);
var updated = false;
const updateProfile = async () => {
  // alert(JSON.stringify(values, null, 2));
  alert(name.value + email.value);
  console.log(name, email, phone, starttime, endtime);
  var userId = dstore.getUserId;
  var nname = name.value ? name.value : user.name;
  var nphone = phone.value ? phone.value : user.contact_number;
  var nemail = email.value ? email.value : user.email;
  var startTime = starttime.value ? starttime.value : user.start_working_hour;
  var endTime = endtime.value ? endtime.value : user.end_working_hour;

  //   var userId = dstore.getUserId;
  //   var nname = name.value ? name : user.name;
  //   var nphone = phone ? phone : user.contact_number;
  //   var nemail = email ? email : user.email;
  //   var startTime = starttime ? starttime : user.start_working_hour;
  //   var endTime = endtime ? endtime : user.end_working_hour;
  const newProfile = {
    id: userId,
    name: nname,
    email: nemail,
    contact_number: nphone,
    start_working_time: startTime,
    end_working_time: endTime,
    avatar_url: "",
  };

  //   try {
  dstore.createUser(newProfile);
  //   } catch (error) {
  //     alert(error);
  //   }
  console.log("updated", dstore.getUser);
  updated = true;
  const { data } = await useFetch("/api/update_user");
  console.log(data);
};

if (updated) {
}

// (name = updatedInput(name, storeToRefs(dstore.user.name))),
//   (phone = updatedInput(phone, storeToRefs(dstore.user.contact_number))),
//   (email = updatedInput(email, storeToRefs(dstore.user.email))),
//   (starttime = updatedInput(
//     starttime,
//     storeToRefs(dstore.user.start_working_hour)
//   )),
//   (endtime = updatedInput(endtime, storeToRefs(dstore.user.end_working_hour)));
</script>

<style lang="scss" scoped></style>
