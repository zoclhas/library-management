"use server";

import { getToken } from "@/lib/session";
import config from "@payload-config";
import { getPayload } from "payload";

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
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

    return {
      success: true,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
