<template>
  <div
    v-if="isLoading"
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
        font-family: sans-serif;
        border-radius: 8px;
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        padding-top: 24px;
        padding-bottom: 24px;
        padding-left: 32px;
        padding-right: 32px;
      "
    >
      <iframe
        style="border: none"
        src="https://embed.lottiefiles.com/animation/6893"
      ></iframe>
      <h3 style="">Meowing...</h3>
      <span>Paws for a moment, the cat is on its way! </span>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "~/stores/datastore";

definePageMeta({
  middleware: ["auth"],
  //   layout: "custom",
});

const isLoading = ref(true);
setTimeout(() => {
  isLoading.value = false;
  console.log(isLoading.value);
}, 3000);

watchEffect(() => {
  if (useSupabaseUser().value && !isLoading.value) {
    navigateTo("/overview");
  }
});
</script>

<script>
export async function refreshDatastore() {
  const { data } = await useFetch("/api/get_full_data");
  console.log("middleware", data);

  const dstore = useDataStore();

  dstore.clearData();

  const userData = data.value;
  if (userData) {
    dstore.createUser({
      id: userData[0].user_id,
      name: userData[0].user_name,
      email: userData[0].email,
      contact_number: userData[0].contact_number,
      avatar_url: "",
      start_working_hour: userData[0].start_working_hour,
      end_working_hour: userData[0].end_working_hour,
    });
    dstore.createProject({
      id: "-1",
      name: "Overview",
      role: "",
      description: "Overview",
      creator_id: "system",
      is_show_project_in_overview: true,
    });
    userData.forEach((data) => {
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
  }
}
</script>
<style lang="scss" scoped></style>
