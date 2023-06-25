import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const project = await readBody(event);
  var success = false;
  if (user) {
    const user_id = user?.id.toString();
    const { data, error } = await client.rpc("get_users_by_event_id", {
      n_event_id: project.project_id,
    });

    if (error) {
      throw createError({ statusMessage: error.message });
    } else {
      success = true;
    }

    console.log(data);
    return { data: data, success: success };
  }
});
