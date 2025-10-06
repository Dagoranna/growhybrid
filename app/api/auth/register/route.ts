import { makeHash } from "../../../../utils/generalUtils";
import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name } = body;

  const baseData = await getUser(email);

  if (baseData === null) {
    return NextResponse.json(
      { message: "Database error", registerState: false },
      { status: 500 }
    );
  }

  if (baseData.length !== 0) {
    return NextResponse.json(
      { message: "User with this email already exists", registerState: false },
      { status: 409 }
    );
  }

  const nameExists = await checkNameExistance(name);

  if (nameExists) {
    return NextResponse.json(
      { message: "User with this name already exists", registerState: false },
      { status: 409 }
    );
  }

  const hashedpass = await makeHash(password);
  const token = await makeHash(email + password);

  const regAttempt = await saveUserToBase(email, name, hashedpass, token);

  if (regAttempt) {
    return NextResponse.json(
      { message: "Registration successful", registerState: true },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "Registration failed", registerState: false },
      { status: 500 }
    );
  }
}

async function saveUserToBase(
  email: string,
  name: string,
  password: string,
  token: string
) {
  const { data, error } = await supabase
    .from("advancedauth")
    .insert([
      { email: email, name: name, passwordhash: password, authtoken: token },
    ])
    .select("id");

  if (error || !data || data.length === 0) {
    console.error("Account create error", error);
    return false;
  }

  const { error: error_2 } = await supabase
    .from("property")
    .insert([{ owner_id: data[0].id, money: 1000 }]);

  if (error_2) {
    console.error("Property creation error ", error_2);
    return false;
  } else {
    return true;
  }
}

async function getUser(email: string) {
  const { data, error } = await supabase
    .from("advancedauth")
    .select("*")
    .eq("email", email);

  if (error) {
    console.error("Error:", error);
    return null;
  } else {
    return data;
  }
}

async function checkNameExistance(name: string) {
  const { data, error } = await supabase
    .from("advancedauth")
    .select("*")
    .eq("name", name);

  if (error) {
    console.error("Error:", error);
    return null;
  } else {
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
