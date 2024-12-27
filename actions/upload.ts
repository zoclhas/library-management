"use server";

import { getToken } from "@/lib/session";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import type { Book as BookPayload } from "@/payload-types";

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
}

export interface Book {
  date: string;
  bid: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  pages: number;
  volume: number;
  total_volume: number;
  source: string;
  cost: string;
  class_no: string;
  isbn?: string | null;
  voucher_no?: string | null;
  voucher_date?: string | null;
  condition: "original" | "torn" | "missing_pages" | "lost";
}

function findColumn(headers: string[], keywords: string[]): number {
  return headers.findIndex((header) =>
    keywords.some((keyword) => header.toLowerCase().includes(keyword)),
  );
}

function parseCSVToStudents(csvContent: string): Student[] {
  const lines = csvContent.split("\n").filter((line) => line.trim());

  const headers = lines[0].split(",").map((header) => header.trim());
  const idColumn = findColumn(headers, ["id", "student id"]);
  const nameColIndex = findColumn(headers, ["name", "full name"]);
  const gradeColIndex = findColumn(headers, ["grade", "year", "standard"]);
  const sectionColIndex = findColumn(headers, ["section", "divison"]);

  const missingColumns = [];

  if (idColumn === -1) missingColumns.push("id");
  if (nameColIndex === -1) missingColumns.push("name");
  if (gradeColIndex === -1) missingColumns.push("grade");
  if (sectionColIndex === -1) missingColumns.push("section");

  if (missingColumns.length > 0) {
    throw new Error(
      `Could not find the following required columns: ${missingColumns.join(", ")}`,
    );
  }

  const students: Student[] = [];
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(",").map((col) => col.trim());

    if (
      columns.length >= Math.max(nameColIndex, gradeColIndex, sectionColIndex)
    ) {
      students.push({
        id: columns[idColumn],
        name: columns[nameColIndex],
        grade: columns[gradeColIndex],
        section: columns[sectionColIndex],
      });
    }
  }

  return students;
}

export async function processStudentCsvData(
  state: unknown,
  formData: FormData,
) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Unauthenticated.");
    }

    const file = formData.get("csv") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const content = await file.text();
    const students = parseCSVToStudents(content);

    return { success: true, students };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function uploadStudentCsvData(students: Student[]) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Unauthenticated.");
    }

    const payload = await getPayload({ config });

    for (let i = 0; i < students.length; i++) {
      const { id: strId, name, section } = students[i];
      const grade = students[i].grade
        .trim()
        .toLowerCase()
        .replaceAll(" ", "")
        .replace("grade", "")
        .replace("kg1", "kg_1")
        .replace("kg2", "kg_2")
        .replace("prekg", "pre_kg");

      const sid = parseInt(strId, 10);
      if (isNaN(sid)) continue;

      const existing = await payload.find({
        collection: "student",
        where: {
          sid: {
            like: sid,
          },
        },
      });

      if (!existing.totalDocs) {
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
      } else {
        await payload.update({
          collection: "student",
          where: {
            id: {
              like: existing.docs[0].id,
            },
          },
          data: {
            sid,
            name,
            // @ts-expect-error Nah just ignore this :>, basically string -> constant strings error
            grade,
            section,
          },
        });
      }
    }

    revalidatePath("/lms/students");
    return {
      success: true,
    };
  } catch (error) {
    revalidatePath("/lms/students");
    return { success: false, error: (error as Error).message };
  }
}

interface VoucherInfo {
  voucherNo: string;
  voucherDate: string;
}

function parseVoucherInfo(input: string, id: string): VoucherInfo {
  const cleaned = input.trim();

  // Match date-only format first (e.g., "28-Aug-2015")
  const dateOnlyRegex = /^(\d{1,2})[-\s]([A-Za-z]+)[-\s](\d{4})$/;
  const dateOnlyMatch = cleaned.match(dateOnlyRegex);
  if (dateOnlyMatch) {
    return {
      voucherNo: "",
      voucherDate: parseCustomDate(
        `${dateOnlyMatch[1]} ${dateOnlyMatch[2]} ${dateOnlyMatch[3]}`,
        id,
      ).toISOString(),
    };
  }

  const parts = cleaned.split(/[-\s]+/);

  let voucherNo = "";
  let dateStr = "";

  voucherNo = parts[0];
  dateStr = parts.slice(1).join(" ");

  const date = parseCustomDate(dateStr, id);

  return {
    voucherNo,
    voucherDate: date.toISOString(),
  };
}

