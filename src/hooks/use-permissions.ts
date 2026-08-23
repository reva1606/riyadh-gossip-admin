import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/config/constants";
import { permissionsService } from "@/services/permissions.service";

export function usePermissionsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.permissions,
    queryFn: () => permissionsService.list(),
  });
}
