import { getSupabaseClient } from "@/lib/connect-supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client.from("horoscopes").select();

    if (error) {
      return new Response("Failed to fetch horoscopes", { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: unknown) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
