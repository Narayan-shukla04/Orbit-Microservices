import { axiosClient } from "../api/axiosClient"

export const friendService = {
  list:    ()                 => axiosClient.get("/friends"),
  pending: ()                 => axiosClient.get("/friends/pending"),
  history: (friendId, params) => axiosClient.get(`/friends/dm/${friendId}`, { params }),
  search:  (username)         => axiosClient.get("/friends/search", { params: { username } }),

  sendRequest:    (recipientId)   => axiosClient.post(`/friends/request/${recipientId}`),
  acceptRequest:  (friendshipId)  => axiosClient.patch(`/friends/accept/${friendshipId}`),
  declineRequest: (friendshipId)  => axiosClient.patch(`/friends/decline/${friendshipId}`),
  remove:         (friendshipId)  => axiosClient.delete(`/friends/${friendshipId}`),
}
