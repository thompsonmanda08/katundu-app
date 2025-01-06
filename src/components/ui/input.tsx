import * as React from "react";

import { cn } from "@/lib/utils";
import { InputProps, Input as NextInput } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export type UIInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  InputProps;
const Input = React.forwardRef<HTMLInputElement, UIInputProps>(
  ({ ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const { type, value, endContent, variant, isInvalid, className } = {
      ...props,
    };

    const validateEmail = (value: any) =>
      value?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const isInvalidEmail = React.useMemo(() => {
      if (type != "email" || value === "") return false;
      return validateEmail(value) ? false : true;
    }, [value, type]);
    return (
      <NextInput
        className={cn("", className)}
        variant={variant || "bordered"}
        isInvalid={isInvalid || isInvalidEmail}
        type={isVisible && type == "password" ? "text" : type}
        endContent={
          type == "password" && Number(value?.length) > 1 ? (
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeOffIcon className="w-6 h-6 aspect-square text-foreground/40 pointer-events-none" />
              ) : (
                <EyeIcon className="w-6 h-6 aspect-square text-foreground/40 pointer-events-none" />
              )}
            </button>
          ) : (
            endContent
          )
        }
        // ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
