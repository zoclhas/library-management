import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Dashboard() {
  return (
    <>
      <section className="pt-16">
        <Card className="border-0 bg-zinc-100 shadow-none dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl">Hello, Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Status Report: </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
