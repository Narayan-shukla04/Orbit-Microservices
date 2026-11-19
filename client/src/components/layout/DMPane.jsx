import { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { useDM } from "../../hooks/useDM"
import { useFriends, useSendRequest, usePendingRequests, useAcceptRequest, useDeclineRequest, useSearchUsers } from "../../hooks/useFriends"

/**
 * DMPane — full 1-on-1 DM view.
 * Left panel: friends list + pending requests + add-friend input.
 * Right panel: conversation with selected friend.
 */
export default function DMPane() {
  const currentUser = useSelector((s) => s.ui.currentUser)
  const [activeFriendship, setActiveFriendship] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [tab, setTab] = useState("friends") // "friends" | "pending"

  const { data: friends  = [], isLoading: loadingFriends  } = useFriends()
  const { data: pending  = [], isLoading: loadingPending  } = usePendingRequests()
  const { data: searchResults = [], isFetching: searching } = useSearchUsers(searchInput)
  const sendRequest    = useSendRequest()
  const acceptRequest  = useAcceptRequest()
  const declineRequest = useDeclineRequest()

  // Resolve the friend's userId from the friendship doc
  const friendId = activeFriendship
    ? activeFriendship.requester === currentUser?._id
      ? activeFriendship.recipient
      : activeFriendship.requester
    : null

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── Left panel ─────────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 flex flex-col bg-surface-container-low border-r border-outline-variant/20">
        {/* Search & add friend */}
        <div className="p-3 border-b border-outline-variant/20">
          <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1.5">
            Add Friend
          </label>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by username…"
            className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant/40 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container"
          />
          {searchInput.length >= 2 && (
            <div className="mt-1.5 space-y-0.5">
              {searching && <p className="text-[10px] text-outline px-1">Searching…</p>}
              {!searching && searchResults.length === 0 && (
                <p className="text-[10px] text-outline px-1">No users found.</p>
              )}
              {searchResults.map((u) => (
                <div key={u._id} className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-surface-container">
                  <div className="w-6 h-6 rounded-full bg-primary-container/30 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs text-on-surface flex-1 truncate">{u.username}</span>
                  <button
                    onClick={() => sendRequest.mutate(u._id, { onSuccess: () => setSearchInput("") })}
                    disabled={sendRequest.isPending}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-primary text-on-primary font-semibold disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
          {sendRequest.isError && (
            <p className="text-xs text-error mt-1">{sendRequest.error?.message}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/20">
          {[["friends", "Friends"], ["pending", `Pending${pending.length ? ` (${pending.length})` : ""}`]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                tab === key
                  ? "text-on-surface border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {tab === "friends" && (
            loadingFriends ? (
              <p className="text-xs text-on-surface-variant px-3 py-2">Loading…</p>
            ) : friends.length === 0 ? (
              <p className="text-xs text-on-surface-variant px-3 py-2">No friends yet.</p>
            ) : (
              friends.map((f) => {
                const fid = f.requester === currentUser?._id ? f.recipient : f.requester
                const isActive = activeFriendship?._id === f._id
                return (
                  <button
                    key={f._id}
                    onClick={() => setActiveFriendship(f)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl mx-1 transition-colors ${
                      isActive ? "bg-primary-container/20 text-on-surface" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-container/30 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                      {String(fid).slice(-2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium truncate">{String(fid).slice(0, 12)}…</span>
                  </button>
                )
              })
            )
          )}

          {tab === "pending" && (
            loadingPending ? (
              <p className="text-xs text-on-surface-variant px-3 py-2">Loading…</p>
            ) : pending.length === 0 ? (
              <p className="text-xs text-on-surface-variant px-3 py-2">No pending requests.</p>
            ) : (
              pending.map((f) => (
                <div key={f._id} className="flex items-center gap-2 px-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-primary-container/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {String(f.requester).slice(-2).toUpperCase()}
                  </div>
                  <span className="text-xs text-on-surface flex-1 truncate">{String(f.requester).slice(0, 10)}…</span>
                  <button
                    onClick={() => acceptRequest.mutate(f._id)}
                    disabled={acceptRequest.isPending}
                    className="p-1 rounded-md hover:bg-primary-container/20 text-primary disabled:opacity-50"
                    title="Accept"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                  <button
                    onClick={() => declineRequest.mutate(f._id)}
                    disabled={declineRequest.isPending}
                    className="p-1 rounded-md hover:bg-error-container/20 text-error disabled:opacity-50"
                    title="Decline"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ))
            )
          )}
        </div>
      </aside>

      {/* ── Right panel ────────────────────────────────── */}
      {friendId ? (
        <Conversation friendId={String(friendId)} currentUserId={String(currentUser?._id)} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-on-surface-variant">Select a friend to start a conversation.</p>
        </div>
      )}
    </div>
  )
}

function Conversation({ friendId, currentUserId }) {
  const { messages, send, isLoading } = useDM(friendId)
  const [input, setInput] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSend(e) {
    e.preventDefault()
    if (!input.trim()) return
    send(input.trim())
    setInput("")
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      {/* Header */}
      <div className="h-12 flex items-center gap-2 px-4 border-b border-outline-variant/20 bg-surface-container-lowest">
        <div className="w-7 h-7 rounded-full bg-primary-container/30 flex items-center justify-center text-[11px] font-bold text-primary">
          {friendId.slice(-2).toUpperCase()}
        </div>
        <span className="text-sm font-bold text-on-surface">{friendId.slice(0, 16)}…</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {isLoading && <p className="text-xs text-on-surface-variant">Loading messages…</p>}
        {messages.map((msg, i) => {
          const isSelf = String(msg.sender) === currentUserId
          return (
            <div key={msg._id ?? i} className={`flex gap-2.5 ${isSelf ? "flex-row-reverse" : ""}`}>
              {!isSelf && (
                <div className="w-7 h-7 rounded-full bg-primary-container/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                  {String(msg.sender).slice(-2).toUpperCase()}
                </div>
              )}
              <div
                className={`max-w-xs px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  isSelf
                    ? "bg-primary text-on-primary rounded-tr-sm"
                    : "bg-surface-container text-on-surface rounded-tl-sm"
                }`}
              >
                {msg.content}
                <div className={`text-[10px] mt-0.5 ${isSelf ? "text-on-primary/60" : "text-on-surface-variant"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-outline-variant/20 flex gap-2 bg-surface-container-lowest">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message…`}
          className="flex-1 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3 py-2 rounded-xl bg-primary text-on-primary disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </div>
  )
}
