import type { Metadata } from "next";
import "./globals.css";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} antialiased overflow-clip`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
