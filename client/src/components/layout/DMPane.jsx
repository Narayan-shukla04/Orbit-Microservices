import { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { useDM } from "../../hooks/useDM"
import { useFriends, useSendRequest, usePendingRequests, useAcceptRequest, useDeclineRequest, useSearchUsers } from "../../hooks/useFriends"

export default function DMPane() {
  const currentUser = useSelector((s) => s.ui.currentUser)
  const [activeFriendship, setActiveFriendship] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [tab, setTab] = useState("friends")

  const { data: friends = [], isLoading: loadingFriends } = useFriends()
  const { data: pending = [], isLoading: loadingPending } = usePendingRequests()
  const { data: searchResults = [], isFetching: searching } = useSearchUsers(searchInput)
  const sendRequest    = useSendRequest()
  const acceptRequest  = useAcceptRequest()
  const declineRequest = useDeclineRequest()

  const friendId = activeFriendship
    ? activeFriendship.requester === currentUser?._id
      ? activeFriendship.recipient
      : activeFriendship.requester
    : null

  return (
    <div className="flex flex-1 overflow-hidden bg-white">
      <aside className="w-60 shrink-0 flex flex-col bg-neutral-50 border-r border-outline-variant">
        <div className="p-3 border-b border-outline-variant">
          <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
            Add Friend
          </label>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by username…"
            className="w-full text-xs px-2.5 py-1.5 rounded bg-white border border-outline-variant text-on-surface placeholder:text-neutral-400 focus:outline-none focus:border-on-surface transition-colors"
          />
          {searchInput.length >= 2 && (
            <div className="mt-1.5 space-y-0.5">
              {searching && <p className="text-[10px] text-neutral-400 px-1">Searching…</p>}
              {!searching && searchResults.length === 0 && (
                <p className="text-[10px] text-neutral-400 px-1">No users found.</p>
              )}
              {searchResults.map((u) => (
                <div key={u._id} className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-neutral-100">
                  <div className="w-5 h-5 rounded-full bg-neutral-200 border border-outline-variant flex items-center justify-center text-[9px] font-bold text-neutral-700 shrink-0">
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs text-on-surface flex-1 truncate">{u.username}</span>
                  <button
                    onClick={() => sendRequest.mutate(u._id, { onSuccess: () => setSearchInput("") })}
                    disabled={sendRequest.isPending}
                    className="text-[10px] px-2 py-0.5 rounded bg-on-surface text-white font-medium disabled:opacity-50 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
          {sendRequest.isError && (
            <p className="text-xs text-red-600 mt-1">{sendRequest.error?.message}</p>
          )}
        </div>

        <div className="flex border-b border-outline-variant">
          {[["friends", "Friends"], ["pending", `Pending${pending.length ? ` (${pending.length})` : ""}`]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${
                tab === key
                  ? "text-on-surface border-b-2 border-on-surface font-semibold bg-white"
                  : "text-neutral-500 hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {tab === "friends" && (
            loadingFriends ? (
              <p className="text-xs text-neutral-400 px-3 py-2">Loading…</p>
            ) : friends.length === 0 ? (
              <p className="text-xs text-neutral-400 px-3 py-2">No friends yet.</p>
            ) : (
              friends.map((f) => {
                const fid = f.requester === currentUser?._id ? f.recipient : f.requester
                const isActive = activeFriendship?._id === f._id
                return (
                  <button
                    key={f._id}
                    onClick={() => setActiveFriendship(f)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-left rounded mx-0.5 transition-colors cursor-pointer ${
                      isActive ? "bg-neutral-200 text-on-surface font-medium" : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-neutral-200 border border-outline-variant flex items-center justify-center text-[10px] font-semibold text-neutral-800 shrink-0">
                      {String(fid).slice(-2).toUpperCase()}
                    </div>
                    <span className="text-xs truncate">{String(fid).slice(0, 12)}…</span>
                  </button>
                )
              })
            )
          )}

          {tab === "pending" && (
            loadingPending ? (
              <p className="text-xs text-neutral-400 px-3 py-2">Loading…</p>
            ) : pending.length === 0 ? (
              <p className="text-xs text-neutral-400 px-3 py-2">No pending requests.</p>
            ) : (
              pending.map((f) => (
                <div key={f._id} className="flex items-center gap-2 px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-neutral-200 border border-outline-variant flex items-center justify-center text-[10px] font-semibold text-neutral-800 shrink-0">
                    {String(f.requester).slice(-2).toUpperCase()}
                  </div>
                  <span className="text-xs text-on-surface flex-1 truncate">{String(f.requester).slice(0, 10)}…</span>
                  <button
                    onClick={() => acceptRequest.mutate(f._id)}
                    disabled={acceptRequest.isPending}
                    className="p-1 rounded hover:bg-neutral-200 text-neutral-700 disabled:opacity-50 cursor-pointer"
                    title="Accept"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                  <button
                    onClick={() => declineRequest.mutate(f._id)}
                    disabled={declineRequest.isPending}
                    className="p-1 rounded hover:bg-neutral-200 text-neutral-500 disabled:opacity-50 cursor-pointer"
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

      {friendId ? (
        <Conversation friendId={String(friendId)} currentUserId={String(currentUser?._id)} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <p className="text-xs text-neutral-400">Select a friend to start a conversation.</p>
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
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="h-12 flex items-center gap-2 px-4 border-b border-outline-variant bg-white">
        <div className="w-6 h-6 rounded-full bg-neutral-200 border border-outline-variant flex items-center justify-center text-[10px] font-semibold text-neutral-800">
          {friendId.slice(-2).toUpperCase()}
        </div>
        <span className="text-xs font-bold text-on-surface">{friendId.slice(0, 16)}…</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {isLoading && <p className="text-xs text-neutral-400">Loading messages…</p>}
        {messages.map((msg, i) => {
          const isSelf = String(msg.sender) === currentUserId
          return (
            <div key={msg._id ?? i} className={`flex gap-2.5 ${isSelf ? "flex-row-reverse" : ""}`}>
              {!isSelf && (
                <div className="w-6 h-6 rounded-full bg-neutral-200 border border-outline-variant flex items-center justify-center text-[10px] font-semibold text-neutral-800 shrink-0 mt-0.5">
                  {String(msg.sender).slice(-2).toUpperCase()}
                </div>
              )}
              <div
                className={`max-w-xs px-3 py-1.5 rounded text-xs leading-normal ${
                  isSelf
                    ? "bg-on-surface text-white"
                    : "bg-neutral-100 border border-outline-variant text-on-surface"
                }`}
              >
                {msg.content}
                <div className={`text-[10px] mt-0.5 ${isSelf ? "text-neutral-400" : "text-neutral-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-outline-variant flex gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message..."
          className="flex-1 px-3 py-1.5 rounded bg-neutral-50 border border-outline-variant text-xs text-on-surface placeholder:text-neutral-400 focus:outline-none focus:border-on-surface focus:bg-white transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3 py-1.5 rounded bg-on-surface text-white disabled:opacity-40 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">send</span>
        </button>
      </form>
    </div>
  )
}
