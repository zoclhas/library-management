"use server";

import { getToken } from "@/lib/session";
import config from "@payload-config";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

export async function addStudent(_: unknown, formData: FormData) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Unauthenticated.");
    }

    const payload = await getPayload({ config });

    const sid = Number(formData.get("sid")!);
    const name = String(formData.get("name")!);
    const grade = String(formData.get("grade")!);
    const section = String(formData.get("section")!);

    await payload.create({
      collection: "student",
      data: {
        sid,
        name,
        // @ts-expect-error Nah just ignore this :>, basically string -> constant strings error
        grade,
        section,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
