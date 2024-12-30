"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { addDays, isPast, isToday, parseISO } from "date-fns";
import * as React from "react";

// Define the filter options
type DueDateFilter = "all" | "today" | "past" | "soon" | "attention";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const dueDateFilterFn: FilterFn<any> = (
  row,
  _columnId,
  filterValue: DueDateFilter,
) => {
  const dueDate = parseISO(row.getValue("due_date"));
  const today = new Date();
  const soon = addDays(today, 365);

  switch (filterValue) {
    case "today":
      return isToday(dueDate);
    case "past":
      return isPast(dueDate) && !isToday(dueDate);
    case "soon":
      return dueDate > today && dueDate <= soon;
    case "attention":
      return isPast(dueDate) || isToday(dueDate);
    default:
      return true;
  }
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [dueDateFilter, setDueDateFilter] =
    React.useState<DueDateFilter>("all");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: dueDateFilter,
    },
    globalFilterFn: dueDateFilterFn,
  });

  const filterOptions: { value: DueDateFilter; label: string }[] = [
    { value: "all", label: "All Books" },
    { value: "today", label: "Due Today" },
    { value: "past", label: "Past Due" },
    { value: "attention", label: "Needs Attention" },
    { value: "soon", label: "Due Soon" },
  ];

  return (
    <div className="space-y-4 pt-8">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={dueDateFilter === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setDueDateFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
