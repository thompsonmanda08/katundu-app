"use client";

import { cn, getUserInitials } from "@/lib/utils";
import { AvatarProps, Avatar as NextAvatar } from "@heroui/react";

function Avatar({
  name,
  src,
  subText,
  showUserInfo,
  classNames,
  width,
  height,
  ...props
}: AvatarProps & {
  showUserInfo?: boolean;
  subText?: string;
  width?: number;
  height?: number;
  classNames?: {
    avatar?: string;
    userInfoWrapper?: string;
    name?: string;
    subText?: string;
  };
}) {
  return (
    <div
      className="flex cursor-pointer items-center justify-start gap-2
							transition-all duration-200 ease-in-out"
    >
      <span className="sr-only">user avatar</span>
      <NextAvatar
        className={cn("h-8 w-8 flex-none rounded-xl", classNames?.avatar)}
        src={src}
        // name={getUserInitials(name as string)}
        alt={`Image - ${name}`}
        width={width || 200}
        height={height || 200}
        showFallback={Boolean(src)}
        color="primary"
        {...props}
      />

      {showUserInfo && (
        <div
          className={cn(
            "flex min-w-[120px] flex-col items-start gap-1",
            classNames?.userInfoWrapper
          )}
        >
          <p
            className={cn(
              "text-sm font-semibold text-foreground-600",
              classNames?.name
            )}
          >
            {name}
          </p>
          <p
            className={cn(
              "-mt-1 ml-0.5 text-sm font-medium text-foreground/50",
              classNames?.subText
            )}
          >
            {subText}
          </p>
        </div>
      )}
    </div>
  );
}

export default Avatar;
