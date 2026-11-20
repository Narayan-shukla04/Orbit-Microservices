import { axiosClient } from "../api/axiosClient";

export const authService = {
  login: async ({ email, password }) => {
    return axiosClient.post("/auth/login", { email, password });
  },

  register: async ({ fullname, username, email, password }) => {
    return axiosClient.post("/auth/register", { fullname, username, email, password });
  },

  logout: async () => {
    return axiosClient.post("/auth/logout");
  },
};