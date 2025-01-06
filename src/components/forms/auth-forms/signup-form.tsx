"use client";

import { Input } from "@/components/ui/input";
import { AuthFormData } from "@/lib/types";

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
      <div className="flex flex-col md:flex-row gap-4">
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

      {/* <Input
        required
        name="Email"
        label="Email"
        placeholder="example@mail.com"
        onChange={(e) =>
          updateFormData({
            email: e.target.value,
          })
        }
      /> */}

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
