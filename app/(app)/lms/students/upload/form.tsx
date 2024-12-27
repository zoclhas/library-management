"use client";

import { processStudentCsvData, uploadStudentCsvData } from "@/actions/upload";
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

export function UploadStudentsForm({
  setOpenAction,
}: {
  setOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [state, action, pending] = useActionState(
    processStudentCsvData,
    undefined,
  );
  const [uState, uAction, uPending] = useActionState(
    () => uploadStudentCsvData(state!.students!),
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
              Add all students
            </Button>
          </form>
          <div className="max-h-96 overflow-scroll pt-4">
            <Table>
              <TableCaption>List of Students</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="min-w-[90px]">Grade</TableHead>
                  <TableHead>Section</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.students?.slice(0, 500).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.id}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.grade}</TableCell>
                    <TableCell>{s.section}</TableCell>
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
