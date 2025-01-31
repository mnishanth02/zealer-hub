"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signinUserAction } from "@/actions/auth/signin-user-action";
import { ForgotPasswordForm } from "@/app/(auth)/components/forgot-password-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SigninSchema, SigninSchemaType } from "@/validators/auth.validators";

export default function SignInPage() {
  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, setError } = form;

  const onSubmit = async (values: SigninSchemaType) => {
    const response = await signinUserAction(values);

    if (response.success) {
      // reset();
      window.location.href = "/profile";
      toast("Login Successfull");
    } else {
      switch (response.statusCode) {
        case 401:
          setError("password", { message: response.error });
          break;
        case 500:
        default:
          const error = response.error || "Internal Server Error";
          setError("password", { message: error });
          break;
      }
    }
  };

  return (
    <div className="mx-auto min-h-[80dvh] min-w-[400px] flex-col items-center justify-center py-24">
      <h1 className={cn("text-center text-3xl font-bold")}>Sign In</h1>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                    <ForgotPasswordForm />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div className="my-0 flex justify-end py-0"></div> */}
          {/* TODO: Need to update alert logic if any error, */}

          <Button className="w-full" type="submit">
            Sign In
          </Button>
        </form>
      </Form>

      <div className="flex justify-end"></div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">Or</span>
        </div>
      </div>

      <Button className="w-full" variant={"secondary"}>
        <Link href="/auth/sign-up">Create an account</Link>
      </Button>
    </div>
  );
}
