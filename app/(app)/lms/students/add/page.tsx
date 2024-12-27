import { AddStudentForm } from "./form";

export default function AddStudent() {
  return (
    <>
      <section>
        <h1 className="pb-8 text-2xl font-bold">Add Student</h1>
        <div className="grid place-items-center">
          <AddStudentForm />
        </div>
      </section>
    </>
  );
}
