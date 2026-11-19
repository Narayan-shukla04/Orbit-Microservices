import { useState } from "react"
import { useFriends } from "../../hooks/useFriends"

export default function LoadingScreen({ message = "Loading..." }) {
  const [showFriends, setShowFriends] = useState(false)
  const { data, isLoading } = useFriends()
  const friends = Array.isArray(data) ? data : data?.data || []

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-on-surface select-none">
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Flat minimal brand mark */}
        <button
          type="button"
          onClick={() => setShowFriends((prev) => !prev)}
          title="Click to view contacts"
          className="w-12 h-12 rounded-lg bg-neutral-900 text-white font-mono font-bold text-base flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          OR
        </button>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
            <span className="text-sm font-medium text-on-surface">
              {message}
            </span>
          </div>
          <span className="text-xs text-on-surface-variant font-mono">
            Orbit Platform
          </span>
        </div>

        {/* Friends list overlay */}
        {showFriends && (
          <div className="w-80 max-h-64 overflow-y-auto bg-white border border-outline-variant rounded-lg p-4 shadow-sm text-left mt-2">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant">
              <span className="text-xs font-semibold text-on-surface">Friends</span>
              <span className="text-xs text-on-surface-variant">{friends.length} active</span>
            </div>
            {isLoading ? (
              <p className="text-xs text-on-surface-variant py-2">Loading...</p>
            ) : friends.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-2">No friends found.</p>
            ) : (
              <ul className="space-y-1.5">
                {friends.map((f) => {
                  const id = f.recipient?._id || f.recipient || f.requester?._id || f.requester || f._id
                  const name = f.recipient?.fullname || f.recipient?.username || f.requester?.fullname || f.requester?.username || String(id).slice(0, 10)
                  return (
                    <li key={f._id || id} className="flex items-center gap-2 p-1.5 rounded bg-surface-container text-xs text-on-surface">
                      <span className="w-5 h-5 rounded bg-neutral-200 text-neutral-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {String(name).slice(0, 2).toUpperCase()}
                      </span>
                      <span className="truncate">{name}</span>
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
