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
  const serverName = currentServer?.name || "No Server Selected"

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
    <aside className="fixed left-[72px] top-0 h-full w-[260px] bg-neutral-50 border-r border-outline-variant z-40 flex flex-col justify-between">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-outline-variant">
          <button
            onClick={() => { if (!currentServer) dispatch(setActiveView("create-chamber")) }}
            type="button"
            className="group flex items-center justify-between flex-1 min-w-0 text-left cursor-pointer"
          >
            <div className="flex flex-col items-start min-w-0">
              <div className="flex items-center gap-1.5 max-w-full">
                <span className="text-sm font-bold text-on-surface tracking-tight truncate">{serverName}</span>
                {currentServer && <span className="material-symbols-outlined text-[16px] text-neutral-500">check_circle</span>}
              </div>
              <span className="text-xs text-on-surface-variant font-normal mt-0.5">{currentServer ? "Community" : "Click to Create"}</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px]">expand_more</span>
          </button>
          {currentServer && (
            <button
              onClick={() => dispatch(openInviteModal())}
              type="button"
              title="Invite Members"
              className="ml-2 p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
            </button>
          )}
        </div>

        <div className="overflow-y-auto px-2 py-3 space-y-4">
          <div>
            <div className="flex items-center justify-between px-2 py-1 text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
              <span>Text Channels</span>
              <button
                onClick={() => {
                  if (!currentServer) dispatch(setActiveView("create-chamber"))
                  else setShowCreateModal(true)
                }}
                type="button"
                title={currentServer ? "Add Channel" : "Create Server"}
                className="hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
              </button>
            </div>
            <div className="mt-1 space-y-0.5 text-body-sm">
              {textChannels.length === 0 ? (
                <div className="px-3 py-3 rounded bg-neutral-100 text-center">
                  <p className="text-xs text-neutral-500 mb-1.5">
                    {currentServer ? "No channels yet." : "No server active."}
                  </p>
                  <button
                    onClick={() => {
                      if (!currentServer) dispatch(setActiveView("create-chamber"))
                      else setShowCreateModal(true)
                    }}
                    type="button"
                    className="text-xs text-neutral-700 font-medium hover:underline cursor-pointer"
                  >
                    {currentServer ? "+ Create Channel" : "+ Create Server"}
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
                      className={`group relative w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors text-xs ${isSelected ? "bg-white text-neutral-900 font-semibold border border-neutral-200" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"}`}>
                      <span className="flex items-center gap-2 truncate">
                        <span className="material-symbols-outlined text-[16px] text-neutral-500">{ch.icon}</span>
                        <span>{ch.label}</span>
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {showCreateModal && (
            <div className="fixed inset-0 bg-neutral-900/40 z-[100] flex items-center justify-center p-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-6 w-full max-w-sm shadow-sm">
                <h3 className="text-base font-bold text-neutral-900 mb-1">Create Channel</h3>
                <p className="text-xs text-neutral-500 mb-4">Add a new channel to this server.</p>
                <form onSubmit={handleCreateChannel}>
                  <input
                    type="text"
                    placeholder="e.g. general"
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-900 mb-4 focus:outline-none focus:border-neutral-900"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900">Cancel</button>
                    <button type="submit" disabled={createChannelMutation.isPending} className="px-4 py-1.5 bg-neutral-900 text-white font-medium rounded-lg text-xs hover:bg-neutral-800">Create</button>
                  </div>
                </form>
              </div>
            </div>
          )}

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

        <div className="p-3 bg-white border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">{initials}</div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-1 ring-white"/>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-neutral-900 truncate leading-tight">{displayName}</span>
              <span className="text-[11px] text-neutral-500 font-mono leading-tight">{userHandle}</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button type="button" title="Mute" className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"><span className="material-symbols-outlined text-[16px]">mic</span></button>
            <button type="button" title="Deafen" className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"><span className="material-symbols-outlined text-[16px]">headphones</span></button>
            <button onClick={() => dispatch(setActiveView("settings"))} type="button" title="Settings" className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"><span className="material-symbols-outlined text-[16px]">settings</span></button>
          </div>
        </div>
    </aside>
  )
}