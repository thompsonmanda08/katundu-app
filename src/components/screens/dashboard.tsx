"use client";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import React from "react";
import { BottomNavBar, TopNavBar } from "@/components/elements";
import useMainStore from "@/context/main-store";
import { Account, Home, Packages } from "@/components/screens";

export default function Dashboard() {
  const { user: currentUser } = useMainStore((state) => state);
  const {
    currentTabIndex,
    activeTab,
    isFirstTab,
    isLastTab,
    navigateTo,
    isLoading,
    setIsLoading,
  } = useCustomTabsHook([
    <Home key={"home"} />,
    <Packages key={"cargo"} />,
    <Account key={"profile"} user={currentUser} />,
  ]);
  return (
    <div className="flex flex-col gap-4 relative flex-1 min-h-screen">
      <TopNavBar currentPage={currentTabIndex} user={currentUser} />

      <div className="pt-20 container mx-auto overflow-y-auto max-h-screen no-scrollbar pb-28">
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
