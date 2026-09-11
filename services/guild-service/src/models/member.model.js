import mongoose from "mongoose";

const memberSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        trim:true,
        
    },
    serverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"guilds",
        require:true
    },
    role:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"roles"
    }
})

memberSchema.index({userId:1,guildId:1},{unique:true})


const memberModel= mongoose.model("members",memberSchema)

export default memberModel


