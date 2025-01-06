"use server";

import { LoginFormSchema, FormState } from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import config from "@payload-config";
import { getPayload } from "payload";

export async function login(state: FormState, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = LoginFormSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // const res = await fetch("/api/users/login", {
  //   method: "post",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     email,
  //     password,
  //   }),
  // });

  // if (!res.ok) {
  //   const user: UserResponseErr = await res.json();
  //   return {
  //     message: user.errors ? user.errors[0].message : "Failed to login.",
  //   };
  // }

  const payload = await getPayload({ config });
  const res = await payload.login({
    collection: 'users', // required
    data: {
      // required
      email: String(email),
      password: String(password)
    },
    depth: 2,
    locale: 'en',
    overrideAccess: false,
    showHiddenFields: true,
  });

  if (!res.token) {
    return {
      message:  "Failed to login.",
    };
  }
  await createSession(res.token);

  redirect("/");
}

export async function logout() {
  deleteSession();
  redirect("/login");
}

interface UserResponseOk {
  message: string;
  exp: number;
  token: string;
  user: User;
}
interface UserResponseErr {
  errors?: { message: string }[];
}

interface User {
  id: number;
  updatedAt: string;
  createdAt: string;
  email: string;
  collection: string;
  loginAttempts: number;
}
