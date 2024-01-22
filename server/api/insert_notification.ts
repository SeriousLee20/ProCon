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
          n_title: nData.title,
          n_content: nData.content,
          n_target: nData.target,
          n_project_id: nData.project_id,
          n_user_id: id,
          n_telegram_chat_id: nData.telegram_chat_id
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
