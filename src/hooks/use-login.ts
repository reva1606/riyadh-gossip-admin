import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/store/auth-context";

interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: ({ email, password, rememberMe }: LoginInput) =>
      login(email, password, rememberMe),
  });
}
