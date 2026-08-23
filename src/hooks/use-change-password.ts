import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import type { ChangePasswordRequest } from "@/types/auth.types";

/**
 * The backend revokes every refresh token for the user on a successful
 * change (see AuthService.changePassword) — including this device's — so
 * the caller must treat success as "the session is now dead" and drive the
 * user back through login, not just close a dialog.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => authService.changePassword(payload),
  });
}
