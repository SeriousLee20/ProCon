<template>
  <div class="flex align-items-center justify-content-center mt-5">
    <Avatar />
  </div>
  <form
    @submit="submitProfile"
    class="flex flex-column gap-5 align-items-center justify-content-center mt-3"
  >
    <div>
      <span class="p-float-label">
        <Pinputtext
          id="name"
          v-model="name"
          type="text"
          :class="{ 'p-invalid': errors.name }"
          aria-describedby="text-error-name"
        />
        <label for="name">Name</label>
      </span>
      <small class="p-error" id="text-error-name">{{
        errors.name || "&nbsp;"
      }}</small>
    </div>

    <div>
      <span class="p-float-label">
        <Pinputmask
          id="phone"
          v-model="phone"
          placeholder="+60 10-12345678"
          mask="+99 99-99999999?9999"
          :class="{ 'p-invalid': errors.phone }"
          aria-describedby="text-error-phone"
        />
        <label for="phone">Contact Number</label>
      </span>
      <small class="p-error" id="text-error-phone">{{
        errors.phone || "&nbsp;"
      }}</small>
    </div>

    <div>
      <span class="p-float-label">
        <Pinputtext
          id="email"
          v-model="email"
          type="email"
          :class="{ 'p-invalid': errors.email }"
          aria-describedby="text-error-email"
        />
        <label for="email">Email</label>
      </span>
      <small class="p-error" id="text-error-email">{{
        errors.email || "&nbsp;"
      }}</small>
    </div>

    <div>
      <span class="p-float-label">
        <Pinputmask
          id="starttime"
          v-model="starttime"
          type="text"
          placeholder="00:00:00"
          mask="99:99:99"
          :class="{ 'p-invalid': errors.starttime }"
          aria-describedby="text-error-start-time"
        />
        <label for="starttime">Start Working Time</label>
      </span>
      <small class="p-error" id="text-error-start-time">{{
        errors.starttime || "&nbsp;"
      }}</small>
    </div>

    <div>
      <span class="p-float-label">
        <Pinputmask
          id="endtime"
          v-model="endtime"
          type="text"
          placeholder="23:59:59"
          mask="99:99:99"
          :class="{ 'p-invalid': errors.endtime }"
          aria-describedby="text-error-end-time"
        />
        <label for="endtime">End Working Time</label>
      </span>
      <small class="p-error" id="text-error-end-time">{{
        errors.endtime || "&nbsp;"
      }}</small>
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

// var name = user.name;
// var email = user.email;
// var phone = user.contact_number;
// var starttime = user.start_working_hour;
// var endtime = user.end_working_hour;

var name = ref("");
var email = ref("");
var phone = ref("");
var starttime = ref("");
var endtime = ref("");

const updatedInput = function (value, setVal) {
  return computed({
    set(newVal) {
      value.value = setVal;
    },
  });
};

console.log(name, email, phone, starttime, endtime);

const validateProfile = {
  name(value) {
    console.log(value);
    if (!value) {
      console.log(value);
      return "Required";
    }
    return true;
  },
  phone(value) {
    if (!value) {
      return "Required";
    }
    return true;
  },
};

const { useFieldModel, errors, handleSubmit } = useForm({
  validationSchema: validateProfile,
});
console.log(errors);
[name, phone, starttime, endtime] = useFieldModel([
  "name",
  "phone",
  "starttime",
  "endtime",
]);
const submitProfile = handleSubmit((values) => {
  console.log(name, email, phone, starttime, endtime);
  alert(JSON.stringify(values, null, 2));
  var userId = dstore.getUserId;
  var name = values.name ? values.name : user.name;
  var phone = values.phone ? values.phone : user.contact_number;
  var email = values.email ? values.email : user.email;
  var startTime = values.starttime ? values.starttime : user.start_working_hour;
  var endTime = values.endtime ? values.endtime : user.end_working_hour;
  const newProfile = {
    id: userId,
    name: name,
    email: email,
    contact_number: phone,
    start_working_time: startTime,
    end_working_time: endTime,
    avatar_url: "",
  };
  dstore.createUser(newProfile);
  console.log("updated", dstore.getUser);
});

export {

    name: updatedInput(name, storeToRefs(dstore.user.name)),
    phone: updatedInput(phone, storeToRefs(dstore.user.contact_number)),
    email: updatedInput(email, storeToRefs(dstore.user.email)),
    starttime: updatedInput(
      starttime,
      storeToRefs(dstore.user.start_working_hour)
    ),
    endtime: updatedInput(endtime, storeToRefs(dstore.user.end_working_hour)),
}
</script>

<style lang="scss" scoped></style>
