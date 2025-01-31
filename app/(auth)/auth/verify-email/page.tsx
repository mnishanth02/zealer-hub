import Link from "next/link";
import { Suspense } from "react";

import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { verifyCredentialsEmailAction } from "@/actions/auth/verify-credentials-email-action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  deleteVerificationTokenByIdentifier,
  findVerificationTokenByToken,
} from "@/data-access/verification-token-queries";

type PageProps = { searchParams: Promise<{ token: string }> };

export default async function Page({ searchParams }: PageProps) {
  const { token } = await searchParams;
  if (!token) {
    return <TokenIsInvalidState />;
  }

  return (
    <main className="container py-8">
      <Suspense fallback={<LoadingState />}>
        <VerificationContent token={token} />
      </Suspense>
    </main>
  );
}

const LoadingState = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

const VerificationCard = ({ children }: { children: React.ReactNode }) => (
  <Card className="mx-auto mt-8 max-w-md">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const TokenIsInvalidState = () => (
  <VerificationCard>
    <Alert variant="destructive" className="mb-4">
      <XCircle className="h-4 w-4" />
      <AlertDescription>The verification link is invalid or has expired.</AlertDescription>
    </Alert>
    <div className="text-center">
      <p className="mb-4 text-muted-foreground">Please try signing up again with a new verification link.</p>
      <Link className={buttonVariants()} href="/auth/sign-up">
        Sign Up Again
      </Link>
    </div>
  </VerificationCard>
);

const VerificationSuccess = () => (
  <VerificationCard>
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-600">Your email has been successfully verified!</AlertDescription>
    </Alert>
    <div className="text-center">
      <p className="mb-4 text-muted-foreground">You can now sign in to your account.</p>
      <Link className={buttonVariants()} href="/auth/sign-in/email">
        Sign In
      </Link>
    </div>
  </VerificationCard>
);

async function VerificationContent({ token }: { token: string }) {
  try {
    const verificationToken = await findVerificationTokenByToken(token);

    if (!verificationToken) {
      return <TokenIsInvalidState />;
    }

    if (!verificationToken?.expires) {
      return <TokenIsInvalidState />;
    }

    const isExpired = new Date(verificationToken.expires) < new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (isExpired) {
      return <TokenIsInvalidState />;
    }

    const res = await verifyCredentialsEmailAction(token);
    if (!res.success) {
      return <TokenIsInvalidState />;
    }
    await deleteVerificationTokenByIdentifier(verificationToken?.identifier);
    return <VerificationSuccess />;
  } catch (error) {
    return <TokenIsInvalidState />;
  }
}
