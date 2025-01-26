"use client";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import React, { useEffect } from "react";
import { BottomNavBar, TopNavBar } from "@/components/elements";
import { Account, Home, Packages } from "@/components/screens";
import { User } from "@/lib/types";
import useMainStore from "@/context/main-store";

export default function Dashboard({ user }: { user: User }) {
  const { setUser } = useMainStore((state) => state);
  const { currentTabIndex, activeTab, navigateTo } = useCustomTabsHook([
    <Home key={"home"} user={user} />,
    <Packages key={"cargo"} />,
    <Account key={"profile"} user={user} />,
  ]);

  useEffect(() => {
    if (user?.phone) {
      setUser(user);
    }
  }, [setUser, user]);

  return (
    <div className="relative flex min-h-screen flex-1 flex-col gap-4">
      <div className="fixed top-16 -z-50 aspect-square w-[420px] bg-gradient-to-br from-primary/30 via-transparent via-[50%] to-transparent" />
      <TopNavBar currentPage={currentTabIndex} />

      <div className="no-scrollbar container mx-auto max-h-screen overflow-y-auto pb-28 pt-20">
        {activeTab}
      </div>

      <BottomNavBar
        selected={String(currentTabIndex)}
        setSelected={navigateTo}
        classNames={{ wrapper: "fixed bottom-0 w-full z-50" }}
      />
    </div>
  );
}
