"use client";

import { addBook } from "@/actions/add";
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
import { format } from "date-fns";
import { Calendar as CalendarIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

export default function AddBook() {
  const [date, setDate] = useState<Date>(new Date(Date.now()));
  const [voucherDate, setVoucherDate] = useState<Date>();
  const [state, action, pending] = useActionState(addBook, undefined);

  const router = useRouter();
  if (state?.success) router.push("/lms/books");

  return (
    <>
      <section>
        <h1 className="pb-8 text-2xl font-bold">Add Book</h1>
        <div className="grid place-items-center">
          <form className="w-full" action={action}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
                {!state?.success && (
                  <CardDescription>{state?.error}</CardDescription>
                )}
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
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
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
                      value={
                        date ? date.toLocaleDateString("fr-CA") : undefined
                      }
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
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="publisher">
                      Place &amp; Publisher{" "}
                      <span className="text-red-600">*</span>
                    </Label>
                    <Input id="publisher" name="publisher" required />
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
                      defaultValue={1}
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
                      defaultValue={1}
                      min={1}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="source">
                      Source <span className="text-red-600">*</span>
                    </Label>
                    <Input id="source" name="source" required />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="cost">
                      Cost <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="cost"
                      name="cost"
                      placeholder="AED ..."
                      defaultValue="AED "
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-5">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="class_no">
                      Class No. <span className="text-red-600">*</span>
                    </Label>
                    <Input id="class_no" name="class_no" required />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="isbn">ISBN No.</Label>
                    <Input
                      id="isbn"
                      name="isbn"
                      placeholder="###"
                      defaultValue="###"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="voucher_no">Voucher No.</Label>
                    <Input id="voucher_no" name="voucher_no" />
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
                          {voucherDate ? (
                            format(voucherDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
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
                    <Select name="condition" defaultValue="original" required>
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
                  Add Book
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </section>
    </>
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
