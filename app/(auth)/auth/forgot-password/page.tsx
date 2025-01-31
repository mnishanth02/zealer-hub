import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { findVerificationTokenByToken } from "@/data-access/verification-token-queries";

import { ResetPasswordForm } from "../../components/reset-password-form";

type PageProps = { searchParams: { token: string } };

export default async function Page({ searchParams }: PageProps) {
  const { token } = await searchParams;
  const verificationToken = await findVerificationTokenByToken(token);

  if (!verificationToken?.expires) return <TokenIsInvalidState />;

  const isExpired = new Date(verificationToken.expires) < new Date();

  if (isExpired) return <TokenIsInvalidState />;

  return (
    <main className="container mx-auto mt-8 max-w-2xl px-4">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Forgot Password?</h1>

      <Card className="">
        <CardHeader>
          <h2 className="text-2xl font-bold tracking-tight">Enter your new password below</h2>
        </CardHeader>

        <CardContent>
          <ResetPasswordForm email={verificationToken.identifier} token={token} />
        </CardContent>
      </Card>

      <CardFooter className="mt-6 flex justify-center">
        <p className="text-sm text-muted-foreground">
          No longer need to reset your password?{" "}
          <Link href="/auth/sign-in" className={buttonVariants({ variant: "link", size: "sm" })}>
            Click here
          </Link>{" "}
          to sign in.
        </p>
      </CardFooter>
    </main>
  );
}

const TokenIsInvalidState = () => {
  return (
    <section className="mt-4">
      <div className="container">
        <div className="text-3xl font-bold tracking-tight">Forgot Password?</div>

        <div className="my-2 h-1 bg-muted" />
        <div className="rounded bg-destructive p-4">
          <p>Token is invalid.</p>

          <span>
            Click{" "}
            <Link className={buttonVariants({ variant: "link" })} href="/auth/sign-in">
              here
            </Link>
            to sign in page so you can request a new forgot password email.
          </span>
        </div>
      </div>
    </section>
  );
};
