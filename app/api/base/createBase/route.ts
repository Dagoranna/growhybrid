import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

/*interface baseData {
  station_name: string;
  circles_count: number;
  sections_count: number;
  sections_1: number[];
  sections_2: number[];
  sections_3: number[];
}*/

export async function POST(req: Request) {
  const body = await req.json();
  const { email, baseName } = body;

  const userId: number | null | boolean = await getUserId(email);
  if (userId === false) {
    return NextResponse.json(
      { message: "Database error", baseState: -1 },
      { status: 500 }
    );
  }
  if (userId === null) {
    return NextResponse.json(
      { message: "no station", baseState: -1 },
      { status: 200 }
    );
  }

  const baseData = await createBase(userId, baseName);
  if (baseData === false) {
    return NextResponse.json(
      { message: "Database error", baseState: -1 },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: baseData, baseState: 1 },
    { status: 200 }
  );
}

async function getUserId(email: string): Promise<number | null | false> {
  const { data, error } = await supabase
    .from("advancedauth")
    .select("id")
    .eq("email", email);

  if (error) {
    console.error("Error:", error);
    return false;
  }

  if (data && data.length > 0) {
    return data[0].id;
  }

  return null;
}

async function createBase(userId: number, baseName: string): Promise<boolean> {
  const { error } = await supabase.from("stations").insert([
    {
      owner_id: userId,
      sections_count: 0,
      station_name: baseName,
    },
  ]);

  if (error) {
    console.error("Error:", error);
    return false;
  }

  return true;
}
