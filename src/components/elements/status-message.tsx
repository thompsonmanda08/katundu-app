"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ErrorState } from "@/lib/types";

function StatusMessage({
  status = false,
  message = "",
  type = "info",
}: ErrorState) {
  return (
    status && (
      <motion.div
        whileInView={{
          opacity: [0, 1],
          scale: [0.98, 1],
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
        className={cn(
          `my-2 flex min-h-[60px] w-full items-center justify-center rounded-lg p-4 px-5`,
          {
            "bg-rose-500/10 text-rose-600": type === "error",
            "bg-green-500/10 text-green-600": type === "success",
            "bg-sky-500/10 text-sky-600": type === "info",
            "bg-yellow-500/10 text-yellow-600": type === "warning",
          }
        )}
      >
        <p className={`text-xs font-semibold md:text-sm`}>{message}!</p>
      </motion.div>
    )
  );
}

export default StatusMessage;
