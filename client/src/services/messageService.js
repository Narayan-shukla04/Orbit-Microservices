import { axiosClient } from "../api/axiosClient";

export const messageService = {
  getAll: async (channelId) => {
    return axiosClient.post(`/message/getallmessages/${channelId}`);
  },

  create: async (channelId, content) => {
    return axiosClient.post(`/message/createmessage/${channelId}`, { content });
  },
};