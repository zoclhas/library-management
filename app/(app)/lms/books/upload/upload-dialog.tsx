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
import { useState } from "react";
import { UploadBooksForm } from "./form";

export const UploadBooks = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BookUser /> <span>Upload Books</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Books (CSV)</DialogTitle>
          <DialogDescription>
            Make sure it is in the standard format: Date, Acc No., Title,
            Author, Place &amp; Publisher, Year, Pages, Volume, Source, Cost,
            Class No., ISBN No., Voucher No. &amp; Date, Remarks (Condition)
          </DialogDescription>
          <UploadBooksForm setOpenAction={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
