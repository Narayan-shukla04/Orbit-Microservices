'use client';

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  Hash,
  HelpCircle,
  Inbox,
  Menu,
  Mic,
  MoreHorizontal,
  Paperclip,
  Pin,
  Plus,
  Search,
  Send,
  Settings,
  Smile,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { apiFetch } from "./lib/api";

type Channel = {
  name: string;
  unread?: boolean;
  voice?: boolean;
};

type Message = {
  id: number;
  author: string;
  initials: string;
  time: string;
  color: string;
  body: string;
  attachment?: string;
};

const servers = [
  { name: "Launch club", mark: "LC", tone: "coral" },
  { name: "Design lab", mark: "DL", tone: "mint" },
  { name: "Music room", mark: "MR", tone: "gold" },
  { name: "Add a server", mark: "+", tone: "add" },
];

const channels: Channel[] = [
  { name: "welcome", unread: true },
  { name: "general" },
  { name: "showcase", unread: true },
  { name: "feedback" },
  { name: "hangout", voice: true },
];

const initialMessages: Message[] = [
  {
    id: 1,
    author: "Maya Chen",
    initials: "MC",
    time: "Today at 9:42 AM",
    color: "#f09a72",
    body: "Morning, crew. The new launch notes are ready for a first pass. I left a few questions in the showcase thread.",
  },
  {
    id: 2,
    author: "Noah Williams",
    initials: "NW",
    time: "Today at 9:46 AM",
    color: "#88b9a6",
    body: "The tone feels much clearer now. I am especially into the little field notes section at the end.",
    attachment: "launch-notes-v3.pdf",
  },
  {
    id: 3,
    author: "Priya Shah",
    initials: "PS",
    time: "Today at 9:51 AM",
    color: "#d5a65c",
    body: "Same here. I can take the onboarding copy if nobody else has claimed it.",
  },
  {
    id: 4,
    author: "Maya Chen",
    initials: "MC",
    time: "Today at 9:54 AM",
    color: "#f09a72",
    body: "Perfect. Let us do a quick sync after lunch and lock it in.",
  },
];

const members = [
  { name: "Maya Chen", role: "Owner", initials: "MC", color: "#f09a72", status: "online" },
  { name: "Noah Williams", role: "Designer", initials: "NW", color: "#88b9a6", status: "online" },
  { name: "Priya Shah", role: "Engineer", initials: "PS", color: "#d5a65c", status: "idle" },
  { name: "Eli Turner", role: "Writer", initials: "ET", color: "#998cc5", status: "offline" },
  { name: "Ari Flores", role: "Research", initials: "AF", color: "#d78092", status: "offline" },
];

