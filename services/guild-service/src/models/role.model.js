
import mongoose from "mongoose";

const roleSchema= new mongoose.Schema({
    serverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"guilds"
    },
    name :{
        type:String,
        trim:true,
        required:true
    },
    Permissions:{
        type:[String],
        default:[]
    },
    position:{
        type:Number,
        default:0
    },
    color:{
        type:String,
        default:"#a84141"
    }
})


const roleModel= mongoose.model("roles",roleSchema)

export default roleModel