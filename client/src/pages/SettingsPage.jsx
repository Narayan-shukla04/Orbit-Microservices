import { useState } from "react"
import { useForm } from "react-hook-form"
import { useCurrentUserQuery } from "../hooks/useAuth"
import { useRolesQuery, useCreateRoleMutation } from "../hooks/useRoles"
import { useServersQuery, useGenerateInviteMutation } from "../hooks/useGuilds"
import { userService } from "../services/userService"
import { useSelector } from "react-redux"

const PERMS = ["Manage Channels", "Manage Members", "Voice Priority", "Attach Files", "View Audit Log", "Ban Members"]

export default function SettingsPage() {
  const activeServerId = useSelector(s => s.ui.activeServerId)
  const [activeTab, setActiveTab] = useState("profile")
  const [saveStatus, setSaveStatus] = useState("")
  const [inviteCopied, setInviteCopied] = useState(false)
  const { data: userProfile, refetch: refetchUser } = useCurrentUserQuery()
  const { data: apiServers } = useServersQuery()

  const currentServer = (apiServers && apiServers.length > 0)
    ? (apiServers.find(s => (s._id || s.id) === activeServerId) || apiServers[0])
    : null
  const currentServerId = currentServer?._id || currentServer?.id

  const { data: apiRoles } = useRolesQuery(currentServerId)
  const createRoleMutation = useCreateRoleMutation(currentServerId)
  const generateInviteMutation = useGenerateInviteMutation()

  const rolesList = (apiRoles && apiRoles.length > 0)
    ? apiRoles
    : [{ _id: "owner", name: "Server Owner", color: "#2563eb", Permissions: ["ALL"] }]

  const [selectedRole, setSelectedRole] = useState(rolesList[0])

  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm({
    values: {
      fullname: userProfile?.fullname || "",
      username: userProfile?.username || "",
      email: userProfile?.email || "",
      mobile: userProfile?.mobile_no || userProfile?.mobile || "",
    }
  })

  const { register: regPass, handleSubmit: handlePassSubmit, reset: resetPass } = useForm()

  const onSaveProfile = async (data) => {
    try {
      await userService.updateDetails({ fullname: data.fullname, username: data.username, mobile: data.mobile })
      setSaveStatus("Profile details updated successfully")
      refetchUser()
      setTimeout(() => setSaveStatus(""), 4000)
    } catch (err) {
      setSaveStatus(`Failed: ${err.message}`)
    }
  }

  const onChangePassword = async (data) => {
    try {
      await userService.changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword })
      setSaveStatus("Password changed successfully")
      resetPass()
      setTimeout(() => setSaveStatus(""), 4000)
    } catch (err) {
      setSaveStatus(`Failed: ${err.message}`)
    }
  }

  const handleCopyInvite = () => {
    if (!currentServer?.invitecode) return
    navigator.clipboard.writeText(currentServer.invitecode)
    setInviteCopied(true)
    setTimeout(() => setInviteCopied(false), 2000)
  }

  const handleGenerateInvite = () => {
    if (!currentServer) return
    generateInviteMutation.mutate(currentServer._id || currentServer.id)
  }

  const TABS = ["profile", "overview", "roles", "channels", "members"]

  return (
    <div className="flex-1 flex h-full bg-white overflow-hidden">
      {/* Settings sidebar */}
      <aside className="w-52 shrink-0 bg-neutral-50 border-r border-outline-variant flex flex-col py-4 px-2 gap-1">
        <div className="px-3 py-1 text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-1">Settings</div>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} type="button"
            className={`px-3 py-1.5 rounded text-left capitalize text-xs font-medium transition-colors cursor-pointer ${activeTab === t ? "bg-white border border-outline-variant text-on-surface font-semibold" : "text-neutral-600 hover:bg-neutral-100 hover:text-on-surface"}`}>
            {t}
          </button>
        ))}
      </aside>

      {/* Main settings */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {saveStatus && (
          <div className="max-w-xl mb-4 p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{saveStatus}</span>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-xl space-y-6">
            <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-on-surface">Profile Details</h2>
                <p className="text-xs text-neutral-500">Manage your personal account details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-700">Full Name</label>
                  <input {...regProfile("fullname")} className="px-3 py-2 rounded bg-neutral-50 text-on-surface text-xs border border-outline-variant focus:outline-none focus:border-on-surface focus:bg-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-700">Username</label>
                  <input {...regProfile("username")} className="px-3 py-2 rounded bg-neutral-50 text-on-surface text-xs border border-outline-variant focus:outline-none focus:border-on-surface focus:bg-white transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-700">Email (Read Only)</label>
                  <input {...regProfile("email")} disabled className="px-3 py-2 rounded bg-neutral-100 text-neutral-400 text-xs border border-outline-variant cursor-not-allowed" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-700">Mobile Number</label>
                  <input {...regProfile("mobile")} placeholder="Phone number" className="px-3 py-2 rounded bg-neutral-50 text-on-surface text-xs border border-outline-variant focus:outline-none focus:border-on-surface focus:bg-white transition-colors" />
                </div>
              </div>

              <button type="submit" className="px-4 py-2 rounded bg-on-surface text-white font-medium text-xs hover:bg-neutral-800 transition-colors cursor-pointer">
                Save Profile
              </button>
            </form>

            <hr className="border-outline-variant" />

            <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Change Password</h3>
                <p className="text-xs text-neutral-500">Update your account password (minimum 8 characters).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-700">Current Password</label>
                  <input type="password" placeholder="••••••••" {...regPass("oldPassword", { required: true })} className="px-3 py-2 rounded bg-neutral-50 text-on-surface text-xs border border-outline-variant focus:outline-none focus:border-on-surface focus:bg-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-neutral-700">New Password</label>
                  <input type="password" placeholder="••••••••" {...regPass("newPassword", { required: true, minLength: 8 })} className="px-3 py-2 rounded bg-neutral-50 text-on-surface text-xs border border-outline-variant focus:outline-none focus:border-on-surface focus:bg-white transition-colors" />
                </div>
              </div>

              <button type="submit" className="px-4 py-2 rounded border border-outline-variant bg-white hover:bg-neutral-50 text-on-surface font-medium text-xs transition-colors cursor-pointer">
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="max-w-xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-on-surface">Server Overview</h2>
              <p className="text-xs text-neutral-500">Server details and invite access codes.</p>
            </div>

            {currentServer ? (
              <>
                <div className="p-4 rounded-lg border border-outline-variant bg-white space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-neutral-100 border border-outline-variant flex items-center justify-center text-on-surface font-bold text-sm">
                      {currentServer.name?.slice(0, 2).toUpperCase() || "OR"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">{currentServer.name}</h3>
                      <p className="text-xs text-neutral-500 font-code">ID: {currentServer._id || currentServer.id}</p>
                    </div>
                  </div>
                </div>

                {/* Invite Code Generator Card */}
                <div className="p-4 rounded-lg border border-outline-variant bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-on-surface">Invite Code</h3>
                      <p className="text-xs text-neutral-500">Share this code with teammates to grant access to this server.</p>
                    </div>
                    <button
                      onClick={handleGenerateInvite}
                      disabled={generateInviteMutation.isPending}
                      type="button"
                      className="px-2.5 py-1 rounded bg-white hover:bg-neutral-50 text-on-surface border border-outline-variant text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-[14px] ${generateInviteMutation.isPending ? "animate-spin" : ""}`}>
                        sync
                      </span>
                      <span>{generateInviteMutation.isPending ? "Generating..." : "Generate Code"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-neutral-50 border border-outline-variant rounded p-1">
                    <input
                      type="text"
                      readOnly
                      value={currentServer.invitecode || "No invite code generated yet"}
                      className="flex-1 bg-transparent px-2 py-0.5 text-xs font-code text-on-surface focus:outline-none select-all"
                    />
                    <button
                      onClick={handleCopyInvite}
                      type="button"
                      disabled={!currentServer.invitecode}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        inviteCopied
                          ? "bg-emerald-600 text-white"
                          : "bg-on-surface text-white hover:bg-neutral-800"
                      }`}
                    >
                      <span>{inviteCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  {generateInviteMutation.isSuccess && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      New invite code generated.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 rounded-lg border border-outline-variant bg-neutral-50 text-center text-neutral-500">
                <p className="text-xs">No server selected. Create a server first to manage invite codes.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "roles" && (
          <div className="max-w-2xl">
            <h2 className="text-base font-bold text-on-surface mb-4">Roles & Permissions</h2>
            <div className="flex gap-4">
              <div className="w-44 shrink-0 space-y-1">
                {rolesList.map(r => (
                  <button key={r._id || r.id || r.name} onClick={() => setSelectedRole(r)} type="button"
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left text-xs transition-colors cursor-pointer ${selectedRole?._id === r._id ? "bg-neutral-100 font-semibold text-on-surface" : "hover:bg-neutral-50 text-neutral-600"}`}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background: r.color || "#2563eb"}}/>
                    <span className="truncate">{r.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex-1 space-y-4 p-4 rounded-lg border border-outline-variant bg-white">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{background: selectedRole?.color || "#2563eb"}}/>
                  <span className="text-sm font-bold text-on-surface">{selectedRole?.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Permissions</div>
                  {PERMS.map(p => (
                    <div key={p} className="flex items-center justify-between py-1.5 border-b border-outline-variant text-xs">
                      <span className="text-on-surface">{p}</span>
                      <span className="material-symbols-outlined text-[16px] text-neutral-400">check_box_outline_blank</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "channels" || activeTab === "members") && (
          <div className="max-w-xl">
            <h2 className="text-base font-bold text-on-surface mb-2 capitalize">{activeTab}</h2>
            <div className="p-6 rounded-lg border border-outline-variant bg-neutral-50 text-center text-neutral-500">
              <p className="text-xs">This section is coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
