import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);

  if (user) {
    const user_id = user?.id.toString();
    const { data, error } = await client.rpc("get_user", { user_id: user_id });

    if (error) {
      throw createError({ statusMessage: error.message });
    }

    console.log(data);
    return data;
  }
});
