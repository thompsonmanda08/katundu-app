import React from "react";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";

type LoaderProps = {
  size?: number;
  loadingText?: string;
  color?: string;
  className?: string;
  classNames?: {
    container?: string;
    wrapper?: string;
    spinner?: string;
    text?: string;
  };
  isLandscape?: boolean;
  removeWrapper?: boolean;
};

function Loader({
  size = 50,
  loadingText,
  color,
  className,
  classNames,
  isLandscape,
  removeWrapper,
}: LoaderProps) {
  const { container, wrapper, spinner, text } = classNames || {};
  return (
    <div
      className={cn(
        "grid min-h-80 flex-1 flex-grow place-items-center rounded-xl bg-slate-200/10 aspect-square py-8",
        wrapper,
        { "shadow-none bg-transparent border-none": removeWrapper }
      )}
    >
      <div
        className={cn(
          "flex w-max flex-1 flex-col items-center justify-start gap-4",
          container,
          className,
          { "flex-row items-center justify-center gap-2": isLandscape }
        )}
      >
        <Spinner size={size} color={color} className={spinner} />
        {loadingText && (
          <p
            className={cn(
              "mt-4 max-w-sm break-words font-bold text-foreground/70",
              text,
              { "mt-0": isLandscape }
            )}
          >
            {loadingText}
          </p>
        )}
      </div>
    </div>
  );
}

export default Loader;
