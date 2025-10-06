import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { owner_id } = body;

  const money: number | null | boolean = await getUserMoney(owner_id);
  if (money === false) {
    return NextResponse.json(
      { message: "Database error", baseState: -1 },
      { status: 500 }
    );
  }
  if (money === null) {
    return NextResponse.json(
      { message: "no user", baseState: -1 },
      { status: 200 }
    );
  }

  return NextResponse.json({ message: money, baseState: 1 }, { status: 200 });
}

async function getUserMoney(userId: number): Promise<number | null | false> {
  const { data, error } = await supabase
    .from("property")
    .select("money")
    .eq("owner_id", userId);

  if (error) {
    console.error("Error:", error);
    return false;
  }

  if (data && data.length > 0) {
    return data[0].money;
  }

  return null;
}
