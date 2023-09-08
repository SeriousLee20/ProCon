import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const data = await readBody(event);

  var success = false;
  console.log(data);
  if (user) {
    const nData = data ? data : null;
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data: insertProject, error: insertError } = await client.rpc(
        "get_users_by_project_id",
        {
          n_event_id: nData.project_id,
        }
      );

      if (insertError) {
        throw createError({ statusMessage: insertError.message });
      } else {
        success = true;
      }
      return { input: data, data: insertProject, success: success };
    }
  }
  return { input: data, success: success };
});
