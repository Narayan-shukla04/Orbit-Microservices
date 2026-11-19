import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setActiveView } from "../store/uiSlice"

const FEATURES = [
  { icon: "graphic_eq",        title: "384kbps Lossless Opus",    desc: "Full-frequency audio over Opus with HRTF spatial processing. Sub-12ms latency via regional edge routing." },
  { icon: "videocam",          title: "4K / 60fps Screen Share",  desc: "NVENC hardware-encoded screen shares at up to 4K/60fps with consistent low frame-drop rates." },
  { icon: "shield",            title: "No Ad Profiling",          desc: "End-to-end encrypted channels. No behavioural tracking, no third-party data sharing." },
  { icon: "cloud_upload",      title: "500MB File Uploads",       desc: "Upload large assets — audio sessions, project exports, design packages — without throttling." },
  { icon: "manage_accounts",   title: "Granular Role Controls",   desc: "Per-channel permission overrides, drag-to-rank role ordering, and full audit logging." },
  { icon: "bolt",              title: "Fast Channel Switching",   desc: "Virtualised scroll and pre-loaded member presence state keep navigation instant." },
]

const COMPARE = [
  { feature: "Audio Bitrate",      orbit: "384kbps Lossless",  discord: "96kbps (free tier)" },
  { feature: "File Upload Limit",  orbit: "500MB",             discord: "25MB" },
  { feature: "Ad Profiling",       orbit: "None",              discord: "Behavioural ads" },
  { feature: "Stream Resolution",  orbit: "4K / 60fps",        discord: "1080p / 30fps (Nitro)" },
  { feature: "Channel Encryption", orbit: "E2E available",     discord: "None" },
  { feature: "Spatial Audio",      orbit: "HRTF 3D",           discord: "Basic stereo" },
]

const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    badge: null,
    perks: ["128kbps audio", "100MB uploads", "Up to 10 servers", "Standard screen share"],
  },
  {
    name: "Gold",
    price: "$9.99",
    badge: "Most picked",
    perks: ["384kbps lossless audio", "500MB uploads", "Unlimited servers", "4K / 60fps streaming", "HRTF spatial audio"],
  },
  {
    name: "Team",
    price: "Custom",
    badge: null,
    perks: ["Dedicated edge routing", "Uptime SLA", "Audit log API", "SSO & admin controls", "Priority support"],
  },
]

