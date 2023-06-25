import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";
import { useDataStore } from "../../stores/datastore";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const departments = await readBody(event);

  var success = false;
  console.log(departments);
  if (user) {
    const nData = departments ? departments : null;
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data: insertProject, error: insertError } = await client.rpc(
        "insert_department",
        {
          event_id: nData.project_id,
          n_name: nData.departments,
        }
      );

      if (insertError) {
        throw createError({ statusMessage: insertError.message });
      } else {
        success = true;
      }
      return { input: departments, data: insertProject, success: success };
    }
  }
  return { input: departments, success: success };
});
