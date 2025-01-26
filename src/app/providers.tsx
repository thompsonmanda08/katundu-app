"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProviderProps } from "next-themes/dist/types";
import { HeroUIProvider } from "@heroui/react";
import { useEffect, useState } from "react";

// Create a client
const queryClient = new QueryClient();

function Providers({
  children,
  ...props
}: ThemeProviderProps & { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <HeroUIProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          {...props}
        >
          <>{children}</>
        </NextThemesProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}

export default Providers;
