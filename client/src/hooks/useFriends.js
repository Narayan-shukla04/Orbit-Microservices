import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { friendService } from "../services/friendService"

export function useFriends() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: () => friendService.list().then((r) => r.data),
  })
}

export function usePendingRequests() {
  return useQuery({
    queryKey: ["friends", "pending"],
    queryFn: () => friendService.pending().then((r) => r.data),
  })
}

export function useSearchUsers(username) {
  return useQuery({
    queryKey: ["friends", "search", username],
    queryFn: () => friendService.search(username).then((r) => r.data),
    enabled: username.length >= 2,
    staleTime: 10_000,
  })
}

export function useSendRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (recipientId) => friendService.sendRequest(recipientId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  })
}

export function useAcceptRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (friendshipId) => friendService.acceptRequest(friendshipId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["friends"] })
      qc.invalidateQueries({ queryKey: ["friends", "pending"] })
    },
  })
}

export function useDeclineRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (friendshipId) => friendService.declineRequest(friendshipId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends", "pending"] }),
  })
}

export function useRemoveFriend() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (friendshipId) => friendService.remove(friendshipId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  })
}
