import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const positions = await readBody(event);

  var success = false;
  console.log(positions);
  if (user) {
    const nData = positions ? positions : null;
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data: insertProject, error: insertError } = await client.rpc(
        "insert_position",
        {
          event_id: nData.project_id,
          n_name: nData.positions,
        }
      );

      if (insertError) {
        throw createError({ statusMessage: insertError.message });
      } else {
        success = true;
      }
      return { input: positions, data: insertProject, success: success };
    }
  }
  return { input: positions, success: success };
});
