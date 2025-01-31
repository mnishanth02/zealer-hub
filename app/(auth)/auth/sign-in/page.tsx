import Link from "next/link";
import { Suspense } from "react";

import { Mail } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { MagicLinkForm } from "../../components/magic-link-form";
import { OAuthSigninButtons, OAuthSigninButtonsSkeleton } from "../../components/oauth-sigin-buttons";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[80dvh] items-center justify-center py-24">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account using one of the options below.</p>
        </div>
        <div className="space-y-4">
          <OAuthSigninButtons />

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                Or sign in with email
              </span>
            </div>
          </div>

          <MagicLinkForm />

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">Other options</span>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/auth/sign-in/email"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                }),
                "w-full"
              )}
            >
              <Mail name="Mail" /> Sign in with Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
