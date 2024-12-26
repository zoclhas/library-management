"use server";

import "server-only";
import { cookies } from "next/headers";
// import { NextRequest } from "next/server";

export async function createSession(token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();
  console.log(token, expiresAt);

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getToken() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  return session?.value;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// export async function validateSession(request: NextRequest) {
//   const session = request.cookies.get("session");
//   return session;
// }
