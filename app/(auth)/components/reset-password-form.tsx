"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { resetPasswordAction } from "@/actions/auth/reset-password-action";
import AppDialog from "@/components/common/app-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPasswordInput, ResetPasswordSchema } from "@/validators/auth.validators";
import Loader from "@/components/common/loader";

type ResetPasswordFormProps = { email: string; token: string };

export const ResetPasswordForm = ({ email, token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: ResetPasswordInput) => {
    const res = await resetPasswordAction(email, token, values);

    if (res.success) {
      setIsDialogOpen(true);
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;

          for (const key in nestedErrors) {
            setError(key as keyof ResetPasswordInput, {
              message: nestedErrors[key]?.[0],
            });
          }
          break;
        case 401:
          setError("password", { message: res.error });
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("password", { message: error });
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="password" placeholder="Enter your new password" className="pr-10" {...field} />
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Must be at least 8 characters with 1 number and 1 special character
                </FormDescription>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your new password" className="" {...field} />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={formState.isSubmitting} className="w-full py-2.5 font-medium">
            {formState.isSubmitting ? (
              <>
                <span className="mr-2">Resetting Password...</span>
                <Loader />
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Rest Password!"
        message="Password has been reset successfully! Please sign in with your new password"
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
};
