"use client";

import { markReturned } from "@/actions/log";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cellColourDue, formatIsoDate } from "@/lib/utils";
import { Book, Student } from "@/payload-types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  BookCheck,
  FileX,
  MoreHorizontal,
  NotepadTextDashed,
  SquareBottomDashedScissors,
} from "lucide-react";
import { startTransition } from "react";

export interface Current {
  id: string;
  book: Book;
  student: Student;
  lend_date: string;
  due_date: string;
  returned?: boolean | null;
  updatedAt: string;
  createdAt: string;
}

const ActionMenu = ({ data }: { data: Current }) => {
  const handleReturn = () => {
    startTransition(() => {
      markReturned(data);
    });
  };

  const handleLost = () => {
    startTransition(() => {
      markReturned(data, "lost");
    });
  };

  const handleTorn = () => {
    startTransition(() => {
      markReturned(data, "torn");
    });
  };

  const handleMissing = () => {
    startTransition(() => {
      markReturned(data, "missing_pages");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleReturn}>
          Mark as returned <BookCheck className="ml-2 h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLost}>
          Mark lost <FileX />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTorn}>
          Mark torn <SquareBottomDashedScissors />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMissing}>
          Mark missing pages <NotepadTextDashed />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Current>[] = [
  {
    id: "bid",
    accessorKey: "book.bid",
    header: "Acc no.",
    accessorFn: (originalRow) => originalRow.book.bid.toString(),
  },
  {
    accessorKey: "book.title",
    header: "Book",
  },
  {
    accessorKey: "student.sid",
    header: "Student ID",
  },
  {
    accessorKey: "student.name",
    header: "Student",
  },
  {
    accessorKey: "lend_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("lend_date") as string;
      return formatIsoDate(date);
    },
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("due_date") as string;
      return (
        <div className={cellColourDue(new Date(date))}>
          <span className="sr-only">{date}</span>
          {formatIsoDate(date)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <ActionMenu data={row.original} />
        </div>
      );
    },
  },
];
