"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import NavIconButton from "./nav-icon-button";
import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function ThemeSwitcher({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NavIconButton
      className={cn(className)}
      onClick={() => {
        if (theme === "light") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      }}
    >
      {theme === "light" ? (
        <MoonIcon className="aspect-square w-6 p-0.5" />
      ) : (
        <SunIcon className="aspect-square w-6 p-0.5" />
      )}
    </NavIconButton>
  );
}

export default ThemeSwitcher;