function parseCustomDate(dateStr: string, id: string): Date {
  if (!dateStr) return new Date();
  if (dateStr.toLowerCase().includes("copy")) return new Date();

  const monthMap: { [key: string]: number } = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
  };

  const trimmedDateStr = dateStr.trim().replace(/\./g, "").toLowerCase();

  // Check for DD/MM/YYYY format
  const ddMmYyyyMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmedDateStr);
  if (ddMmYyyyMatch) {
    const day = parseInt(ddMmYyyyMatch[1], 10);
    const month = parseInt(ddMmYyyyMatch[2], 10) - 1; // Convert to zero-based index
    const year = parseInt(ddMmYyyyMatch[3], 10);

    const date = new Date(year, month, day, 12, 0, 0, 0);
    if (isNaN(date.getTime())) {
      console.log(dateStr, id, "ID0");
      throw new Error("Invalid date");
    }

    return date;
  }

  // Custom format with month names
  const parts = trimmedDateStr.split(/\s+/);

  if (parts.length !== 3) {
    console.log(dateStr, id, "IDF");
    throw new Error("Invalid date format");
  }

  const day = parseInt(parts[0], 10);
  const month = monthMap[parts[1].toLowerCase()];
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || month === undefined || isNaN(year)) {
    console.log(dateStr, id, "IDC");
    throw new Error("Invalid date components");
  }

  const date = new Date(year, month, day, 12, 0, 0, 0);

  if (isNaN(date.getTime())) {
    console.log(dateStr, id, "ID");
    throw new Error("Invalid date");
  }

  return date;
}

