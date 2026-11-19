import { axiosClient } from "../api/axiosClient";

// Layer 2: Domain Service - Channels
export const channelService = {
  getChannels: async (serverId) => {
    return axiosClient.post(`/channel/getchannels/${serverId}`);
  },

  createChannel: async (data) => {
    return axiosClient.post("/channel/create", data);
  },

  updateChannel: async (channelId, data) => {
    return axiosClient.patch(`/channel/update/${channelId}`, data);
  },
};