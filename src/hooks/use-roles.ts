import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/config/constants";
import { toApiError } from "@/lib/api/api-error";
import { rolesService } from "@/services/roles.service";
import type { AssignRolePermissionPayload, CreateRolePayload, UpdateRolePayload } from "@/types/role.types";

export function useRolesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.roles,
    queryFn: () => rolesService.list(),
  });
}

export function useRolePermissionsQuery(roleId: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.rolePermissions(roleId ?? 0),
    queryFn: () => rolesService.listPermissions(roleId as number),
    enabled: roleId !== null,
  });
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => rolesService.create(payload),
    onSuccess: () => {
      toast.success("Role created.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRolePayload }) =>
      rolesService.update(id, payload),
    onSuccess: () => {
      toast.success("Role updated.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rolesService.remove(id),
    onSuccess: () => {
      toast.success("Role deleted.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useAssignRolePermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssignRolePermissionPayload }) =>
      rolesService.assignPermission(id, payload),
    onSuccess: (_data, variables) => {
      toast.success("Permission granted.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rolePermissions(variables.id) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useRemoveRolePermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionId }: { id: number; permissionId: number }) =>
      rolesService.removePermission(id, permissionId),
    onSuccess: (_data, variables) => {
      toast.success("Permission revoked.");
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rolePermissions(variables.id) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles });
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}
