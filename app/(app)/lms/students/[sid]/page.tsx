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
import { cellColourDue, formatIsoDate } from "@/lib/utils";
import { Book } from "@/payload-types";
import config from "@payload-config";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

async function getStudent(id: string) {
  try {
    const payload = await getPayload({ config });

    const student = await payload.findByID({
      collection: "student",
      id,
    });

    return student;
  } catch (err) {
    console.error(err);
    redirect("/lms/students");
  }
}

async function getCurrentBooksStudent(id: string) {
  try {
    const payload = await getPayload({ config });

    return payload.find({
      collection: "current",
      where: {
        and: [
          {
            student: {
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
    redirect("/lms/students");
  }
}

async function getPreviousBooksStudent(id: string) {
  try {
    const payload = await getPayload({ config });

    return payload.find({
      collection: "previous",
      where: {
        student: {
          equals: id,
        },
      },
      limit: 100,
    });
  } catch (err) {
    console.error(err);
    redirect("/lms/students");
  }
}

export default async function StudentId({
  params,
}: {
  params: Promise<{ sid: string }>;
}) {
  const sid = (await params).sid;

  const student = await getStudent(sid);
  const grade = student.grade
    .replace("kg_1", "KG 1")
    .replace("kg_2", "KG 2")
    .replace("pre_kg", "Pre KG");

  const current = await getCurrentBooksStudent(sid);
  const previous = await getPreviousBooksStudent(sid);

  return (
    <>
      <section>
        <div className="flex items-center justify-between gap-2 pb-8 max-sm:flex-col">
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <Button variant="outline" asChild>
            <Link href={`/lms/students/${sid}/edit`}>
              <Pencil /> Edit
            </Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-8 md:grid-cols-[0.5fr_1.5fr]">
        <Card className="h-max">
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">
              <li>
                <strong>Student ID:</strong> {student.sid}
              </li>
              <li>
                <strong>Name:</strong> {student.name}
              </li>
              <li>
                <strong>Grade &amp; Section:</strong> {grade} {student.section}
              </li>
            </ul>
          </CardContent>
        </Card>
        <div>
          {current.totalDocs ? (
            <div className="pb-8">
              <h2 className="pb-4 text-xl font-semibold">Current Books</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Acc No.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Lend Date</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {current.docs.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-bold">
                        {(t.book as Book).bid}
                      </TableCell>
                      <TableCell>{(t.book as Book).title}</TableCell>
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
            <div>
              <h2 className="pb-4 text-xl font-semibold">Previous Books</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Acc No.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Lend Date</TableHead>
                    <TableHead>Returned Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previous.docs.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-bold">
                        {(t.book as Book).bid}
                      </TableCell>
                      <TableCell>{(t.book as Book).title}</TableCell>
                      <TableCell>{formatIsoDate(t.lend_date)}</TableCell>
                      <TableCell>{formatIsoDate(t.returned_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
