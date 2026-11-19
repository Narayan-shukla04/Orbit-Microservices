import createJoinToken, { getActiveParticipants } from "../services/livekit.js"

export const getJoinController = async (req, res, next) => {
  try {
    const channelId = req.body?.channelId || req.body
    const username = req.body?.username || req.params?.username || "User"

    if (!channelId || typeof channelId !== "string") {
      return res.status(400).json({ success: false, message: "channel ID is required" })
    }

    const data = await createJoinToken({
      channelId,
      userId: req.userId,
      username,
    })

    res.status(200).json({
      success: true,
      message: "JOIN",
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getActiveParticipantsController = async (req, res, next) => {
  try {
    const data = await getActiveParticipants()
    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

export default getJoinController