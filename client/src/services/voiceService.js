import { axiosClient } from "../api/axiosClient";

export const voiceService = {
  getJoinToken: async (channelId, username) => {
    return axiosClient.post("/calls/token", { channelId, username });
  },

  getActiveParticipants: async () => {
    return axiosClient.get("/calls/participants");
  },
};
