"use client";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { Button } from "../ui/button";

function NavIconButton({
  className,
  onClick,
  children,
}: PropsWithChildren & { className?: string; onClick?: (e?: any) => void }) {
  return (
    <Button
      isIconOnly
      variant="light"
      className={cn(
        "cursor-pointer border p-1 rounded-lg hover:text-primary bg-transparent text-foreground/80 hover:bg-transparent max-w-8 max-h-8 aspect-square",
        className
      )}
      onPress={onClick}
    >
      {children}
    </Button>
  );
}

export default NavIconButton;
