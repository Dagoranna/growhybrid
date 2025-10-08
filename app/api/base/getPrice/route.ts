import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { item_name } = body;

  const price: number | null | boolean = await getPrice(item_name);
  if (item_name === false) {
    return NextResponse.json(
      { message: "Database error", baseState: -1 },
      { status: 500 }
    );
  }
  if (item_name === null) {
    return NextResponse.json(
      { message: "no such item", baseState: -1 },
      { status: 200 }
    );
  }

  return NextResponse.json({ message: price, baseState: 1 }, { status: 200 });
}

async function getPrice(item_name: string): Promise<number | null | false> {
  const { data, error } = await supabase
    .from("library")
    .select("item_price")
    .eq("item_name", item_name);

  if (error) {
    console.error("Error:", error);
    return false;
  }

  if (data && data.length > 0) {
    return data[0].item_price;
  }

  return null;
}
