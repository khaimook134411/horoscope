import { getSupabaseClient } from "@/lib/connect-supabase";

export async function POST() {
  try {
    const client = getSupabaseClient();

    const { error } = await client.auth.signOut({ scope: "local" });

    if (error) {
      return new Response("Failed to logout", { status: 500 });
    }

    return new Response("Logged out successfully", { status: 200 });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
