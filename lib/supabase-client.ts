import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const url =
  process?.env?.NEXT_PUBLIC_SITE_URL ??
  process?.env?.NEXT_PUBLIC_VERCEL_URL ??
  "http://localhost:3000/";

const supabase = createClient<Database>(
  url as string,

  process.env.SUPABASE_ANON_KEY as string
);

export default supabase;
