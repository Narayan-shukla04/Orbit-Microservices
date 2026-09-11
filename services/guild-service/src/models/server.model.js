import mongoose from "mongoose";

const serverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    icon: {
      type: String,
      default: null,
    },
    banner: {
      type: String,
      default: null,
    },
    invitecode: {
      type: String,

      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const serverModel = await mongoose.model("server", serverSchema);

export default serverModel
