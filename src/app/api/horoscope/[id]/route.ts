import { getSupabaseClient } from "@/lib/connect-supabase";
import { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);

  try {
    const client = getSupabaseClient();

    if (id === "random") {
      const exclude = searchParams.get("exclude") || 0;

      const { count, error: countError } = await client
        .from("horoscopes")
        .select("*", { count: "exact", head: true })
        .not("id", "eq", exclude ?? "");

      if (countError || !count) {
        console.error(countError);
        return;
      }

      // Pick random offset
      const randomOffset = Math.floor(Math.random() * count);

      // Fetch that one random row
      const { data, error } = await client
        .from("horoscopes")
        .select("*")
        .not("id", "eq", exclude ?? "")
        .range(randomOffset, randomOffset)
        .single();

      if (error) {
        return new Response("Failed to fetch random horoscope", {
          status: 500,
        });
      }
      return new Response(JSON.stringify(data), { status: 200 });
    }

    const { data, error } = await client
      .from("horoscopes")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      return new Response(`Failed to fetch horoscope by id ${id}`, {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: unknown) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const client = getSupabaseClient();
    const body = await req.json();

    const { data, error } = await client
      .from("horoscopes")
      .update({
        description: body.description,
        note: body.note,
        level: body.level,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return new Response("Failed to update horoscope", { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: unknown) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from("horoscopes")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return new Response("Failed to delete horoscope", { status: 500 });
    }

    return new Response(JSON.stringify({ id }), { status: 200 });
  } catch (error: unknown) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
