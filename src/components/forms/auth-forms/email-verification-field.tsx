"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ErrorState } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  sendEmailResetVerificationCode,
  verifyVerificationCode,
} from "@/app/_actions/auth-actions";

const slideDownInView = {
  hidden: {
    opacity: 0,
    y: -100,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

interface EmailVerificationFieldProps {
  onVerified: () => void;
}

function EmailVerificationField({ onVerified }: EmailVerificationFieldProps) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<ErrorState>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);

  const handleSendVerificationCode = async () => {
    setIsLoading(true);

    setError({
      status: false,
      message: "",
    });

    if (!email) {
      setError({
        status: true,
        message: "Email address is required.",
      });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({
        status: true,
        message: "Please enter a valid email address.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await sendEmailResetVerificationCode(email);

      if (!response?.success) {
        setError({
          status: true,
          message: response?.message ?? "Could not sent the verification code.",
        });
        return;
      }

      setIsCodeSent(true);
    } catch (err) {
      setError({
        status: true,
        message: "Failed to send verification code. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);

    setError({
      status: false,
      message: "",
    });

    if (!verificationCode) {
      setError({
        status: true,
        message: "Verification code is required.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await verifyVerificationCode(email, verificationCode);

      if (!response.success) {
        setError({
          status: true,
          message: response?.message ?? "Could not verify the code.",
        });
        return;
      }
      onVerified();
    } catch (err) {
      setError({
        status: true,
        message: "Failed to verify code. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={slideDownInView}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="flex flex-col py-4"
      >
        <div className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email Address"
            placeholder="Enter your email address"
            type="email"
            isInvalid={Boolean(error?.status && !isCodeSent)}
            errorMessage={!isCodeSent ? error?.message : ""}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          {!isCodeSent && (
            <Button
              size="sm"
              className="h-10 px-8 text-sm"
              disabled={isLoading || isCodeSent}
              onPress={handleSendVerificationCode}
            >
              {isLoading && !isCodeSent ? "Sending..." : "Send Code"}
            </Button>
          )}
        </div>

        {isCodeSent && (
          <motion.div
            variants={slideDownInView}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col gap-4"
          >
            <Input
              id="verification-code"
              label="Verification Code"
              placeholder="Enter the verification code"
              type="text"
              isInvalid={Boolean(error?.status && isCodeSent)}
              errorMessage={isCodeSent ? error?.message : ""}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                className="h-10 px-8 text-sm"
                disabled={isLoading}
                onPress={handleVerifyCode}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default EmailVerificationField;
