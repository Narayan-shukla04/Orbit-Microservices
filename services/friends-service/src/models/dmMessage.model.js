/**
 * DM message stored per conversation. conversationId = sorted pair of userIds joined by "_".
 * Kept simple: no separate Conversation document needed for 1-on-1 DMs.
 */
import mongoose from "mongoose"

const dmMessageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    content: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: true }
)

export const DmMessage = mongoose.model("DmMessage", dmMessageSchema)
