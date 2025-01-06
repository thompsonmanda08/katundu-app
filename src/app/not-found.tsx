"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Logo } from "@/components/elements";
import AuthLayout from "./auth/layout";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

export default function NotFound() {
  return (
    <AuthLayout>
      <div className="flex items-center justify-center m-auto">
        <Card className="m-auto aspect-square w-full max-w-sm flex-auto p-6 font-inter self-start">
          <CardHeader>
            <Logo href="/" isIcon={true} className="mx-auto" />
          </CardHeader>
          <CardBody className="flex cursor-pointer select-none flex-col w-full items-center justify-center p-0">
            <p className="text-[clamp(32px,5vw,60px)] font-bold leading-normal  text-primary-700">
              404
            </p>
            <h1 className="text-lg font-semibold capitalize text-gray-900">
              Page not found
            </h1>
            <p className="text-center text-sm font-medium text-foreground/80">
              Sorry, we couldn’t find the page you’re looking for. Try reloading
              the page, or go back to the homepage.
            </p>
          </CardBody>

          <CardFooter className="flex items-center justify-center mt-4">
            <Link href="/">
              <Button className="w-full">Go back home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AuthLayout>
  );
}
