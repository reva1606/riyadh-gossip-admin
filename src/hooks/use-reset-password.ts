import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";

interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
}

/**
 * Composes the real two-step backend flow behind one mutation so the form
 * stays a single step: verify the OTP to get a short-lived `reset_token`,
 * then use that token (not the OTP, not an Authorization header) to reset.
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ email, otp, password }: ResetPasswordInput) => {
      const { reset_token } = await authService.verifyResetOtp({ email, otp });
      return authService.resetPassword({ reset_token, password });
    },
  });
}
