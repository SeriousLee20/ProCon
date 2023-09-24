import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";
import { useDataStore } from "../../stores/datastore";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const data = await readBody(event);
  var success = false;

  if (user) {
    const nData = data ? data : null;
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data: queryResponse, error: queryError } = await client.rpc(
        "upsert_task",
        {
          n_task_id: nData?.task_id,
          n_name: nData?.task_name,
          n_description: nData?.task_desc,
          n_creator_id: nData?.creator_id,
          n_owner_ids: nData?.owner_ids,
          n_due_date_time: nData?.due_date_time,
          n_urgent_date: nData?.urgent_date,
          n_project_id: nData?.project_id,
          n_importance: nData?.importance,
          n_importance_rate: nData?.importance_rate,
          n_status_code: nData?.status_code,
          n_modified_at: nData?.modified_at,
          n_modified_by: id,
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
