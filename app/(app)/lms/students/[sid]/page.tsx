import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function StudentId({
  params,
}: {
  params: Promise<{ sid: string }>;
}) {
  const sid = (await params).sid;

  const student = await getStudent(sid);

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
        <Card>
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
                <strong>Grade &amp; Section:</strong> {student.grade}{" "}
                {student.section}
              </li>
            </ul>
          </CardContent>
        </Card>
        <div>
          <h2 className="pb-4 text-xl font-semibold">Previous Books</h2>
        </div>
      </section>
    </>
  );
}
