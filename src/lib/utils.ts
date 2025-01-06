import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { AIRTEL_NO, ALLOWED_FILE_TYPES, MTN_NO, ZAMTEL_NO } from "./constants";

import { toast } from "@/hooks/use-toast";

export const notify = ({
  title,
  description,
  variant = "default",
}: {
  title?: string;
  description?: string;
  variant?: "default" | "danger" | "success" | "warning";
}) => {
  // DEFAULT
  return toast({
    title,
    description,
    variant: variant,
  });
};

export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  const currencyFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ZMW",
    minimumFractionDigits: 2,
  });
  return amount > 0 ? currencyFormat.format(amount) : "ZMW 0.00";
}

export function formatDate(inputDate: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formattedDate = new Date(inputDate).toLocaleDateString("en", options);

  const [month, day, year] = formattedDate.split(" ");

  return `${parseInt(day)}-${month}-${year}`;
}

export function compareObjects(obj1: any, obj2: any) {
  // Check if both are the same object reference
  if (obj1 === obj2) return true;

  // Check if either is not an object (null or primitive values)
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  // Get all keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // If the number of keys is different, objects are not equal
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Compare each key and value recursively
  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    if (!compareObjects(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function validateFileType(file: File) {
  return ALLOWED_FILE_TYPES.includes(file.type);
}

export function getUserInitials(name: string) {
  return name
    ?.split(" ")
    .map((i) => i[0])
    .join("");
}
