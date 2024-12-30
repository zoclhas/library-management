"use client";

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
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { useDebounce } from "react-use";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginatedDocs } from "payload";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  paginatedDocs,
}: DataTableProps<TData, TValue> & { paginatedDocs: PaginatedDocs }) {
  const [query, setQuery] = React.useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  useDebounce(
    () => {
      setDebouncedQuery(query);
    },
    400,
    [query],
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (name === "q") {
        if (value) {
          params.set(name, value);
          params.set("page", "1");
        } else {
          params.delete(name);
          params.delete("page");
        }
      } else if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );

  React.useEffect(() => {
    router.push(pathname + "?" + createQueryString("q", debouncedQuery));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Names or ID..."
          value={searchParams.get("query") ?? query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
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
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
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
          onClick={() =>
            router.push(
              pathname +
                "?" +
                createQueryString("page", String(paginatedDocs.prevPage)),
            )
          }
          disabled={!paginatedDocs.hasPrevPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(
              pathname +
                "?" +
                createQueryString("page", String(paginatedDocs.nextPage)),
            )
          }
          disabled={!paginatedDocs.hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
