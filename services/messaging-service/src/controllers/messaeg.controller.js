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

  const ServerMember = await serverMemberDetails(channelDetails.serverId, cookies)
 
  if (!ServerMember) throw new AppError(403, "not authorized")


    let membersUserId=[]
ServerMember.map((e)=>{
membersUserId.push(e.userId)
})

    
    
    const members= await multipleUsersDetails(membersUserId)
// console.log("members", members);

    const findMessages=await messageModel.find({
      authorId: { $in: members.map(member=>member._id) }
    })

    // console.log("find messages", findMessages);
    

    let result=findMessages.map((e)=>({
      user: members.find(p=>String(e.authorId)===String(p._id)),
      content:e.content,
      createdAt:e.createdAt,
      updatedAt:e.updatedAt
    }))
    
    console.log(result);
    











  return res.status(200).json({
    message: "messages fetched successfully",
    result
  })

});