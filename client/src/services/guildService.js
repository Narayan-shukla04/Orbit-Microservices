import { axiosClient } from "../api/axiosClient";

export const guildService = {
  getServers: async () => {
    return axiosClient.get("/guild/getserver");
  },

  getServerDetails: async (serverId) => {
    return axiosClient.get("/guild/getserver-details", { params: { serverId } });
  },

  createServer: async (payload) => {
    return axiosClient.post("/guild/create", payload);
  },

  joinServer: async (inviteCode) => {
    return axiosClient.post(`/guild/join-server/${inviteCode}`);
  },

  leaveServer: async () => {
    return axiosClient.post("/guild/leave-server");
  },

  deleteServer: async (serverId) => {
    return axiosClient.delete("/guild/delete-server", { data: { serverId } });
  },

  generateInviteCode: async (serverId) => {
    return axiosClient.post("/guild/invite/generate", { serverId });
  },
};