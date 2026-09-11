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

  if (!(server.owner === req.user))
    throw new appError(401, "only owner can create the roles");

  const servermember = await memberModel.findOne({ serverId });

  if (!servermember) throw new appError(404, "member is not found");

  const arr = rolePermissions.split(" ");

  const role = await roleModel.create({
    name: rolename,
    position,
    serverId,
    color,
    Permissions: arr,
  });

  servermember.role.push(role._id);

  return res.status(200).json({
    success: true,
    message: "role created successfully",
  });
});

export const updateRoleController = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const { rolename, position, color, rolePermissions, newrolename } = req.body;

  const server = await serverModel.findById(serverId);

  if (!(server.owner === req.user))
    throw new appError(401, "unauthrized access!");

  const role = await roleModel.findOne({ serverId, name: rolename });

  if (!role) throw new appError(404, "role not found");

  role.name = newrolename;

  if (!(position === undefined)) role.position = position;
  if (!(color === undefined)) role.color = color;
  if (!(rolePermissions === undefined)) {
    const arr = rolePermissions.split(",");

    role.Permissions = arr;
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

  if (!(server.owner === req.user))
    throw new appError(401, "unauthrized access");

  const role = await roleModel.find({ serverId: server._id });

  if (!role) throw new appError(404, "roles not defind");

  return res.status(200).json({
    success: true,
    message: "all roles fatched successfully",
    roles: role,
  });
});

export const deleteRoleController = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const { rolename } = req.body;

  const server = await serverModel.findById(serverId);

  if (!(server.owner === req.user))
    throw new appError(401, "unauthrized access");

  const role = await roleModel.findOneAndDelete({ serverId, name: rolename });
  console.log(role);
  

  if (!role) throw new appError(404, "role not found");

  return res.status(201).json({
    success:true,
    message:"role delete successfully"
  })
});
