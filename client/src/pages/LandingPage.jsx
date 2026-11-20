import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setActiveView } from "../store/uiSlice"

const FEATURES = [
  { icon: "graphic_eq",        title: "384kbps Opus Audio",       desc: "Full-frequency audio encoding with sub-12ms regional edge routing." },
  { icon: "videocam",          title: "60fps Screen Sharing",     desc: "Hardware-accelerated desktop and application window streaming." },
  { icon: "shield",            title: "Private by Default",       desc: "No behavioral tracking, no data brokering, and no ad profiling." },
  { icon: "cloud_upload",      title: "500MB File Sharing",       desc: "Send source files, audio stems, and design bundles without truncation." },
  { icon: "manage_accounts",   title: "Role & Permission Control", desc: "Per-channel permission overrides and complete administrative audit logs." },
  { icon: "bolt",              title: "Instant Switching",        desc: "Local state caching for immediate channel and server transitions." },
]

const COMPARE = [
  { feature: "Audio Bitrate",      orbit: "384kbps Opus",      discord: "96kbps default" },
  { feature: "File Upload Limit",  orbit: "500MB",             discord: "25MB" },
  { feature: "Ad Tracking",        orbit: "None",              discord: "Behavioral profiling" },
  { feature: "Stream Resolution",  orbit: "4K / 60fps",        discord: "1080p / 30fps (Nitro)" },
  { feature: "Access Overrides",   orbit: "Granular channel",  discord: "Role hierarchy only" },
]