export default function LandingPage() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
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
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-6">
          <span className="text-xl font-bold tracking-tight text-on-surface">Orbit</span>
          <nav className="hidden lg:flex items-center gap-6">
            {[["Features","#features"],["Voice","#voice"],["Pricing","#pricing"],["Compare","#compare"]].map(([l,h]) => (
              <a key={l} href={h} className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} type="button"
              className="hidden sm:inline-flex text-sm text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">
              Sign in
            </button>
            <button onClick={() => navigate("/register")} type="button"
              className="inline-flex items-center text-sm font-semibold px-4 py-2 rounded-xl bg-primary text-on-primary hover:opacity-90 transition-opacity">
              Get started
            </button>
          </div>
        </div>
      </header>

      <main className="w-full pt-16">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative w-full pt-20 pb-16 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-on-surface max-w-3xl leading-tight mb-5">
              Voice, text, and video built for quality.
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed mb-8">
              Orbit gives your community studio-grade audio, 4K screen sharing, and 500MB file uploads — with no ad profiling and end-to-end encryption where it matters.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-12">
              <button onClick={enterApp} type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Open Orbit in browser
                <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
              </button>
              <button type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download client
              </button>
            </div>

            {/* App mockup window */}
            <div className="w-full max-w-5xl rounded-2xl bg-surface-container-lowest shadow-[0_24px_64px_-8px_rgba(115,92,0,0.12)] overflow-hidden text-left">
              {/* Window chrome */}
              <div className="h-9 bg-surface-container-low px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-outline-variant/60"/>
                  <span className="w-3 h-3 rounded-full bg-outline-variant/40"/>
                  <span className="w-3 h-3 rounded-full bg-outline-variant/25"/>
                </div>
                <div className="flex items-center gap-2 px-3 py-0.5 rounded-md bg-surface-container text-[11px] font-mono text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[13px]">lock</span>
                  orbit.app
                </div>
                <div className="w-16"/>
              </div>
              {/* App interior */}
              <div className="grid grid-cols-12 min-h-[360px] bg-surface-container-lowest select-none pointer-events-none">
                {/* Server rail */}
                <div className="col-span-1 hidden sm:flex flex-col items-center py-4 gap-3 bg-surface-container-low/70">
                  <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center font-bold text-on-primary text-sm">A</div>
                  <div className="w-6 h-px bg-outline-variant/30"/>
                  {["SY","GC","RX"].map(s => <div key={s} className="w-9 h-9 rounded-full bg-surface-container shadow-sm flex items-center justify-center text-[11px] font-bold text-on-surface-variant">{s}</div>)}
                </div>
                {/* Channel list */}
                <div className="col-span-3 hidden md:flex flex-col gap-1 p-3 bg-surface-container-low/40">
                  <div className="text-[10px] text-outline font-bold uppercase tracking-wider px-1 mb-1">Text Channels</div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary-container/20 text-on-surface font-bold text-xs">
                    <span className="material-symbols-outlined text-primary text-[14px]">tag</span>general
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-[14px]">tag</span>announcements
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-[14px]">tag</span>projects
                  </div>
                  <div className="mt-2 text-[10px] text-outline font-bold uppercase tracking-wider px-1 mb-1">Voice</div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-semibold text-xs shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">graphic_eq</span>Studio
                  </div>
                </div>
                {/* Chat */}
                <div className="col-span-12 md:col-span-8 lg:col-span-5 flex flex-col justify-end p-4 bg-surface gap-3">
                  {[
                    { u:"MC", name:"Marcus C.", msg:"Upload finally went through — 340MB project file, no throttle.", time:"Today at 3:41 PM" },
                    { u:"RS", name:"Rena S.",   msg:"Audio quality on the call earlier was noticeably better. Zero artefacts.", time:"Today at 3:44 PM" },
                  ].map(m => (
                    <div key={m.u} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container/30 flex items-center justify-center font-bold text-primary text-[11px] shrink-0">{m.u}</div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-on-surface">{m.name}</span>
                          <span className="text-[10px] text-on-surface-variant">{m.time}</span>
                        </div>
                        <p className="text-xs text-on-surface mt-0.5 line-clamp-2">{m.msg}</p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-[16px] text-outline">add_circle</span>
                    <span className="text-xs text-outline flex-1">Message #general…</span>
                    <span className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary text-[14px]">send</span>
                    </span>
                  </div>
                </div>
                {/* Member list */}
                <div className="col-span-3 hidden lg:flex flex-col gap-2 p-3 bg-surface-container-low/40">
                  <div className="text-[10px] text-outline font-bold uppercase tracking-wider px-1">Online — 4</div>
                  {[{a:"MC",n:"Marcus C.",s:"bg-nx-green"},{a:"RS",n:"Rena S.",s:"bg-nx-green"},{a:"TW",n:"Theo W.",s:"bg-nx-amber"},{a:"JL",n:"Jamie L.",s:"bg-outline-variant"}].map(m => (
                    <div key={m.a} className="flex items-center gap-2 p-1.5 rounded-xl">
                      <div className="relative shrink-0">
                        <div className="w-7 h-7 rounded-full bg-primary-container/30 flex items-center justify-center text-[10px] font-bold text-primary">{m.a}</div>
                        <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-surface-container-low ${m.s}`}/>
                      </div>
                      <span className="text-xs text-on-surface font-medium truncate">{m.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VOICE ────────────────────────────────────────── */}
        <section id="voice" className="py-20 px-6 lg:px-10 bg-surface-container-low/30">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            {/* Text */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary-container/15 self-start">
                <span className="material-symbols-outlined text-[14px] text-primary" style={{fontVariationSettings:"'FILL' 1"}}>graphic_eq</span>
                <span className="font-mono text-xs text-primary font-semibold uppercase tracking-wider">Voice Channels</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-on-surface tracking-tight">Audio you can actually hear the difference in.</h2>
              <p className="text-base text-on-surface-variant leading-relaxed">
                384kbps Opus with HRTF spatial processing. Regional edge routing keeps latency under 12ms for most users. No codec compression artefacts.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  { icon: "spatial_audio",     label: "HRTF 3D Spatial",         desc: "Each speaker placed in 3D coordinates via head-related transfer function." },
                  { icon: "speed",             label: "Sub-12ms Routing",         desc: "Edge nodes on 6 continents. Packet round-trip stays below perception threshold." },
                  { icon: "volume_up",         label: "384kbps Lossless Opus",    desc: "Full frequency range preserved. No reduction artefacts." },
                  { icon: "noise_control_off", label: "Background Suppression",   desc: "Signal processing removes ambient noise at the source before encoding." },
                ].map(f => (
                  <li key={f.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-container/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-primary" style={{fontVariationSettings:"'FILL' 1"}}>{f.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-on-surface">{f.label}</div>
                      <div className="text-sm text-on-surface-variant">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Voice room mockup */}
            <div className="flex-1 w-full max-w-md">
              <div className="rounded-2xl bg-surface-container-lowest shadow-[0_8px_48px_rgba(115,92,0,0.08)] p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary" style={{fontVariationSettings:"'FILL' 1"}}>graphic_eq</span>
                    <span className="text-base font-bold text-on-surface">Studio</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-container/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-nx-green"/>
                    <span className="font-mono text-xs text-primary font-bold">384kbps</span>
                  </div>
                </div>

                {/* Waveform */}
                <div className="flex items-end gap-0.5 h-10 px-1">
                  {Array.from({length: 32}).map((_, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-primary-container/60"
                      style={{height:`${12 + Math.abs(Math.sin(i * 0.65) * 18)}px`}}/>
                  ))}
                </div>

                {/* Participants */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { abbr:"MC", name:"Marcus C.",  speaking:true,  mic:true },
                    { abbr:"RS", name:"Rena S.",    speaking:false, mic:true },
                    { abbr:"TW", name:"Theo W.",    speaking:false, mic:false },
                    { abbr:"JL", name:"Jamie L.",   speaking:false, mic:true },
                  ].map(p => (
                    <div key={p.abbr} className={`flex items-center gap-2 p-2.5 rounded-xl ${p.speaking ? "bg-primary-container/15 ring-1 ring-primary-container/40" : "bg-surface-container"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] ${p.speaking ? "bg-primary text-on-primary" : "bg-primary-container/30 text-primary"}`}>{p.abbr}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-on-surface truncate">{p.name}</div>
                        <div className={`text-[10px] font-mono ${p.speaking ? "text-primary" : "text-on-surface-variant"}`}>{p.speaking ? "speaking" : "listening"}</div>
                      </div>
                      <span className={`material-symbols-outlined text-[14px] ${p.mic ? (p.speaking ? "text-primary" : "text-outline") : "text-error"}`}>{p.mic ? "mic" : "mic_off"}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container">
                  <span className="font-mono text-[10px] text-on-surface-variant">LATENCY</span>
                  <span className="font-mono text-[10px] text-primary font-bold">11ms · US-EAST</span>
                  <span className="w-2 h-2 rounded-full bg-nx-green"/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────── */}
        <section id="features" className="py-20 px-6 lg:px-10 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-on-surface tracking-tight">What Orbit includes</h2>
              <p className="mt-2 text-base text-on-surface-variant max-w-xl">Built for communities that need reliable infrastructure, not a consumer product dressed up as professional.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(f => (
                <div key={f.title} className="group p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary-container/40 hover:shadow-[0_4px_24px_rgba(212,175,55,0.08)] transition-all duration-200 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-primary" style={{fontVariationSettings:"'FILL' 1"}}>{f.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-on-surface">{f.title}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARE ───────────────────────────────────────── */}
        <section id="compare" className="py-20 px-6 lg:px-10 bg-surface-container-low/30">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-on-surface tracking-tight">How Orbit compares to Discord</h2>
              <p className="mt-2 text-base text-on-surface-variant">Feature-for-feature, across the things that matter for community infrastructure.</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-outline-variant/30">
              <div className="grid grid-cols-3 bg-surface-container-low px-5 py-3">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Feature</span>
                <span className="text-xs text-primary uppercase tracking-wider font-bold text-center">Orbit</span>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold text-center">Discord</span>
              </div>
              {COMPARE.map((r, i) => (
                <div key={r.feature} className={`grid grid-cols-3 px-5 py-3.5 items-center ${i % 2 === 0 ? "bg-surface-container-lowest" : "bg-surface"}`}>
                  <span className="text-sm text-on-surface font-medium">{r.feature}</span>
                  <span className="text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary-container/20 text-on-primary-container text-xs font-bold">
                      <span className="material-symbols-outlined text-[12px] text-primary">check</span>{r.orbit}
                    </span>
                  </span>
                  <span className="text-center text-sm text-on-surface-variant">{r.discord}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────── */}
        <section id="pricing" className="py-20 px-6 lg:px-10 bg-surface">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-on-surface tracking-tight">Pricing</h2>
              <p className="mt-2 text-base text-on-surface-variant">Free to start. Upgrade when you need the higher limits.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {PRICING_TIERS.map(t => (
                <div key={t.name} className={`relative rounded-2xl p-5 border ${t.badge ? "border-primary-container/60 bg-surface-container-lowest shadow-[0_4px_32px_rgba(212,175,55,0.12)]" : "border-outline-variant/30 bg-surface-container-lowest"}`}>
                  {t.badge && (
                    <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md bg-primary text-on-primary font-mono text-xs font-bold">
                      {t.badge}
                    </span>
                  )}
                  <div className="mt-2 mb-4">
                    <div className="text-2xl font-bold text-on-surface">{t.price}{t.price !== "Custom" && <span className="text-sm font-normal text-on-surface-variant">/mo</span>}</div>
                    <div className="text-base font-bold text-on-surface mt-0.5">{t.name}</div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {t.perks.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm text-on-surface">
                        <span className="material-symbols-outlined text-[14px] text-primary" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>{p}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={t.name !== "Team" ? enterApp : undefined}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-opacity active:scale-95 ${t.badge ? "bg-primary text-on-primary hover:opacity-90" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`}>
                    {t.name === "Team" ? "Contact sales" : `Start with ${t.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP ─────────────────────────────────────── */}
        <section className="py-16 px-6 lg:px-10 bg-surface-container-low/40 border-t border-outline-variant/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-on-surface tracking-tight mb-3">Ready to try Orbit?</h2>
            <p className="text-base text-on-surface-variant mb-6">Create an account in under a minute. No credit card required for the free tier.</p>
            <button onClick={enterApp} type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity">
              Get started free
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────── */}
        <footer className="py-8 px-6 lg:px-10 bg-surface border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-base font-bold text-on-surface tracking-tight">Orbit</span>
            <span className="text-sm text-on-surface-variant">© 2026 Orbit Platform.</span>
            <div className="flex items-center gap-5 text-sm text-on-surface-variant">
              <a href="/privacy" className="hover:text-on-surface transition-colors">Privacy Policy</a>
              <a href="/terms"   className="hover:text-on-surface transition-colors">Terms of Service</a>
              <a href="/status"  className="hover:text-on-surface transition-colors">Status</a>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}