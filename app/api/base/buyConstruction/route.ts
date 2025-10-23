import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, itemName, count, payment } = body;

  const { data, error } = await supabase.rpc("add_section_and_pay", {
    p_user_id: userId,
    p_count: count,
    p_payment: payment,
  });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Database error", baseState: -1 },
      { status: 500 }
    );
  } else {
    return NextResponse.json(
      {
        message: "operation successful",
        newArray: data.sections,
        success: true,
      },
      { status: 200 }
    );
  }
}
