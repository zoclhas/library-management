export const dynamic = "force-dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import config from "@payload-config";
import { getPayload, PaginatedDocs } from "payload";
import { columns, Current } from "./columns";
import { DataTable } from "./data-table";
import { isPast, isToday, isWithinInterval, addDays, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookPlus } from "lucide-react";

async function getLogs() {
  try {
    const payload = await getPayload({ config });

    return payload.find({
      collection: "current",
      where: {
        returned: {
          equals: false,
        },
      },
      limit: 1000,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get logs. " + err);
  }
}

export default async function Dashboard() {
  const logs = (await getLogs()) as PaginatedDocs<Current>;

  const pastDue = logs.docs.filter(
    (log) =>
      log.due_date &&
      isPast(parseISO(log.due_date)) &&
      !isToday(parseISO(log.due_date)),
  ).length;
  const dueToday = logs.docs.filter(
    (log) => log.due_date && isToday(parseISO(log.due_date)),
  ).length;
  const dueSoon = logs.docs.filter((log) => {
    const dueDate = parseISO(log.due_date);
    return (
      log.due_date &&
      isWithinInterval(dueDate, {
        start: new Date(),
        end: addDays(new Date(), 365),
      })
    );
  }).length;

  return (
    <>
      <section className="pt-16">
        <Card className="border-0 bg-zinc-100 shadow-none dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl">Hello, Admin</CardTitle>
            <CardDescription>
              <Button
                variant="outline"
                className="text-black dark:text-white"
                asChild
              >
                <Link href="/lms/add">
                  <BookPlus /> Add Log
                </Link>
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Status Report: </p>
            <ul className="list-disc pl-4">
              <li>
                <strong>Books lent:</strong> {logs.totalDocs}
              </li>
              <li>
                <strong>Books past due:</strong> {pastDue}
              </li>
              <li>
                <strong>Books due today:</strong> {dueToday}
              </li>
              <li>
                <strong>Books due soon:</strong> {dueSoon}
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
      <section>
        <DataTable data={logs.docs} columns={columns} />
      </section>
    </>
  );
}
