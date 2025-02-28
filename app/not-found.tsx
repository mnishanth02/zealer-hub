"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { buttonVariants } from "@ui/button";

import { cn } from "@/lib/utils";

export default function NotFound(): ReactNode {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      router.push("/");
    }

    return () => clearInterval(interval);
  }, [countdown, router]);

  return (
    <div className="dark relative flex h-full w-full flex-1 flex-col items-center justify-center space-y-6 bg-background">
      <h1 className="lg:font-heading px-6 text-center font-sans text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl lg:tracking-normal xl:text-7xl">
        Page not found
      </h1>

      <h3 className="max-w-[40rem] px-6 text-center text-lg leading-normal text-muted-foreground sm:leading-8">
        `The page you are searching for is not available.`
      </h3>

      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "relative h-12 w-full min-w-[110px] max-w-[200px] items-center overflow-hidden rounded-full font-bold"
        )}
      >
        Go back home <span className="ml-2 font-bold">({countdown})</span>
      </Link>
    </div>
  );
}
