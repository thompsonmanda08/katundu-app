import { verifySession } from "@/lib/session";
import Dashboard from "./(root)/page";
import { Suspense } from "react";
import LoadingPage from "./loading";
import { User } from "@/lib/types";

export default async function App() {
  // const { isAuthenticated, user } = await verifySession();

  // if (!isAuthenticated) redirect("/auth");

  return (
    <Suspense fallback={<LoadingPage loadingText="Please wait..." />}>
      <Dashboard />{" "}
    </Suspense>
  );
}
