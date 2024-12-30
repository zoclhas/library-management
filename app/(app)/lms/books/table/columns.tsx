"use client";

import { Button } from "@/components/ui/button";
import { Book } from "@/payload-types";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, PencilIcon } from "lucide-react";
import Link from "next/link";

export const bookColumns: ColumnDef<Book>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <p>{formatIsoDate(row.getValue("date"))}</p>,
  },
  {
    accessorKey: "bid",
    header: "Acc. No.",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link href={`/lms/books/${row.original.id}`} className="underline">
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "publisher",
    header: "Place & Publisher",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "pages",
    header: "Pages",
  },
  {
    accessorKey: "volume",
    header: "Volume",
  },
  {
    accessorKey: "total_volume",
    header: "Total Vol.",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "cost",
    header: "Cost",
  },
  {
    accessorKey: "class_no",
    header: "Class No.",
  },
  {
    accessorKey: "isbn",
    header: "ISBN No.",
  },
  {
    accessorKey: "voucher_no",
    header: "Voucher No.",
  },
  {
    accessorKey: "voucher_date",
    header: "Voucher Date",
    cell: ({ row }) => <p>{formatIsoDate(row.getValue("voucher_date"))}</p>,
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    id: "actions", // Unique ID for the column
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/lms/books/${row.original.id}`}>
            <EyeIcon /> View
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/lms/books/${row.original.id}/edit`}>
            <PencilIcon /> Edit
          </Link>
        </Button>
      </div>
    ),
  },
];

function formatIsoDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
