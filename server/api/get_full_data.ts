import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  var success = false;

  if (user) {
    const user_id = user?.id.toString();

    const { data: queryResponse, error: queryError } = await client.rpc(
      "get_full_data2",
      {
        current_user_id: user_id,
      }
    );

    if (queryError) {
      throw createError({ statusMessage: queryError.message });
    } else {
      success = true;
    }
    return { response: queryResponse, success: success };
  }
});
