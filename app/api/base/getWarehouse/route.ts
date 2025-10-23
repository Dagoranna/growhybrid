import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";
import type { MyWarehouseState } from "../../../store/slices/warehouseSlice";

export async function POST(req: Request) {
  const body = await req.json();
  const { owner_id } = body;

  const warehouse: MyWarehouseState | boolean =
    await getUserWarehouse(owner_id);
  if (warehouse === false) {
    return NextResponse.json(
      { message: "Database error", baseState: -1 },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: warehouse, baseState: 1 },
    { status: 200 }
  );
}

async function getUserWarehouse(
  userId: number
): Promise<MyWarehouseState | boolean> {
  const { data, error } = await supabase
    .from("property")
    .select("money, seeds, crops")
    .eq("owner_id", userId);

  if (error) {
    console.error("Error:", error);
    return false;
  }

  return data[0];
}
