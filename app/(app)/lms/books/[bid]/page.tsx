import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import config from "@payload-config";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

async function getBook(id: string) {
  try {
    const payload = await getPayload({ config });

    const student = await payload.findByID({
      collection: "book",
      id,
    });

    return student;
  } catch (err) {
    console.error(err);
    redirect("/lms/books");
  }
}

export default async function StudentId({
  params,
}: {
  params: Promise<{ bid: string }>;
}) {
  const bid = (await params).bid;

  const book = await getBook(bid);

  return (
    <>
      <section>
        <div className="flex items-center justify-between gap-2 pb-8 max-sm:flex-col">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <Button variant="outline" asChild>
            <Link href={`/lms/students/${bid}/edit`}>
              <Pencil /> Edit
            </Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-8 md:grid-cols-[0.5fr_1.5fr]">
        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              {" "}
              <li>
                <strong>Date:</strong> {formatIsoDate(book.date)}
              </li>
              <li>
                <strong>Acc No.:</strong> {book.bid}
              </li>
              <li>
                <strong>Title:</strong> {book.title}
              </li>
              <li>
                <strong>Author:</strong> {book.author}
              </li>
              <li>
                <strong>Publisher:</strong> {book.publisher}
              </li>
              <li>
                <strong>Year:</strong> {book.year}
              </li>
              <li>
                <strong>Pages:</strong> {book.pages}
              </li>
              <li>
                <strong>Volume:</strong> {book.volume} of {book.total_volume}
              </li>
              <li>
                <strong>Source:</strong> {book.source}
              </li>
              <li>
                <strong>Cost:</strong> {book.cost}
              </li>
              <li>
                <strong>Class No.:</strong> {book.class_no}
              </li>
              <li>
                <strong>ISBN:</strong> {book.isbn ?? "null"}
              </li>
              <li>
                <strong>Voucher No.:</strong> {book.voucher_no ?? "null"}
              </li>
              <li>
                <strong>Voucher Date:</strong>{" "}
                {formatIsoDate(book.voucher_date ?? "")}
              </li>
              <li>
                <strong>Condition:</strong> {book.condition}
              </li>
            </ul>
          </CardContent>
        </Card>
        <div>
          <h2 className="pb-4 text-xl font-semibold">Previous Owners</h2>
        </div>
      </section>
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
