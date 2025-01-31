"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { oauthSigninAction } from "@/actions/auth/oauth-signin-action";
import { Button } from "@/components/ui/button";

type OAuthSigninButtonsProps = { signup?: boolean };

export const OAuthSigninButtons = ({ signup }: OAuthSigninButtonsProps) => {
  const [errMessage, setErrMessage] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;

    if (error === "OAuthAccountNotLinked") {
      setErrMessage("This account is already in use. Please sign in.");
    } else {
      setErrMessage("An error occured. Please try again.");
    }
  }, [error]);

  const clickHandler = async (provider: "google" | "github") => {
    try {
      await oauthSigninAction(provider);
    } catch (err) {
      console.error(err);
    }
  };

  const text = signup ? "Sign up" : "Sign in";
  return (
    <div className="max-w-[400px]">
      <Button
        variant="secondary"
        className="w-full"
        onClick={clickHandler.bind(null, "google")}
      >
        <GoogleIcon className="mr-2 stroke-white" />
        {text} with Google
      </Button>

      <Button disabled variant="secondary" className="mt-2 w-full" onClick={clickHandler.bind(null, "github")}>
        <GithubIcon className="mr-2" />
        {text} with Github
      </Button>

      {errMessage && <p className="mt-2 text-sm font-medium text-destructive">{errMessage}</p>}
    </div>
  );
};

type OAuthSigninButtonsSkeletonProps = OAuthSigninButtonsProps;

export const OAuthSigninButtonsSkeleton = ({ signup }: OAuthSigninButtonsSkeletonProps) => {
  const text = signup ? "Sign up" : "Sign in";

  return (
    <div className="max-w-[400px]">
      <Button variant="secondary" className="w-full">
        <GoogleIcon className="mr-2 stroke-white" />
        {text} with Google
      </Button>

      <Button variant="secondary" className="mt-2 w-full">
        <GithubIcon className="mr-2" />
        {text} with Github
      </Button>
    </div>
  );
};

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
