import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const newData = await readBody(event);

  console.log(newData);
  var success = false;
  if (user) {
    const nData = newData ? newData : null;
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data, error } = await client.rpc("update_event_user_map", {
        n_user_id: id,
        n_event_id: nData.id.toString(),
        n_role: nData.role,
        n_department: nData.department,
        n_position: nData.position,
      });
      if (error) {
        throw createError({ statusMessage: error.message });
      } else {
        success = true;
      }
      console.log(data);
      return { input: newData, data: data, success: success };
    }
  }
  return { input: newData, success: success };
});