const PRICING_TIERS = [
  {
    name: "Standard",
    price: "$0",
    badge: null,
    perks: ["128kbps audio", "100MB uploads", "Up to 10 servers", "Standard screen share"],
  },
  {
    name: "Pro",
    price: "$9",
    badge: "Recommended",
    perks: ["384kbps Opus audio", "500MB uploads", "Unlimited servers", "4K / 60fps screen share", "Priority routing"],
  },
  {
    name: "Organization",
    price: "Custom",
    badge: null,
    perks: ["Dedicated regional edge nodes", "SLA guarantee", "Audit log export API", "SSO integration", "Dedicated account support"],
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(s => s.ui.isAuthenticated)

  function enterApp() {
    if (isAuthenticated) {
      dispatch(setActiveView("channels"))
      navigate("/app")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="min-h-screen bg-white text-on-surface font-sans antialiased">
      <header className="sticky top-0 z-50 bg-white border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-sm font-bold tracking-wider text-on-surface uppercase">Orbit</span>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-xs text-neutral-600 hover:text-black transition-colors">Features</a>
              <a href="#voice" className="text-xs text-neutral-600 hover:text-black transition-colors">Voice</a>
              <a href="#compare" className="text-xs text-neutral-600 hover:text-black transition-colors">Comparison</a>
              <a href="#pricing" className="text-xs text-neutral-600 hover:text-black transition-colors">Pricing</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              type="button"
              className="text-xs text-neutral-600 hover:text-black px-2.5 py-1"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/register")}
              type="button"
              className="px-3 py-1.5 rounded bg-on-surface text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <section className="pt-20 pb-16 border-b border-outline-variant">
          <div className="max-w-3xl">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-4">
              Real-time Communication Infrastructure
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-on-surface leading-tight">
              Audio, text, and video built for low latency.
            </h1>
            <p className="mt-4 text-base text-neutral-600 leading-relaxed max-w-2xl">
              Orbit provides studio-grade Opus audio, high-framerate screen sharing, and persistent channels with zero behavioral profiling and solid operational reliability.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={enterApp}
                type="button"
                className="px-4 py-2 rounded bg-on-surface text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open in browser</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
              <a
                href="#features"
                className="px-4 py-2 rounded border border-outline-variant bg-white text-on-surface text-xs font-medium hover:bg-neutral-50 transition-colors"
              >
                Read documentation
              </a>
            </div>
          </div>

          <div className="mt-12 border border-outline-variant rounded-lg bg-neutral-50 overflow-hidden text-left">
            <div className="h-9 px-3 bg-white border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              </div>
              <span className="text-[11px] font-mono text-neutral-500">orbit.app</span>
              <div className="w-12" />
            </div>

            <div className="grid grid-cols-12 min-h-[300px] select-none pointer-events-none">
              <div className="col-span-1 hidden sm:flex flex-col items-center py-3 gap-2 bg-neutral-100 border-r border-outline-variant">
                <div className="w-8 h-8 rounded bg-on-surface text-white text-xs font-semibold flex items-center justify-center">O</div>
                <div className="w-4 h-px bg-outline-variant my-1" />
                {["A", "B", "C"].map(s => (
                  <div key={s} className="w-8 h-8 rounded bg-white border border-outline-variant text-[11px] font-medium text-neutral-700 flex items-center justify-center">
                    {s}
                  </div>
                ))}
              </div>

              <div className="col-span-3 hidden md:flex flex-col gap-1 p-3 bg-neutral-50 border-r border-outline-variant">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1 mb-1">Channels</div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-outline-variant text-xs font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-[14px] text-neutral-500">tag</span>
                  <span>general</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-neutral-600">
                  <span className="material-symbols-outlined text-[14px] text-neutral-400">tag</span>
                  <span>announcements</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-neutral-600">
                  <span className="material-symbols-outlined text-[14px] text-neutral-400">volume_up</span>
                  <span>general voice</span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-8 flex flex-col justify-end p-4 bg-white gap-3">
                {[
                  { user: "Marcus C.", time: "10:24 AM", text: "Latency on the regional voice node is consistently under 12ms." },
                  { user: "Rena S.", time: "10:25 AM", text: "Audio fidelity test with 384k Opus passed with zero clipping." }
                ].map(m => (
                  <div key={m.user} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded bg-neutral-200 border border-outline-variant flex items-center justify-center text-xs font-semibold text-neutral-700 shrink-0">
                      {m.user[0]}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-on-surface">{m.user}</span>
                        <span className="text-[10px] text-neutral-400">{m.time}</span>
                      </div>
                      <p className="text-xs text-neutral-700 mt-0.5">{m.text}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded border border-outline-variant bg-neutral-50">
                  <span className="text-xs text-neutral-400 flex-1">Message #general...</span>
                  <span className="material-symbols-outlined text-[16px] text-neutral-400">send</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 border-b border-outline-variant">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-on-surface">Core Capabilities</h2>
            <p className="mt-1 text-xs text-neutral-500">Engineered for teams requiring predictable performance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="p-4 rounded-lg border border-outline-variant bg-white">
                <span className="material-symbols-outlined text-[20px] text-neutral-700 mb-2 block">{f.icon}</span>
                <h3 className="text-xs font-bold text-on-surface mb-1">{f.title}</h3>
                <p className="text-xs text-neutral-500 leading-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="voice" className="py-16 border-b border-outline-variant">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">Voice Quality</p>
              <h2 className="text-2xl font-bold text-on-surface">Precision audio without compression artifacts.</h2>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                Orbit routes Opus packets through regional edge clusters, preserving full spectrum dynamic range while keeping round-trip latency below human perceptual thresholds.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-neutral-700 mt-0.5">check</span>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block">384kbps Opus Stream</span>
                    <span className="text-xs text-neutral-500">Full audio spectrum preservation for critical listening.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-neutral-700 mt-0.5">check</span>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block">Direct Edge Routing</span>
                    <span className="text-xs text-neutral-500">Low-latency packet distribution across multi-region nodes.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-neutral-700 mt-0.5">check</span>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block">In-line Noise Suppression</span>
                    <span className="text-xs text-neutral-500">Removes acoustic rumble and ambient hum before transmission.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border border-outline-variant rounded-lg bg-neutral-50">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <span className="text-xs font-bold text-on-surface">Voice Room: Studio</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">384kbps · 11ms</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { name: "Marcus C.", status: "Speaking", isSpeaking: true },
                  { name: "Rena S.", status: "Listening", isSpeaking: false },
                  { name: "Theo W.", status: "Muted", isSpeaking: false },
                  { name: "Jamie L.", status: "Listening", isSpeaking: false }
                ].map(p => (
                  <div key={p.name} className={`p-2.5 rounded border bg-white ${p.isSpeaking ? "border-emerald-600 ring-1 ring-emerald-600" : "border-outline-variant"}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-700">
                        {p.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-on-surface truncate">{p.name}</div>
                        <div className="text-[10px] text-neutral-400">{p.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="compare" className="py-16 border-b border-outline-variant">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-on-surface">Feature Comparison</h2>
            <p className="mt-1 text-xs text-neutral-500">Comparing Orbit architecture with standard consumer solutions.</p>
          </div>
          <div className="border border-outline-variant rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-outline-variant">
                  <th className="py-2.5 px-4 font-semibold text-neutral-700">Feature</th>
                  <th className="py-2.5 px-4 font-semibold text-on-surface">Orbit</th>
                  <th className="py-2.5 px-4 font-semibold text-neutral-500">Discord</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {COMPARE.map(c => (
                  <tr key={c.feature} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-on-surface">{c.feature}</td>
                    <td className="py-2.5 px-4 font-semibold text-on-surface">{c.orbit}</td>
                    <td className="py-2.5 px-4 text-neutral-500">{c.discord}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="pricing" className="py-16 border-b border-outline-variant">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-on-surface">Simple Pricing</h2>
            <p className="mt-1 text-xs text-neutral-500">Transparent tiers with no artificial restrictions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRICING_TIERS.map(tier => (
              <div key={tier.name} className="p-5 rounded-lg border border-outline-variant bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">{tier.name}</span>
                    {tier.badge && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-neutral-300 bg-neutral-100 text-neutral-700">
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 mb-4">
                    <span className="text-2xl font-bold text-on-surface">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-xs text-neutral-500"> / month</span>}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.perks.map(perk => (
                      <li key={perk} className="text-xs text-neutral-600 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[15px] text-neutral-700">check</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={enterApp}
                  className="w-full py-2 rounded border border-outline-variant bg-neutral-50 hover:bg-neutral-100 text-xs font-medium text-on-surface transition-colors cursor-pointer"
                >
                  {tier.price === "Custom" ? "Contact sales" : `Select ${tier.name}`}
                </button>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <span>Orbit Platform © 2026</span>
          <div className="flex items-center gap-4">
            <a href="/terms" className="hover:text-black transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-black transition-colors">Privacy</a>
            <a href="/status" className="hover:text-black transition-colors">System Status</a>
          </div>
        </footer>
      </main>
    </div>
  )
}
