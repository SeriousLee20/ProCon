import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";
import { useDataStore } from "../../stores/datastore";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const dstore = useDataStore();
  const project = await readBody(event);

  var success = false;
  console.log(project);
  if (user) {
    const nData = project ? project : null;
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data: insertProject, error: insertError } = await client.rpc(
        "new_project",
        {
          n_name: nData.name,
          n_description: nData.description,
          n_creator_id: id.toString(),
        }
      );

      if (insertError) {
        throw createError({ statusMessage: insertError.message });
      } else {
        success = true;
      }
      return { input: project, data: insertProject, success: success };
    }
  }
  return { input: project, success: success };
});
