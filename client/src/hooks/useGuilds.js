import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { guildService } from "../services/guildService";

export const GUILD_KEYS = {
  servers: ["guilds", "servers"],
  serverDetails: (id) => ["guilds", "server", id],
};

export function useServersQuery() {
  return useQuery({
    queryKey: GUILD_KEYS.servers,
    queryFn: async () => {
      try {
        const data = await guildService.getServers();
        if (Array.isArray(data?.servers)) return data.servers;
        if (data?.server) return [data.server];
        if (Array.isArray(data?.result)) return data.result;
        return [];
      } catch (_) {
        return [];
      }
    },
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useServerDetailsQuery(serverId) {
  return useQuery({
    queryKey: GUILD_KEYS.serverDetails(serverId),
    queryFn: async () => {
      try {
        const data = await guildService.getServerDetails(serverId);
        return data || null;
      } catch (_) {
        return null;
      }
    },
    enabled: Boolean(serverId),
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function useCreateServerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => guildService.createServer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUILD_KEYS.servers });
    },
  });
}

export function useJoinServerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteCode) => guildService.joinServer(inviteCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUILD_KEYS.servers });
    },
  });
}

export function useGenerateInviteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serverId) => guildService.generateInviteCode(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUILD_KEYS.servers });
    },
  });
}