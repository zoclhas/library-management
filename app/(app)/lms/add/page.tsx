import { AddLogForm } from "./form";

export default function AddLog() {
  return (
    <>
      <section>
        <h1 className="pb-8 text-2xl font-bold">Add Log</h1>

        <div className="grid place-items-center">
          <AddLogForm />
        </div>
      </section>
    </>
  );
}
