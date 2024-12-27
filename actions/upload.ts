"use server";

import { getToken } from "@/lib/session";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
}

interface Book {
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

  if (
    idColumn === -1 ||
    nameColIndex === -1 ||
    gradeColIndex === -1 ||
    sectionColIndex === -1
  ) {
    throw new Error(
      "Could not find all required columns (id, name, grade, section)",
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

function parseVoucherInfo(input: string): VoucherInfo {
  const cleaned = input.trim();

  // Match date-only format first (e.g., "28-Aug-2015")
  const dateOnlyRegex = /^(\d{1,2})[-\s]([A-Za-z]+)[-\s](\d{4})$/;
  const dateOnlyMatch = cleaned.match(dateOnlyRegex);
  if (dateOnlyMatch) {
    return {
      voucherNo: "",
      voucherDate: parseCustomDate(
        `${dateOnlyMatch[1]} ${dateOnlyMatch[2]} ${dateOnlyMatch[3]}`,
      ).toISOString(),
    };
  }

  const parts = cleaned.split(/[-\s]+/);

  let voucherNo = "";
  let dateStr = "";

  voucherNo = parts[0];
  dateStr = parts.slice(1).join(" ");

  const date = parseCustomDate(dateStr);

  return {
    voucherNo,
    voucherDate: date.toISOString(),
  };
}

function parseCustomDate(dateStr: string): Date {
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

  const parts = dateStr.trim().split(/\s+/);

  if (parts.length !== 3) {
    throw new Error("Invalid date format");
  }

  const day = parseInt(parts[0], 10);
  const month = monthMap[parts[1].toLowerCase()];
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || month === undefined || isNaN(year)) {
    throw new Error("Invalid date components");
  }

  const date = new Date(year, month, day, 12, 0, 0, 0);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  return date;
}

function parseCsvToBooks(csvContent: string): Book[] {
  const lines = csvContent.split("\n").filter((line) => line.trim());

  const headers = lines[0].split(",").map((header) => header.trim());

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

  if (
    idColumn === -1 ||
    dateColIndex === -1 ||
    titleColIndex === -1 ||
    authorColIndex === -1 ||
    placeColIndex === -1 ||
    yearColIndex === -1 ||
    pageColIndex === -1 ||
    volumeColIndex === -1 ||
    sourceColIndex === -1 ||
    costColIndex === -1 ||
    classColIndex === -1 ||
    isbnColIndex === -1 ||
    voucherColIndex === -1
  ) {
    throw new Error(
      "Could not find all required columns (id, title, author, place, year, pages, volume, source, cost, isbn, voucher, remarks)",
    );
  }

  const books: Book[] = [];
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(",").map((col) => col.trim());

    if (
      columns.length >=
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
      )
    ) {
      let vol = 0;
      let total_volume = 0;
      const volumeValue = columns[volumeColIndex];
      if (volumeValue) {
        const volumeParts = volumeValue.split("of").map((part) => part.trim());
        if (volumeParts.length === 2) {
          vol = parseInt(volumeParts[0], 10);
          total_volume = parseInt(volumeParts[1], 10);
        } else {
          vol = total_volume = parseInt(volumeParts[0], 10);
        }
      }

      const { voucherNo: voucher_no, voucherDate: voucher_date } =
        parseVoucherInfo(columns[voucherColIndex]);

      books.push({
        date: parseCustomDate(columns[dateColIndex]).toISOString(),
        bid: parseInt(columns[idColumn], 10),
        title: columns[titleColIndex],
        author: columns[authorColIndex],
        publisher: columns[placeColIndex],
        year: parseInt(columns[yearColIndex], 10),
        pages: parseInt(columns[pageColIndex], 10),
        volume: vol,
        total_volume,
        source: columns[sourceColIndex],
        cost: columns[costColIndex],
        class_no: columns[classColIndex],
        isbn: columns[isbnColIndex],
        voucher_no,
        voucher_date,
        condition: "original",
      });
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
