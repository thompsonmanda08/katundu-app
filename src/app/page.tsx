import { verifySession } from "@/lib/session";
import Dashboard from "./(tabs)/page";
import { Suspense } from "react";
import LoadingPage from "./loading";

export default async function App({ searchParams }: { searchParams: any }) {
  const { isAuthenticated, user } = await verifySession();

  // if (!isAuthenticated) redirect("/auth");

  return (
    <Suspense fallback={<LoadingPage loadingText="Please wait..." />}>
      <Dashboard user={user} />{" "}
    </Suspense>
  );
}
