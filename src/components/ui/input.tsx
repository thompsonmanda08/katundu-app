import * as React from "react";

import { cn } from "@/lib/utils";
import { InputProps, Input as NextInput } from "@heroui/react";

export type UIInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  InputProps;

const Input: React.FC<UIInputProps> = ({
  type,
  variant,
  className,
  ...props
}) => {
  return (
    <NextInput
      type={type}
      className={cn("", className)}
      variant={variant || "bordered"}
      {...props}
    />
  );
};

export { Input };
