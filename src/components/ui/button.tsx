import * as React from "react";

import { ButtonProps, Button as NextUIButton } from "@nextui-org/react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  loadingText,
  size = "lg",
  className,
  ...props
}: ButtonProps & {
  loadingText?: string;
}) {
  props.variant ??= "solid";
  props.color ??= "primary";

  return (
    <NextUIButton
      radius="sm"
      size={size}
      spinner={
        <svg
          className="h-5 w-5 animate-spin text-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          />
        </svg>
      }
      className={cn("min-w-max font-semibold", className)}
      {...props}
    >
      {props.isLoading ? loadingText || "" : children}
    </NextUIButton>
  );
}
