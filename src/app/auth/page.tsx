"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { APIResponse, AuthFormData, ErrorState } from "@/lib/types";

import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { Logo, StatusMessage } from "@/components/elements";
import { Button } from "@/components/ui/button";
import { SignUpForm, LoginForm } from "@/components/forms";
import { notify } from "@/lib/utils";
import { registerNewUser } from "@/app/_actions/auth-actions";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Tab, Tabs } from "@nextui-org/react";
import { containerVariants } from "@/lib/constants";

const AUTH_TABS = [
  {
    ID: "0",
    title: "Login",
    description: "Provide your login credentials.",
    actionButton: "Login",
  },
  {
    ID: "1",
    title: "Create a new account",
    description: "Your real estate journey begins here. Let's get you set up.",
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

  // async function handleUserLogin(e: FormEvent<HTMLFormElement>) {
  // e.preventDefault();
  // // const response = await logUserIn();

  // if (response?.success) {
  //   const loginUrl = urlParams.get("callbackUrl") || "/";
  //   push(loginUrl);
  // } else {
  //   setError({
  //     status: true,
  //     message: response?.message,
  //   });
  // }
  // }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    navigateForward();

    let response: APIResponse = {
      status: 200,
      message: "",
      success: false,
      statusText: "",
      data: null,
    };

    //********* STEP 0: ACCOUNT INITIALIZATION ************ //
    if (currentTabIndex == 0) {
      response = await registerNewUser(formData);

      if (response?.success) {
        notify({
          title: "Registration Successful",
          description: response?.message,
        });

        window.location.href = "/";
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
        className="max-w-[412px] md:max-w-[560px] w-full flex flex-col gap-4 px-5 pt-24 mx-auto"
      >
        <div className="flex-col flex gap-2 w-full mb-4">
          <span className="sr-only">Katundu Logo</span>
          <Logo href="/" />
          {/* <h3 className="text-foreground text-[clamp(20px,1rem+1vw,1.75rem)] font-bold ">
                {AUTH_TABS[currentTabIndex].title}
              </h3>
              <p className="text-sm text-foreground/80">
                {AUTH_TABS[currentTabIndex].description}
              </p> */}
        </div>
        <Tabs
          aria-label="auth-options"
          color="primary"
          size="lg"
          variant="bordered"
          classNames={{
            tabList: "w-full",
          }}
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
          >
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
              className="flex-1 w-full mt-4"
              disabled={isLoading}
              type="submit"
              isLoading={isLoading}
            >
              {AUTH_TABS[currentTabIndex].actionButton}
            </Button>
          </motion.div>
          <div className="flex justify-center items-center">
            <p className="text-sm text-foreground/80">
              {isFirstTab ? "Don't have account?" : "Already have account?"}{" "}
              <span
                className="text-primary font-semibold hover:underline underline-offset-4 cursor-pointer"
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
