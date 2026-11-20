import { axiosClient } from "../api/axiosClient";

export const roleService = {
  getRoles: async (serverId) => {
    return axiosClient.get(`/role/getroles/${serverId}`);
  },

  createRole: async (serverId, data) => {
    return axiosClient.post(`/role/create/${serverId}`, data);
  },

  updateRole: async (serverId, data) => {
    return axiosClient.patch(`/role/update/${serverId}`, data);
  },

  deleteRole: async (serverId, roleId) => {
    return axiosClient.delete(`/role/delete/${serverId}`, { data: { roleId } });
  },
};