"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { PASSWORD_PATTERN } from "@/lib/constants";
import { ErrorState, passwordResetProps } from "@/lib/types";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/app/_actions/auth-actions";

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

function ChangePasswordField({
  changePassword,
  setChangePassword,
  onPwdChanged,
}: {
  changePassword: boolean;
  setChangePassword?: Dispatch<SetStateAction<boolean>>;
  onPwdChanged: () => void;
}) {
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [error, setError] = useState<ErrorState>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  function updateFormData(fields: Partial<passwordResetProps>) {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  }

  const isValidPasswordPattern = (password: string) => {
    const passwordRegex = new RegExp(PASSWORD_PATTERN);
    setIsValidPassword(passwordRegex.test(password));
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    setIsLoading(true);

    // Clear error state
    setError({
      status: false,
      noPassword: false,
      invalidNewPassword: false,
      noMatch: false,
      message: "",
    });

    // Perform validations
    if (!formData.currentPassword) {
      setError({
        status: true,
        noPassword: true,
        message: "Current password is required.",
      });
      return;
    }

    if (!formData.password) {
      setError({
        status: true,
        invalidNewPassword: true,
        message: "New password is required.",
      });
      return;
    }

    if (!formData.confirmPassword) {
      setError({
        status: true,
        noMatch: true,
        message: "Confirm password is required.",
      });
      return;
    }

    if (!isValidPasswordPattern(formData.password)) {
      setError({
        status: true,
        invalidNewPassword: true,
        message:
          "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError({
        status: true,
        noMatch: true,
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await updatePassword(formData.password);

      if (!response.success) {
        setError({
          status: true,
          message: response?.message ?? "could not update the password",
        });
        return;
      }

      onPwdChanged();
    } catch (error) {
      // const res = await handlePwdReset ();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    changePassword && (
      <AnimatePresence mode="wait">
        <motion.div
          variants={slideDownInView}
          initial={"hidden"}
          animate={"visible"}
          exit={"hidden"}
          className="flex flex-col w-full py-4"
        >
          <div className="flex w-full flex-col gap-4">
            {!pathname.startsWith("/auth/reset-password") && (
              <Input
                id="old_password"
                label="Current Password"
                placeholder="Enter current password"
                type="password"
                isInvalid={Boolean(error?.noPassword)}
                errorMessage={error?.message as string}
                value={formData?.currentPassword}
                name="old-password"
                onChange={(e) =>
                  updateFormData({ currentPassword: e.target.value })
                }
              />
            )}
          </div>
          <div className="flex w-full flex-col gap-4">
            <Input
              id="new_password"
              label="New Password"
              placeholder="Enter new password"
              type="password"
              isInvalid={Boolean(error?.invalidNewPassword)}
              errorMessage={error?.message as string}
              name="new-password"
              onChange={(e) => updateFormData({ password: e.target.value })}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Your password must include letters numbers and symbols!"
            />
            <Input
              id="confirm_password"
              label="Confirm Password"
              placeholder="Confirm new password"
              type="password"
              isInvalid={Boolean(error?.noMatch)}
              errorMessage={error?.message}
              value={formData?.confirmPassword}
              onChange={(e) =>
                updateFormData({ confirmPassword: e.target.value })
              }
            />
            {formData?.password && <PasswordPatternRules />}

            {!pathname.startsWith("/auth/reset-password") && (
              <>
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    className="h-10 px-6 text-sm"
                    variant="light"
                    disabled={isLoading}
                    onPress={
                      setChangePassword
                        ? () => setChangePassword(false)
                        : undefined
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-10 px-8 text-sm"
                    disabled={isLoading || isValidPassword}
                    onClick={async () => await handleChangePassword()}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  );
}

function PasswordPatternRules() {
  return (
    <AnimatePresence>
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 100 },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex justify-start"
      >
        <ul className="flex list-disc flex-col pl-4 text-[10px] tracking-normal text-foreground/80 text-xs lg:text-sm">
          <li>Your New Password must have at least 8 characters</li>
          <li>Must contain at least 8 characters</li>
          <li>Must include uppercase letters</li>
          <li>Must include lowercase letters</li>
          <li>Must include a number & symbols</li>
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}

export default ChangePasswordField;
