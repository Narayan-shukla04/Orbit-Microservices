import asyncHandler from "../middleware/asyncHandler.js";
import messageModel from "../models/message.model.js";
import { channeldetails, multipleUsersDetails, serverMemberDetails, userdetails } from "../services/fatchDetails.services.js";
import { getIo } from "../socket/socket.js";
import AppError from "../utils/App.error.js";
export const createMessage = asyncHandler(async (req, res) => {
  const { channelId } = req.params;



  const { content } = req.body;

  const files = req.files
console.log("logged in user",req.user);


  const message = await messageModel.create({
    content,
    authorId: req.user,
    channelId,
    // attachments :files?.attachments ||""

  })


  const messageDetails = await userdetails(req.user)
  // console.log(messageDetails);

  const broadcastMessage = {
    messageId: message._id,
    content: message.content,
    attachments: message?.attachments || "",
    username: messageDetails.user.username,
    fullname: messageDetails.user.fullname,
    profile_pic: messageDetails.user.profile_pic,

  }


  const io = getIo()
  io.to(`channel-${channelId}`).emit("new-message", broadcastMessage)
  console.log("new message sent")
  console.log(broadcastMessage)







  return res.status(200).json({
    message: "message created successfully",
    message
  })

});



export const getAllMessages = asyncHandler(async (req, res) => {
  
console.log("hittrs");

  const { channelId } = req.params;
  const cookies=req.headers.cookie;

  

  const channelDetails = await channeldetails(channelId);

  
  if (!channelDetails) throw new AppError(404, "channel not found")

  const ServerMember = await serverMemberDetails(channelDetails.serverId, cookies);
  if (!ServerMember || (Array.isArray(ServerMember) && ServerMember.length === 0)) {
    throw new AppError(403, "not authorized");
  }

    const findMessages = await messageModel.find({ channelId }).sort({ createdAt: 1 });

    const authorIds = [...new Set(findMessages.map(m => m.authorId).filter(Boolean))];
    let allMembers = [];
    if (authorIds.length > 0) {
      try {
        allMembers = await multipleUsersDetails(authorIds);
      } catch (_) {
        allMembers = [];
      }
    }

    let result = findMessages.map((e) => ({
      _id: e._id,
      user: allMembers.find(p => String(e.authorId) === String(p._id)) || {
        _id: e.authorId,
        username: "Member",
        fullname: "Chamber Member"
      },
      content: e.content,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt
    }));
    
    console.log(result);
    











  return res.status(200).json({
    message: "messages fetched successfully",
    result
  })

});