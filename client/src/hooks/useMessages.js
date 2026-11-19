import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../services/messageService";
import { getSocket, joinChannel, leaveChannel } from "../services/socketService";

// Layer 3: Application / Query Hook for Messages
export const MESSAGE_KEYS = {
  channelMessages: (channelId) => ["messages", channelId],
};

export function useChannelSocket(channelId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!channelId) return;

    const socket = getSocket();
    joinChannel(channelId);

    const handleNewMessage = (msg) => {
      queryClient.setQueryData(MESSAGE_KEYS.channelMessages(channelId), (old = []) => {
        const id = msg.messageId || msg._id;
        if (old.some((m) => (m._id || m.messageId) === id)) return old;

        const formatted = {
          _id: id,
          content: msg.content,
          createdAt: msg.createdAt || new Date().toISOString(),
          user: {
            username: msg.username,
            fullname: msg.fullname,
            profile_pic: msg.profile_pic,
          },
        };
        return [...old, formatted];
      });
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      leaveChannel(channelId);
      socket.off("new-message", handleNewMessage);
    };
  }, [channelId, queryClient]);
}

export function useChannelMessagesQuery(channelId) {
  return useQuery({
    queryKey: MESSAGE_KEYS.channelMessages(channelId),
    queryFn: async () => {
      const data = await messageService.getAll(channelId);
      return data?.result || data?.messages || [];
    },
    enabled: Boolean(channelId),
    staleTime: 10 * 1000,
    retry: false,
  });
}

export function useSendMessageMutation(channelId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content) => {
      return messageService.create(channelId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.channelMessages(channelId),
      });
    },
  });
}