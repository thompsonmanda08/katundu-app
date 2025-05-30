"use client";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

import Lottie from "react-lottie-player";

import successLottie from "../../../public/lottie/success.json";
import loadingLottie from "../../../public/lottie/loading.json";
import errorLottie from "../../../public/lottie/error.json";
import { cn } from "@/lib/utils";
import { RotateCcwIcon } from "lucide-react";

function StatusBox({
  title,
  description,
  status,
  onPress,
  buttonText,
  dismissText,
}: {
  title: string;
  description: string;
  status: string;
  onPress?: any;
  buttonText?: string;
  dismissText?: string;
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
      className="relative z-0 mx-auto flex w-full max-w-[412px] flex-col gap-4 px-5 md:mt-20 md:max-w-[560px]"
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
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center object-contain">
        <Lottie
          loop
          animationData={lottieFile}
          play
          style={{ width: 180, height: 180 }}
        />
        {dismissText && (
          <>
            <span className="mx-auto flex items-center justify-center text-center text-sm font-semibold leading-6 text-foreground/80">
              {dismissText}
            </span>
            <Button
              onPress={() => {
                window.location.reload();
              }}
              variant="flat"
              color={
                String(status)?.toUpperCase() == "SUCCESS"
                  ? "success"
                  : "primary"
              }
              className={cn("my-4 w-full")}
              startContent={<RotateCcwIcon className="h-4 w-4" />}
            >
              Reload
            </Button>
          </>
        )}
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
