"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { Camera, Loader2, X } from "lucide-react";

import { useAuth } from "@/store/auth-context";
import { useRemoveProfilePhotoMutation, useUpdateProfilePhotoMutation } from "@/hooks/use-profile-photo";
import { env } from "@/config/env";
import { useTranslation } from "@/lib/i18n/language-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Mirrors the backend's defaults (upload.config.ts: ALLOWED_FILE_TYPES / MAX_FILE_SIZE_MB) —
// only client-side UX, the server enforces its own copy of these limits regardless.
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

export function ProfilePhotoUpload() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const updateMutation = useUpdateProfilePhotoMutation();
  const removeMutation = useRemoveProfilePhotoMutation();
  const isPending = updateMutation.isPending || removeMutation.isPending;

  const avatarUrl = user?.avatar_url ? `${env.apiUrl}${user.avatar_url}` : undefined;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error(t("settings.photo.invalidType"));
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(t("settings.photo.tooLarge"));
      return;
    }

    updateMutation.mutate(file);
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={t("settings.photo.photoAlt")} />}
        <AvatarFallback className="text-base">{getInitials(user?.first_name, user?.last_name)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            {updateMutation.isPending ? <Loader2 className="animate-spin" /> : <Camera />}
            {user?.avatar_url ? t("settings.photo.changePhoto") : t("settings.photo.uploadPhoto")}
          </Button>
          {user?.avatar_url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => removeMutation.mutate()}
            >
              <X />
              {t("settings.photo.remove")}
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{t("settings.photo.helpText")}</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(",")}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
