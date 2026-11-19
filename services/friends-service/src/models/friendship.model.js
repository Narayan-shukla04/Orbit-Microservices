import mongoose from "mongoose"

/**
 * One document per directed friendship edge.
 * requester sends a request → recipient accepts/declines.
 * Once accepted, both directions are queryable via the compound index.
 */
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

// Prevent duplicate requests between same pair
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true })

export const Friendship = mongoose.model("Friendship", friendshipSchema)
