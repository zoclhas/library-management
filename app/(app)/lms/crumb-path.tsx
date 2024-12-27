"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const BreadcrumbsPath = () => {
  const pathname = usePathname().replace("/", "");
  const pathnames = pathname.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnames.map((p, i) => (
          <React.Fragment key={p + i}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href={joinPath(pathnames, i)} className="capitalize">
                  {p.replace("lms", "home")}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {i < pathnames.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

function joinPath(paths: string[], i: number): string {
  if (i < 0 || i >= paths.length) {
    throw new Error("Index out of bounds");
  }

  return "/" + paths.slice(0, i + 1).join("/");
}
