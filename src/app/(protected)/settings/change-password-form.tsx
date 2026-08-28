"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuth } from "@/store/auth-context";
import { useChangePassword } from "@/hooks/use-change-password";
import { toApiError } from "@/lib/api/api-error";
import { useTranslation } from "@/lib/i18n/language-provider";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/forms/password-input";

export function ChangePasswordForm() {
  const { logout } = useAuth();
  const changePassword = useChangePassword();
  const { t } = useTranslation();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  function onSubmit(values: ChangePasswordFormValues) {
    changePassword.mutate(
      { current_password: values.current_password, new_password: values.new_password },
      {
        onSuccess: () => {
          toast.success(t("settings.changePassword.successToast"));
          void logout();
        },
        onError: (error) => toast.error(toApiError(error).message),
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.changePassword.currentPassword")}</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.changePassword.newPassword")}</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.changePassword.confirmPassword")}</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-xs text-muted-foreground">{t("settings.changePassword.signOutNotice")}</p>

        <Button type="submit" disabled={changePassword.isPending} className="mt-1 self-start">
          {changePassword.isPending ? t("settings.changePassword.submitting") : t("settings.changePassword.submit")}
        </Button>
      </form>
    </Form>
  );
}
