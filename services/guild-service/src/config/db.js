import mongoose from "mongoose"


export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected");
        try {
            await mongoose.connection.collection("channels").dropIndex("channelName_1");
            console.log("Dropped legacy channelName_1 index");
        } catch (_) {}
        try {
            await mongoose.connection.collection("members").dropIndex("userId_1_guildId_1");
            console.log("Dropped legacy userId_1_guildId_1 index");
        } catch (_) {}
    } catch (error) {
        console.log(error.message);
    }
}