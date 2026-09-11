import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  serverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "guilds",
    required: true,
    index: true,
  },
  channelName: {
    type: String,
    trim: true,
    default: "general",
    unique: true,
  },
  type: {
    type: String,
    enum: ["voice", "text"],
    default: "text",
  },
  position: {
    type: Number,
    default: 0,
  },
},{
  timeseries:true
});

const channelModel = mongoose.model("channels", channelSchema);

export default channelModel;
