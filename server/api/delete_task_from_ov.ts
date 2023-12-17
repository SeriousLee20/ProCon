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
      const { data: queryResponse, error: queryError } = await client.rpc(
        "delete_task_from_ov",
        {
          n_task_id: nData.task_id,
          n_project_id: nData.project_id,
          n_user_id: id,
        }
      );

      if (queryError) {
        throw createError({ statusMessage: queryError.message });
      } else {
        success = true;
      }
      return { input: data, response: queryResponse, success: success };
    }
  }
  return { input: data, success: success };
});
