"use client";

import { editStudent } from "@/actions/edit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "@/payload-types";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export function EditForm({ id, student }: { id: string; student: Student }) {
  const [state, action, pending] = useActionState(editStudent, undefined);

  const router = useRouter();
  if (state?.success) router.push(`/lms/students/${id}`);

  return (
    <form className="w-full" action={action}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          {!state?.success && <CardDescription>{state?.error}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 pb-4 sm:grid-cols-[0.5fr_1.5fr]">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="sid">
                Student ID <span className="text-red-600">*</span>
              </Label>
              <Input
                id="sid"
                name="sid"
                placeholder="####"
                type="number"
                min={0}
                defaultValue={student.sid}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">
                Full Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Full Name"
                defaultValue={student.name}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="grade">
                Grade <span className="text-red-600">*</span>
              </Label>
              <Select name="grade" defaultValue={student.grade} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade..." />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="section">
                Section <span className="text-red-600">*</span>
              </Label>
              <Input
                id="section"
                name="section"
                placeholder="##"
                defaultValue={student.section}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && (
              <span>
                <LoaderIcon className="animate-spin" />{" "}
              </span>
            )}
            Edit Student
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

const grades: { value: string; label: string }[] = [
  {
    value: "pre_kg",
    label: "Pre KG",
  },
  {
    value: "kg_1",
    label: "KG 1",
  },
  {
    value: "kg_2",
    label: "KG 2",
  },
  ...Array.from({ length: 12 }, (_, index) => {
    const value = String(index + 1);
    return { value, label: `Grade ${value}` };
  }),
];
