import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";
import { useDataStore } from "../../stores/datastore";
import { storeToRefs } from "pinia";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const dstore = useDataStore();
  const projects = await readBody(event);

  console.log(projects);
  if (user) {
    const nData = projects ? projects : null;
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
      return { projects, data };
    }
  }
  return { projects, event };
});
