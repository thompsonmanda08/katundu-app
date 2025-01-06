"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import ThemeSwitcher from "./theme-switcher";
import useNavigationStore from "@/context/navigation-store";
import Logo from "./logo";

function TopNavBar({
  authenticated = false,
  user = {} as Partial<User>,
  currentPage,
}: {
  authenticated?: boolean;
  user: Partial<User>;
  currentPage?: number;
}) {
  return (
    <nav
      className={cn(
        `fixed left-0 right-0 z-50 flex w-full items-center light:bg-background/60 py-3 md:pl-2 lg:top-0 backdrop-blur-md lg:justify-start bg-background/80 border-b border-foreground/5 `
      )}
    >
      <div className="flex w-full items-center px-5 relative container mx-auto">
        {currentPage == 0 ? (
          <>
            <h2
              className={cn(
                "font-semibold capitalize text-foreground md:text-xl"
              )}
            >
              Hello, {"User"}
            </h2>
          </>
        ) : (
          <div className="flex-col flex w-full">
            <span className="sr-only">Katundu Logo</span>
            <Logo href="#" />
          </div>
        )}
        {/* <div className="fixed left-[-20%] min-w-[420px] aspect-square rounded-full bg-primary-50/40 -z-50" /> */}
        <div className="relative z-50 ml-auto flex  items-center justify-center rounded-full">
          {/* <button
            className="p-2 max-w-fit hover:text-primary/80 transition-all duration-200 ease-in-out text-foreground w-fit z-30 absolute left-4 top-3 cursor-pointer lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Bars3Icon className="w-6 h-6cursor-pointer" />
          </button> */}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default TopNavBar;
