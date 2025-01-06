"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "../../ui/button";

import { APIResponse, ErrorState, ResetPasswordFormProps } from "@/lib/types";

import useCustomTabsHook from "@/hooks/use-custom-tabs";
import StatusMessage from "../../elements/status-message";
import Link from "next/link";
import { Input } from "../../ui/input";
import OTPVerification from "./otp-form";
import ChangePasswordField from "./change-password-form";
import { Logo } from "@/components/elements";

const ONBOARDING_STEPS = [
  {
    ID: 0,
    title: "Reset Password",
    description: "Enter the email address associated with your account.",
  },
  {
    ID: 1,
    title: "Reset Password - OTP Verification",
    description: "An OTP has been sent to your email address.",
  },
  {
    ID: 2,
    title: "Reset Password - New Password",
    description: "Create a new password.",
  },
  {
    ID: 3,
    title: "Reset Password - Success",
    description: "Create a new password.",
  },
];

export default function ResetPasswordForm() {
  // INITIALIZE STATE
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  function updateFormData(fields: { [key: string]: unknown }) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...fields,
    }));
  }

  const [error, setError] = useState<ErrorState>({
    status: false,
    message: "",
  });

  const {
    currentTabIndex,
    activeTab,
    isFirstTab,
    isLastTab,
    navigateBackwards,
    navigateForward,
    isLoading,
    setIsLoading,
  } = useCustomTabsHook([
    <ProvideEmailStep
      key={ONBOARDING_STEPS[0]?.ID}
      {...formData}
      handleInputChange={handleInputChange}
    />,
    <OTPVerification
      key={ONBOARDING_STEPS[0]?.ID}
      {...formData}
      updateFormData={updateFormData}
    />,
    <ChangePasswordField
      changePassword={true}
      key={ONBOARDING_STEPS[0]?.ID}
      onPwdChanged={() => {}}
    />,
  ]);

  function setLoadingState(x: boolean) {
    setIsLoading(x);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    navigateForward();

    const response: APIResponse = {
      status: 200,
      message: "",
      success: false,
      statusText: "",
      data: null,
    };

    //**************** IF SOMETHING GOES WRONG *************** //
    setError({ status: true, message: response?.message });
    setIsLoading(false);
    return;
  }

  return (
    <div className="max-w-lg m-auto">
      <>
        <span className="sr-only">Katundu Logo</span>
        <Logo href="/" />
        <AnimatePresence>
          <motion.div
            key={currentTabIndex}
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                ease: "easeInOut",
                duration: 0.25,
              },
            }}
            exit={{ opacity: 0, x: 100 }}
            className="flex-col flex  w-full my-4"
          >
            <h3 className="text-foreground text-[clamp(20px,1rem+1vw,1.75rem)] font-bold ">
              {ONBOARDING_STEPS[currentTabIndex].title}
            </h3>
            <p className="text-sm text-foreground/80">
              {ONBOARDING_STEPS[currentTabIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </>

      <form
        id="password-reset-form"
        onSubmit={onSubmit}
        className="w-full flex flex-col gap-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTabIndex}
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                // type: "spring",
                // stiffness: 300,
                ease: "easeInOut",
                duration: 0.25,
              },
            }}
            exit={{ opacity: 0, y: -100 }}
          >
            {/* COMPONENT TO BE RENDERED */}
            {activeTab}
            {/* COMPONENT TO BE RENDERED */}

            {error?.status && (
              <div className="mx-auto flex w-full flex-col items-center justify-center text-center">
                <StatusMessage
                  status={error.status}
                  type={error.type}
                  message={error.message}
                />
              </div>
            )}

            <div className="flex gap-4 mt-4">
              {!isFirstTab && (
                <Button
                  className="flex-1 w-full"
                  variant="bordered"
                  type="button"
                  onPress={navigateBackwards}
                >
                  Back
                </Button>
              )}
              <Button
                className="flex-1 w-full "
                disabled={isLoading}
                type="submit"
                isLoading={isLoading}
              >
                {isLastTab ? "Reset Password" : "Next"}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
      <div className="mt-8">
        <p className="text-sm text-foreground/80 text-center max-w-max mx-auto">
          I already have access,{" "}
          <Link
            href={"/auth"}
            className="text-primary hover:underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function ProvideEmailStep({
  handleInputChange,
}: Partial<ResetPasswordFormProps>) {
  return (
    <>
      <Input
        type="email"
        label="Email"
        name="email"
        required={true}
        placeholder="Enter your email"
        onChange={handleInputChange}
      />
    </>
  );
}
