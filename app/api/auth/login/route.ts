import { makeHash } from "../../../../utils/generalUtils";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { supabase } from "../../../../utils/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, rememberMe } = body;

  const baseData = await getPass(email);

  if (baseData === null) {
    return NextResponse.json(
      { message: "database error", loginState: false },
      { status: 500 }
    );
  }

  if (baseData.length === 0) {
    return NextResponse.json(
      { message: "no user", loginState: false },
      { status: 200 }
    );
  } else {
    const passwordhash = baseData[0].passwordhash;
    const hashedpass = await makeHash(password);

    if (passwordhash !== hashedpass) {
      return NextResponse.json(
        { message: "wrong password", loginState: false },
        { status: 200 }
      );
    } else {
      if (rememberMe) {
        const baseTokenData = await getToken(email);

        const token = await makeHash(email + password);
        const setTokenAttempt = await writeTokenToBase(email, token);

        if (setTokenAttempt) {
          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);

          const name = await getName(email);
          const userID = await getUserID(email);
          const response = NextResponse.json(
            {
              message: "login successful, token saved",
              name: name,
              userID: userID,
              loginState: true,
            },
            { status: 200 }
          );

          response.headers.append(
            "Set-Cookie",
            `token=${token}; Path=/; HttpOnly; Secure; Expires=${expirationDate.toUTCString()}`
          );
          response.headers.append(
            "Set-Cookie",
            `email=${email}; Path=/; HttpOnly; Secure; Expires=${expirationDate.toUTCString()}`
          );

          return response;
        } else {
          return NextResponse.json(
            { message: "problem with token setting", loginState: false },
            { status: 200 }
          );
        }
      } else {
        const name = await getName(email);
        const userID = await getUserID(email);

        return NextResponse.json(
          {
            message: "session login successful",
            name: name,
            userID: userID,
            loginState: true,
          },
          { status: 200 }
        );
      }
    }
  }
}

async function writeTokenToBase(email: string, token: string) {
  const { data, error } = await supabase
    .from("advancedauth")
    .update({ authtoken: token })
    .eq("email", email);

  if (error) {
    console.error("Error:", error);
    return false;
  } else {
    return true;
  }
}

async function getPass(email: string) {
  const { data, error } = await supabase
    .from("advancedauth")
    .select("passwordhash")
    .eq("email", email);
  if (error) {
    console.error("Error:", error);
    return null;
  } else {
    return data;
  }
}

async function getToken(email: string) {
  const { data, error } = await supabase
    .from("advancedauth")
    .select("authtoken")
    .eq("email", email);

  if (error) {
    console.error("Error:", error);
    return null;
  } else {
    return data;
  }
}

async function getName(email: string) {
  const { data, error } = await supabase
    .from("advancedauth")
    .select("name")
    .eq("email", email);

  if (error) {
    console.error("Error:", error);
    return null;
  } else {
    return data[0].name;
  }
}

async function getUserID(email: string) {
  const { data, error } = await supabase
    .from("advancedauth")
    .select("id")
    .eq("email", email);

  if (error) {
    console.error("Error:", error);
    return null;
  } else {
    return data[0].id;
  }
}
