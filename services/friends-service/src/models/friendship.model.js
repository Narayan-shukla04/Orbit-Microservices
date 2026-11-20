import mongoose from "mongoose"

const friendshipSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
)

friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true })

export const Friendship = mongoose.model("Friendship", friendshipSchema)
