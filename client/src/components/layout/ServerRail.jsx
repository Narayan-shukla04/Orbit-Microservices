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
    <aside className="fixed left-0 top-0 h-full w-[72px] bg-white border-r border-outline-variant z-50 flex flex-col items-center py-4 justify-between">
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Direct Messages Button */}
        <button
          type="button"
          onClick={() => dispatch(setActiveView("dm"))}
          title="Direct Messages"
          className={`relative flex items-center justify-center w-11 h-11 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
            activeView === "dm"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          OR
          {activeView === "dm" && (
            <span className="absolute -left-3 w-1 h-6 bg-neutral-900 rounded-r" />
          )}
        </button>

        <div className="w-8 h-px bg-outline-variant my-1" />

        {/* Server list */}
        <div className="flex flex-col items-center gap-2 w-full">
          {servers.map(s => (
            <button
              key={s.id}
              onClick={() => {
                dispatch(setActiveServerId(s.id));
                dispatch(setActiveView("channels"));
              }}
              type="button"
              title={s.name}
              className={`relative flex items-center justify-center w-11 h-11 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                s.active
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {s.abbr}
              {s.active && (
                <span className="absolute -left-3 w-1 h-6 bg-neutral-900 rounded-r" />
              )}
            </button>
          ))}

          {/* Add Server Button */}
          <button
            onClick={() => dispatch(setActiveView("create-chamber"))}
            type="button"
            title="Create Server"
            className="flex items-center justify-center w-11 h-11 rounded-lg border border-dashed border-neutral-300 hover:border-neutral-900 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <button
          type="button"
          title="Client"
          className="flex items-center justify-center w-11 h-11 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">terminal</span>
        </button>
      </div>
    </aside>
  )
}
