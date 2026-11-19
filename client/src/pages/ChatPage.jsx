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

  // Real-time socket subscription for active channel
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
          role: isSelf ? "Presiding Officer" : "Syndicate Patron",
          roleColor: isSelf ? "bg-primary-container text-on-primary-container" : "bg-surface-container text-outline",
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
          group: `Chamber Members — ${apiMembers.length}`,
          members: apiMembers.map(m => {
            const u = m.user || {}
            const name = u.fullname || u.username || "Chamber Member"
            const isSelf = Boolean(currentUserId && String(u._id) === String(currentUserId))
            const roleName = m.role?.name || (isSelf ? "Server Owner" : "Member")
            return {
              name,
              role: roleName,
              status: "online",
              badge: isSelf ? "military_tech" : null,
              badgeColor: "text-primary",
            }
          })
        }
      ]
    : [
        {
          group: "Chamber Members — 1",
          members: [
            {
              name: user?.fullname || user?.username || "Orbit Member",
              role: "Server Owner",
              status: "online",
              badge: "military_tech",
              badgeColor: "text-primary",
            }
          ]
        }
      ]

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight
  }, [messages])

  const handleCreateChamber = (e) => {
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
        setServerError(err.response?.data?.message || err.message || "Failed to create chamber")
      }
    })
  }

  if (!activeServerId || activeView === "create-chamber") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-surface-container-lowest min-h-full">
        <div className="w-full max-w-md bg-surface-container-low/60 border border-outline-variant/40 rounded-2xl p-8 shadow-[0_4px_24px_rgba(212,175,55,0.08)] backdrop-blur-md flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-container via-primary-fixed to-secondary-container flex items-center justify-center shadow-[0_4px_16px_rgba(212,175,55,0.25)] mb-4">
            <span className="material-symbols-outlined text-[32px] text-on-primary-fixed" style={{fontVariationSettings:"'FILL' 1"}}>account_balance</span>
          </div>
          <h2 className="text-display-mobile sm:text-headline-lg font-bold text-on-surface tracking-tight">Create Chamber</h2>
          <p className="mt-2 text-body-md text-on-surface-variant leading-relaxed">
            Name your private sovereign collective to host curated discussions and lossless acoustic lounges.
          </p>

          <form onSubmit={handleCreateChamber} className="w-full mt-6 flex flex-col gap-4 text-left">
            <div>
              <label className="block text-label-sm font-bold uppercase tracking-wider text-outline mb-1.5">
                Chamber Name
              </label>
              <input
                type="text"
                value={newServerName}
                onChange={e => { setNewServerName(e.target.value); setServerError(""); }}
                placeholder="e.g. Solaria Citadel"
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                autoFocus
              />
            </div>
            {serverError && (
              <div className="text-body-sm text-error bg-error-container/20 px-3 py-2 rounded-lg">
                {serverError}
              </div>
            )}
            <button
              type="submit"
              disabled={createServerMutation.isPending || !newServerName.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-title-md font-semibold shadow-[0_2px_12px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{createServerMutation.isPending ? "Forging Chamber..." : "Create Chamber"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            {apiServers && apiServers.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  dispatch(setActiveServerId(apiServers[0]._id || apiServers[0].id))
                  dispatch(setActiveView("channels"))
                }}
                className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-center"
              >
                Cancel and return to {apiServers[0].name}
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
      {/* Main arena */}
      <section className="flex-1 flex flex-col h-full min-w-0 bg-surface-container-lowest">
        {/* Channel header */}
        <header className="h-14 px-space-lg flex-shrink-0 bg-surface-container-lowest flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)] z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[20px]" style={{fontVariationSettings:"'FILL' 1"}}>tag</span>
              <span className="text-title-lg font-bold text-on-surface tracking-tight">{activeChannel}</span>
            </div>
            <div className="h-4 w-px bg-outline-variant/60 hidden sm:block"/>
            <p className="text-body-sm text-on-surface-variant truncate hidden sm:block">Private salon for syndicate leaders | Opus 384k Lossless</p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" title="Pinned" className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[19px]">push_pin</span></button>
            <button type="button" title="Notifications" className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[19px]">notifications</span></button>
          </div>
        </header>

        {/* Messages */}
        <div ref={feedRef} className="flex-1 overflow-y-auto px-space-lg py-6 space-y-6">
          {/* Welcome stamp */}
          <div className="my-4 p-space-lg rounded-2xl bg-surface-container-low shadow-[inset_0_1px_3px_rgba(212,175,55,0.1)] flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-container via-primary-fixed to-secondary-container flex items-center justify-center shadow-[0_4px_16px_rgba(212,175,55,0.25)] flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary-fixed text-[30px]" style={{fontVariationSettings:"'FILL' 1"}}>stars</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface tracking-tight">Welcome to #{activeChannel}</h2>
              <p className="mt-1 text-body-md text-on-surface-variant max-w-2xl leading-relaxed">This marks the Genesis registry for sovereign decisions, high-quorum allocations, and curated architectural releases.</p>
              <div className="mt-3 flex items-center gap-2 font-code text-label-sm text-primary">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse-dot"/>
                ENCRYPTED CHANNEL · ACCESS LEVEL TIER-IV
              </div>
            </div>
          </div>

          {/* Date divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-outline-variant/60 to-transparent"/>
            <span className="relative px-3 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-bold tracking-widest uppercase">Today</span>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-on-surface-variant">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary mb-3 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">mark_chat_read</span>
              </div>
              <h3 className="text-title-md font-bold text-on-surface mb-1">No transmissions yet</h3>
              <p className="text-body-sm text-outline max-w-sm leading-relaxed">
                This sanctuary is waiting for its first dispatch. Enter your transmission below.
              </p>
            </div>
          ) : (
            messages.map(m => (
              <article key={m.id} className={`group relative flex items-start gap-3.5 p-2 -mx-2 rounded-xl transition-colors ${m.isSelf ? "bg-primary-fixed/20 shadow-sm" : "hover:bg-surface-container-low"}`}>
                {m.isSelf && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"/>}
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-on-primary shadow-sm ring-1 ${m.isSelf ? "ring-2 ring-primary bg-gradient-to-br from-primary to-secondary-container" : "ring-primary-container bg-gradient-to-br from-primary-container to-secondary-fixed"}`}>{m.avatar}</div>
                <div className="flex-1 min-w-0 pl-1">
                  <div className="flex items-center gap-2">
                    <span className="text-title-md font-bold text-on-surface hover:underline cursor-pointer">{m.user}</span>
                    <span className={`px-2 py-0.5 rounded-full text-label-sm font-bold tracking-wider uppercase scale-90 ${m.roleColor}`}>{m.role}</span>
                    <time className="text-label-sm text-outline">{m.time}</time>
                  </div>
                  <p className="mt-1 text-body-md text-on-surface leading-relaxed">{m.text}</p>
                  {m.reactions && m.reactions.length > 0 && (
                    <div className="flex items-center gap-2 mt-2.5">
                      {m.reactions.map(r => (
                        <button key={r.emoji} onClick={() => dispatch(toggleReaction({ msgId: m.id, emoji: r.emoji }))} type="button"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-label-sm font-semibold text-on-surface">
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

        {/* Input tray */}
        <div className="p-space-lg flex-shrink-0">
          <form onSubmit={handleSubmit(onSend)} className="relative flex items-center bg-surface-container-low rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.08)] px-4 py-2.5">
            <button type="button" title="Attach" className="p-1.5 rounded-full hover:bg-surface-container text-outline hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </button>
            <input {...register("msg")} type="text" placeholder={`Message #${activeChannel}...`}
              className="flex-1 mx-3 bg-transparent text-on-surface text-body-md placeholder:text-outline focus:outline-none"/>
            <div className="flex items-center gap-1.5">
              <button type="button" className="p-1.5 rounded-full hover:bg-surface-container text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">featured_seasonal_and_gifts</span></button>
              <button type="button" className="px-2 py-0.5 rounded text-outline hover:text-on-surface font-code text-label-sm font-bold hover:bg-surface-container transition-colors">GIF</button>
              <button type="button" className="p-1.5 rounded-full hover:bg-surface-container text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">mood</span></button>
              <button type="submit" className="ml-1 w-9 h-9 rounded-xl bg-primary text-on-primary hover:brightness-105 active:scale-95 shadow-[0_2px_8px_rgba(212,175,55,0.3)] flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-[19px]">send</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Member list */}
      {memberListOpen && (
        <aside className="w-64 flex-shrink-0 bg-surface-container-low flex flex-col h-full overflow-y-auto px-space-md py-4 select-none">
          {membersList.map(g => (
            <div key={g.group} className="mb-5">
              <h4 className="px-2 text-label-sm font-bold text-outline uppercase tracking-wider">{g.group}</h4>
              <div className="mt-2 space-y-1">
                {g.members.map(m => (
                  <div key={m.name} className="group flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-container transition-colors cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary-fixed flex items-center justify-center text-on-primary-container font-bold text-[11px]">
                        {m.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-surface-container-low ${STATUS_DOT[m.status]}`}/>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-title-md font-bold text-on-surface truncate">{m.name}</span>
                        {m.badge && <span className={`material-symbols-outlined text-[15px] ${m.badgeColor}`} style={{fontVariationSettings:"'FILL' 1"}}>{m.badge}</span>}
                      </div>
                      <span className="text-label-sm text-on-surface-variant truncate">{m.role}</span>
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