export default function HomePage() {
  const [selectedChannel, setSelectedChannel] = useState("welcome");
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<"servers" | "channels" | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<"checking" | "connected" | "offline">("checking");

  useEffect(() => {
    let active = true;
    apiFetch("/api/user/getme")
      .then(() => { if (active) setGatewayStatus("connected"); })
      .catch(() => { if (active) setGatewayStatus("offline"); });
    return () => { active = false; };
  }, []);

  const selectedLabel = useMemo(() => selectedChannel.replaceAll("-", " "), [selectedChannel]);

  async function sendMessage() {
    const body = draft.trim();
    if (!body) return;
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        author: "You",
        initials: "YO",
        time: "Just now",
        color: "#d5a65c",
        body,
      },
    ]);
    setDraft("");
    try {
      await apiFetch(`/api/message/createmessage/${selectedChannel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: body }),
      });
    } catch {
      setGatewayStatus("offline");
    }
  }

  return (
    <main className="discord-app">
      <aside className={`server-rail ${mobilePanel === "servers" ? "is-open" : ""}`}>
        <div className="brand-mark" aria-label="Home">o</div>
        <div className="rail-rule" />
        {servers.map((server) => (
          <button className={`server-button ${server.tone === "coral" ? "is-active" : ""} ${server.tone}`} key={server.name} title={server.name}>
            {server.mark}
          </button>
        ))}
        <div className="rail-spacer" />
        <button className="server-button utility" title="Help"><HelpCircle size={19} /></button>
        <button className="server-button utility" title="Notifications"><Bell size={19} /></button>
      </aside>

      <aside className={`channel-panel ${mobilePanel === "channels" ? "is-open" : ""}`}>
        <div className="workspace-heading">
          <button className="workspace-name">Launch club <ChevronDown size={16} /></button>
          <button className="icon-button subtle" title="Workspace settings"><Settings size={17} /></button>
        </div>

        <div className="channel-scroll">
          <div className="channel-category"><span>Text channels</span><button title="Add channel"><Plus size={15} /></button></div>
          {channels.filter((channel) => !channel.voice).map((channel) => (
            <button
              className={`channel-item ${selectedChannel === channel.name ? "selected" : ""}`}
              key={channel.name}
              onClick={() => { setSelectedChannel(channel.name); setMobilePanel(null); }}
            >
              <Hash size={17} />
              <span>{channel.name}</span>
              {channel.unread && <span className="unread-dot" />}
            </button>
          ))}
          <div className="channel-category voice-category"><span>Voice channels</span><button title="Add voice channel"><Plus size={15} /></button></div>
          {channels.filter((channel) => channel.voice).map((channel) => (
            <button className="channel-item" key={channel.name}><Volume2 size={17} /><span>{channel.name}</span></button>
          ))}
        </div>

        <div className="account-bar">
          <div className="avatar avatar-small avatar-maya">MC<span className="presence online" /></div>
          <div className="account-copy"><strong>Maya Chen</strong><span>{gatewayStatus === "connected" ? "Connected" : gatewayStatus === "checking" ? "Connecting..." : "Demo mode"}</span></div>
          <button className="icon-button subtle" title="Mute"><Mic size={16} /></button>
          <button className="icon-button subtle" title="User settings"><Settings size={16} /></button>
        </div>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <button className="mobile-menu" onClick={() => setMobilePanel(mobilePanel ? null : "channels")} title="Open channels"><Menu size={20} /></button>
          <div className="chat-title"><Hash size={21} /><strong>{selectedLabel}</strong><span className="title-divider" /><span className="topic">A calm place to make good things.</span></div>
          <div className="chat-actions">
            <button className="icon-button" title="Notifications"><Bell size={18} /></button>
            <button className="icon-button" title="Pinned messages"><Pin size={18} /></button>
            <button className={`icon-button ${showMembers ? "active" : ""}`} onClick={() => setShowMembers(!showMembers)} title="Toggle member list"><Users size={18} /></button>
            <button className="icon-button" title="Inbox"><Inbox size={18} /></button>
            <div className="search-box"><input placeholder="Search" aria-label="Search messages" /><Search size={16} /></div>
            <button className="mobile-menu" onClick={() => setMobilePanel("servers")} title="Open servers"><MoreHorizontal size={20} /></button>
          </div>
        </header>

        <div className="chat-body">
          <div className="message-column">
            <div className="channel-intro">
              <div className="intro-icon"><Hash size={31} /></div>
              <h1>Welcome to #{selectedLabel}</h1>
              <p>This is the beginning of this channel. Share ideas, ask questions, and keep the good momentum going.</p>
            </div>
            <div className="date-divider"><span>Today</span></div>
            <div className="message-list">
              {messages.map((message) => (
                <article className="message" key={message.id}>
                  <div className="avatar avatar-message" style={{ background: message.color }}>{message.initials}</div>
                  <div className="message-content">
                    <div className="message-meta"><strong>{message.author}</strong><time>{message.time}</time></div>
                    <p>{message.body}</p>
                    {message.attachment && <div className="attachment"><div className="file-icon">PDF</div><div><strong>{message.attachment}</strong><span>2.4 MB · PDF document</span></div></div>}
                  </div>
                </article>
              ))}
            </div>
            <div className="composer-wrap">
              <div className="composer">
                <button className="icon-button composer-action" title="Attach a file"><Paperclip size={19} /></button>
                <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder={`Message #${selectedLabel}`} aria-label={`Message #${selectedLabel}`} />
                <button className="icon-button composer-action" title="Add emoji"><Smile size={19} /></button>
                <button className="send-button" onClick={sendMessage} title="Send message"><Send size={17} /></button>
              </div>
              <span className="composer-hint">Press Enter to send</span>
            </div>
          </div>

          {showMembers && <aside className="member-panel">
            <div className="member-heading"><span>Members — 5</span><button className="mobile-close" onClick={() => setShowMembers(false)} title="Close members"><X size={17} /></button></div>
            <div className="member-group"><span className="member-label">Online — 3</span>{members.filter((member) => member.status !== "offline").map((member) => <MemberRow member={member} key={member.name} />)}</div>
            <div className="member-group"><span className="member-label">Offline — 2</span>{members.filter((member) => member.status === "offline").map((member) => <MemberRow member={member} key={member.name} />)}</div>
          </aside>}
        </div>
      </section>
    </main>
  );
}

function MemberRow({ member }: { member: (typeof members)[number] }) {
  return <div className="member-row"><div className="avatar avatar-member" style={{ background: member.color, opacity: member.status === "offline" ? 0.55 : 1 }}>{member.initials}<span className={`presence ${member.status}`} /></div><div><strong>{member.name}</strong><span>{member.role}</span></div></div>;
}

