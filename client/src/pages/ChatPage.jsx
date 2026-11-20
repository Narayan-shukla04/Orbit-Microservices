import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { sendMessage, toggleReaction } from "../store/chatSlice"
import { setActiveServerId, setActiveView } from "../store/uiSlice"
import { useChannelMessagesQuery, useSendMessageMutation, useChannelSocket } from "../hooks/useMessages"
import { useCurrentUserQuery } from "../hooks/useAuth"
import { useServerDetailsQuery, useServersQuery, useCreateServerMutation } from "../hooks/useGuilds"

const STATUS_DOT = {
  online:  "bg-nx-green",
  idle:    "bg-nx-amber",
  dnd:     "bg-nx-red",
  voice:   "bg-primary-container",
  offline: "bg-outline-variant",
}

export default function ChatPage() {
  const dispatch = useDispatch()
  const activeView = useSelector(s => s.ui.activeView)
  const seedMessages = useSelector(s => s.chat.messages)
  const memberListOpen = useSelector(s => s.ui.memberListOpen)
  const activeChannel = useSelector(s => s.ui.activeChannel)
  const activeChannelId = useSelector(s => s.ui.activeChannelId)
  const activeServerId = useSelector(s => s.ui.activeServerId)
  const currentUserState = useSelector(s => s.ui.currentUser)
  const { data: queryUser } = useCurrentUserQuery()
  const { data: apiServers } = useServersQuery()
  const createServerMutation = useCreateServerMutation()
  const { data: serverDetails } = useServerDetailsQuery(activeServerId)
  const user = queryUser || currentUserState

  const [newServerName, setNewServerName] = useState("")
  const [serverError, setServerError] = useState("")

  useChannelSocket(activeChannelId)

  const { data: liveMessages } = useChannelMessagesQuery(activeChannelId)
  const sendMutation = useSendMessageMutation(activeChannelId)

  const feedRef = useRef(null)
  const { register, handleSubmit, reset } = useForm()

  const currentUserId = user?._id || user?.id

  const messages = (liveMessages && liveMessages.length > 0)
    ? liveMessages.map((m, idx) => {
        const u = m.user || {}
        const isSelf = Boolean(currentUserId && String(u._id) === String(currentUserId))
        const name = u.fullname || u.username || "Orbit Member"
        const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
        const time = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
        return {
          id: m._id || idx,
          user: name,
          avatar: initials,
          role: isSelf ? "Owner" : "Member",
          roleColor: isSelf ? "bg-neutral-100 text-neutral-800" : "bg-neutral-50 text-neutral-600",
          time,
          text: m.content,
          isSelf,
          reactions: [],
        }
      })
    : seedMessages

  const apiMembers = serverDetails?.member || serverDetails?.members || []
  const membersList = (apiMembers && apiMembers.length > 0)
    ? [
        {
          group: `Members — ${apiMembers.length}`,
          members: apiMembers.map(m => {
            const u = m.user || {}
            const name = u.fullname || u.username || "Member"
            const isSelf = Boolean(currentUserId && String(u._id) === String(currentUserId))
            const roleName = m.role?.name || (isSelf ? "Owner" : "Member")
            return {
              name,
              role: roleName,
              status: "online",
              badge: isSelf ? "shield" : null,
              badgeColor: "text-neutral-500",
            }
          })
        }
      ]
    : [
        {
          group: "Members — 1",
          members: [
            {
              name: user?.fullname || user?.username || "Orbit Member",
              role: "Owner",
              status: "online",
              badge: "shield",
              badgeColor: "text-neutral-500",
            }
          ]
        }
      ]

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight
  }, [messages])

  const handleCreateServer = (e) => {
    e.preventDefault()
    if (!newServerName.trim()) return
    setServerError("")
    createServerMutation.mutate({ name: newServerName.trim() }, {
      onSuccess: (data) => {
        setNewServerName("")
        const createdServer = data?.server || data
        const newId = createdServer?._id || createdServer?.id
        if (newId) {
          dispatch(setActiveServerId(newId))
        }
        dispatch(setActiveView("channels"))
      },
      onError: (err) => {
        setServerError(err.response?.data?.message || err.message || "Failed to create server")
      }
    })
  }

  if (!activeServerId || activeView === "create-chamber") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-neutral-50 min-h-full">
        <div className="w-full max-w-sm bg-white border border-outline-variant rounded-lg p-6 flex flex-col items-start text-left">
          <div className="w-10 h-10 rounded bg-neutral-100 border border-outline-variant flex items-center justify-center text-on-surface mb-4">
            <span className="material-symbols-outlined text-[20px]">add_business</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">Create a server</h2>
          <p className="mt-1 text-xs text-neutral-500 leading-normal">
            Your server is where you communicate in text channels and voice rooms.
          </p>

          <form onSubmit={handleCreateServer} className="w-full mt-5 flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Server Name
              </label>
              <input
                type="text"
                value={newServerName}
                onChange={e => { setNewServerName(e.target.value); setServerError(""); }}
                placeholder="e.g. My Workspace"
                className="w-full px-3 py-2 bg-neutral-50 border border-outline-variant rounded text-xs text-on-surface placeholder:text-neutral-400 focus:outline-none focus:border-on-surface focus:bg-white transition-colors"
                autoFocus
              />
            </div>
            {serverError && (
              <div className="text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded border border-red-200">
                {serverError}
              </div>
            )}
            <button
              type="submit"
              disabled={createServerMutation.isPending || !newServerName.trim()}
              className="w-full py-2 rounded bg-on-surface text-white text-xs font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
            >
              <span>{createServerMutation.isPending ? "Creating..." : "Create Server"}</span>
            </button>
            {apiServers && apiServers.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  dispatch(setActiveServerId(apiServers[0]._id || apiServers[0].id))
                  dispatch(setActiveView("channels"))
                }}
                className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer text-center mt-1"
              >
                Back to {apiServers[0].name}
              </button>
            )}
          </form>
        </div>
      </div>
    )
  }

  const onSend = ({ msg }) => {
    if (!msg.trim()) return
    const text = msg.trim()
    dispatch(sendMessage(text))
    reset()
    if (activeChannelId) {
      sendMutation.mutate(text)
    }
  }

  return (
    <div className="flex flex-row w-full h-full min-w-0 bg-surface">
      <section className="flex-1 flex flex-col h-full min-w-0 bg-white">
        <header className="h-12 px-4 flex-shrink-0 bg-white border-b border-outline-variant flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="material-symbols-outlined text-neutral-500 text-[18px]">tag</span>
              <span className="text-sm font-bold text-on-surface tracking-tight">{activeChannel}</span>
            </div>
            <div className="h-3.5 w-px bg-outline-variant hidden sm:block"/>
            <p className="text-xs text-neutral-500 truncate hidden sm:block">Channel discussion</p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" title="Pinned" className="p-1 rounded text-neutral-500 hover:text-on-surface hover:bg-neutral-100 transition-colors"><span className="material-symbols-outlined text-[18px]">push_pin</span></button>
            <button type="button" title="Notifications" className="p-1 rounded text-neutral-500 hover:text-on-surface hover:bg-neutral-100 transition-colors"><span className="material-symbols-outlined text-[18px]">notifications</span></button>
          </div>
        </header>

        <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="my-2 pb-4 border-b border-outline-variant">
            <div className="w-9 h-9 rounded bg-neutral-100 border border-outline-variant flex items-center justify-center text-on-surface mb-2">
              <span className="material-symbols-outlined text-[20px]">tag</span>
            </div>
            <h2 className="text-lg font-bold text-on-surface tracking-tight">Welcome to #{activeChannel}</h2>
            <p className="mt-0.5 text-xs text-neutral-500">This is the start of the #{activeChannel} channel.</p>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-x-0 h-px bg-outline-variant"/>
            <span className="relative px-2 py-0.5 rounded bg-white border border-outline-variant text-neutral-500 text-[10px] font-medium uppercase">Today</span>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500">
              <div className="w-10 h-10 rounded bg-neutral-100 border border-outline-variant flex items-center justify-center text-neutral-500 mb-2">
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </div>
              <h3 className="text-xs font-semibold text-on-surface mb-0.5">No messages yet</h3>
              <p className="text-xs text-neutral-400 max-w-xs leading-normal">
                Send a message to start the conversation.
              </p>
            </div>
          ) : (
            messages.map(m => (
              <article key={m.id} className={`group relative flex items-start gap-3 p-1.5 -mx-1.5 rounded transition-colors ${m.isSelf ? "bg-neutral-50" : "hover:bg-neutral-50"}`}>
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs text-on-surface bg-neutral-200 border border-outline-variant">{m.avatar}</div>
                <div className="flex-1 min-w-0 pl-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface hover:underline cursor-pointer">{m.user}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border border-outline-variant ${m.roleColor}`}>{m.role}</span>
                    <time className="text-[10px] text-neutral-400">{m.time}</time>
                  </div>
                  <p className="mt-0.5 text-xs text-on-surface leading-normal">{m.text}</p>
                  {m.reactions && m.reactions.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {m.reactions.map(r => (
                        <button key={r.emoji} onClick={() => dispatch(toggleReaction({ msgId: m.id, emoji: r.emoji }))} type="button"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 border border-outline-variant hover:bg-neutral-200 transition-colors text-xs font-medium text-on-surface">
                          <span>{r.emoji}</span><span>{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        <div className="p-4 flex-shrink-0">
          <form onSubmit={handleSubmit(onSend)} className="relative flex items-center bg-neutral-50 border border-outline-variant rounded-lg px-3 py-1.5">
            <button type="button" title="Attach" className="p-1 rounded text-neutral-400 hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
            </button>
            <input {...register("msg")} type="text" placeholder={`Message #${activeChannel}...`}
              className="flex-1 mx-2.5 bg-transparent text-on-surface text-xs placeholder:text-neutral-400 focus:outline-none"/>
            <div className="flex items-center gap-1">
              <button type="button" className="px-1.5 py-0.5 rounded text-neutral-400 hover:text-on-surface font-code text-[10px] font-bold hover:bg-neutral-200 transition-colors">GIF</button>
              <button type="button" className="p-1 rounded text-neutral-400 hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-[18px]">mood</span></button>
              <button type="submit" className="ml-1 w-7 h-7 rounded bg-on-surface text-white hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {memberListOpen && (
        <aside className="w-56 flex-shrink-0 bg-neutral-50 border-l border-outline-variant flex flex-col h-full overflow-y-auto px-3 py-3 select-none">
          {membersList.map(g => (
            <div key={g.group} className="mb-4">
              <h4 className="px-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">{g.group}</h4>
              <div className="mt-1.5 space-y-0.5">
                {g.members.map(m => (
                  <div key={m.name} className="group flex items-center gap-2 p-1.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <div className="w-7 h-7 rounded-full bg-neutral-200 border border-outline-variant flex items-center justify-center text-on-surface font-medium text-[10px]">
                        {m.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white ${STATUS_DOT[m.status]}`}/>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-on-surface truncate">{m.name}</span>
                        {m.badge && <span className={`material-symbols-outlined text-[14px] ${m.badgeColor}`}>{m.badge}</span>}
                      </div>
                      <span className="text-[10px] text-neutral-500 truncate">{m.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>
      )}
    </div>
  )
}