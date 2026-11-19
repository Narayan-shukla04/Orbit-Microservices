import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import memberModel from "../models/member.model.js";
import roleModel from "../models/role.model.js";
import serverModel from "../models/server.model.js";
import { appError } from "../utils/appError.js";

export const createRoleController = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const { rolename, position, color, rolePermissions } = req.body;

  const server = await serverModel.findOne({ _id: serverId });
  if (!server) throw new appError(404, "server not found");

  if (server.owner.toString() !== req.user?.toString())
    throw new appError(403, "only owner can create roles");

  const servermember = await memberModel.findOne({ serverId });
  if (!servermember) throw new appError(404, "member is not found");

  const arr = Array.isArray(rolePermissions)
    ? rolePermissions
    : (rolePermissions || "").split(/[,\s]+/).filter(Boolean);

  const role = await roleModel.create({
    name: rolename,
    position,
    serverId,
    color,
    Permissions: arr,
  });

  servermember.role.push(role._id);
  await servermember.save();

  return res.status(200).json({
    success: true,
    message: "role created successfully",
    role,
  });
});

export const updateRoleController = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const { rolename, position, color, rolePermissions, newrolename } = req.body;

  const server = await serverModel.findById(serverId);
  if (!server) throw new appError(404, "server not found");

  if (server.owner.toString() !== req.user?.toString())
    throw new appError(403, "unauthorized access");

  const role = await roleModel.findOne({ serverId, name: rolename });
  if (!role) throw new appError(404, "role not found");

  if (newrolename) role.name = newrolename;
  if (position !== undefined) role.position = position;
  if (color !== undefined) role.color = color;
  if (rolePermissions !== undefined) {
    role.Permissions = Array.isArray(rolePermissions)
      ? rolePermissions
      : rolePermissions.split(/[,\s]+/).filter(Boolean);
  }

  await role.save();

  return res.status(200).json({
    success: true,
    message: "role update successfully",
    role,
  });
});

export const getAllRolesController = asyncHandler(async (req, res) => {
  const { serverId } = req.params;

  const server = await serverModel.findById(serverId);
  if (!server) throw new appError(404, "server not found");

  const roles = await roleModel.find({ serverId: server._id });

  return res.status(200).json({
    success: true,
    message: "all roles fetched successfully",
    roles: roles || [],
  });
});

export const deleteRoleController = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const { rolename } = req.body;

  const server = await serverModel.findById(serverId);
  if (!server) throw new appError(404, "server not found");

  if (server.owner.toString() !== req.user?.toString())
    throw new appError(403, "unauthorized access");

  const role = await roleModel.findOneAndDelete({ serverId, name: rolename });
  if (!role) throw new appError(404, "role not found");

  return res.status(200).json({
    success: true,
    message: "role delete successfully",
  });
});
