import { Button } from "@/components/ui/button";
import config from "@payload-config";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { getPayload } from "payload";
import { UploadStudents } from "./upload/upload-dialog";
import { DataTable } from "./table/data-table";
import { studentColumns } from "./table/columns";

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
  searchParams: {
    q?: string;
    page?: string;
  };
}) {
  const { q, page } = searchParams;
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
