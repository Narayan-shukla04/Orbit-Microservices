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
    <div className={`relative flex flex-col items-center justify-center w-52 h-44 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-lg transition-all overflow-hidden ${p.isSpeaking ? "ring-2 ring-nx-green shadow-[0_0_24px_rgba(35,165,89,0.2)]" : ""}`}>
      {hasVideo ? (
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
      ) : (
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center text-2xl font-bold text-on-primary shadow-md">
          {initials}
          {p.isMuted && (
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#da373c] text-white flex items-center justify-center shadow">
              <span className="material-symbols-outlined text-[14px]">mic_off</span>
            </span>
          )}
        </div>
      )}
      <div className={`mt-3 flex items-center gap-1.5 text-center ${hasVideo ? "absolute bottom-2 left-2 bg-surface/85 backdrop-blur-sm px-2 py-0.5 rounded-lg" : ""}`}>
        <span className="text-body-sm font-bold text-on-surface truncate max-w-[150px]">
          {p.name} {p.isLocal && "(You)"}
        </span>
        {p.isSpeaking && <span className="w-2 h-2 rounded-full bg-nx-green animate-pulse" />}
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
    <div className="flex-1 flex flex-col h-full bg-surface bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-container-low via-surface to-surface-container-high text-on-surface overflow-hidden select-none">
      {/* Top channel header in light theme */}
      <header className="h-12 px-5 border-b border-outline-variant/30 flex items-center justify-between flex-shrink-0 z-10 bg-surface/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-on-surface font-semibold">
          <span className="material-symbols-outlined text-[20px] text-outline">volume_up</span>
          <span className="text-body-md font-bold text-on-surface tracking-tight">{channelTitle}</span>
          {isConnected && (
            <span className="ml-2 text-label-sm font-semibold text-nx-green flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-nx-green animate-ping" />
              Connected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(setActiveView("channels"))}
            type="button"
            title="Open Chat"
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
          </button>
        </div>
      </header>

      {/* Main voice arena */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {error && (
          <div className="absolute top-4 px-4 py-2 bg-error-container/80 text-on-error-container border border-error/30 rounded-xl text-body-sm shadow">
            {error}
          </div>
        )}

        {!isConnected ? (
          /* Empty / Unconnected State */
          <div className="flex flex-col items-center text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
              {channelTitle}
            </h1>
            <p className="mt-2 mb-6 text-body-sm font-medium text-outline">
              {!activeChannelId ? "Select a voice channel to connect" : "Ready to join high-definition voice"}
            </p>
            <button
              onClick={connect}
              disabled={isConnecting || !activeChannelId}
              type="button"
              className="px-8 py-2.5 bg-on-surface hover:bg-on-surface/90 disabled:opacity-50 text-surface font-semibold text-sm rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              {isConnecting && <span className="w-4 h-4 rounded-full border-2 border-surface border-t-transparent animate-spin" />}
              <span>{isConnecting ? "Connecting..." : "Join Voice"}</span>
            </button>
          </div>
        ) : (
          /* Connected State */
          <div className="flex flex-col items-center justify-between h-full w-full max-w-4xl py-6 animate-fade-in">
            <div className="flex-1 flex flex-wrap items-center justify-center gap-5 p-4 overflow-y-auto">
              {participants.map(p => (
                <ParticipantTile key={p.id} p={p} />
              ))}
            </div>

            {/* Bottom floating dock */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/30 shadow-xl">
              <button
                onClick={toggleMute}
                type="button"
                title={muted ? "Unmute" : "Mute"}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${muted ? "bg-[#da373c] text-white" : "bg-surface-container hover:bg-surface-container-high text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]">{muted ? "mic_off" : "mic"}</span>
              </button>
              <button
                onClick={toggleDeafen}
                type="button"
                title={deafened ? "Undeafen" : "Deafen"}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${deafened ? "bg-[#da373c] text-white" : "bg-surface-container hover:bg-surface-container-high text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]">{deafened ? "headset_off" : "headphones"}</span>
              </button>
              <button
                onClick={toggleScreenShare}
                type="button"
                title={sharing ? "Stop Sharing" : "Share Screen"}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${sharing ? "bg-primary-container text-on-primary-container" : "bg-surface-container hover:bg-surface-container-high text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]">screen_share</span>
              </button>
              <div className="h-6 w-px bg-outline-variant/40 mx-1" />
              <button
                onClick={disconnect}
                type="button"
                title="Disconnect"
                className="px-4 py-2 rounded-xl bg-[#da373c] hover:bg-[#c02e34] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">call_end</span>
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
