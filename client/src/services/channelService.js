import { axiosClient } from "../api/axiosClient";

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