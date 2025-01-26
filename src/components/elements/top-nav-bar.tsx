"use client";
import React from "react";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "./theme-switcher";
import Logo from "./logo";

function TopNavBar({
  authenticated = false,
  currentPage,
}: {
  authenticated?: boolean;
  currentPage?: number;
}) {
  return (
    <nav
      className={cn(
        `fixed left-0 right-0 z-50 flex w-full items-center light:bg-background/60 py-3 md:pl-2 lg:top-0 backdrop-blur-md lg:justify-start bg-background/80 border-b border-foreground/5 `
      )}
    >
      <div className="container relative mx-auto flex w-full items-center px-5">
        <div className="flex w-full flex-col">
          <span className="sr-only">Katundu Logo</span>
          <Logo href="/" />
        </div>
        {/* <div className="fixed left-[-20%] -z-50 aspect-square min-w-[420px] rounded-full bg-primary-50/40" /> */}
        <div className="relative z-50 ml-auto flex items-center justify-center rounded-full">
          {/* <button
            className="absolute left-4 top-3 z-30 w-fit max-w-fit cursor-pointer p-2 text-foreground transition-all duration-200 ease-in-out hover:text-primary/80 lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Bars3Icon className="h-6cursor-pointer w-6" />
          </button> */}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default TopNavBar;
