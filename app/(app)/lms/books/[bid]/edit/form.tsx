"use client";

import { editBook } from "@/actions/edit";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Book } from "@/payload-types";
import { format } from "date-fns";
import { Calendar as CalendarIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

export function EditForm({ id, book }: { id: string; book: Book }) {
  const [date, setDate] = useState<Date>(new Date(book.date));
  const [voucherDate, setVoucherDate] = useState<Date | undefined>(
    book.voucher_date ? new Date(book.voucher_date) : undefined,
  );
  const [state, action, pending] = useActionState(editBook, undefined);

  const router = useRouter();
  if (state?.success) router.push(`/lms/books/${id}`);

  return (
    <form className="w-full" action={action}>
      <input className="hidden" value={id} />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
          {!state?.success && <CardDescription>{state?.error}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 pb-4 sm:grid-cols-[0.4fr_0.4fr_1.2fr]">
            <div className="flex flex-col">
              <Label htmlFor="date" className="mb-1.5">
                Date <span className="text-red-600">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={date}
                    // @ts-expect-error Just ignore
                    onSelect={setDate}
                    fromYear={1970}
                    toYear={2050}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input
                id="date"
                name="date"
                type="date"
                placeholder="####"
                min={0}
                value={date ? date.toLocaleDateString("fr-CA") : undefined}
                className="m-0 h-0 w-0 border-0 p-0"
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="bid">
                Acc No. <span className="text-red-600">*</span>
              </Label>
              <Input
                id="bid"
                name="bid"
                placeholder="####"
                type="number"
                min={0}
                defaultValue={book.bid}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Book Title"
                defaultValue={book.title}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 pb-4 sm:grid-cols-[0.2fr_0.4fr_0.2fr_0.2fr]">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="author">
                Author <span className="text-red-600">*</span>
              </Label>
              <Input
                id="author"
                name="author"
                placeholder="Author Name"
                defaultValue={book.author}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="publisher">
                Place &amp; Publisher <span className="text-red-600">*</span>
              </Label>
              <Input
                id="publisher"
                name="publisher"
                defaultValue={book.publisher}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="year">
                Year <span className="text-red-600">*</span>
              </Label>
              <Input
                id="year"
                name="year"
                placeholder="####"
                type="number"
                min={0}
                defaultValue={book.year}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="pages">
                Pages <span className="text-red-600">*</span>
              </Label>
              <Input
                id="pages"
                name="pages"
                type="number"
                min={0}
                defaultValue={book.pages}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 pb-4 sm:grid-cols-[0.2fr_0.2fr_0.4fr_0.2fr]">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="volume">
                Volume <span className="text-red-600">*</span>
              </Label>
              <Input
                id="volume"
                name="volume"
                type="number"
                defaultValue={book.volume}
                min={1}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="total_volume">
                Total Volume <span className="text-red-600">*</span>
              </Label>
              <Input
                id="total_volume"
                name="total_volume"
                type="number"
                defaultValue={book.total_volume}
                min={1}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="source">
                Source <span className="text-red-600">*</span>
              </Label>
              <Input
                id="source"
                name="source"
                defaultValue={book.source}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="cost">
                Cost <span className="text-red-600">*</span>
              </Label>
              <Input
                id="cost"
                name="cost"
                placeholder="AED ..."
                defaultValue={book.cost}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-5">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="class_no">
                Class No. <span className="text-red-600">*</span>
              </Label>
              <Input
                id="class_no"
                name="class_no"
                defaultValue={book.class_no}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="isbn">ISBN No.</Label>
              <Input
                id="isbn"
                name="isbn"
                placeholder="###"
                defaultValue={book.isbn ?? ""}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="voucher_no">Voucher No.</Label>
              <Input
                id="voucher_no"
                name="voucher_no"
                defaultValue={book.voucher_no ?? ""}
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="voucher_date" className="mb-1.5">
                Voucher Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={voucherDate}
                    onSelect={setVoucherDate}
                    fromYear={1970}
                    toYear={2050}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <input
                id="voucher_date"
                name="voucher_date"
                type="date"
                placeholder="####"
                min={0}
                value={
                  voucherDate
                    ? voucherDate.toLocaleDateString("fr-CA")
                    : undefined
                }
                className="m-0 h-0 w-0 border-0 p-0"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="condition">
                Condition <span className="text-red-600">*</span>
              </Label>
              <Select name="condition" defaultValue={book.condition} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Condition..." />
                </SelectTrigger>
                <SelectContent>
                  {condition.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && (
              <span>
                <LoaderIcon className="animate-spin" />{" "}
              </span>
            )}
            Edit Book
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

const condition: { value: string; label: string }[] = [
  {
    value: "original",
    label: "Original",
  },
  {
    value: "torn",
    label: "Torn",
  },
  {
    value: "missing_pages",
    label: "Missing Pages",
  },
  {
    value: "lost",
    label: "Lost",
  },
];
