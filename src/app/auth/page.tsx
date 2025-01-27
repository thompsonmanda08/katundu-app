"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { APIResponse, AuthFormData, ErrorState } from "@/lib/types";

import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { Logo, StatusMessage } from "@/components/elements";
import { Button } from "@/components/ui/button";
import { SignUpForm, LoginForm } from "@/components/forms";
import { cn, notify } from "@/lib/utils";
import { authenticateUser, registerNewUser } from "@/app/_actions/auth-actions";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { form, Tab, Tabs } from "@heroui/react";
import { containerVariants } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const AUTH_TABS = [
  {
    ID: "0",
    title: "Login",
    description: "Provide your login credentials as a: ",
    actionButton: "Login",
  },
  {
    ID: "1",
    title: "Create a new account",
    description: "Let's get you set up with an account.",
    actionButton: "Register",
  },
];

export default function AuthPage() {
  // INITIALIZE STATE
  const [formData, setFormData] = useState<AuthFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState<ErrorState>({
    status: false,
    message: "",
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateFormData = (fields: Partial<AuthFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const {
    currentTabIndex,
    activeTab,
    isFirstTab,
    navigateTo,
    navigateBackwards,
    navigateForward,
    isLoading,
    setIsLoading,
  } = useCustomTabsHook([
    <LoginForm
      key="login"
      formData={formData}
      updateFormData={updateFormData}
    />,
    <SignUpForm
      key="register"
      formData={formData}
      updateFormData={updateFormData}
    />,
  ]);

  function setLoadingState(x: boolean) {
    setIsLoading(x);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    let response: APIResponse = {
      status: 200,
      message: "",
      success: false,
      statusText: "",
      data: null,
    };

    //********* STEP 0: LOG INTO ACCOUNT************ //
    if (currentTabIndex == 0) {
      response = await authenticateUser({
        phone: formData?.phone,
        password: formData?.password,
        role: formData?.role,
      });

      if (response?.success) {
        notify({
          title: "Login Successful",
          description: "You now have access to your account",
        });

        //
        queryClient.invalidateQueries();
        window.location.href = "/"; // HARD ROUTING - FULL PAGE RELOAD
        // router.push("/"); // SOFT ROUTING

        return;
      }
    }

    //********* STEP 1: ACCOUNT CREATION ************ //
    if (currentTabIndex == 1) {
      response = await registerNewUser({
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        password: formData?.password,
        phone: formData?.phone,
        role: formData?.role,
      });

      if (response?.success) {
        notify({
          title: "Registration Successful",
          description: "You can now login to your account",
        });
        setIsLoading(false);
        navigateBackwards();
        return;
      }
    }

    //**************** IF SOMETHING GOES WRONG *************** //
    setError({ status: true, type: "error", message: response?.message });
    notify({
      title: "Registration Error",
      description: response?.message,
      variant: "danger",
    });
    setIsLoading(false);
    return;
  }

  useEffect(() => {
    setError({
      status: false,
      message: "",
    });
    setIsLoading(false);
    window.scrollTo(0, 0);
  }, [currentTabIndex, setIsLoading]);

  return (
    <>
      <form
        id="auth-form"
        onSubmit={onSubmit}
        className={cn(
          "mx-auto flex w-full max-w-[412px] flex-col gap-4 px-5 pt-24 md:max-w-[560px]"
        )}
      >
        <Tabs
          aria-label="auth-options"
          color="primary"
          size="lg"
          variant="bordered"
          classNames={{
            tabList: "w-full",
          }}
          radius="sm"
          selectedKey={String(currentTabIndex)}
          onSelectionChange={navigateTo}
        >
          {AUTH_TABS.map((tab, index) => (
            <Tab key={String(index)} title={tab.actionButton} />
          ))}
        </Tabs>

        {/* ACCOUNT INITIALIZATION */}
        <AnimatePresence mode="wait">
          <motion.div
            variants={containerVariants}
            key={currentTabIndex}
            initial={"initial"}
            animate={"animate"}
            exit={"exit"}
            className=""
          >
            <div className="mb-4 flex w-full flex-col gap-2">
              <h3 className="text-[clamp(20px,1rem+1vw,1.75rem)] font-bold text-foreground">
                {AUTH_TABS[currentTabIndex].title}
              </h3>
              <p className="text-sm text-foreground/80">
                {AUTH_TABS[currentTabIndex].description}
              </p>
            </div>
            {/* COMPONENT TO BE RENDERED */}
            {activeTab}
            {/* COMPONENT TO BE RENDERED */}

            {error?.status && (
              <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 text-center">
                <StatusMessage
                  status={error.status}
                  type={error.type}
                  message={error.message}
                />
              </div>
            )}

            <Button
              className="mt-4 w-full flex-1"
              disabled={isLoading}
              type="submit"
              isLoading={isLoading}
            >
              {AUTH_TABS[currentTabIndex].actionButton}
            </Button>
          </motion.div>
          <div className="flex items-center justify-center">
            <p className="text-sm text-foreground/80">
              {isFirstTab ? "Don't have account?" : "Already have account?"}{" "}
              <span
                className="cursor-pointer font-semibold text-primary underline-offset-4 hover:underline"
                onClick={isFirstTab ? navigateForward : navigateBackwards}
              >
                {isFirstTab ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </AnimatePresence>
      </form>
    </>
  );
}
