"use server";

import "server-only";
import { cookies } from "next/headers";

export async function createSession(token: string) {
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
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
