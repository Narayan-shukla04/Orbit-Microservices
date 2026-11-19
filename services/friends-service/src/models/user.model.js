import mongoose from "mongoose"

// Read-only projection of the shared `users` collection.
// Only fields needed for friend-search are declared.
const userSchema = new mongoose.Schema(
  { username: String, fullname: String, profile_pic: String },
  { collection: "users", timestamps: true }
)

export const User = mongoose.model("User", userSchema)
