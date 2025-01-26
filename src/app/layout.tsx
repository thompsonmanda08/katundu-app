import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";

const inter = localFont({
  src: "font/Inter-VariableFont_slnt,wght.ttf",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Katundu | Cargo Transportation System",
  description: "Transport your katundu with ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`${inter.className} antialiased overflow-clip`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
