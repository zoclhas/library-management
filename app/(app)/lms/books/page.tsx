import { Button } from "@/components/ui/button";
import config from "@payload-config";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { getPayload } from "payload";
import { UploadBooks } from "./upload/upload-dialog";

async function getBooks(q: string, page: number) {
  const payload = await getPayload({ config });

  return payload.find({
    collection: "book",
    limit: 10,
    page,
    where: {
      or: [
        {
          title: {
            like: q,
          },
        },
        {
          bid: {
            like: q,
          },
        },
      ],
    },
  });
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  const { q, page } = await searchParams;
  const books = await getBooks(q ?? "", Number(page) ?? 1);

  return (
    <>
      <section className="flex items-center justify-end gap-2 pt-16">
        <UploadBooks />
        <Button variant="secondary" asChild>
          <Link href="/lms/books/add">
            <UserPlus /> <span>Add Book</span>
          </Link>
        </Button>
      </section>
      <section className="mt-8 pb-16">
        {/* <DataTable */}
        {/*   columns={studentColumns} */}
        {/*   data={students.docs} */}
        {/*   paginatedDocs={students} */}
        {/* /> */}
      </section>
    </>
  );
}
