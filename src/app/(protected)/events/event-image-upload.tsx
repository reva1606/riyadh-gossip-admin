"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, X } from "lucide-react";

import { env } from "@/config/env";
import { uploadsService } from "@/services/uploads.service";
import { toApiError } from "@/lib/api/api-error";
import { useTranslation } from "@/lib/i18n/language-provider";

// Mirrors the backend's defaults (upload.config.ts) — client-side UX only,
// the server enforces its own copy of these limits regardless.
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface EventImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

/** Multi-image grid for an event — uploads through the main API's generic /uploads/single, stores the URLs. */
export function EventImageUpload({ value, onChange }: EventImageUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  async function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast.error(t("events.imageUpload.invalidType", { fileName: file.name }));
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(t("events.imageUpload.tooLarge", { fileName: file.name }));
        return;
      }
    }

    setIsUploading(true);
    try {
      const uploaded = await Promise.all(files.map((file) => uploadsService.uploadSingle(file)));
      onChange([...value, ...uploaded.map((file) => file.url)]);
    } catch (error) {
      toast.error(toApiError(error).message);
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove(url: string) {
    onChange(value.filter((existing) => existing !== url));
  }

  return (
    <div className="flex flex-wrap gap-3">
      {value.map((url) => (
        <div key={url} className="group relative size-24 overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element -- relative /uploads/ URL from our own API, not a Next-optimizable remote image */}
          <img src={`${env.apiUrl}${url}`} alt="" className="size-full object-cover" />
          <button
            type="button"
            onClick={() => handleRemove(url)}
            className="absolute inset-e-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={t("events.imageUpload.removeAria")}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-ring hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        {isUploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
        <span className="text-xs">{t("events.imageUpload.addImage")}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ALLOWED_MIME_TYPES.join(",")}
        className="hidden"
        onChange={(event) => void handleFilesSelected(event)}
      />
    </div>
  );
}
