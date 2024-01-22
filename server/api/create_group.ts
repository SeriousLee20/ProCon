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
    console.log("ann data", nData);

    if (nData) {
      const { data: queryResponse, error: queryError } = await client.rpc(
        "create_chatgroup",
        {
          n_group_name: nData.group_name,
          n_group_description: nData.group_description,
          n_project_id: nData.project_id,
          n_user_ids: nData.user_ids,
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
