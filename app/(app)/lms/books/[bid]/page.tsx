import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cellColourDue } from "@/lib/utils";
import { Student } from "@/payload-types";
import config from "@payload-config";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

async function getBook(id: string) {
  try {
    const payload = await getPayload({ config });

    const book = await payload.findByID({
      collection: "book",
      id,
    });

    return book;
  } catch (err) {
    console.error(err);
    redirect("/lms/books");
  }
}

async function getCurrentOwner(id: string) {
  try {
    const payload = await getPayload({ config });

    return payload.find({
      collection: "current",
      where: {
        and: [
          {
            book: {
              equals: id,
            },
          },
          {
            returned: {
              equals: false,
            },
          },
        ],
      },
    });
  } catch (err) {
    console.error(err);
    redirect("/lms/books");
  }
}

async function getPreviousOwners(id: string) {
  try {
    const payload = await getPayload({ config });

    return payload.find({
      collection: "previous",
      where: {
        book: {
          equals: id,
        },
      },
      limit: 100,
    });
  } catch (err) {
    console.error(err);
    redirect("/lms/books");
  }
}

export default async function BookId({
  params,
}: {
  params: Promise<{ bid: string }>;
}) {
  const bid = (await params).bid;
  const book = await getBook(bid);

  const current = await getCurrentOwner(bid);
  const previous = await getPreviousOwners(bid);

  return (
    <>
      <section>
        <div className="flex items-center justify-between gap-2 pb-8 max-sm:flex-col">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <Button variant="outline" asChild>
            <Link href={`/lms/books/${bid}/edit`}>
              <Pencil /> Edit
            </Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-8 md:grid-cols-[0.5fr_1.5fr]">
        <Card className="h-max">
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
          <div>
            {current.totalDocs ? (
              <div className="pb-8">
                <h2 className="pb-4 text-xl font-semibold">Current Owner</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Lend Date</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {current.docs.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-bold">
                          {(t.student as Student).sid}
                        </TableCell>
                        <TableCell>{(t.student as Student).name}</TableCell>
                        <TableCell>{formatIsoDate(t.lend_date)}</TableCell>
                        <TableCell
                          className={cellColourDue(new Date(t.due_date))}
                        >
                          {formatIsoDate(t.due_date)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}

            {previous.totalDocs ? (
              <div className="pb-8">
                <h2 className="pb-4 text-xl font-semibold">Previous Owners</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Lend Date</TableHead>
                      <TableHead>Returned Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previous.docs.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-bold">
                          {(t.student as Student).sid}
                        </TableCell>
                        <TableCell>{(t.student as Student).name}</TableCell>
                        <TableCell>{formatIsoDate(t.lend_date)}</TableCell>
                        <TableCell>{formatIsoDate(t.returned_date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </div>
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
