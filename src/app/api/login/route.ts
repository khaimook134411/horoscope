import { getSupabaseClient } from "@/lib/connect-supabase";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const client = getSupabaseClient();
    const body = await req.json();

    const { data, error } = await client.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      return new Response("Failed to fetch horoscopes", { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
