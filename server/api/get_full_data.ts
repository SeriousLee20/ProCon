import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  console.log(user);

  if (user) {
    const user_id = user?.id.toString();
    const { data, error } = await client.rpc("get_full_data", {
      current_user_id: "c402cbde-9d94-4a45-98cc-5e1da5a282ee",
    });

    if (error) {
      throw createError({ statusMessage: error.message });
    }

    console.log(data);
    return data;
  }
});
