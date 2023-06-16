<template>
  <div>
    <Pbutton label="logout" @click="logout" />
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";

definePageMeta({
  middleware: ["auth"],
  layout: "custom",
});

const { auth } = useSupabaseAuthClient();
const dstore = useDataStore();
const { data: userData } = await useFetch("/api/get_full_data");
const table = userData.value;

watchEffect(() => {
  if (!useSupabaseUser().value) {
    navigateTo("/login");
  }
});

const logout = async () => {
  await auth.signOut();
  dstore.logout();
};

dstore.clearData();
dstore.createUser({
  id: table[0].user_id,
  name: table[0].user_name,
  email: table[0].email,
  contact_number: table[0].contact_number,
  avatar_url: "",
});
dstore.createProject({
  id: "-1",
  name: "Overview",
  role: "",
  description: "Overview",
  creator_id: "system",
  is_show_project_in_overview: true,
});
table.forEach((data) => {
  console.log(data);
  dstore.createProject({
    id: data.event_id,
    name: data.event_name,
    role: data.user_role,
    description: data.event_desc,
    creator_id: data.event_creator_id,
    is_show_project_in_overview: data.is_show_in_overview,
  });
  dstore.createAnnouncement({
    id: data.announcement_id,
    name: data.announcement_name,
    project_id: data.event_id,
    creator_id: data.announcement_creator_id,
    creation_date_time: data.announcement_creation_timestamp,
    description: data.announcement_desc,
    receiver_id: data.announcement_receiver_ids,
  });
});

dstore.setSelectedProject("-1");
console.log(dstore.getFullData());
</script>

<style lang="scss" scoped></style>
