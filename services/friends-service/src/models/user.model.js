import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  { username: String, fullname: String, profile_pic: String },
  { collection: "users", timestamps: true }
)

export const User = mongoose.model("User", userSchema)
