import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import channelModel from "../models/channel.model.js";
import serverModel from "../models/server.model.js";
import { appError } from "../utils/appError.js";
import { channelGenerator } from "../utils/channelGenerator.js";

export const createChannel = asyncHandler(async (req, res) => {
  const user = req.user;
  const { channelname, channeltype, position } = req.body;

  const server = await serverModel.findOne({
    owner: user,
  });

  if (!server) throw new appError(404, "server not exists");

  const textChannel = await channelGenerator(
    server._id,
    channelname,
    channeltype,
    position,
  );

  return res.status(201).json({
    success: true,
    message: "channel created successfully",
    textChannel,
  });
});

export const updateChannelController = asyncHandler(async (req, res) => {
  const user = req.user;
  const { channelid } = req.params;

  const { channelname, position } = req.body;

  const server = await serverModel.findOne({ owner: user });

  if (!server)
    throw new appError(404, "only owner of the server can upadate the channel");

  const channel = await channelModel.findOneAndUpdate(
    { _id: channelid },
    {
      channelName: channelname,
      position: position,
    },
  );

  return res.status(200).json({
    success: true,
    message: "channel update successfully",
  });
});

export const getchannelController = asyncHandler(async (req, res) => {
  const { serverId } = req.params;

  const server = await serverModel.findById(serverId);
  if (!server) throw new appError(404, "server not found");


  const channels= await channelModel.find({serverId})
  if(!channels) throw new appError(404,"create a channel first")

    return res.status(200).json({
      success:true,
      message:"channnels fatched successfully",
      channels
    })

});



export const exportChannelDetailsController=asyncHandler(async(req,res)=>{

  const {channelId}=req.body

  const details=await channelModel.findById(channelId)

  if(!details) throw new appError(404,"channel not found")

    return res.status(200).json({
      message:"channel details fatched successfully",
      details
    })

})