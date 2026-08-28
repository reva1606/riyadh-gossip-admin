"use client";

import { ShieldAlert } from "lucide-react";

import { useAuth } from "@/store/auth-context";
import { useTranslation } from "@/lib/i18n/language-provider";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ChangePasswordForm } from "./change-password-form";
import { ProfilePhotoUpload } from "./profile-photo-upload";

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("common.settings")} description={t("settings.description")} />

      <div className="flex flex-col gap-6 lg:max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.profile.title")}</CardTitle>
            <CardDescription>{t("settings.profile.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 text-sm">
            <ProfilePhotoUpload />
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t("settings.profile.name")}</span>
              <span className="font-medium">
                {user ? `${user.first_name} ${user.last_name}` : "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t("settings.profile.email")}</span>
              <span className="font-medium">{user?.email ?? "—"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t("settings.profile.roles")}</span>
              <div className="flex flex-wrap justify-end gap-1.5">
                {user?.roles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("settings.changePassword.title")}</CardTitle>
            <CardDescription>
              {user?.must_change_password ? (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                  <ShieldAlert className="size-4 shrink-0" />
                  {t("settings.changePassword.mustChangeWarning")}
                </span>
              ) : (
                t("settings.changePassword.description")
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
