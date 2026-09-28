import mongoose, { model } from "mongoose";

const messageSchema=new mongoose.Schema({
    channelId:{
       type: String,
       require:true,
       index:true
    },
    authorId:{
        type:String,
        require:true,
        index:true
    },
    content:{
        type:String,
        trim:true
    },
    attachments:{
        type:String,
        enum:["image","video","document"]
    }
},{timestamps:true})


const messageModel= mongoose.model("messages",messageSchema)


export default messageModel