import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/components/providers/providers";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zealer Hub",
  description: "Explore all Zealers apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("flex min-h-screen flex-col bg-background antialiased", inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
