import memberModel from "../models/member.model.js"

export const memberGenerator= async(userId ,serverId ,role,color="#ffff")=>{
return await memberModel.create({
    userId,serverId,role,color
})
}