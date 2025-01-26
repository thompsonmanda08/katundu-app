"use client";

import { CustomRadio } from "@/components/ui/custom-radio";
import { Input } from "@/components/ui/input";
import { AuthFormData, User, UserRole } from "@/lib/types";
import { Radio, RadioGroup } from "@heroui/react";

type AuthFormProps = {
  formData: AuthFormData;
  updateFormData: (fields: Partial<AuthFormData>) => void;
};

export default function SignUpForm({
  updateFormData,
  formData,
}: AuthFormProps) {
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
        required
        label="Mobile Number"
        value={formData.phone}
        onChange={(e) =>
          updateFormData({
            phone: e.target.value,
          })
        }
      />

      <RadioGroup
        color="default"
        label="What best describes you?"
        orientation="horizontal"
        value={formData.role}
        onValueChange={(role) =>
          updateFormData({
            role: role as UserRole,
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
        type="password"
        value={formData.password}
        onChange={(e) =>
          updateFormData({
            password: e.target.value,
          })
        }
      />
      <Input
        required
        label="Confirm Password"
        type="password"
        isInvalid={
          formData.password.length > 5 &&
          formData.password !== formData.confirmPassword
        }
        errorMessage="Passwords do not match"
        value={formData.confirmPassword}
        onChange={(e) =>
          updateFormData({
            confirmPassword: e.target.value,
          })
        }
      />
    </div>
  );
}
