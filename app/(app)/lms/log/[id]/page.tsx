import { redirect } from "next/navigation";
import config from "@payload-config";
import { getPayload } from "payload";
import { EditLogForm } from "./form";

async function getLog(id: string) {
  try {
    const payload = await getPayload({ config });

    return payload.findByID({
      collection: "current",
      id,
    });
  } catch (err) {
    console.error(err);
    redirect("/lms");
  }
}

export default async function LogEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const log = await getLog(id);

  return (
    <>
      <section>
        <h1 className="pb-8 text-2xl font-bold">Edit Log</h1>

        <div className="grid place-items-center">
          <EditLogForm data={log} />
        </div>
      </section>
    </>
  );
}
