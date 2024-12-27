import { Button } from "@/components/ui/button";
import config from "@payload-config";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { getPayload } from "payload";
import { UploadStudents } from "./upload/upload-dialog";
import { studentColumns } from "./table/columns";
import { DataTable } from "@/components/data-table";

async function getStudents(q: string, page: number) {
  const payload = await getPayload({ config });

  return payload.find({
    collection: "student",
    limit: 10,
    page,
    where: {
      or: [
        {
          name: {
            like: q,
          },
        },
        {
          sid: {
            like: q,
          },
        },
      ],
    },
  });
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  const { q, page } = await searchParams;
  const students = await getStudents(q ?? "", Number(page) ?? 1);

  return (
    <>
      <section className="flex items-center justify-end gap-2 pt-16">
        <UploadStudents />
        <Button variant="secondary" asChild>
          <Link href="/lms/students/add">
            <UserPlus /> <span>Add Student</span>
          </Link>
        </Button>
      </section>
      <section className="mt-8 pb-16">
        <DataTable
          columns={studentColumns}
          data={students.docs}
          paginatedDocs={students}
        />
      </section>
    </>
  );
}
