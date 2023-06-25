import { useDataStore } from "~/stores/datastore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await useFetch("/api/get_full_data");

  const dstore = useDataStore();
  const userData = data.value;

  console.log("middleware", data);
  console.log("initiate: selectedproject", dstore.getSelectedProject);

  dstore.clearData();
  console.log("cleared", dstore);
  console.log("userdata", userData);

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
      // console.log(data);
      dstore.createProject({
        id: data.event_id,
        name: data.event_name,
        role: data.user_role,
        description: data.event_desc,
        creator_id: data.event_creator_id,
        is_show_project_in_overview: data.is_show_in_overview,
      });
      // dstore.createAnnouncement({
      //   id: data.announcement_id,
      //   name: data.announcement_name,
      //   project_id: data.event_id,
      //   creator_id: data.announcement_creator_id,
      //   creation_date_time: data.announcement_creation_timestamp,
      //   description: data.announcement_desc,
      //   receiver_id: data.announcement_receiver_ids,
      // });
    });

    if (from.name == "index") {
      dstore.setSelectedProject("-1");
      dstore.setCurrentPage("");
    }
    console.log(dstore.getFullData());
  }
});
