import { getSupabaseClient } from "@/lib/connect-supabase";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const client = getSupabaseClient();
    const body = await req.json();

    const { data, error } = await client
      .from("horoscopes")
      .insert([
        { description: body.description, note: body.note, level: body.level },
      ])
      .select();

    if (error) {
      return new Response("Failed to create horoscope", { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error: unknown) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
