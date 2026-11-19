import { useState } from "react"
import { useFriends } from "../../hooks/useFriends"

export default function LoadingScreen({ message = "Securing Chamber Session..." }) {
  const [showFriends, setShowFriends] = useState(false)
  const { data, isLoading } = useFriends()
  const friends = Array.isArray(data) ? data : data?.data || []

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface text-on-surface select-none">
      {/* Ambient background glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary-container/20 via-primary-fixed-dim/15 to-transparent blur-[140px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
        {/* Animated Brand Emblem */}
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowFriends((prev) => !prev)}
            title="Click to view friends"
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-fixed-dim via-primary-container to-secondary-container flex items-center justify-center text-on-primary-fixed font-code font-bold text-headline-sm shadow-[0_0_40px_rgba(212,175,55,0.4)] ring-2 ring-primary/40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            OR
          </button>
          <div className="absolute -inset-2.5 rounded-3xl border border-primary/30 border-t-primary animate-spin pointer-events-none" />
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-1.5 text-center px-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-title-md font-semibold text-on-surface tracking-tight">
              {message}
            </span>
          </div>
          <span className="text-label-sm font-code text-outline uppercase tracking-widest">
            Orbit Protocol · Cryptographic Verification
          </span>
        </div>

        {/* Friends list overlay */}
        {showFriends && (
          <div className="w-80 max-h-64 overflow-y-auto bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/50 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-left">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/30">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Friends</span>
              <span className="text-[10px] text-outline">{friends.length} active</span>
            </div>
            {isLoading ? (
              <p className="text-xs text-on-surface-variant py-2">Loading friends…</p>
            ) : friends.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-2">No friends found.</p>
            ) : (
              <ul className="space-y-1.5">
                {friends.map((f) => {
                  const id = f.recipient?._id || f.recipient || f.requester?._id || f.requester || f._id
                  const name = f.recipient?.fullname || f.recipient?.username || f.requester?.fullname || f.requester?.username || String(id).slice(0, 10)
                  return (
                    <li key={f._id || id} className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container/60 text-xs text-on-surface">
                      <span className="w-6 h-6 rounded-full bg-primary-container/30 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                        {String(name).slice(0, 2).toUpperCase()}
                      </span>
                      <span className="truncate flex-1 font-medium">{name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
