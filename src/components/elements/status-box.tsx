"use client";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

import Lottie from "react-lottie-player";

import successLottie from "../../../public/lottie/success.json";
import loadingLottie from "../../../public/lottie/loading.json";
import errorLottie from "../../../public/lottie/error.json";
import { cn } from "@/lib/utils";

function StatusBox({
  title,
  description,
  status,
  onPress,
  buttonText,
}: {
  title: string;
  description: string;
  status: string;
  onPress?: any;
  buttonText?: string;
}) {
  const [lottieFile, setLottieFile] = React.useState<any>(loadingLottie);

  React.useEffect(() => {
    if (status == "SUCCESS") {
      setLottieFile(successLottie);
    } else if (status == "FAILED") {
      setLottieFile(errorLottie);
    } else {
      setLottieFile(loadingLottie);
    }
  }, [status]);
  return (
    <motion.div
      key={status + title}
      whileInView={{
        opacity: [0, 1],
        scaleX: [0.8, 1],
        transition: {
          type: "spring",
          stiffness: 300,
          ease: "easeInOut",
          duration: 0.25,
        },
      }}
      className="relative z-0 mx-auto my-20 flex w-full max-w-[412px] flex-col gap-4 px-5 md:mt-20 md:max-w-[560px]"
    >
      <span
        className={cn(
          "mx-auto max-w-max rounded-full border border-primary/20 p-1 px-4 font-semibold text-primary",
          {
            "text-success border-success/20":
              String(status)?.toUpperCase() == "SUCCESS",
            "text-danger border-danger/20":
              String(status)?.toUpperCase() == "FAILED",
          }
        )}
      >
        {title}
      </span>
      <span className="max-w-md text-center text-sm font-medium leading-6 text-foreground/60">
        {description}
      </span>
      <div className="mx-auto max-w-sm object-contain">
        <Lottie
          loop
          animationData={lottieFile}
          play
          style={{ width: 220, height: 220 }}
        />
      </div>
      {onPress && (
        <Button onPress={onPress} className={"my-4 w-full"}>
          {buttonText || "Done"}
        </Button>
      )}
    </motion.div>
  );
}

export default StatusBox;
