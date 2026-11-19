import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import channelModel from "../models/channel.model.js";
import memberModel from "../models/member.model.js";
import roleModel from "../models/role.model.js";
import serverModel from "../models/server.model.js";
import storageInstance from "../services/storageInstance.service.js";
import { appError } from "../utils/appError.js";
import { channelGenerator } from "../utils/channelGenerator.js";
import inviteCodeGenerater from "../utils/inviteCodeGenerater.js";
import { jwtDecode } from "../utils/jwt.js";
import { memberGenerator } from "../utils/membergenerator.js";
import { ownerRoles, userRoles } from "../utils/userRoles.js";
import axios from "axios";

export const createServerController = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const owner = req.user;
  const file = req.files;

  if (!name) throw new appError(400, "fires are required");

  let icon = null;
  let banner = null;

  if (file?.icon?.[0]) {
    icon = await storageInstance(
      file.icon[0].buffer,
      file.icon[0].originalname,
    );
  }
  if (file?.banner?.[0]) {
    banner = await storageInstance(
      file.banner[0].buffer,
      file.banner[0].originalname,
    );
  }

  const invitecode = inviteCodeGenerater();

  const server = await serverModel.create({
    name,
    description,
    owner,
    invitecode: invitecode,
    icon: icon?.url || null,
    banner: banner?.url || null,
  });

  const userrole = await userRoles(server._id);
  const ownerrole = await ownerRoles(server._id);

  await memberGenerator(owner, server._id, [userrole, ownerrole]);

  await channelGenerator(server._id,"general text","text",1);
  await channelGenerator(server._id,"general voice","voice",2);

  return res.status(201).json({
    success: true,
    Message: "server created",
    server,
  });
});

export const getServerController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const memberships = await memberModel.find({ userId }).select("serverId");
  const memberServerIds = memberships.map((m) => m.serverId);

  const servers = await serverModel.find({
    $or: [{ owner: userId }, { _id: { $in: memberServerIds } }],
  });

  return res.status(200).json({
    success: true,
    message: "servers fetched",
    servers,
    server: servers[0] || null,
  });
});

export const serverDetailcontroller = asyncHandler(async (req, res) => {
  const serverId = req.query?.serverId || req.body?.serverId;
  const server = serverId
    ? await serverModel.findById(serverId)
    : await serverModel.findOne({ owner: req.user });

  if (!server) throw new appError(404, "server not found");

  const member = await memberModel.find({ serverId: server._id }).populate({
    path: "role",
    select: "name Permissions",
  });

  const itrate = member.map((e) => {
    return e.userId;
  });

  let usersDetails = [];
  try {
    const response = await axios.post("http://localhost:3001/api/user/getuser", {
      itrate,
    });
    usersDetails = response.data.users || [];
  } catch (_) {
    usersDetails = [];
  }

  const result = member.map((m) => {
    const user = usersDetails.find(
      (e) => e._id.toString() === m.userId.toString(),
    );

    return {
      user,
      role: m.role,
    };
  });

  return res.status(200).json({
    success: true,
    message: "server details fetched successfully",
    server,
    result,
    members: result,
  });
});

export const joinServerController = asyncHandler(async (req, res) => {
  const { invitecode } = req.params;

  const server = await serverModel.findOne({ invitecode });

  if (!server) throw new appError(404, "invalid invite code");

  const userId = req.user || jwtDecode(req.cookies?.accessToken)?.id;

  if (server.owner.toString() === userId?.toString())
    throw new appError(
      400,
      "you are already owner you dont need to join it bro!",
    );

  const existingMember = await memberModel.findOne({
    userId,
    serverId: server._id,
  });

  if (existingMember) {
    return res.status(200).json({
      success: true,
      message: "already a member of this server",
      member: existingMember,
      server,
    });
  }

  let userrole = await roleModel.findOne({ serverId: server._id, name: "@everyone" });
  if (!userrole) {
    userrole = await roleModel.findOne({ serverId: server._id });
  }
  if (!userrole) {
    userrole = await userRoles(server._id);
  }

  const member = await memberGenerator(
    userId,
    server._id,
    userrole._id,
  );

  return res.status(200).json({
    success: true,
    message: "server joined successfully",
    member,
    server,
  });
});

export const deleteServerController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const server = await serverModel.findOne({ owner: userId });
  if (!server) throw new appError(404, "create server first");

  await memberModel.deleteMany({ serverId: server._id });
  await roleModel.deleteMany({ serverId: server._id });

  await serverModel.deleteOne(server._id);
  await channelModel.deleteMany({serverId:server._id})

  return res.status(200).json({
    success: true,
    message: "server delete successfully",
  });
});

export const kickMembercontroller = asyncHandler(async (req, res) => {
  const { serverid, user } = req.params;

  const serverDetails = await serverModel.findById(serverid);

  if (!serverDetails.owner === req.user)
    throw new appError(401, "rank is too low for kick a person");

  if (!serverDetails) throw new appError(404, "server not exists");

  const serverMembers = await memberModel.find({ userId: user });

  if (!serverMembers) throw new appError(404, "already kicked!");

  // console.log(serverMembers[0].role);

  await roleModel.deleteMany({ userId: user });
  await memberModel.deleteOne({ serverId: serverMembers.serverID });

  res.status(200).json({
    success: true,
    message: "user kicked successfully!",
  });
});

export const leaveServer = asyncHandler(async (req, res) => {

    const user = req.user;

  const server=await serverModel.findOne({owner:user})
  if(server) throw new appError(400, "owner cannot leave the server")

    const member = await memberModel.findOne({ userId: user }).populate({
      path:"role"
    })

    if (!member) throw new appError(404, "not a member of this server")

    
    await memberModel.deleteOne({userId:user})

    
    return res.status(200).json({
      success:true,
      message:"member leave successfully"
    })

 
});


export const getchannelMemberDetailsController = asyncHandler(async (req, res) => {
  const { serverId } = req.body;
  const userId = req.user;

  const server = await serverModel.findById(serverId);
  const isOwner = server && String(server.owner) === String(userId);

  let member = await memberModel.find({ serverId, userId });
  if (member.length === 0 && isOwner) {
    member = [{ userId, serverId, role: [] }];
  }

  return res.status(200).json({
    success: true,
    message: "member details fetched successfully",
    member,
  });
});

export const generateInviteCodeController = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { serverId } = req.body || {};
  
  const server = serverId
    ? await serverModel.findById(serverId)
    : await serverModel.findOne({ owner: userId });

  if (!server) throw new appError(404, "Server not found");

  const newCode = inviteCodeGenerater();
  server.invitecode = newCode;
  await server.save();

  return res.status(200).json({
    success: true,
    message: "Invite code generated successfully",
    invitecode: newCode,
    server,
  });
});