"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { ROUTES } from "@/config/routes";
import { useResetPassword } from "@/hooks/use-reset-password";
import { toApiError } from "@/lib/api/api-error";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/forms/password-input";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const resetPassword = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    resetPassword.mutate(
      { email, otp: values.otp, password: values.password },
      {
        onSuccess: () => {
          toast.success("Password reset. Please sign in.");
          router.push(ROUTES.login);
        },
        onError: (error) => toast.error(toApiError(error).message),
      },
    );
  }

  return (
    <Card className="border-none bg-transparent shadow-none sm:border-border sm:bg-card sm:shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>
          {email ? (
            <>
              Enter the code sent to <span className="font-medium text-foreground">{email}</span>{" "}
              and choose a new password.
            </>
          ) : (
            "Enter the verification code and choose a new password."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      autoComplete="one-time-code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" disabled={resetPassword.isPending} className="mt-1">
              {resetPassword.isPending ? "Resetting…" : "Reset password"}
            </Button>

            <Link
              href={ROUTES.login}
              className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to sign in
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
