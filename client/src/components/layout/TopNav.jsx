import { useDispatch, useSelector } from "react-redux"
import { setActiveView, toggleMemberList, openInviteModal } from "../../store/uiSlice"
import { useLogoutMutation } from "../../hooks/useAuth"

const VIEWS = [
  { id: "channels",  label: "Channels" },
  { id: "voice",     label: "Voice" },
  { id: "settings",  label: "Settings" },
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
    <header className={`fixed top-0 ${isDm ? "left-[72px]" : "left-[332px]"} right-0 h-14 bg-surface border-b border-outline-variant z-30 flex items-center justify-between px-4 transition-all duration-150`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-on-surface tracking-wider">ORBIT</span>
        </div>
        {!isDm && (
          <nav className="hidden lg:flex items-center gap-1 p-0.5 bg-neutral-100 rounded border border-outline-variant">
            {VIEWS.map(v => (
              <button key={v.id} onClick={() => dispatch(setActiveView(v.id))} type="button"
                className={`px-3 py-1 rounded text-xs transition-colors ${activeView === v.id ? "text-on-surface font-semibold bg-white border border-outline-variant" : "text-on-surface-variant hover:text-on-surface"}`}>
                {v.label}
              </button>
            ))}
            {activeView === "create-chamber" && (
              <span className="px-3 py-1 rounded text-xs text-on-surface font-semibold bg-white border border-outline-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">add_circle</span>
                Create Server
              </span>
            )}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-outline pointer-events-none">search</span>
          <input type="text" placeholder="Search..." className="w-44 xl:w-56 pl-8 pr-10 py-1 bg-neutral-50 border border-outline-variant rounded text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-on-surface focus:bg-white transition-colors"/>
          <span className="absolute right-2 px-1 py-0.2 rounded border border-outline-variant font-code text-[10px] text-on-surface-variant pointer-events-none">⌘K</span>
        </div>
        <div className="flex items-center gap-1 border-l border-outline-variant pl-3">
          <button onClick={() => dispatch(openInviteModal())} type="button" title="Invite & Join Server" className="flex items-center gap-1.5 px-2.5 py-1 mr-1 rounded bg-white hover:bg-neutral-100 text-on-surface text-xs font-medium border border-outline-variant transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person_add</span>
            <span className="hidden sm:inline">Invite</span>
          </button>
          <button type="button" title="Notifications" className="relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-neutral-100 rounded transition-colors">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary"/>
          </button>
          <button type="button" title="Pinned Messages" className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-neutral-100 rounded transition-colors">
            <span className="material-symbols-outlined text-[18px]">push_pin</span>
          </button>
          <button onClick={() => dispatch(toggleMemberList())} type="button" title="Member List" className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-neutral-100 rounded transition-colors">
            <span className="material-symbols-outlined text-[18px]">group</span>
          </button>
        </div>
        <div className="flex items-center gap-2 pl-2">
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-neutral-200 border border-outline-variant flex items-center justify-center text-on-surface font-semibold text-xs">{initials}</div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"/>
          </div>
          <button onClick={handleLogout} type="button" title="Sign out" className="p-1.5 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}