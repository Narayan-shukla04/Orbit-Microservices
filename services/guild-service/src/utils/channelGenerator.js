import channelModel from "../models/channel.model.js"


export const channelGenerator=async(serverId,channelName,type,position)=>{

return await channelModel.create({
    serverId,
    channelName,
    type,
    position
})

}