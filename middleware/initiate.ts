import { useDataStore } from "~/stores/datastore";
import type {User} from "~/stores/datastore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await useFetch("/api/get_full_data");

  //TODO: add api to get project list separately, error when no project joined
  const dstore = useDataStore();
  const userData = data.value?.response[0];

  console.log("middleware", data);
  console.log("initiate: selectedproject", dstore.getSelectedProject);

  dstore.clearData();
  console.log("cleared", dstore);
  console.log("userdata", userData);


  if (userData) {
    dstore.createUser(userData.user_info as any as JSON);
    dstore.initializeProjectList(userData.user_projects as any as JSON);
    // dstore.createProject({
    //   id: "-1",
    //   name: "Overview",
    //   role: "",
    //   description: "Overview",
    //   creator_id: "system",
    //   is_show_project_in_overview: true,
    //   telegram_chat_id: '',
    //   grouped_members: []
    // });
    // dstore.initializeProjectList(userData?.user_projects)
    // userData.forEach((data) => {
    //   console.log(data);
    //   dstore.createProject({
    //     id: data.project_id,
    //     name: data.project_name,
    //     role: data.user_role,
    //     description: data.project_desc,
    //     creator_id: data.project_creator_id,
    //     is_show_project_in_overview: data.is_show_in_overview,
    //   });
      // dstore.createAnnouncement({
      //   id: data.announcement_id,
      //   name: data.announcement_name,
      //   project_id: data.event_id,
      //   creator_id: data.announcement_creator_id,
      //   creation_date_time: data.announcement_creation_timestamp,
      //   description: data.announcement_desc,
      //   receiver_id: data.announcement_receiver_ids,
      // });
    // });

    if (from.name == "index") {
      dstore.setSelectedProject("-1");
      dstore.setCurrentPage("");
    }
    console.log(dstore.getFullData());
  }
});
