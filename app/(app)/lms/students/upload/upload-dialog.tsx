"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookUser } from "lucide-react";
import { UploadStudentsForm } from "./form";
import { useState } from "react";

export const UploadStudents = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BookUser /> <span>Upload Students</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Students (CSV)</DialogTitle>
          <DialogDescription>
            Make sure it is in the standard format: ID, Name, Grade, Section
          </DialogDescription>
          <UploadStudentsForm setOpenAction={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
