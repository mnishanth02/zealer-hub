"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    console.log(values);
  }

  return (
    <div className="mx-auto max-w-[400px] space-y-6 py-24">
      <h1 className={cn("text-center text-4xl font-bold")}>Forgot Password</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
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

          <Button isLoading={false} className="w-full" type="submit">
            Send Reset Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
