import { useState } from "react"
import { useForm } from "react-hook-form"
import { useCurrentUserQuery } from "../hooks/useAuth"
import { useRolesQuery, useCreateRoleMutation } from "../hooks/useRoles"
import { useServersQuery, useGenerateInviteMutation } from "../hooks/useGuilds"
import { userService } from "../services/userService"

import { useSelector } from "react-redux"

const PERMS = ["Manage Channels", "Manage Members", "Studio Voice Priority", "Unthrottled Media", "View Audit Log", "Ban Members"]

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
    : [{ _id: "owner", name: "Chamber Owner", color: "#D4AF37", Permissions: ["ALL"] }]

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
    <div className="flex-1 flex h-full bg-surface animate-fade-up overflow-hidden">
      {/* Settings sidebar */}
      <aside className="w-56 flex-shrink-0 bg-surface-container-low border-r border-outline-variant/20 flex flex-col py-4 px-2 gap-1">
        <div className="px-3 py-1 text-label-sm text-outline uppercase tracking-widest font-bold mb-1">Server Settings</div>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} type="button"
            className={`px-3 py-2 rounded-lg text-left capitalize text-body-sm font-medium transition-all ${activeTab === t ? "bg-primary-container/20 text-on-surface font-semibold" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}>
            {t}
          </button>
        ))}
      </aside>

      {/* Main settings */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {saveStatus && (
          <div className="max-w-2xl mb-6 p-3 rounded-xl bg-primary-container/20 border border-primary/30 text-on-surface text-body-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span>{saveStatus}</span>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-2xl space-y-8">
            <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-5">
              <div>
                <h2 className="text-headline-md font-bold text-on-surface">Member Credentials</h2>
                <p className="text-body-sm text-on-surface-variant">Manage your cryptographic profile and enclave jurisdiction details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">Full Name</label>
                  <input {...regProfile("fullname")} className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">Username</label>
                  <input {...regProfile("username")} className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">Email (Read Only)</label>
                  <input {...regProfile("email")} disabled className="px-4 py-2.5 rounded-xl bg-surface-container/60 text-outline text-body-md border border-outline-variant/30 cursor-not-allowed" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">Mobile Number</label>
                  <input {...regProfile("mobile")} placeholder="9876543210" className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all" />
                </div>
              </div>

              <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-body-sm shadow-sm hover:opacity-90 transition-all cursor-pointer">
                Save Member Details
              </button>
            </form>

            <hr className="border-outline-variant/20" />

            <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4">
              <div>
                <h3 className="text-title-lg font-bold text-on-surface">Change Access Key</h3>
                <p className="text-body-sm text-on-surface-variant">Update your enclave password with min 8 characters.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">Current Password</label>
                  <input type="password" placeholder="••••••••" {...regPass("oldPassword", { required: true })} className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">New Password</label>
                  <input type="password" placeholder="••••••••" {...regPass("newPassword", { required: true, minLength: 8 })} className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all" />
                </div>
              </div>

              <button type="submit" className="px-5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold text-body-sm hover:bg-surface-container transition-all cursor-pointer">
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-headline-md font-bold text-on-surface">Chamber Overview</h2>
              <p className="text-body-sm text-on-surface-variant">Jurisdiction details and invite access codes for this chamber.</p>
            </div>

            {currentServer ? (
              <>
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-headline-sm">
                      {currentServer.name?.slice(0, 2).toUpperCase() || "CH"}
                    </div>
                    <div>
                      <h3 className="text-title-lg font-bold text-on-surface">{currentServer.name}</h3>
                      <p className="text-body-sm text-outline font-code">ID: {currentServer._id || currentServer.id}</p>
                    </div>
                  </div>
                </div>

                {/* Invite Code Generator Card */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">vpn_key</span>
                        Invite Code & Access
                      </h3>
                      <p className="text-body-sm text-on-surface-variant">Share this code with anyone to grant access to this chamber.</p>
                    </div>
                    <button
                      onClick={handleGenerateInvite}
                      disabled={generateInviteMutation.isPending}
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-primary-container/20 hover:bg-primary-container/40 text-primary border border-primary/30 text-body-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-[17px] ${generateInviteMutation.isPending ? "animate-spin" : ""}`}>
                        sync
                      </span>
                      <span>{generateInviteMutation.isPending ? "Generating..." : "Generate New Code"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/40 rounded-xl p-2">
                    <input
                      type="text"
                      readOnly
                      value={currentServer.invitecode || "No invite code generated yet"}
                      className="flex-1 bg-transparent px-2.5 py-1 text-body-sm font-code text-on-surface focus:outline-none select-all"
                    />
                    <button
                      onClick={handleCopyInvite}
                      type="button"
                      disabled={!currentServer.invitecode}
                      className={`px-4 py-2 rounded-lg text-label-md font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                        inviteCopied
                          ? "bg-nx-green text-white"
                          : "bg-primary text-on-primary hover:opacity-90 active:scale-95"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{inviteCopied ? "check" : "content_copy"}</span>
                      <span>{inviteCopied ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>

                  {generateInviteMutation.isSuccess && (
                    <p className="text-label-sm font-medium text-nx-green flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      New invite code generated and updated!
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 rounded-2xl bg-surface-container-lowest text-center text-outline">
                <span className="material-symbols-outlined text-[48px] text-outline-variant">domain_disabled</span>
                <p className="mt-2 text-body-md">No chamber selected. Create a chamber first to manage invite codes.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "roles" && (
          <div className="max-w-3xl">
            <h2 className="text-headline-md font-bold text-on-surface mb-6">Roles & Crests</h2>
            <div className="flex gap-6">
              <div className="w-48 flex-shrink-0 space-y-1">
                {rolesList.map(r => (
                  <button key={r._id || r.id || r.name} onClick={() => setSelectedRole(r)} type="button"
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${selectedRole?._id === r._id ? "bg-surface-container-high" : "hover:bg-surface-container"}`}>
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{background: r.color || "#D4AF37"}}/>
                    <span className="text-body-sm font-medium text-on-surface truncate">{r.name}</span>
                  </button>
                ))}
                <button type="button" className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-primary hover:bg-primary-container/10 transition-all text-body-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px]">add</span> Create Role
                </button>
              </div>
              <div className="flex-1 space-y-5 p-5 rounded-2xl bg-surface-container-lowest shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full" style={{background: selectedRole?.color || "#D4AF37"}}/>
                  <span className="text-headline-sm font-bold text-on-surface">{selectedRole?.name}</span>
                  <span className="text-label-sm font-code text-outline">{selectedRole?.members || 1} members</span>
                </div>
                <div className="space-y-3">
                  <div className="text-label-md text-on-surface-variant uppercase tracking-wider font-bold">Jurisdiction Toggles</div>
                  {PERMS.map(p => (
                    <div key={p} className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                      <span className="text-body-md text-on-surface">{p}</span>
                      <button type="button" className={`relative w-10 h-6 rounded-full transition-colors ${["Manage Channels","Studio Voice Priority"].includes(p) ? "bg-nx-green" : "bg-outline-variant/40"}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${["Manage Channels","Studio Voice Priority"].includes(p) ? "left-5" : "left-1"}`}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "channels" || activeTab === "members" || activeTab === "audit") && (
          <div className="max-w-2xl">
            <h2 className="text-headline-md font-bold text-on-surface mb-4 capitalize">{activeTab}</h2>
            <div className="p-8 rounded-2xl bg-surface-container-lowest text-center text-on-surface-variant shadow-sm">
              <span className="material-symbols-outlined text-[48px] text-outline-variant">construction</span>
              <p className="mt-3 text-body-md">This section is coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}