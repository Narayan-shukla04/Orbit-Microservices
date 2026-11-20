import axios from "axios"
import AppError from "../utils/App.error.js"

const guildServiceUrl = process.env.GUILD_SERVICE_URL || "http://localhost:3003"
const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3001"

export const channeldetails = async (channelId) => {
    const response = await axios.post(
        `${guildServiceUrl}/api/server/channel/export/channeldetails`,
        { channelId }
    )

    if (!response.data?.details) throw new AppError(400, "channel details fetch failed")
    return response.data.details
}



export const serverMemberDetails=async (serverId,cookie)=>{

    const response= await axios.post(
        `${guildServiceUrl}/api/server/export/channel-member`,
        { serverId },
       {
        headers:{
            Cookie:cookie
        }
       }
    )
    
    return response.data.member

}



export const userdetails = async (userId) => {
    const response = await axios.post(
        `${authServiceUrl}/api/user/export/mydetails`,
        { userId }
    )
    return response.data
}

export const multipleUsersDetails = async (serverId) => {
    const response = await axios.post(
        `${authServiceUrl}/api/user/export/usersdetails`,
        { serverId }
    )
    return response.data.users
}