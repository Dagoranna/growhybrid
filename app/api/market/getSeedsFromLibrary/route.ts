import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";
import type { PlantItem } from "../../../store/slices/librarySlice";

export async function POST(req: Request) {
  const seeds = await getSeeds();
  if (seeds === false) {
    return NextResponse.json(
      { message: "Database error", baseState: -1 },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: seeds, baseState: 1 }, { status: 200 });
}

async function getSeeds(): Promise<any> {
  const { data, error } = await supabase
    .from("library")
    .select("*")
    .eq("item_type", "plant");

  if (error) {
    console.error("Error:", error);
    return false;
  }

  return data;
}
