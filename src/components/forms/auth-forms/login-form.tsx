"use client";
import React, { useEffect } from "react";
import Link from "next/link";

import { AuthFormData, ErrorState } from "@/lib/types";

import { useRouter } from "next/navigation";
import { StatusMessage } from "@/components/elements";
import { Input } from "@/components/ui/input";
import { LockIcon, Smartphone } from "lucide-react";

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
      <div className="flex flex-col gap-y-4">
        <Input
          type="tel"
          label="Mobile Number"
          value={formData.phone}
          isInvalid={Boolean(error.status)}
          endContent={
            <Smartphone className="pointer-events-none aspect-square h-6 w-6 text-default-400" />
          }
          onChange={(e) =>
            updateFormData({
              phone: String(e.target.value),
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
          endContent={
            <LockIcon className="pointer-events-none aspect-square h-6 w-6 text-default-400" />
          }
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
