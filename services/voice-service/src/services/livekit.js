import { AccessToken, RoomServiceClient } from "livekit-server-sdk"

const getRoomService = () => {
  const url = (process.env.LIVEKIT_URL || "").replace(/^ws/, "http")
  return new RoomServiceClient(url, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET)
}

export const getActiveParticipants = async () => {
  const svc = getRoomService()
  const rooms = await svc.listRooms()
  const map = {}
  await Promise.all(
    rooms.map(async (room) => {
      if (room.numParticipants > 0) {
        const participants = await svc.listParticipants(room.name)
        map[room.name] = participants.map((p) => ({
          id: p.identity,
          name: p.name || p.identity,
        }))
      }
    })
  )
  return map
}

const createJoinToken = async ({ channelId, userId, username }) => {
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: String(userId),
    name: username,
  })

  at.addGrant({
    room: channelId,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  })

  const token = await at.toJwt()

  return {
    token,
    url: process.env.LIVEKIT_URL,
  }
}

export default createJoinToken