import { getSupabaseClient } from "@/lib/connect-supabase";

export async function GET() {
  const client = getSupabaseClient();
  try {
    const { data, error } = await client.auth.getSession();
    console.log("data, error: ", data, error);

    if (error) {
      return new Response("Failed to fetch session", { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
