import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const getSupabaseClient = (): SupabaseClient => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase URL or Key is not defined in environment variables"
    );
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};
