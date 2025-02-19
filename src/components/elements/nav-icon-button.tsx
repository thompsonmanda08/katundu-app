"use client";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { Button } from "../ui/button";

function NavIconButton({
  className,
  onClick,
  isLoading,
  children,
}: PropsWithChildren & {
  className?: string;
  onClick?: (e?: any) => void;
  isLoading?: boolean;
}) {
  return (
    <Button
      isIconOnly
      isLoading={isLoading}
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
