import { Database } from "../../types/supabase";
import { serverSupabaseUser } from "../../src/runtime/server/services/serverSupabaseUser";
import { serverSupabaseClient } from "../../src/runtime/server/services/serverSupabaseClient";
import { useDataStore } from "../../stores/datastore";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient<Database>(event);
  const dstore = useDataStore();
  const nData = dstore.getUser;

  if (user) {
    const id = user?.id.toString();
    console.log(nData);
    if (nData) {
      const { data, error } = await client.rpc("update_user", {
        user_id: id,
        n_name: nData?.name,
        n_email: nData?.email,
        n_contact_number: nData?.contact_number,
        n_start_working_hour: nData?.start_working_hour,
        n_end_working_hour: nData?.end_working_hour,
      });
      if (error) {
        throw createError({ statusMessage: error.message });
      }
      console.log(data);
      return data;
    }
  }
});
