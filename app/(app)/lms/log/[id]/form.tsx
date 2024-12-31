"use client";

import { editLog, getBooks, getStudents } from "@/actions/add-log";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Book, Current, Student } from "@/payload-types";
import { format } from "date-fns";
import { Calendar as CalendarIcon, LoaderIcon } from "lucide-react";
import * as React from "react";
import { useActionState } from "react";
import { DebouncedCombobox } from "../../add/search-box";
import { useRouter } from "next/navigation";

export function EditLogForm({ data }: { data: Current }) {
  const [lendDate, setLendDate] = React.useState<Date>(
    new Date(data.lend_date),
  );
  const [returnDate, setReturnDate] = React.useState<Date>(
    new Date(data.due_date),
  );
  const [state, action, pending] = useActionState(editLog, undefined);

  const router = useRouter();
  if (state?.success) router.push("/lms");

  const handleSetReturnDate = (weeks: number) => {
    setReturnDate(() => {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + weeks * 7);
      return newDate;
    });
  };

  return (
    <form className="w-full" action={action}>
      <input className="hidden" name="id" id="id" value={data.id} />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Log Details</CardTitle>
          {!state?.success && <CardDescription>{state?.error}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 pb-4 max-sm:flex-col">
            <div className="flex flex-col">
              <Label htmlFor="bid" className="pb-1.5">
                Book ID <span className="text-red-600">*</span>
              </Label>
              <DebouncedCombobox
                placeholder="Enter book ID..."
                emptyMessage="No books found"
                fetchItems={getBooks}
                name="bid"
                val={`${(data.book as Book).bid} - ${(data.book as Book).title}`}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="sid" className="pb-1.5">
                Student ID <span className="text-red-600">*</span>
              </Label>
              <DebouncedCombobox
                placeholder="Enter student ID..."
                emptyMessage="No students found"
                fetchItems={getStudents}
                name="sid"
                val={`${(data.student as Student).sid} - ${(data.student as Student).name}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="date" className="mb-1.5">
                  Lend Date <span className="text-red-600">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !lendDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {lendDate ? (
                        format(lendDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown-buttons"
                      selected={lendDate}
                      // @ts-expect-error Just ignore
                      onSelect={setLendDate}
                      fromYear={1970}
                      toYear={2050}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <input
                  id="lend_date"
                  name="lend_date"
                  type="lend_date"
                  placeholder="####"
                  min={0}
                  value={
                    lendDate ? lendDate.toLocaleDateString("fr-CA") : undefined
                  }
                  className="m-0 h-0 w-0 border-0 p-0"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                name="returned"
                id="returned"
                defaultChecked={data.returned ?? false}
              />
              <label
                htmlFor="returned"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Book returned?
              </label>
            </div>
          </div>

          <div className="flex gap-2 max-sm:flex-col sm:items-end">
            <div className="flex flex-col">
              <Label htmlFor="date" className="mb-1.5">
                Due Date <span className="text-red-600">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !lendDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? (
                      format(returnDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={returnDate}
                    // @ts-expect-error Just ignore
                    onSelect={setReturnDate}
                    fromYear={1970}
                    toYear={2050}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input
                id="return_date"
                name="return_date"
                type="return_date"
                placeholder="####"
                min={0}
                value={
                  returnDate
                    ? returnDate.toLocaleDateString("fr-CA")
                    : undefined
                }
                className="m-0 h-0 w-0 border-0 p-0"
                required
              />
            </div>

            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                handleSetReturnDate(0);
              }}
            >
              Today
            </Button>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                handleSetReturnDate(1);
              }}
            >
              1 Week
            </Button>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                handleSetReturnDate(2);
              }}
            >
              2 Week
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && (
              <span>
                <LoaderIcon className="animate-spin" />{" "}
              </span>
            )}
            Save Log
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
