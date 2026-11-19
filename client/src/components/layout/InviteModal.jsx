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

  const serverName = currentServer?.name || "Sovereign Chamber"
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
        setJoinMsg("Successfully joined chamber!")
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-container via-primary-fixed to-secondary-container flex items-center justify-center text-on-primary-container shadow-md">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <div>
              <h3 className="text-title-lg font-bold text-on-surface">Invite to {serverName}</h3>
              <p className="text-body-sm text-on-surface-variant">Share your invite code to grant immediate access.</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeInviteModal())}
            type="button"
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Current Invite Code Box */}
        {currentServer ? (
          <div className="space-y-4">
            <div>
              <label className="block text-label-sm font-bold uppercase tracking-wider text-outline mb-1.5">
                Current Chamber Invite Code
              </label>
              <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/40 rounded-xl p-1.5 focus-within:border-primary-container transition-all">
                <input
                  type="text"
                  readOnly
                  value={inviteCode || "No invite code generated yet"}
                  className="flex-1 bg-transparent px-2.5 py-1 text-body-sm font-code text-on-surface focus:outline-none select-all truncate"
                />
                <button
                  onClick={handleCopy}
                  type="button"
                  disabled={!inviteCode}
                  className={`px-3.5 py-1.5 rounded-lg text-label-sm font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer ${
                    copied
                      ? "bg-nx-green text-white"
                      : "bg-primary text-on-primary hover:opacity-90 active:scale-95"
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{copied ? "check" : "content_copy"}</span>
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Generate New Code Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-body-sm text-on-surface-variant">Need a fresh invite key?</span>
              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary-container/20 text-primary border border-outline-variant/30 text-body-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[16px] ${generateMutation.isPending ? "animate-spin" : ""}`}>
                  sync
                </span>
                <span>{generateMutation.isPending ? "Generating..." : "Generate New Code"}</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-body-sm text-outline my-2">Create or select a chamber first to manage invite codes.</p>
        )}

        <hr className="my-5 border-outline-variant/20" />

        {/* Join Server by Invite Code */}
        <div>
          <h4 className="text-body-md font-bold text-on-surface mb-1">Join Another Chamber</h4>
          <p className="text-body-sm text-on-surface-variant mb-2.5">Have an invite code from someone else?</p>
          <form onSubmit={handleJoin} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. 9a77d5b8..."
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              className="flex-1 px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-body-sm font-code text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container"
            />
            <button
              type="submit"
              disabled={joinMutation.isPending || !joinCode.trim()}
              className="px-4 py-2 bg-primary-container text-on-primary-container text-body-sm font-bold rounded-xl shadow-sm hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer flex-shrink-0"
            >
              {joinMutation.isPending ? "Joining..." : "Join"}
            </button>
          </form>
          {joinMsg && (
            <p className={`mt-2 text-label-sm font-semibold ${joinMsg.startsWith("Failed") ? "text-error" : "text-nx-green"}`}>
              {joinMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
