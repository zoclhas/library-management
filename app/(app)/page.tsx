import { getToken } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = await getToken();
  if (token) redirect("/lms");

  return;
}
