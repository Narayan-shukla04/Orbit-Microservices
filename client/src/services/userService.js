import { axiosClient } from "../api/axiosClient";

export const userService = {
  getMe: async () => {
    return axiosClient.get("/user/getme");
  },

  updateDetails: async (data) => {
    return axiosClient.patch("/user/update-details", data);
  },

  updateProfile: async (formData) => {
    return axiosClient.patch("/user/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  changePassword: async (data) => {
    return axiosClient.patch("/user/change-password", data);
  },
};