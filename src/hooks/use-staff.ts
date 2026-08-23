import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/config/constants";
import { toApiError } from "@/lib/api/api-error";
import { staffService } from "@/services/staff.service";
import type { CreateStaffPayload } from "@/types/staff.types";

/**
 * Creates a role-bearing account. There's no separate "staff" section in the
 * UI — accounts created this way just show up in the Users list, same as
 * everyone else — but account creation itself still goes through the
 * backend's `/staff` endpoint (the only one that accepts roles + sends a
 * welcome email), so this hook stays split out from `use-users.ts`.
 */
export function useCreateStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStaffPayload) => staffService.create(payload),
    onSuccess: () => {
      toast.success("Account created.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}
