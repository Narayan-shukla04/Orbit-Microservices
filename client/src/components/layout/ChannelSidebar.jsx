import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import { setActiveChannel, setActiveChannelId, setActiveView, openInviteModal } from "../../store/uiSlice"
import { useCurrentUserQuery } from "../../hooks/useAuth"
import { useChannelsQuery, useCreateChannelMutation } from "../../hooks/useChannels"
import { voiceService } from "../../services/voiceService"
import { useServersQuery } from "../../hooks/useGuilds"

export default function ChannelSidebar() {
  const dispatch = useDispatch()
  const activeChannel = useSelector(s => s.ui.activeChannel)
  const activeChannelId = useSelector(s => s.ui.activeChannelId)
  const activeServerId = useSelector(s => s.ui.activeServerId)
  const currentUserState = useSelector(s => s.ui.currentUser)
  const { data: queryUser } = useCurrentUserQuery()
  const { data: apiServers } = useServersQuery()
  const { data: serverChannels } = useChannelsQuery(activeServerId)
  const createChannelMutation = useCreateChannelMutation()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")

  const { data: voicePresence } = useQuery({
    queryKey: ["voice-presence"],
    queryFn: voiceService.getActiveParticipants,
    refetchInterval: 3000,
  })
  const activeVoiceMap = voicePresence?.data || {}

  const user = queryUser || currentUserState
  const currentServer = (apiServers && apiServers.length > 0)
    ? (apiServers.find(s => (s._id || s.id) === activeServerId) || apiServers[0])
    : null
  const serverName = currentServer?.name || "No Chamber Selected"

  // Auto-select first channel from real API channels if none selected or mismatched
  useEffect(() => {
    if (serverChannels && serverChannels.length > 0) {
      const match = serverChannels.find(c => c._id === activeChannelId)
      if (!match) {
        const textChan = serverChannels.find(c => c.type !== "voice") || serverChannels[0]
        dispatch(setActiveChannelId(textChan._id))
        dispatch(setActiveChannel(textChan.channelName))
      }
    }
  }, [serverChannels, activeChannelId, dispatch])

  const displayName = user?.fullname || user?.username || "Orbit Member"
  const userHandle = user?.username ? `@${user.username}` : "#0042"
  const initials = displayName
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const textChannels = (serverChannels && serverChannels.length > 0)
    ? serverChannels.filter(c => c.type !== "voice").map(c => ({
        id: c._id,
        label: c.channelName,
        icon: "tag",
        badge: false,
      }))
    : []

  const voiceChannels = (serverChannels && serverChannels.length > 0)
    ? serverChannels.filter(c => c.type === "voice").map(c => ({
        id: c._id,
        label: c.channelName,
        icon: "graphic_eq",
        count: "Lossless",
      }))
    : []

  const handleCreateChannel = (e) => {
    e.preventDefault()
    if (!newChannelName.trim()) return
    createChannelMutation.mutate({
      channelname: newChannelName.trim().toLowerCase().replace(/\s+/g, '-'),
      channeltype: "text",
      position: (serverChannels?.length || 0) + 1,
    }, {
      onSuccess: () => {
        setNewChannelName("")
        setShowCreateModal(false)
      }
    })
  }

  return (
    <aside className="fixed left-[72px] top-0 h-full w-[260px] bg-surface-container-low/75 backdrop-blur-xl border-r border-outline-variant/30 z-40 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Guild header */}
        <div className="flex items-center justify-between px-space-md py-3.5 bg-surface-container-lowest/80 border-b border-outline-variant/20 shadow-[0_1px_4px_rgba(212,175,55,0.08)]">
          <button
            onClick={() => { if (!currentServer) dispatch(setActiveView("create-chamber")) }}
            type="button"
            className="group flex items-center justify-between flex-1 min-w-0 text-left cursor-pointer"
          >
            <div className="flex flex-col items-start min-w-0">
              <div className="flex items-center gap-1.5 max-w-full">
                <span className="text-title-md font-bold text-on-surface tracking-tight truncate">{serverName}</span>
                {currentServer && <span className="material-symbols-outlined text-[17px] text-primary" style={{fontVariationSettings:"'FILL' 1"}}>verified</span>}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="px-1.5 rounded-full bg-primary-container/20 text-on-primary-container text-label-sm uppercase tracking-wider font-bold">Chamber</span>
                <span className="text-label-sm text-outline font-medium">{currentServer ? "Sovereign Quorum" : "Click to Create"}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary">expand_more</span>
          </button>
          {currentServer && (
            <button
              onClick={() => dispatch(openInviteModal())}
              type="button"
              title="Invite Members / Generate Code"
              className="ml-2 p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </button>
          )}
        </div>

        <div className="overflow-y-auto px-2 py-3 space-y-4">
          {/* Text channels */}
          <div>
            <div className="flex items-center justify-between px-space-xs py-1 text-outline text-label-sm font-bold tracking-wider uppercase">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">expand_more</span>Text Channels</span>
              <button
                onClick={() => {
                  if (!currentServer) dispatch(setActiveView("create-chamber"))
                  else setShowCreateModal(true)
                }}
                type="button"
                title={currentServer ? "Add Sanctuary" : "Create Chamber"}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
              </button>
            </div>
            <div className="mt-1 space-y-0.5 text-body-sm">
              {textChannels.length === 0 ? (
                <div className="px-3 py-3 rounded-xl bg-surface-container-low/50 text-center">
                  <p className="text-label-sm text-on-surface-variant mb-1.5">
                    {currentServer ? "No sanctuaries yet." : "No chamber active."}
                  </p>
                  <button
                    onClick={() => {
                      if (!currentServer) dispatch(setActiveView("create-chamber"))
                      else setShowCreateModal(true)
                    }}
                    type="button"
                    className="text-label-sm text-primary font-semibold hover:underline cursor-pointer"
                  >
                    {currentServer ? "+ Create Channel" : "+ Create Chamber"}
                  </button>
                </div>
              ) : (
                textChannels.map(ch => {
                  const isSelected = activeChannelId === ch.id || activeChannel === ch.label
                  return (
                    <button key={ch.id} onClick={() => {
                      dispatch(setActiveChannelId(ch.id))
                      dispatch(setActiveChannel(ch.label))
                      dispatch(setActiveView("channels"))
                    }} type="button"
                      className={`group relative w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${isSelected ? "bg-surface-container-lowest text-primary font-bold shadow-[0_2px_12px_rgba(212,175,55,0.12)]" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"}`}>
                      {isSelected && <span className="absolute left-0 top-1 bottom-1 w-1 bg-primary-container rounded-r-full"/>}
                      <span className="flex items-center gap-2 truncate pl-1">
                        <span className={`material-symbols-outlined text-[17px] ${isSelected ? "text-primary" : "text-outline group-hover:text-primary"}`} style={isSelected ? {fontVariationSettings:"'FILL' 1"} : {}}>{ch.icon}</span>
                        <span>{ch.label}</span>
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Create Channel Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <h3 className="text-title-lg font-bold text-on-surface mb-2">Create Sanctuary</h3>
                <p className="text-body-sm text-on-surface-variant mb-4">Add a new channel to this chamber.</p>
                <form onSubmit={handleCreateChannel}>
                  <input
                    type="text"
                    placeholder="e.g. strategic-brief"
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-body-sm text-on-surface mb-4 focus:outline-none focus:border-primary-container"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 text-body-sm text-on-surface-variant hover:text-on-surface">Cancel</button>
                    <button type="submit" disabled={createChannelMutation.isPending} className="px-4 py-1.5 bg-primary-container text-on-primary-container font-semibold rounded-xl text-body-sm shadow-sm hover:opacity-90">Create</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Voice channels */}
          <div>
            <div className="flex items-center justify-between px-space-xs py-1 text-outline text-label-sm font-bold tracking-wider uppercase">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">expand_more</span>Voice Channels</span>
              <button
                onClick={() => {
                  if (!currentServer) dispatch(setActiveView("create-chamber"))
                  else setShowCreateModal(true)
                }}
                type="button"
                title="Add Voice Channel"
                className="hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
              </button>
            </div>
            <div className="mt-1 space-y-0.5 text-body-sm">
              {voiceChannels.length === 0 ? (
                <p className="text-label-sm text-outline px-2 py-1">No voice channels.</p>
              ) : (
                voiceChannels.map(r => {
                  const isSelected = activeChannelId === r.id || activeChannel === r.label
                  const members = activeVoiceMap[r.id] || []
                  return (
                    <div key={r.id} className="flex flex-col">
                      <button onClick={() => {
                        dispatch(setActiveChannelId(r.id))
                        dispatch(setActiveChannel(r.label))
                        dispatch(setActiveView("voice"))
                      }} type="button"
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${isSelected ? "bg-surface-container-high text-on-surface font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"}`}>
                        <span className="flex items-center gap-2 truncate">
                          <span className="material-symbols-outlined text-[17px] text-outline">volume_up</span>
                          <span>{r.label}</span>
                        </span>
                        {members.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-nx-green/15 text-nx-green border border-nx-green/30">
                            {members.length}
                          </span>
                        )}
                      </button>

                      {/* Connected users below voice channel */}
                      {members.length > 0 && (
                        <div className="ml-5 pl-2.5 my-0.5 border-l-2 border-outline-variant/30 space-y-1 py-0.5">
                          {members.map(m => (
                            <div key={m.id} className="flex items-center gap-1.5 text-xs text-on-surface font-medium truncate py-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-nx-green shrink-0 animate-pulse" />
                              <span className="truncate">{m.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

        {/* User bar */}
        <div className="p-space-sm bg-surface-container-lowest/90 border-t border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center text-on-primary font-bold ring-2 ring-primary-container ring-offset-1 ring-offset-surface-container-lowest text-body-sm">{initials}</div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-tertiary-container rounded-full ring-2 ring-surface-container-lowest"/>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-title-md font-semibold text-on-surface truncate leading-tight">{displayName}</span>
              <span className="text-label-sm text-on-surface-variant font-code leading-tight">{userHandle}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" title="Mute" className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-md transition-colors"><span className="material-symbols-outlined text-[18px]">mic</span></button>
            <button type="button" title="Deafen" className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-md transition-colors"><span className="material-symbols-outlined text-[18px]">headphones</span></button>
            <button onClick={() => dispatch(setActiveView("settings"))} type="button" title="Settings" className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-md transition-colors"><span className="material-symbols-outlined text-[18px]">settings</span></button>
          </div>
        </div>
    </aside>
  )
}