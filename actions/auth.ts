import { LoginFormSchema, FormState } from "@/lib/definitions";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

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

  const res = await fetch("/api/users/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    const user: UserResponseErr = await res.json();
    return {
      message: user.errors ? user.errors[0].message : "Failed to login.",
    };
  }

  const user: UserResponseOk = await res.json();
  await createSession(user.token);

  redirect("/");
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
