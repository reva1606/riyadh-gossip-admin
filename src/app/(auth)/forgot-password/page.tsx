"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { ROUTES } from "@/config/routes";
import { useForgotPassword } from "@/hooks/use-forgot-password";
import { toApiError } from "@/lib/api/api-error";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth.schema";
import { useTranslation } from "@/lib/i18n/language-provider";
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgotPassword = useForgotPassword();
  const { t } = useTranslation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    forgotPassword.mutate(values, {
      onSuccess: () => {
        toast.success(t("auth.verificationSent"));
        router.push(`${ROUTES.resetPassword}?email=${encodeURIComponent(values.email)}`);
      },
      onError: (error) => toast.error(toApiError(error).message),
    });
  }

  return (
    <Card className="border-none bg-transparent shadow-none sm:border-border sm:bg-card sm:shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("auth.forgotTitle")}</CardTitle>
        <CardDescription>{t("auth.forgotSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@glitch404.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" disabled={forgotPassword.isPending} className="mt-1">
              {forgotPassword.isPending ? t("auth.sending") : t("auth.sendCode")}
            </Button>

            <Link
              href={ROUTES.login}
              className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 rtl:-scale-x-100" />
              {t("auth.backToSignIn")}
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
