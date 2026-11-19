import { useDispatch, useSelector } from "react-redux"
import { setActiveView, toggleMemberList, openInviteModal } from "../../store/uiSlice"
import { useLogoutMutation } from "../../hooks/useAuth"

const VIEWS = [
  { id: "channels",  label: "Channels" },
  { id: "voice",     label: "Voice Lounge" },
  { id: "settings",  label: "Server Settings" },
]

export default function TopNav() {
  const dispatch    = useDispatch()
  const activeView  = useSelector(s => s.ui.activeView)
  const currentUser = useSelector(s => s.ui.currentUser)
  const logoutMutation = useLogoutMutation()
  const initials    = currentUser?.fullname
    ? currentUser.fullname.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "OR"

  function handleLogout() {
    logoutMutation.mutate()
  }

  const isDm = activeView === "dm"
  return (
    <header className={`fixed top-0 ${isDm ? "left-[72px]" : "left-[332px]"} right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 z-30 flex items-center justify-between px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all duration-150`}>
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-2">
          <span className="text-title-lg font-bold text-primary tracking-wider">ORBIT</span>
        </div>
        {!isDm && (
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-surface-container-low/70 rounded-lg border border-outline-variant/30">
            {VIEWS.map(v => (
              <button key={v.id} onClick={() => dispatch(setActiveView(v.id))} type="button"
                className={`px-space-md py-1 rounded-md transition-all text-body-sm ${activeView === v.id ? "text-on-surface font-semibold bg-surface-container-high shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}>
                {v.label}
              </button>
            ))}
            {activeView === "create-chamber" && (
              <span className="px-space-md py-1 rounded-md text-primary font-semibold bg-surface-container-high shadow-sm text-body-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">account_balance</span>
                Create Chamber
              </span>
            )}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-space-md">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-outline pointer-events-none">search</span>
          <input type="text" placeholder="Search chambers..." className="w-48 xl:w-64 pl-8 pr-12 py-1.5 bg-surface-container-low/80 border border-outline-variant/40 rounded-lg text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:bg-surface-container-lowest transition-all"/>
          <span className="absolute right-2 px-1.5 py-0.5 rounded border border-outline-variant/40 font-code text-label-sm text-outline-variant pointer-events-none">⌘K</span>
        </div>
        <div className="flex items-center gap-1 border-l border-outline-variant/30 pl-space-md">
          <button onClick={() => dispatch(openInviteModal())} type="button" title="Invite & Join Chamber" className="flex items-center gap-1.5 px-2.5 py-1.5 mr-1 rounded-lg bg-primary-container/20 hover:bg-primary-container/30 text-on-surface font-medium text-label-md border border-primary/20 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-primary">person_add</span>
            <span className="hidden sm:inline text-label-sm font-semibold">Invite</span>
          </button>
          <button type="button" title="Notifications" className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container ring-2 ring-surface"/>
          </button>
          <button type="button" title="Pinned Messages" className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">push_pin</span>
          </button>
          <button onClick={() => dispatch(toggleMemberList())} type="button" title="Member List" className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">group</span>
          </button>
        </div>
        <div className="flex items-center gap-2 pl-space-xs">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center text-on-primary font-bold text-body-sm ring-2 ring-primary-container ring-offset-2 ring-offset-surface shadow-sm">{initials}</div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-tertiary-container ring-1 ring-surface"/>
          </div>
          <button onClick={handleLogout} type="button" title="Sign out" className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}