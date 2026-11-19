import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useCurrentUserQuery } from "../hooks/useAuth"
import { useVoice } from "../hooks/useVoice"
import { setActiveView } from "../store/uiSlice"

function ParticipantTile({ p }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!p?.participant) return
    const el = videoRef.current
    const trackPub = Array.from(p.participant.videoTrackPublications?.values() || [])[0]
    if (trackPub?.track && el) {
      trackPub.track.attach(el)
      return () => {
        trackPub.track?.detach(el)
      }
    }
  }, [p])

  const initials = (p.name || "U")
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const hasVideo = p.participant?.videoTrackPublications?.size > 0

  return (
    <div className={`relative flex flex-col items-center justify-center w-48 h-40 rounded-lg bg-white border transition-colors overflow-hidden ${p.isSpeaking ? "border-emerald-600 ring-1 ring-emerald-600" : "border-outline-variant"}`}>
      {hasVideo ? (
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="relative w-16 h-16 rounded-full bg-neutral-200 border border-outline-variant flex items-center justify-center text-lg font-semibold text-neutral-800">
          {initials}
          {p.isMuted && (
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[12px]">mic_off</span>
            </span>
          )}
        </div>
      )}
      <div className={`mt-3 flex items-center gap-1.5 text-center ${hasVideo ? "absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-white" : ""}`}>
        <span className="text-xs font-medium text-on-surface truncate max-w-[140px]">
          {p.name} {p.isLocal && "(You)"}
        </span>
        {p.isSpeaking && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
      </div>
    </div>
  )
}

export default function VoicePage() {
  const dispatch = useDispatch()
  const activeChannel = useSelector(s => s.ui.activeChannel)
  const activeChannelId = useSelector(s => s.ui.activeChannelId)
  const currentUserState = useSelector(s => s.ui.currentUser)
  const { data: queryUser } = useCurrentUserQuery()

  const user = queryUser || currentUserState
  const displayName = user?.fullname || user?.username || "Orbit Member"
  const channelTitle = activeChannel || "General Voice"

  const {
    isConnected,
    isConnecting,
    error,
    muted,
    deafened,
    sharing,
    participants,
    connect,
    disconnect,
    toggleMute,
    toggleDeafen,
    toggleScreenShare,
  } = useVoice(activeChannelId, displayName)

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-50 text-on-surface overflow-hidden select-none">
      {/* Top channel header */}
      <header className="h-12 px-4 border-b border-outline-variant flex items-center justify-between flex-shrink-0 z-10 bg-white">
        <div className="flex items-center gap-2 text-on-surface font-semibold">
          <span className="material-symbols-outlined text-[18px] text-neutral-500">volume_up</span>
          <span className="text-xs font-bold text-on-surface tracking-tight">{channelTitle}</span>
          {isConnected && (
            <span className="ml-2 text-xs font-medium text-emerald-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Connected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(setActiveView("channels"))}
            type="button"
            title="Open Chat"
            className="p-1.5 rounded text-neutral-500 hover:text-on-surface hover:bg-neutral-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
          </button>
        </div>
      </header>

      {/* Main voice arena */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {error && (
          <div className="absolute top-4 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-medium">
            {error}
          </div>
        )}

        {!isConnected ? (
          /* Empty / Unconnected State */
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              {channelTitle}
            </h1>
            <p className="mt-1 mb-5 text-xs text-neutral-500">
              {!activeChannelId ? "Select a voice channel to connect" : "Ready to join voice"}
            </p>
            <button
              onClick={connect}
              disabled={isConnecting || !activeChannelId}
              type="button"
              className="px-5 py-2 bg-on-surface hover:bg-neutral-800 disabled:opacity-50 text-white font-medium text-xs rounded transition-colors cursor-pointer flex items-center gap-2"
            >
              {isConnecting && <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />}
              <span>{isConnecting ? "Connecting..." : "Join Voice"}</span>
            </button>
          </div>
        ) : (
          /* Connected State */
          <div className="flex flex-col items-center justify-between h-full w-full max-w-4xl py-6">
            <div className="flex-1 flex flex-wrap items-center justify-center gap-4 p-4 overflow-y-auto">
              {participants.map(p => (
                <ParticipantTile key={p.id} p={p} />
              ))}
            </div>

            {/* Bottom dock */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-outline-variant">
              <button
                onClick={toggleMute}
                type="button"
                title={muted ? "Unmute" : "Mute"}
                className={`p-2 rounded transition-colors cursor-pointer ${muted ? "bg-red-600 text-white hover:bg-red-700" : "text-neutral-700 hover:bg-neutral-100"}`}
              >
                <span className="material-symbols-outlined text-[18px]">{muted ? "mic_off" : "mic"}</span>
              </button>
              <button
                onClick={toggleDeafen}
                type="button"
                title={deafened ? "Undeafen" : "Deafen"}
                className={`p-2 rounded transition-colors cursor-pointer ${deafened ? "bg-red-600 text-white hover:bg-red-700" : "text-neutral-700 hover:bg-neutral-100"}`}
              >
                <span className="material-symbols-outlined text-[18px]">{deafened ? "headset_off" : "headphones"}</span>
              </button>
              <button
                onClick={toggleScreenShare}
                type="button"
                title={sharing ? "Stop Sharing" : "Share Screen"}
                className={`p-2 rounded transition-colors cursor-pointer ${sharing ? "bg-blue-600 text-white" : "text-neutral-700 hover:bg-neutral-100"}`}
              >
                <span className="material-symbols-outlined text-[18px]">screen_share</span>
              </button>
              <div className="h-4 w-px bg-neutral-200 mx-1" />
              <button
                onClick={disconnect}
                type="button"
                title="Disconnect"
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">call_end</span>
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
