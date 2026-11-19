import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { closeInviteModal, setActiveServerId } from "../../store/uiSlice"
import { useServersQuery, useGenerateInviteMutation, useJoinServerMutation } from "../../hooks/useGuilds"

export default function InviteModal() {
  const dispatch = useDispatch()
  const isOpen = useSelector(s => s.ui.inviteModalOpen)
  const activeServerId = useSelector(s => s.ui.activeServerId)
  const { data: apiServers } = useServersQuery()
  const generateMutation = useGenerateInviteMutation()
  const joinMutation = useJoinServerMutation()

  const [copied, setCopied] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [joinMsg, setJoinMsg] = useState("")

  if (!isOpen) return null

  const currentServer = (apiServers && apiServers.length > 0)
    ? (apiServers.find(s => (s._id || s.id) === activeServerId) || apiServers[0])
    : null

  const serverName = currentServer?.name || "Server"
  const inviteCode = currentServer?.invitecode || ""

  const handleCopy = () => {
    if (!inviteCode) return
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = () => {
    if (!currentServer) return
    generateMutation.mutate(currentServer._id || currentServer.id)
  }

  const handleJoin = (e) => {
    e.preventDefault()
    if (!joinCode.trim()) return
    setJoinMsg("")
    joinMutation.mutate(joinCode.trim(), {
      onSuccess: (res) => {
        const joinedId = res?.server?._id || res?.data?.server?._id || res?.member?.serverId
        if (joinedId) {
          dispatch(setActiveServerId(joinedId))
        }
        setJoinMsg("Successfully joined server!")
        setJoinCode("")
        setTimeout(() => {
          setJoinMsg("")
          dispatch(closeInviteModal())
        }, 1500)
      },
      onError: (err) => {
        setJoinMsg(`Failed: ${err.response?.data?.message || err.message || "Invalid invite code"}`)
      }
    })
  }

  return (
    <div
      onClick={() => dispatch(closeInviteModal())}
      className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-outline-variant rounded-lg p-5 w-full max-w-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-neutral-100 border border-outline-variant flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Invite to {serverName}</h3>
              <p className="text-xs text-neutral-500">Share your invite code with others.</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeInviteModal())}
            type="button"
            className="p-1 rounded text-neutral-400 hover:text-on-surface hover:bg-neutral-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Current Invite Code Box */}
        {currentServer ? (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                Server Invite Code
              </label>
              <div className="flex items-center gap-2 bg-neutral-50 border border-outline-variant rounded p-1">
                <input
                  type="text"
                  readOnly
                  value={inviteCode || "No invite code generated yet"}
                  className="flex-1 bg-transparent px-2 py-0.5 text-xs font-code text-on-surface focus:outline-none select-all truncate"
                />
                <button
                  onClick={handleCopy}
                  type="button"
                  disabled={!inviteCode}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-on-surface text-white hover:bg-neutral-800"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{copied ? "check" : "content_copy"}</span>
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Generate New Code Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-neutral-500">Need a fresh code?</span>
              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                type="button"
                className="px-2.5 py-1 rounded bg-white hover:bg-neutral-100 text-neutral-700 border border-outline-variant text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[14px] ${generateMutation.isPending ? "animate-spin" : ""}`}>
                  sync
                </span>
                <span>{generateMutation.isPending ? "Generating..." : "Generate Code"}</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-neutral-500 my-2">Create or select a server first.</p>
        )}

        <hr className="my-4 border-outline-variant" />

        {/* Join Server by Invite Code */}
        <div>
          <h4 className="text-xs font-bold text-on-surface mb-0.5">Join Another Server</h4>
          <p className="text-xs text-neutral-500 mb-2">Have an invite code from someone else?</p>
          <form onSubmit={handleJoin} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. 9a77d5b8..."
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              className="flex-1 px-2.5 py-1.5 bg-neutral-50 border border-outline-variant rounded text-xs font-code text-on-surface placeholder:text-neutral-400 focus:outline-none focus:border-on-surface focus:bg-white"
            />
            <button
              type="submit"
              disabled={joinMutation.isPending || !joinCode.trim()}
              className="px-3 py-1.5 bg-on-surface text-white text-xs font-medium rounded hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer flex-shrink-0"
            >
              {joinMutation.isPending ? "Joining..." : "Join"}
            </button>
          </form>
          {joinMsg && (
            <p className={`mt-2 text-xs font-medium ${joinMsg.startsWith("Failed") ? "text-red-600" : "text-emerald-600"}`}>
              {joinMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
