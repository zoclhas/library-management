"use server";

import { getToken } from "@/lib/session";
import config from "@payload-config";
import { getPayload } from "payload";

export async function getBooks(
  q: string,
): Promise<{ items: string[]; error: string | null }> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Not logged in.");
    }

    const payload = await getPayload({ config });

    const docs = await payload.find({
      collection: "book",
      where: {
        or: [{ bid: { like: q } }, { title: { like: q } }],
      },
      limit: 250,
    });

    return {
      items: docs.docs.map((t) => `${t.bid} - ${t.title}`),
      error: null,
    };
  } catch (err) {
    console.error(err);
    return {
      items: [],
      error: String(err),
    };
  }
}

export async function getStudents(
  q: string,
): Promise<{ items: string[]; error: string | null }> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Not logged in.");
    }

    const payload = await getPayload({ config });

    const docs = await payload.find({
      collection: "student",
      where: {
        or: [{ sid: { like: q } }, { name: { like: q } }],
      },
      limit: 250,
    });

    return {
      items: docs.docs.map((t) => `${t.sid} - ${t.name}`),
      error: null,
    };
  } catch (err) {
    console.error(err);
    return {
      items: [],
      error: String(err),
    };
  }
}

export async function addLog(_: unknown, form: FormData) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Not logged in.");
    }

    const payload = await getPayload({ config });

    const bid = parseInt(String(form.get("bid")!).split(" - ")[0], 10);
    const sid = parseInt(String(form.get("sid")!).split(" - ")[0], 10);

    const books = await payload.find({
      collection: "book",
      where: {
        bid: {
          equals: bid,
        },
      },
    });
    const book = books.docs[0].id;

    const alreadyLent = await payload.find({
      collection: "current",
      where: {
        and: [
          {
            returned: {
              equals: false,
            },
          },
          {
            book: {
              equals: book,
            },
          },
        ],
      },
    });

    if (alreadyLent.totalDocs) throw new Error("Book is already lent.");
    if (books.docs[0].condition === "lost") throw new Error("Book is lost.");

    const students = await payload.find({
      collection: "student",
      where: {
        sid: {
          equals: sid,
        },
      },
    });
    const student = students.docs[0].id;

    const lend_date = String(form.get("lend_date")!);
    const due_date = String(form.get("return_date")!);

    const log = await payload.create({
      collection: "current",
      data: {
        book,
        student,
        lend_date,
        due_date,
      },
    });

    return {
      success: true,
      id: log.id,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: String(err),
    };
  }
}
