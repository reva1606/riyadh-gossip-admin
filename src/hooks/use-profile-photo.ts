import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuth } from "@/store/auth-context";
import { toApiError } from "@/lib/api/api-error";
import { uploadsService } from "@/services/uploads.service";
import { usersService } from "@/services/users.service";

/** Uploads the file, then points the current user's own record at it. */
export function useUpdateProfilePhotoMutation() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      const uploaded = await uploadsService.uploadSingle(file);
      return usersService.updateMe({ avatar_url: uploaded.url });
    },
    onSuccess: async () => {
      await refreshUser();
      toast.success("Profile photo updated.");
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useRemoveProfilePhotoMutation() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: () => usersService.updateMe({ avatar_url: "" }),
    onSuccess: async () => {
      await refreshUser();
      toast.success("Profile photo removed.");
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}
