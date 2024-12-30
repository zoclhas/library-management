"use server";

import { getToken } from "@/lib/session";
import config from "@payload-config";
import { getPayload } from "payload";

export async function editStudent(_: unknown, formData: FormData) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Unauthenticated.");
    }

    const payload = await getPayload({ config });

    const id = formData.get("id")!;
    const sid = Number(formData.get("sid")!);
    const name = String(formData.get("name")!);
    const grade = String(formData.get("grade")!);
    const section = String(formData.get("section")!);

    await payload.update({
      collection: "student",
      where: {
        or: [
          {
            id: {
              equals: id,
            },
          },
          {
            sid: {
              equals: sid,
            },
          },
        ],
      },
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

export async function addBook(_: unknown, formData: FormData) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Unauthenticated.");
    }

    const payload = await getPayload({ config });

    const date = String(formData.get("date")!);
    const bid = Number(formData.get("bid")!);
    const title = String(formData.get("title")!);
    const author = String(formData.get("author")!);
    const publisher = String(formData.get("publisher")!);
    const year = Number(formData.get("year")!);
    const pages = Number(formData.get("pages")!);
    const volume = Number(formData.get("volume")!);
    const total_volume = Number(formData.get("total_volume")!);
    const source = String(formData.get("source")!);
    const cost = String(formData.get("cost")!);
    const class_no = String(formData.get("class_no")!);
    const isbn = formData.get("isbn") ? String(formData.get("isbn")) : null;
    const voucher_no = formData.get("voucher_no")
      ? String(formData.get("voucher_no"))
      : null;
    const voucher_date = formData.get("voucher_date")
      ? String(formData.get("voucher_date"))
      : null;
    const condition = String(formData.get("condition")!) as
      | "original"
      | "torn"
      | "missing_pages"
      | "lost";

    await payload.create({
      collection: "book",
      data: {
        date,
        bid,
        title,
        author,
        publisher,
        year,
        pages,
        volume,
        total_volume,
        source,
        cost,
        class_no,
        isbn,
        voucher_no,
        voucher_date,
        condition,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
