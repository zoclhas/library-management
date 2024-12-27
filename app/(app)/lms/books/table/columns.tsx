"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, PencilIcon } from "lucide-react";
import Link from "next/link";

export interface Student {
  id: string;
  sid: number;
  name: string;
  grade:
    | "pre_kg"
    | "kg_1"
    | "kg_2"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12";
  section: string;
  updatedAt: string;
  createdAt: string;
}

export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "sid",
    header: "Student ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/lms/students/${row.original.id}`} className="underline">
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => {
      const grade = String(row.getValue("grade"));
      return gradeTransform(grade);
    },
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    id: "actions", // Unique ID for the column
    header: "", // Leave header blank
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/lms/students/${row.original.id}`}>
            <EyeIcon /> View
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/lms/students/${row.original.id}/edit`}>
            <PencilIcon /> Edit
          </Link>
        </Button>
      </div>
    ),
  },
];

function gradeTransform(grade: string) {
  // Perform reverse transformations
  let reversedGrade = grade
    .replace("kg_1", "KG 1")
    .replace("kg_2", "KG 2")
    .replace("pre_kg", "Pre KG");

  if (!reversedGrade.startsWith("K") && !reversedGrade.startsWith("P"))
    reversedGrade = "Grade " + reversedGrade;

  return reversedGrade;
}
