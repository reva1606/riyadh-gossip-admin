import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/config/constants";
import { toApiError } from "@/lib/api/api-error";
import { usersService } from "@/services/users.service";
import type { AssignUserRolePayload, UpdateUserPayload, UsersListParams } from "@/types/user.types";

export function useUsersQuery(params: UsersListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.users, params],
    queryFn: () => usersService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useUserRolesQuery(userId: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.userRoles(userId ?? 0),
    queryFn: () => usersService.listRoles(userId as number),
    enabled: userId !== null,
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      usersService.update(id, payload),
    onSuccess: () => {
      toast.success("User updated.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersService.remove(id),
    onSuccess: () => {
      toast.success("User deleted.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useActivateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersService.activate(id),
    onSuccess: () => {
      toast.success("User activated.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useDeactivateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersService.deactivate(id),
    onSuccess: () => {
      toast.success("User deactivated.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useAssignUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssignUserRolePayload }) =>
      usersService.assignRole(id, payload),
    onSuccess: (_data, variables) => {
      toast.success("Role assigned.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userRoles(variables.id) });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useRemoveUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleId }: { id: number; roleId: number }) => usersService.removeRole(id, roleId),
    onSuccess: (_data, variables) => {
      toast.success("Role removed.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userRoles(variables.id) });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}
