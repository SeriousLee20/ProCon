import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const data = await readBody(event);

  console.log(data);
  var success = false;

  if (user) {
    const nData = data ? data : null;
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data: queryResponse, error: queryError } = await client.rpc(
        "update_project_user_map",
        {
          n_user_id: nData.user_id,
          n_project_id: nData.project_id.toString(),
          n_role: nData.role,
          n_department: nData.department,
          n_position: nData.position,
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