function parseCsvToBooks(csvContent: string): Book[] {
  const lines = csvContent.split("\n").filter((line) => line?.trim());
  if (lines.length === 0) throw new Error("Empty CSV file");

  const headers = lines[0].split(",").map((header) => header?.trim() || "");

  // Column index finding remains the same
  const idColumn = findColumn(headers, ["acc"]);
  const dateColIndex = findColumn(headers, ["date"]);
  const titleColIndex = findColumn(headers, ["title"]);
  const authorColIndex = findColumn(headers, ["author"]);
  const placeColIndex = findColumn(headers, ["place", "publisher"]);
  const yearColIndex = findColumn(headers, ["year"]);
  const pageColIndex = findColumn(headers, ["page", "pages"]);
  const volumeColIndex = findColumn(headers, ["volume"]);
  const sourceColIndex = findColumn(headers, ["source"]);
  const costColIndex = findColumn(headers, ["cost"]);
  const classColIndex = findColumn(headers, ["class"]);
  const isbnColIndex = findColumn(headers, ["isbn"]);
  const voucherColIndex = findColumn(headers, ["voucher"]);

  // Column validation remains the same
  const missingColumns = [];
  if (idColumn === -1) missingColumns.push("id");
  if (dateColIndex === -1) missingColumns.push("date");
  if (titleColIndex === -1) missingColumns.push("title");
  if (authorColIndex === -1) missingColumns.push("author");
  if (placeColIndex === -1) missingColumns.push("place");
  if (yearColIndex === -1) missingColumns.push("year");
  if (pageColIndex === -1) missingColumns.push("pages");
  if (volumeColIndex === -1) missingColumns.push("volume");
  if (sourceColIndex === -1) missingColumns.push("source");
  if (costColIndex === -1) missingColumns.push("cost");
  if (classColIndex === -1) missingColumns.push("class");
  if (isbnColIndex === -1) missingColumns.push("isbn");
  if (voucherColIndex === -1) missingColumns.push("voucher");

  if (missingColumns.length > 0) {
    throw new Error(
      `Could not find the following required columns: ${missingColumns.join(", ")}`,
    );
  }

  const books: Book[] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      // Safely handle CSV values with proper quote handling
      const columns =
        lines[i]
          .match(/(?:,|^)(?:"([^"]*)"|([^",]*))/g)
          ?.map((val) => val?.replace(/^,/, "")?.trim() || "") || [];

      if (
        columns.length <
        Math.max(
          idColumn,
          dateColIndex,
          titleColIndex,
          authorColIndex,
          placeColIndex,
          yearColIndex,
          pageColIndex,
          volumeColIndex,
          sourceColIndex,
          costColIndex,
          classColIndex,
          isbnColIndex,
          voucherColIndex,
        ) +
          1
      ) {
        console.warn(`Skipping malformed line ${i + 1}: insufficient columns`);
        continue;
      }

      // Safe volume parsing
      let vol = 0;
      let total_volume = 0;
      const volumeValue = columns[volumeColIndex];
      if (volumeValue) {
        const volumeParts = volumeValue.split("of").map((part) => part.trim());
        if (volumeParts.length === 2) {
          vol = parseInt(volumeParts[0], 10) || 0;
          total_volume = parseInt(volumeParts[1], 10) || 0;
        } else {
          vol = total_volume = parseInt(volumeParts[0], 10) || 0;
        }
      }

      // Safe parsing of dates and voucher info
      let bookDate: Date;
      try {
        bookDate = parseCustomDate(
          columns[dateColIndex] || "",
          columns[idColumn],
        );
      } catch (e) {
        console.warn(`Invalid date on line ${i + 1}, using current date`);
        bookDate = new Date();
        console.error(e);
      }

      let voucherInfo = {
        voucherNo: "",
        voucherDate: new Date().toISOString(),
      };
      try {
        voucherInfo = parseVoucherInfo(
          columns[voucherColIndex] || "",
          columns[idColumn],
        );
      } catch (e) {
        console.warn(`Invalid voucher info on line ${i + 1}`);
        console.error(e);
      }

      books.push({
        date: bookDate.toISOString(),
        bid: parseInt(columns[idColumn], 10) || 0,
        title: columns[titleColIndex] || "",
        author: columns[authorColIndex] || "",
        publisher: columns[placeColIndex] || "",
        year: parseInt(columns[yearColIndex], 10) || 0,
        pages: parseInt(columns[pageColIndex], 10) || 0,
        volume: vol,
        total_volume,
        source: columns[sourceColIndex] || "",
        cost: columns[costColIndex] || "",
        class_no: columns[classColIndex] || "",
        isbn: columns[isbnColIndex] || null,
        voucher_no: voucherInfo.voucherNo,
        voucher_date: voucherInfo.voucherDate,
        condition: "original",
      });
    } catch (error) {
      console.warn(`Error processing line ${i + 1}:`, error);
      continue;
    }
  }

  return books;
}
export async function processBookCsvData(state: unknown, formData: FormData) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Unauthenticated.");
    }

    const file = formData.get("csv") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const content = await file.text();
    const books = parseCsvToBooks(content);

    return { success: true, books };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function uploadBookCsvData(books: Book[]) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Unauthenticated.");
    }

    const payload = await getPayload({ config });

    for (let i = 0; i < books.length; i++) {
      const {
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
      } = books[i];

      const data: Omit<
        BookPayload,
        "id" | "sizes" | "createdAt" | "updatedAt"
      > &
        // @ts-expect-error meh
        Partial<Pick<BookPayload, "id" | "sizes" | "createdAt" | "updatedAt">> =
        {
          date,
          bid,
          title,
          author: author.length < 1 ? "null" : author,
          publisher: publisher.length < 1 ? "null" : publisher,
          year,
          pages,
          volume,
          total_volume,
          source: source.length < 1 ? "null" : source,
          cost: cost.length < 1 ? "null" : cost,
          class_no: class_no.length < 1 ? "null" : class_no,
          isbn,
          voucher_no,
          voucher_date,
          condition: "original",
        };

      const existing = await payload.find({
        collection: "book",
        where: {
          bid: {
            like: bid,
          },
        },
      });

      if (!existing.totalDocs) {
        await payload.create({
          collection: "book",
          data,
        });
      } else {
        await payload.update({
          collection: "book",
          where: {
            id: {
              like: existing.docs[0].id,
            },
          },
          data,
        });
      }
    }

    revalidatePath("/lms/students");
    return {
      success: true,
    };
  } catch (error) {
    revalidatePath("/lms/students");
    return { success: false, error: (error as Error).message };
  }
}
