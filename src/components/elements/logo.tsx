"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";

type LogoProps = {
  href?: string;
  src?: string;
  alt?: string;
  name?: string;
  width?: number;
  height?: number;
  className?: string;
  isIcon?: boolean;
};

function Logo({
  href = "#",
  src,
  alt,

  className = "",
  isIcon = false,
}: LogoProps) {
  const { theme } = useTheme();
  const [logoUrl, setLogoUrl] = useState("/images/logo/logo-light.svg");

  useEffect(() => {
    let logoType: string;
    if (isIcon) {
      logoType =
        theme === "dark"
          ? `/images/logo/logo-icon-dark.svg`
          : "/images/logo/logo-icon-light.svg";
    } else {
      logoType =
        theme === "dark"
          ? `/images/logo/logo-dark.svg`
          : "/images/logo/logo-light.svg";
    }

    setLogoUrl(logoType);
  }, [theme, isIcon]);

  // RENDERER
  if (isIcon) {
    return (
      <Link href={href}>
        <div
          className={cn(
            `aspect-square flex justify-center w-full max-h-[48px] items-center min-w-fit`,
            className,
            {
              "max-w-[48px] mx-auto max-h-[48px] min-h-14": isIcon,
            }
          )}
        >
          <Image
            className="object-contain"
            src={logoUrl}
            width={50}
            height={50}
            alt={alt || "logo"}
            unoptimized
          />
        </div>
      </Link>
    );
  } else {
    return (
      <Link href={href}>
        <div className={cn(`w-full min-w-fit`, className)}>
          <Image
            className="object-contain transition-all duration-300 ease-in-out"
            src={src || logoUrl}
            width={160}
            height={60}
            alt={alt || "logo"}
            unoptimized
          />
        </div>
      </Link>
    );
  }
}

export default Logo;
