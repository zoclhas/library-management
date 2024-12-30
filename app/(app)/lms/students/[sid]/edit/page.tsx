import { EditForm } from "./form";

import { getPayload } from "payload";
import config from "@payload-config";
import { redirect } from "next/navigation";

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

export default async function EditStudent({
  params,
}: {
  params: Promise<{ sid: string }>;
}) {
  const id = (await params).sid;
  const student = await getStudent(id);

  return (
    <>
      <section>
        <h1 className="pb-8 text-2xl font-bold">Add Student</h1>
        <div className="grid place-items-center">
          <EditForm id={id} student={student} />
        </div>
      </section>
    </>
  );
}
