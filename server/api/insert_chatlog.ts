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
        "insert_chatlog",
        {
          n_chatroom_id: nData.chatroom_id,
          n_project_id: nData.project_id,
          n_user_id: id,
          n_receiver_id: nData.receiver_id,
          n_text_content: nData.text_content,
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
