"use client";

import { ReactNode } from "react";

import { Toaster } from "@ui/sonner";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";

import { ThemeProvider } from "@/components/providers/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NextTopLoader color="#15803d" shadow="0 0 10px #15803d,0 0 5px #15803d" />
      {/* <TooltipProvider delayDuration={0}>{children}</TooltipProvider> */}
      <SessionProvider>{children}</SessionProvider>
      <Toaster position="bottom-right" richColors duration={3000} toastOptions={{ style: { textAlign: "center" } }} />
    </ThemeProvider>
  );
}
