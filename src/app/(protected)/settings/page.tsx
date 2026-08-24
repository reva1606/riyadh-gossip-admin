"use client";

import { ShieldAlert } from "lucide-react";

import { useAuth } from "@/store/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ChangePasswordForm } from "./change-password-form";
import { ProfilePhotoUpload } from "./profile-photo-upload";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and platform preferences." />

      <div className="flex flex-col gap-6 lg:max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account details.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 text-sm">
            <ProfilePhotoUpload />
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">
                {user ? `${user.first_name} ${user.last_name}` : "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email ?? "—"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Roles</span>
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
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              {user?.must_change_password ? (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                  <ShieldAlert className="size-4 shrink-0" />
                  You&apos;re signed in with a temporary password — please change it now.
                </span>
              ) : (
                "Update the password you use to sign in."
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
