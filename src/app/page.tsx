import { verifySession } from "@/lib/session";
import { Suspense } from "react";
import LoadingPage from "./loading";
import { User } from "@/lib/types";
import { Dashboard } from "@/components/screens";
import { getCities } from "./_actions/config-actions";
import { redirect } from "next/navigation";

export default async function App() {
  const { isAuthenticated, session } = await verifySession();

  if (!isAuthenticated) redirect("/auth");

  return (
    <Suspense fallback={<LoadingPage loadingText="Please wait..." />}>
      <Dashboard
        user={session?.user as User}
        isAuthenticated={isAuthenticated}
      />{" "}
    </Suspense>
  );
}
