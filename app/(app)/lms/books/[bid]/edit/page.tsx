import config from "@payload-config";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { EditForm } from "./form";

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

export default async function AddBook({
  params,
}: {
  params: Promise<{ bid: string }>;
}) {
  const bid = (await params).bid;
  const book = await getBook(bid);

  return (
    <>
      <section>
        <h1 className="pb-8 text-2xl font-bold">Add Book</h1>
        <div className="grid place-items-center">
          <EditForm id={bid} book={book} />
        </div>
      </section>
    </>
  );
}
