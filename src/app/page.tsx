import { verifySession } from "@/lib/session";
import Dashboard from "./(tabs)/page";
import { redirect } from "next/navigation";

export default async function App({ searchParams }: { searchParams: any }) {
  const { isAuthenticated, user } = await verifySession();

  // if (!isAuthenticated) redirect("/auth");

  return <Dashboard user={user} />;
}
