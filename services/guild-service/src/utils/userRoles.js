import roleModel from "../models/role.model.js";

export const userRoles = async (serverId) => {
  return await roleModel.create({
    serverId,
    name: "@everyone",
    Permissions: ["SEND MESSAGES", "VIEW CHANNELS"],
    position:10
  });
};
export const ownerRoles = async (serverId) => {
  return await roleModel.create({
    serverId,
    name:"@owner",
    Permissions: [
      "MANAGE_CHANNELS",
      "KICK_MEMBERS",
      "MANAGE_ROLES",
      "SEND_MESSAGES",
      "VIEW_CHANNELS",
    ],
    position:100
  });
};
