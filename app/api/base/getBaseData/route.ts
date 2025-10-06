import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";

interface baseData {
  station_name: string;
  circles_count: number;
  sections_count: number;
  sections_1: number[];
  sections_2: number[];
  sections_3: number[];
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

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

  const baseData = await getBaseData(userId);
  console.log(baseData);
  if (baseData === false) {
    return NextResponse.json(
      { message: "Database error", baseState: -1 },
      { status: 500 }
    );
  }
  if (baseData === null) {
    return NextResponse.json(
      { message: "no station", baseState: -1 },
      { status: 200 }
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

async function getBaseData(userId: number): Promise<baseData | boolean | null> {
  const { data, error } = await supabase
    .from("stations")
    .select(
      "station_name,circles_count,sections_count,sections_1,sections_2,sections_3"
    )
    .eq("owner_id", userId);

  if (error) {
    console.error("Error:", error);
    return false;
  }

  if (data && data.length > 0) {
    return data[0];
  }

  return null;
}
