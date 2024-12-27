"use client";

import { processBookCsvData, uploadBookCsvData } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderIcon } from "lucide-react";
import { useActionState, useEffect } from "react";

export function UploadBooksForm({
  setOpenAction,
}: {
  setOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [state, action, pending] = useActionState(
    processBookCsvData,
    undefined,
  );
  const [uState, uAction, uPending] = useActionState(
    () => uploadBookCsvData(state!.books!),
    undefined,
  );

  useEffect(() => {
    if (uState?.success) {
      setOpenAction(false);
    }
  }, [uState, setOpenAction]);

  return (
    <>
      {!state?.success && <p>{state?.error}</p>}
      <form action={action} className="pt-4">
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="csv">
              Upload File <span className="text-red-600">*</span>
            </Label>
            <Input
              id="csv"
              name="csv"
              type="file"
              accept=".csv"
              className="cursor-pointer"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={pending}
            variant={state?.success ? "secondary" : "default"}
          >
            {pending && (
              <span>
                <LoaderIcon className="animate-spin" />{" "}
              </span>
            )}
            Process
          </Button>
        </div>
      </form>

      {state?.success && (
        <div className="pt-8">
          <form className="grid" action={uAction}>
            {uState?.error && <p>{uState.error}</p>}
            <Button disabled={uPending}>
              {uPending && (
                <span>
                  <LoaderIcon className="animate-spin" />{" "}
                </span>
              )}
              Add all books
            </Button>
          </form>
          <div className="max-h-96 max-w-[550px] overflow-scroll pt-4">
            <Table>
              <TableCaption>List of Books</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Place &amp; Publisher</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Total Vol.</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Class No.</TableHead>
                  <TableHead>ISBN No.</TableHead>
                  <TableHead>Voucher No.</TableHead>
                  <TableHead>Voucher Date</TableHead>
                  <TableHead>Condition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.books?.slice(0, 500).map((s) => (
                  <TableRow key={s.bid}>
                    <TableCell>{formatIsoDate(s.date)}</TableCell>
                    <TableCell className="font-medium">{s.bid}</TableCell>
                    <TableCell>{s.title}</TableCell>
                    <TableCell>{s.author}</TableCell>
                    <TableCell>{s.publisher}</TableCell>
                    <TableCell>{s.year}</TableCell>
                    <TableCell>{s.pages}</TableCell>
                    <TableCell>{s.volume}</TableCell>
                    <TableCell>{s.total_volume}</TableCell>
                    <TableCell>{s.source}</TableCell>
                    <TableCell>{s.cost}</TableCell>
                    <TableCell>{s.class_no}</TableCell>
                    <TableCell>{s.isbn ?? "###"}</TableCell>
                    <TableCell>{s.voucher_no ?? "null"}</TableCell>
                    <TableCell>
                      {s.voucher_date ? formatIsoDate(s.voucher_date) : "null"}
                    </TableCell>
                    <TableCell>{s.condition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}

function formatIsoDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
