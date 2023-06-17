import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";
import { useDataStore } from "../../stores/datastore";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const dstore = useDataStore();
  const projectList = dstore.getAllProjects;

  if (user) {
    const nData = projectList ? projectList[projectList?.length - 1] : null;
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data, error } = await client.rpc("map_user_event", {
        n_user_id: id,
        n_event_id: nData.id.toString(),
        n_role: nData.role,
      });
      if (error) {
        throw createError({ statusMessage: error.message });
      }
      console.log(data);
      return data;
    }
  }
});
