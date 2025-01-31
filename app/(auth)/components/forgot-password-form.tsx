"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { forgotPasswordAction } from "@/actions/auth/forgot-password-action";
import AppDialog from "@/components/common/app-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordInput, ForgotPasswordSchema } from "@/validators/auth.validators";

export const ForgotPasswordForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState("");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: ForgotPasswordInput) => {
    setSuccess("");
    const res = await forgotPasswordAction(values);

    if (res.success) {
      setSuccess("Password reset email sent.");
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;
          if (nestedErrors && "email" in nestedErrors) {
            setError("email", { message: nestedErrors.email?.toString() });
          } else {
            setError("email", { message: "Internal Server Error" });
          }
          break;
        case 401:
          setError("email", { message: res.error });
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("email", { message: error });
      }
    }
  };

  const formContent = (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} disabled={!!success} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {success && <p className="text-sm font-medium text-primary">{success}</p>}

        <Button
          type="button"
          onClick={handleSubmit(submit)}
          disabled={formState.isSubmitting || !!success}
          className="w-full"
        >
          Send Password Reset Email
        </Button>
      </form>
    </Form>
  );

  return (
    <AppDialog
      trigger={
        <Button variant="link" className="flex justify-end p-0 text-sm text-primary hover:underline">
          Forgot Password
        </Button>
      }
      title="Enter Your Email"
      message="We will send you an email with a link to reset your password."
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      showButtons={false}
      customContent={formContent}
    />
  );
};
