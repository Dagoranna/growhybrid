import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, itemName, payment, count } = body;

  const { data, error } = await supabase.rpc("buy_item_from_library", {
    p_user_id: userId,
    p_item_name: itemName,
    p_payment: payment,
  });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Database error", success: false },
      { status: 500 }
    );
  } else {
    return NextResponse.json(
      {
        message: "operation successful",
        item: data,
        count: count,
        success: true,
      },
      { status: 200 }
    );
  }
}
