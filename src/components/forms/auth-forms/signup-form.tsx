"use client";

import { Input } from "@/components/ui/input";
import { AuthFormData } from "@/lib/types";
import { Radio, RadioGroup } from "@heroui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";

type AuthFormProps = {
  formData: Partial<AuthFormData>;
  updateFormData: (fields: Partial<AuthFormData>) => void;
};

export default function SignUpForm({
  updateFormData,
  formData,
}: AuthFormProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          name="firstName"
          required
          label="First Name"
          value={formData.firstName}
          onChange={(e) =>
            updateFormData({
              firstName: e.target.value,
            })
          }
        />
        <Input
          name="lastName"
          value={formData.lastName}
          required
          label="Last Name"
          onChange={(e) =>
            updateFormData({
              lastName: e.target.value,
            })
          }
        />
      </div>

      <Input
        name="phone"
        type="tel"
        required
        label="Mobile Number"
        value={formData.phone}
        onChange={(e) =>
          updateFormData({
            phone: String(e.target.value),
          })
        }
      />

      <RadioGroup
        color="default"
        label="What best describes you?"
        orientation="horizontal"
        defaultValue={"SENDER"}
        value={formData.role || "SENDER"}
        onValueChange={(role) =>
          updateFormData({
            role: role as "SENDER" | "TRANSPORTER",
          })
        }
      >
        <Radio description="Sending cargo packages" value="SENDER">
          Sender
        </Radio>
        <Radio description="Transporting cargo packages" value="TRANSPORTER">
          Transporter
        </Radio>
      </RadioGroup>

      <Input
        name="password"
        required
        label="Password"
        type={isVisible ? "text" : "password"}
        value={formData.password}
        onChange={(e) =>
          updateFormData({
            password: e.target.value,
          })
        }
        endContent={
          Number(formData.password?.length) > 6 ? (
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="Toggle password visibility"
            >
              {isVisible ? (
                <EyeOffIcon className="pointer-events-none aspect-square h-6 w-6 text-foreground/40" />
              ) : (
                <EyeIcon className="pointer-events-none aspect-square h-6 w-6 text-foreground/40" />
              )}
            </button>
          ) : (
            <></>
          )
        }
      />
      <Input
        required
        label="Confirm Password"
        type={isVisible ? "text" : "password"}
        isInvalid={Boolean(
          formData?.password &&
            formData?.password.length > 5 &&
            formData?.password !== formData.confirmPassword
        )}
        errorMessage="Passwords do not match"
        value={formData.confirmPassword}
        onChange={(e) =>
          updateFormData({
            confirmPassword: e.target.value,
          })
        }
        endContent={
          Number(formData.password?.length) > 6 ? (
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="Toggle password visibility"
            >
              {isVisible ? (
                <EyeOffIcon className="pointer-events-none aspect-square h-6 w-6 text-foreground/40" />
              ) : (
                <EyeIcon className="pointer-events-none aspect-square h-6 w-6 text-foreground/40" />
              )}
            </button>
          ) : (
            <></>
          )
        }
      />
    </div>
  );
}
