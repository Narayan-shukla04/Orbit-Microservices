import { Server } from "socket.io";
import asyncHandler from "../middleware/asyncHandler.js";
import { channeldetails, serverMemberDetails } from "../services/fatchDetails.services.js";
import AppError from "../utils/App.error.js";
import { socketAuthMiddleware } from "../middleware/socketAuth.middleware.js";

let io;

export const initializedSocket = (server) => {
  io = new Server(server);

  io.use(socketAuthMiddleware)

  io.on("connection", (socket) => {
    console.log("socket connect ", socket.id);
    socket.on("join-channel",asyncHandler(async(channelId)=>{

     try {
       const channelDetails= await channeldetails(channelId)

      if(!channelDetails) throw new AppError(404,"channel not found")


        const serverMember= await serverMemberDetails({serverId:channelDetails.serverId,userId:socket.user})

        if(!serverMember) throw new AppError(404,"server member not found")

        socket.join(`channel-${channelId}`)
        
     } catch (error) {
        
        return next(new AppError(500, "Internal Server Error"))
     }

      
    })
  )

  socket.on("leave-channel",asyncHandler(async(channelId)=>{
    try {
      socket.leave(`channel-${channelId}`)

      
      
    } catch (error) {
      console.log(error.message);
    }
  }))


    socket.on("disconnect", () => {
      console.log("socket dissconect", socket.id);
    });
  });
};

export const getIo=()=>{
  if(!io) throw new AppError(500,"socket io not initialized")
  return io;
}