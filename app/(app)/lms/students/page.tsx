import { Button } from "@/components/ui/button";
import config from "@payload-config";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { getPayload } from "payload";
import { UploadStudents } from "./upload/upload-dialog";

async function getStudents() {
  const payload = await getPayload({ config });

  return payload.find({
    collection: "student",
  });
}

export default async function StudentsPage() {
  // console.log(await getStudents());

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
    </>
  );
}
