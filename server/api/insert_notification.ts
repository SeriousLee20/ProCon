import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";
import { useDataStore } from "../../stores/datastore";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const data = await readBody(event);
  var success = false;

  console.log(data);

  if (user) {
    const nData = data ? data : null;
    const id = user?.id.toString();

    if (nData) {
      // TODO:add projectid
      // TODO: add get noti api based on user & project
      const { data: queryResponse, error: queryError } = await client.rpc(
        "insert_notification",
        {
          p_title: nData.title,
          p_content: nData.content,
          p_target: nData.target,
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
