import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const project = await readBody(event);

  console.log(project);
  var success = false;
  if (user) {
    const nData = project ? project : null;
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data, error } = await client.rpc("map_user_event", {
        n_user_id: nData.user_id,
        n_event_id: nData.project_id,
        n_role: nData.role,
      });
      if (error) {
        throw createError({ statusMessage: error.message });
      } else {
        success = true;
      }
      console.log(data);
      return { input: project, data: data, success: success };
    }
  }
  return { input: project, success: success };
});
