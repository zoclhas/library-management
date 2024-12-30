"use server";

import { Current } from "@/app/(app)/lms/columns";
import { getToken } from "@/lib/session";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";

export async function markReturned(data: Current) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Not logged in.");
    }

    const payload = await getPayload({ config });

    await payload.create({
      collection: "previous",
      depth: 0,
      data: {
        book: String(data.book.id),
        student: String(data.student.id),
        lend_date: data.lend_date,
        returned_date: new Date().toISOString(),
      },
    });

    await payload.update({
      collection: "current",
      where: {
        id: {
          equals: data.id,
        },
      },
      data: {
        returned: true,
      },
      depth: 0,
    });

    revalidatePath("/lms");
    return { success: true };
  } catch (err) {
    console.error(err);
    return {
      success: false,
    };
  }
}
