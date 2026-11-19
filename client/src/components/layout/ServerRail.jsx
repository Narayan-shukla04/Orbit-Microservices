import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setActiveView, setActiveServerId } from "../../store/uiSlice"
import { useServersQuery } from "../../hooks/useGuilds"

export default function ServerRail() {
  const dispatch = useDispatch()
  const activeView = useSelector(s => s.ui.activeView)
  const activeServerId = useSelector(s => s.ui.activeServerId)
  const { data: apiServers } = useServersQuery()

  useEffect(() => {
    if (apiServers && apiServers.length > 0 && !activeServerId) {
      dispatch(setActiveServerId(apiServers[0]._id || apiServers[0].id))
    }
  }, [apiServers, activeServerId, dispatch])

  const servers = (apiServers && apiServers.length > 0)
    ? apiServers.map(s => {
        const sid = s._id || s.id
        return {
          id: sid,
          name: s.name,
          abbr: s.name ? s.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "OR",
          active: activeView !== "dm" && activeServerId === sid,
        }
      })
    : []

  return (
    <aside className="fixed left-0 top-0 h-full w-[72px] bg-surface-container-lowest/90 backdrop-blur-xl border-r border-outline-variant/30 z-50 flex flex-col items-center py-space-md justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col items-center gap-space-sm w-full">
        <button type="button" onClick={() => dispatch(setActiveView("dm"))} title="Direct Messages & Friends" className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${activeView === "dm" ? "bg-primary-container text-on-primary-container shadow-md" : "bg-gradient-to-tr from-surface-container to-surface-container-lowest border border-outline-variant/50 hover:border-primary-container text-primary shadow-[0_2px_8px_rgba(212,175,55,0.15)]"}`}>
          <span className="font-code text-title-lg font-bold">OR</span>
          <span className={`absolute -left-1 w-1 bg-primary rounded-r-full transition-transform ${activeView === "dm" ? "top-2.5 bottom-2.5 scale-y-100" : "top-3.5 bottom-3.5 scale-y-0 group-hover:scale-y-100"}`}/>
        </button>
        <div className="w-8 h-px bg-outline-variant/40 my-space-xs"/>
        <div className="flex flex-col items-center gap-space-sm w-full">
          {servers.map(s => (
            <button key={s.id} onClick={() => { dispatch(setActiveServerId(s.id)); dispatch(setActiveView("channels")); }} type="button" title={s.name}
              className={`relative group flex items-center justify-center w-12 h-12 rounded-xl border transition-all ${s.active ? "bg-surface-container-low border-outline-variant/30 text-primary" : "bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container text-on-surface-variant hover:text-on-surface hover:border-outline-variant/60"}`}>
              <span className={`absolute -left-1 w-1 bg-primary rounded-r-full transition-transform ${s.active ? "top-2.5 bottom-2.5 scale-y-100" : "top-4 bottom-4 scale-y-0 group-hover:scale-y-100"}`}/>
              <span className="text-title-md font-bold">{s.abbr}</span>
              {s.badge && <span className="absolute -top-1 -right-1 w-4 h-4 bg-tertiary-container text-on-tertiary-container text-label-sm font-bold flex items-center justify-center rounded-full shadow-sm">{s.badge}</span>}
            </button>
          ))}
          <button onClick={() => dispatch(setActiveView("create-chamber"))} type="button" title="Create Chamber" className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container border border-dashed border-outline-variant hover:border-primary hover:bg-primary-container/10 text-primary transition-all group cursor-pointer">
            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">add</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-space-sm w-full">
        <button type="button" className="flex items-center justify-center w-12 h-12 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all">
          <span className="material-symbols-outlined text-[20px]">download</span>
        </button>
      </div>
    </aside>
  )
}