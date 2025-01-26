"use client";
import React, { FormEvent, useEffect } from "react";
import Link from "next/link";

import useOnBoardingStore from "@/context/onboarding-store";
import { APIResponse, AuthFormData, ErrorState, UserRole } from "@/lib/types";

import { motion, AnimatePresence } from "framer-motion";

import { useRouter, useSearchParams } from "next/navigation";
import { Logo, StatusMessage } from "@/components/elements";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Radio, RadioGroup } from "@heroui/react";

type AuthFormProps = {
  formData: AuthFormData;
  updateFormData: (fields: Partial<AuthFormData>) => void;
};

function LoginForm({ formData, updateFormData }: AuthFormProps) {
  const { push } = useRouter();

  const [error, setError] = React.useState<ErrorState>({
    status: false,
    message: "",
  });

  useEffect(() => {
    setError({
      status: false,
      message: "",
    });
  }, [formData]);

  return (
    <>
      <RadioGroup
        color="default"
        label="Login as"
        orientation="horizontal"
        className="my-1 mb-4"
        classNames={{
          wrapper: "gap-6",
        }}
        value={formData.role}
        onValueChange={(role) =>
          updateFormData({
            role: role as UserRole,
          })
        }
      >
        <Radio value="SENDER">Sender</Radio>
        <Radio value="TRANSPORTER">Transporter</Radio>
      </RadioGroup>
      <div className="flex flex-col gap-y-4">
        <Input
          type="text"
          label="Mobile Number"
          value={formData.phone}
          isInvalid={Boolean(error.status)}
          onChange={(e) =>
            updateFormData({
              username: e.target.value,
              email: e.target.value,
              phone: e.target.value,
            })
          }
        />

        <Input
          label="Password"
          type="password"
          name="password"
          isInvalid={Boolean(error.status)}
          value={formData.password}
          onChange={(e) => updateFormData({ password: e.target.value })}
        />
        <Link
          href={"/auth/reset-password"}
          className="-mt-2 ml-auto flex px-2 text-xs font-medium text-primary hover:text-primary/80 md:text-sm"
        >
          Forgot password?
        </Link>
        {/******** ERROR MESSAGES *********/}
        {error.status && (
          <div className="w-full">
            <StatusMessage
              status={error.status}
              type="error"
              message={error.message}
            />
          </div>
        )}
        {/******** ERROR MESSAGES *********/}
      </div>
    </>
  );
}

export default LoginForm;
