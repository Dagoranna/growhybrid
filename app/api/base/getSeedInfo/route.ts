import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";
import type { PlantItem } from "../../../store/slices/librarySlice";

export async function POST(req: Request) {
  const body = await req.json();
  const { item_name } = body;

  const itemInfo: PlantItem | null | boolean = await getItem(item_name);
  if (itemInfo === false) {
    return NextResponse.json(
      { message: "Database error", baseState: -1 },
      { status: 500 }
    );
  }
  if (itemInfo === null) {
    return NextResponse.json(
      { message: "no such item", baseState: -1 },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { message: itemInfo, baseState: 1 },
    { status: 200 }
  );
}

async function getItem(item_name: string): Promise<PlantItem | null | false> {
  const { data, error } = await supabase
    .from("library")
    .select("*")
    .eq("item_name", item_name);

  if (error) {
    console.error("Error:", error);
    return false;
  }

  if (data && data.length > 0) {
    return data[0];
  }

  return null;
}
