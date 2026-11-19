import { useState, useEffect, useRef, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { friendService } from "../services/friendService"
import { getDmSocket, joinDm, sendDm } from "../services/dmSocketService"

/**
 * Manages DM state for a single conversation with `friendId`.
 * - Fetches history on mount via REST
 * - Joins the Socket.IO room
 * - Appends incoming dm:message events
 * - Returns messages, send fn, and loading state
 */
export function useDM(friendId) {
  const [messages, setMessages] = useState([])
  const joined = useRef(false)

  // Initial history load
  const { data, isLoading } = useQuery({
    queryKey: ["dm", friendId],
    queryFn: () => friendService.history(friendId).then((r) => r.data),
    enabled: Boolean(friendId),
  })

  useEffect(() => {
    if (data) setMessages(data)
  }, [data])

  // Join room + listen for new messages
  useEffect(() => {
    if (!friendId) return

    const socket = getDmSocket()

    if (!joined.current) {
      joinDm(friendId)
      joined.current = true
    }

    const onMessage = (msg) => {
      setMessages((prev) => [...prev, msg])
    }

    socket.on("dm:message", onMessage)
    return () => {
      socket.off("dm:message", onMessage)
      joined.current = false
    }
  }, [friendId])

  const send = useCallback(
    (content) => sendDm(friendId, content),
    [friendId]
  )

  return { messages, send, isLoading }
}
