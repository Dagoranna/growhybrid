import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { supabase } from "../../../../utils/supabase";
//export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("token")?.value;

  if (authToken) {
    const baseData = await getEmailForToken(authToken);

    if (baseData === null) {
      return NextResponse.json(
        { message: "Database error", tokenState: -1 },
        { status: 500 }
      );
    }

    if (baseData.length === 0) {
      return NextResponse.json(
        { message: "No such token", tokenState: -1 },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Token valid",
          tokenState: 1,
          email: baseData[0].email,
          name: baseData[0].name,
          userID: baseData[0].id,
        },
        { status: 200 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "No saved token", tokenState: -1 },
      { status: 200 }
    );
  }
}

async function getEmailForToken(token: string) {
  const { data, error } = await supabase
    .from("advancedauth")
    .select("email, name, id")
    .eq("authtoken", token);

  if (error) {
    console.error("Error:", error);
    return null;
  } else {
    return data;
  }
}
