import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roleService } from "../services/roleService";

export const ROLE_KEYS = {
  roles: (serverId) => ["roles", serverId],
};

export function useRolesQuery(serverId) {
  return useQuery({
    queryKey: ROLE_KEYS.roles(serverId),
    queryFn: async () => {
      const data = await roleService.getRoles(serverId);
      return data?.roles || data?.result || [];
    },
    enabled: Boolean(serverId),
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useCreateRoleMutation(serverId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => roleService.createRole(serverId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.roles(serverId) });
    },
  });
}