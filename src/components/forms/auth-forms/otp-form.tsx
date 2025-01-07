"use client";
import { ErrorState, ResetPasswordFormProps, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useOnBoardingStore from "@/context/onboarding-store";
import { InputOtp } from "@nextui-org/react";

// import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";

type OTPVerificationProps = ResetPasswordFormProps & {
  otp: string;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<ErrorState>>;
};

export default function OTPVerification({
  otp,
  updateFormData,
}: Partial<OTPVerificationProps>) {
  const [count, setCount] = useState(60);
  const [isDownToZero, setIsDownToZero] = useState(false);
  const { updateUserFields } = useOnBoardingStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      clearInterval(count);
      setIsDownToZero(true);
    }
  }, [count]);

  // async function handleResendOTP() {
  //   setIsLoading(true);
  //   setError({ status: false, message: "" });
  //   const response = await resendOTP(
  //     mobileOTPReference as string,
  //     registrationReference as string
  //   );

  //   if (response?.success) {
  //     notify("success", response.message);
  //     updateUserFields({
  //       mobileOTPReference: response?.data?.otpReference,
  //       otpReference: response?.data?.otpReference,
  //     });
  //     setCount(60);
  //     setIsDownToZero(false);
  //     setIsLoading(false);
  //     return;
  //   }

  //   notify("error", response.message);
  //   setIsLoading(false);
  //   return;
  // }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <label
          className="block font-medium leading-6 text-slate-500 text-sm mb-2"
          htmlFor={"otp"}
        >
          Enter your One-Time-Passcode
        </label>
        <InputOtp
          size="lg"
          isRequired
          variant="bordered"
          className="mr-auto"
          // isInvalid={error?.status}
          // errorMessage={error?.message}
          name={"passcode"}
          length={6}
          value={otp}
          onValueChange={(code: any) => updateFormData!({ code })}
        />
        {/* <InputOtp
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={otp}
          onChange={(value) => updateFormData!({ otp: value })}
          className="bg-red-500"
        >
          <InputOTPSlot
            index={0}
            autoFocus
            className="w-9 md:w-16 h-9 md:h-16 text-3xl text-primary-700 font-bold"
          />
          <InputOTPSlot
            index={1}
            className="w-9 md:w-16 h-9  md:h-16 text-3xl text-primary-700 font-bold"
          />
          <InputOTPSlot
            index={2}
            className="w-9 md:w-16 h-9  md:h-16 text-3xl text-primary-700 font-bold"
          />
          <InputOTPSlot
            index={3}
            className="w-9 md:w-16 h-9  md:h-16 text-3xl text-primary-700 font-bold"
          />
          <InputOTPSlot
            index={4}
            className="w-9 md:w-16 h-9  md:h-16 text-3xl text-primary-700 font-bold"
          />
          <InputOTPSlot
            index={5}
            className="w-9 md:w-16 h-9  md:h-16 text-3xl text-primary-700 font-bold"
          />
        </InputOtp> */}
      </div>

      {isDownToZero ? (
        <div className="flex justify-center items-center mb-4">
          <Button
            className="ml-auto font-semibold text-sm"
            // onPress={handleResendOTP}
            type="button"
            variant="light"
          >
            Resend OTP
          </Button>
        </div>
      ) : (
        <p className="w-full my-2 px-2 text-slate-500 justify-start items-center flex text-sm font-medium leading-snug mb-10">
          Request new Pass Code:{" "}
          <span className="text-slate-500 ml-auto text-base font-semibold mr-1 leading-normal">
            0:{count}
          </span>
          seconds
        </p>
      )}
    </div>
  );
}
