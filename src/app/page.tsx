import { verifySession } from "@/lib/session";
import { Suspense } from "react";
import LoadingPage from "./loading";
import { User } from "@/lib/types";
import { Dashboard } from "@/components/screens";

export default async function App() {
  // const { isAuthenticated, user } = await verifySession();

  // if (!isAuthenticated) redirect("/auth");

  return (
    <Suspense fallback={<LoadingPage loadingText="Please wait..." />}>
      <Dashboard />{" "}
    </Suspense>
  );
}
