"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signupUserAction } from "@/actions/auth/signup-user-action";
import AppDialog from "@/components/common/app-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SignupSchema, SignupSchemaType } from "@/validators/auth.validators";

export default function SignUpPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, setError } = form;

  const onSubmit = async (values: SignupSchemaType) => {
    const response = await signupUserAction(values);

    if (response.success) {
      setIsDialogOpen(true);
    } else {
      switch (response.statusCode) {
        case 400:
          const nestedErrors = response.error;
          Object.entries(nestedErrors).forEach(([field, messages]) => {
            messages.forEach((message) => {
              setError(field as keyof SignupSchemaType, { type: "manual", message });
            });
          });
          break;
        case 500:
        default:
          const error = response.error || "Internal server Error";
          setError("password", { message: error });
          break;
      }
    }
  };

  return (
    <>
      <div className="mx-auto min-h-[80dvh] min-w-[400px] flex-col items-center justify-center py-24">
        <h1 className={cn("text-center text-3xl font-bold")}>Sign Up</h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" placeholder="Enter your name" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" placeholder="Enter your email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex flex-col">
                      <Input {...field} className="w-full" placeholder="Enter your password" type="password" />
                      <Link
                        href="/auth/forgot-password"
                        className={cn("flex justify-end text-sm text-primary hover:underline")}
                      >
                        Forgot Password
                      </Link>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </form>
        </Form>
      </div>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Welcome Zealer!"
        message="Verification email has been sent! Please check your email to verify and activate your account"
        showSecondaryButton={false}
        primaryButton={{
          text: "Sign In",
          variant: "default",
          onClick: () => router.push("/auth/sign-in/email"),
        }}
        className="sm:max-w-md"
      />
    </>
  );
}
