import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { channelService } from "../services/channelService";

export const CHANNEL_KEYS = {
  channels: (serverId) => ["channels", serverId],
};

export function useChannelsQuery(serverId) {
  return useQuery({
    queryKey: CHANNEL_KEYS.channels(serverId),
    queryFn: async () => {
      const data = await channelService.getChannels(serverId);
      return data?.channels || data?.result || [];
    },
    enabled: Boolean(serverId),
    staleTime: 30 * 1000,
    retry: false,
  });
}

export function useCreateChannelMutation(serverId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => channelService.createChannel({ ...data, serverId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHANNEL_KEYS.channels(serverId) });
    },
  });
}