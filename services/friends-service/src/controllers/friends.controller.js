import { Friendship } from "../models/friendship.model.js"
import { DmMessage } from "../models/dmMessage.model.js"
import { User } from "../models/user.model.js"
import AppError from "../utils/AppError.js"
import asyncHandler from "../middleware/asyncHandler.js"

export const conversationId = (a, b) =>
  [a, b].map(String).sort().join("_")

export const sendRequest = asyncHandler(async (req, res) => {
  const { recipientId } = req.params
  if (recipientId === req.userId)
    throw new AppError("Cannot add yourself", 400)

  const existing = await Friendship.findOne({
    requester: req.userId,
    recipient: recipientId,
  })
  if (existing) return res.json({ success: true, data: existing })

  const friendship = await Friendship.create({
    requester: req.userId,
    recipient: recipientId,
  })
  res.status(201).json({ success: true, data: friendship })
})

export const acceptRequest = asyncHandler(async (req, res) => {
  const friendship = await Friendship.findOneAndUpdate(
    { _id: req.params.friendshipId, recipient: req.userId, status: "pending" },
    { status: "accepted" },
    { new: true }
  )
  if (!friendship) throw new AppError("Request not found", 404)
  res.json({ success: true, data: friendship })
})

export const declineRequest = asyncHandler(async (req, res) => {
  const friendship = await Friendship.findOneAndUpdate(
    { _id: req.params.friendshipId, recipient: req.userId, status: "pending" },
    { status: "declined" },
    { new: true }
  )
  if (!friendship) throw new AppError("Request not found", 404)
  res.json({ success: true, data: friendship })
})

export const removeFriend = asyncHandler(async (req, res) => {
  const friendship = await Friendship.findOneAndDelete({
    _id: req.params.friendshipId,
    $or: [{ requester: req.userId }, { recipient: req.userId }],
    status: "accepted",
  })
  if (!friendship) throw new AppError("Friendship not found", 404)
  res.json({ success: true })
})

export const listFriends = asyncHandler(async (req, res) => {
  const friendships = await Friendship.find({
    $or: [{ requester: req.userId }, { recipient: req.userId }],
    status: "accepted",
  }).lean()
  res.json({ success: true, data: friendships })
})

export const listPending = asyncHandler(async (req, res) => {
  const requests = await Friendship.find({
    recipient: req.userId,
    status: "pending",
  }).lean()
  res.json({ success: true, data: requests })
})

export const getDmHistory = asyncHandler(async (req, res) => {
  const { friendId } = req.params
  const limit  = Math.min(Number(req.query.limit) || 50, 100)
  const before = req.query.before ? new Date(req.query.before) : new Date()

  const cid  = conversationId(req.userId, friendId)
  const msgs = await DmMessage.find({
    conversationId: cid,
    createdAt: { $lt: before },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  res.json({ success: true, data: msgs.reverse() })
})

export const searchUsers = asyncHandler(async (req, res) => {
  const { username } = req.query
  if (!username) throw new AppError("username query param required", 400)

  const users = await User.find({
    _id: { $ne: req.userId },
    username: { $regex: username, $options: "i" },
  })
    .select("_id username fullname profile_pic")
    .limit(20)
    .lean()

  res.json({ success: true, data: users })
})
