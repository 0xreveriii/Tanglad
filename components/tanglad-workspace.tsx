"use client";

import {
  Archive,
  ArrowUUpLeft,
  ArrowLeft,
  At,
  Bell,
  CalendarBlank,
  CaretDown,
  CaretRight,
  ChartBar,
  ChatCircle,
  Check,
  CirclesFour,
  ClockCounterClockwise,
  Diamond,
  DotsNine,
  DotsThree,
  FileText,
  FolderSimple,
  FunnelSimple,
  Gear,
  House,
  Kanban,
  Lightning,
  List,
  Lock,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Question,
  Rows,
  SidebarSimple,
  SlidersHorizontal,
  Star,
  UserPlus,
  UsersThree,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LazyMotion, LayoutGroup, domMax, m, useReducedMotion } from "motion/react";
import "@/app/app/workspace.css";

type Screen = "workspace" | "my-work" | "inbox" | "board" | "reporting" | "collaborators" | "permissions";
type WorkspaceTab = "recents" | "content" | "collaborators" | "permissions";
type BoardView = "table" | "kanban";
type TaskStatus = "Working on it" | "Review" | "Done" | "Blocked";
type TaskPriority = "Low" | "Medium" | "High";

type Task = {
  id: number;
  name: string;
  owner: string;
  ownerName: string;
  status: TaskStatus;
  priority: TaskPriority;
  due: string;
  group: "This week" | "Next week";
};

type Member = {
  initials: string;
  name: string;
  email: string;
  role: "Owner" | "Member" | "Viewer";
  lastActive: string;
  items: number;
  tone: string;
};

const initialTasks: Task[] = [
  { id: 1, name: "Map the onboarding journey", owner: "MC", ownerName: "Mara Cruz", status: "Done", priority: "Medium", due: "Aug 19", group: "This week" },
  { id: 2, name: "Finalize launch page copy", owner: "IK", ownerName: "Inez Kim", status: "Review", priority: "Low", due: "Aug 20", group: "This week" },
  { id: 3, name: "Build workspace permissions", owner: "RA", ownerName: "Rafi Ahmed", status: "Working on it", priority: "High", due: "Aug 21", group: "This week" },
  { id: 4, name: "Run accessibility QA", owner: "MC", ownerName: "Mara Cruz", status: "Blocked", priority: "Medium", due: "Aug 22", group: "This week" },
  { id: 5, name: "Prepare release notes", owner: "IK", ownerName: "Inez Kim", status: "Working on it", priority: "Low", due: "Aug 25", group: "Next week" },
  { id: 6, name: "Review usage event schema", owner: "RA", ownerName: "Rafi Ahmed", status: "Review", priority: "High", due: "Aug 26", group: "Next week" },
  { id: 7, name: "Schedule launch retrospective", owner: "MC", ownerName: "Mara Cruz", status: "Working on it", priority: "Medium", due: "Aug 28", group: "Next week" },
];

const members: Member[] = [
  { initials: "MC", name: "Mara Cruz", email: "mara@tanglad.team", role: "Owner", lastActive: "Now", items: 18, tone: "blue" },
  { initials: "IK", name: "Inez Kim", email: "inez@tanglad.team", role: "Member", lastActive: "12 min ago", items: 11, tone: "amber" },
  { initials: "RA", name: "Rafi Ahmed", email: "rafi@tanglad.team", role: "Member", lastActive: "1 hour ago", items: 14, tone: "cyan" },
  { initials: "SO", name: "Sam Ortega", email: "sam@tanglad.team", role: "Viewer", lastActive: "Yesterday", items: 5, tone: "violet" },
];

const statusOrder: TaskStatus[] = ["Working on it", "Review", "Done", "Blocked"];

const screenLabels: Record<Screen, string> = {
  workspace: "Manage workspace",
  "my-work": "My work",
  inbox: "Inbox",
  board: "Tanglad",
  reporting: "Dashboard and reporting",
  collaborators: "Collaborators",
  permissions: "Permissions",
};

function AppMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`tl-mark ${small ? "is-small" : ""}`} aria-hidden="true">
      <CirclesFour weight="fill" />
    </span>
  );
}

function Avatar({ member, size = "normal" }: { member: Pick<Member, "initials" | "tone" | "name">; size?: "small" | "normal" | "large" }) {
  return <span className={`tl-avatar tone-${member.tone} size-${size}`} title={member.name}>{member.initials}</span>;
}

export function TangladWorkspace() {
  const [screen, setScreen] = useState<Screen>("workspace");
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("recents");
  const [boardView, setBoardView] = useState<BoardView>("table");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cover, setCover] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const navigate = (next: Screen) => {
    setScreen(next);
    setSidebarOpen(false);
    setToast(null);
    setNotificationsOpen(false);
    setInviteModalOpen(false);
  };

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesText = !term || `${task.name} ${task.ownerName} ${task.status}`.toLowerCase().includes(term);
      const matchesMine = !mineOnly || task.owner === "MC";
      return matchesText && matchesMine;
    });
  }, [mineOnly, search, tasks]);

  const addTask = () => {
    const name = newTask.trim();
    if (!name) return;
    setTasks((current) => [...current, {
      id: Date.now(),
      name,
      owner: "MC",
      ownerName: "Mara Cruz",
      status: "Working on it",
      priority: "Medium",
      due: "No date",
      group: "This week",
    }]);
    setNewTask("");
    setComposerOpen(false);
    setToast("Task added to Tanglad");
  };

  const cycleStatus = (id: number) => {
    setTasks((current) => current.map((task) => {
      if (task.id !== id) return task;
      const next = statusOrder[(statusOrder.indexOf(task.status) + 1) % statusOrder.length];
      return { ...task, status: next };
    }));
  };

  return (
    <LazyMotion features={domMax}>
    <div className={`tl-app ${navCollapsed ? "is-nav-collapsed" : ""}`}>
      <a className="tl-skip-link" href="#tl-main">Skip to content</a>

      <header className="tl-topbar">
        <div className="tl-topbar-brand">
          <button className="tl-mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation" title="Open navigation"><List weight="bold" /></button>
          <button className="tl-wordmark" onClick={() => navigate("workspace")} aria-label="Open Tanglad workspace">
            <AppMark small />
            <strong>Tanglad</strong>
          </button>
          <button className="tl-plans-button" onClick={() => setToast("Plans are not connected in this UI preview")}><Diamond weight="fill" />Plans</button>
        </div>

        <label className="tl-global-search">
          <MagnifyingGlass weight="bold" />
          <span className="sr-only">Search Tanglad</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for anything" />
        </label>

        <div className="tl-topbar-actions">
          <button className={notificationsOpen ? "is-open" : ""} onClick={() => setNotificationsOpen((value) => !value)} aria-label="Open notifications" title="Notifications" aria-expanded={notificationsOpen}><Bell /><span className="tl-unread-count">3</span></button>
          <button onClick={() => navigate("my-work")} aria-label="Open my work" title="My work"><Archive /></button>
          <button onClick={() => { setNotificationsOpen(false); setInviteModalOpen(true); }} aria-label="Invite people" title="Invite people"><UserPlus /></button>
          <button onClick={() => navigate("permissions")} aria-label="Open settings" title="Settings"><Gear /></button>
          <button onClick={() => setToast("Help is not connected in this UI preview")} aria-label="Open help" title="Help"><Question /></button>
          <button onClick={() => setToast("App launcher is not connected in this UI preview")} aria-label="Open app launcher" title="App launcher"><DotsNine weight="bold" /></button>
          <button className="tl-profile" onClick={() => setToast("Profile settings are not connected in this UI preview")} aria-label="Open Mara Cruz profile" title="Mara Cruz profile">MC</button>
        </div>
      </header>

      <aside className="tl-utility-rail" aria-label="Primary application navigation">
        <UtilityButton icon={<CirclesFour />} label="Workspace" active={screen === "workspace" || screen === "board"} onClick={() => navigate("workspace")} />
        <UtilityButton icon={<Lightning weight="bold" />} label="My work" active={screen === "my-work"} onClick={() => navigate("my-work")} />
        <UtilityButton icon={<Archive />} label="Inbox" active={screen === "inbox"} onClick={() => navigate("inbox")} />
        <span className="tl-rail-divider" />
        <UtilityButton icon={<ChartBar />} label="Reporting" active={screen === "reporting"} onClick={() => navigate("reporting")} />
        <UtilityButton icon={<Star />} label="Favorites" active={false} onClick={() => navigate("board")} />
        <div className="tl-rail-spacer" />
        <Link className="tl-utility-link" href="/"><ArrowLeft /><span>Website</span></Link>
      </aside>

      {sidebarOpen && <button className="tl-drawer-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <aside className={`tl-workspace-nav ${sidebarOpen ? "is-open" : ""}`} aria-label="Workspace navigation">
        <div className="tl-workspace-nav-head">
          <strong>Workspace</strong>
          <div>
            <button onClick={() => setToast("Workspace search uses the global search field above")} aria-label="Search workspace" title="Search workspace"><MagnifyingGlass /></button>
            <button onClick={() => setNavCollapsed((value) => !value)} aria-label={navCollapsed ? "Expand workspace navigation" : "Collapse workspace navigation"} title={navCollapsed ? "Expand workspace navigation" : "Collapse workspace navigation"}><SidebarSimple /></button>
            <button className="tl-drawer-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" title="Close navigation"><X /></button>
          </div>
        </div>

        <button className="tl-workspace-switcher" onClick={() => navigate("workspace")}>
          <span className="tl-workspace-switcher-mark"><AppMark small /></span>
          <span><strong>Main workspace</strong><small>4 members</small></span>
          <CaretDown weight="bold" />
        </button>

        <button className={`tl-nav-row ${screen === "my-work" ? "is-active" : ""}`} onClick={() => navigate("my-work")}><Lightning weight="bold" /><span>My work</span><CaretRight /></button>
        <button className={`tl-nav-row ${screen === "inbox" ? "is-active" : ""}`} onClick={() => navigate("inbox")}><Archive /><span>Inbox</span><span className="tl-nav-badge">3</span></button>

        <div className="tl-nav-label"><span>Content</span><button onClick={() => setToast("Create menu is not connected in this UI preview")} aria-label="Create content"><Plus /></button></div>
        <nav className="tl-content-nav">
          <button className={screen === "workspace" ? "is-active" : ""} onClick={() => navigate("workspace")}><CirclesFour /><span>Manage workspace</span></button>
          <button className={screen === "board" ? "is-active" : ""} onClick={() => navigate("board")}><Rows /><span>Tanglad</span></button>
          <button className={screen === "reporting" ? "is-active" : ""} onClick={() => navigate("reporting")}><ChartBar /><span>Dashboard and reporting</span></button>
        </nav>

        <div className="tl-nav-label"><span>Team</span></div>
        <nav className="tl-content-nav">
          <button className={screen === "collaborators" ? "is-active" : ""} onClick={() => navigate("collaborators")}><UsersThree /><span>Collaborators</span></button>
          <button className={screen === "permissions" ? "is-active" : ""} onClick={() => navigate("permissions")}><Lock /><span>Permissions</span></button>
        </nav>

        <div className="tl-nav-spacer" />
        <div className="tl-storage-line"><span>Workspace storage</span><strong>UI preview</strong></div>
      </aside>

      <main className="tl-main" id="tl-main">
        <div className="tl-mobile-context">
          <button onClick={() => setSidebarOpen(true)}><List /><span>{screenLabels[screen]}</span></button>
        </div>

        {screen === "workspace" && (
          <WorkspaceOverview
            activeTab={workspaceTab}
            setActiveTab={setWorkspaceTab}
            navigate={navigate}
            members={members}
            cover={cover}
            changeCover={() => setCover((value) => (value + 1) % 3)}
            setToast={setToast}
          />
        )}
        {screen === "board" && (
          <BoardScreen
            tasks={filteredTasks}
            view={boardView}
            setView={setBoardView}
            mineOnly={mineOnly}
            setMineOnly={setMineOnly}
            cycleStatus={cycleStatus}
            composerOpen={composerOpen}
            setComposerOpen={setComposerOpen}
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
            navigate={navigate}
            setToast={setToast}
          />
        )}
        {screen === "my-work" && <MyWorkScreen tasks={filteredTasks} cycleStatus={cycleStatus} setToast={setToast} />}
        {screen === "inbox" && <InboxScreen navigate={navigate} setToast={setToast} />}
        {screen === "reporting" && <ReportingScreen tasks={tasks} members={members} navigate={navigate} setToast={setToast} />}
        {screen === "collaborators" && <CollaboratorsScreen members={members} setToast={setToast} openInvite={() => setInviteModalOpen(true)} />}
        {screen === "permissions" && <PermissionsScreen setToast={setToast} />}
      </main>

      {notificationsOpen && <NotificationPanel onClose={() => setNotificationsOpen(false)} openInvite={() => setInviteModalOpen(true)} setToast={setToast} />}
      {inviteModalOpen && <InviteMembersModal onClose={() => setInviteModalOpen(false)} setToast={setToast} />}

      {toast && (
        <div className="tl-toast" role="status">
          <Check weight="bold" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} aria-label="Dismiss message"><X /></button>
        </div>
      )}
    </div>
    </LazyMotion>
  );
}

function NotificationPanel({ onClose, openInvite, setToast }: { onClose: () => void; openInvite: () => void; setToast: (message: string) => void }) {
  const [tab, setTab] = useState<"all" | "mentioned" | "assigned">("all");
  const [query, setQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [showTeamsCard, setShowTeamsCard] = useState(true);

  return (
    <aside className="tl-notification-panel" aria-label="Notifications">
      <header className="tl-notification-head">
        <h2>Notifications</h2>
        <div><button onClick={() => setToast("Notification settings are ready for product integration")} aria-label="Notification settings" title="Notification settings"><Gear /></button><button onClick={() => setToast("Notification options are ready for product integration")} aria-label="Notification options" title="Notification options"><DotsThree /></button><button onClick={onClose} aria-label="Close notifications" title="Close notifications"><X /></button></div>
      </header>
      <AnimatedTabs id="notification-tabs" className="tl-notification-tabs" ariaLabel="Notification filters" active={tab} onChange={(value) => setTab(value as typeof tab)} items={[{ id: "all", label: "All" }, { id: "mentioned", label: "Mentioned" }, { id: "assigned", label: "Assigned to me" }]} />
      <div className="tl-notification-controls">
        <label className="tl-notification-search"><MagnifyingGlass /><span className="sr-only">Search notifications</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notifications by people, boards, and more..." /></label>
        <label className="tl-notification-toggle"><input type="checkbox" checked={unreadOnly} onChange={(event) => setUnreadOnly(event.target.checked)} /><span aria-hidden="true" />Unread only</label>
      </div>
      {showTeamsCard && <div className="tl-teams-card"><div className="tl-service-icons"><ChatCircle weight="fill" /><AppMark small /></div><div><strong>Get notifications in MS Teams</strong><p>Connect now to enable real-time updates for all users in your account.</p></div><button className="tl-blue-button" onClick={() => setToast("Teams connection is ready for product integration")}>Connect users</button><button className="tl-teams-dismiss" onClick={() => setShowTeamsCard(false)} aria-label="Dismiss Teams connection" title="Dismiss Teams connection"><X /></button></div>}
      <div className="tl-notification-empty" aria-live="polite">
        <div className="tl-notification-empty-art" aria-hidden="true"><span className="tl-notification-count">4</span><div className="tl-notification-mention"><At weight="bold" /><i /></div><UserCircle weight="duotone" /><div className="tl-notification-reply"><ArrowUUpLeft weight="bold" /></div></div>
        <h3>{query || tab !== "all" || unreadOnly ? "No matching notifications" : "No notifications to show"}</h3>
        <p>{query || tab !== "all" || unreadOnly ? "Try another filter or clear your search." : "You'll get notified here whenever someone @mentions or replies to you."}</p>
        <button className="tl-outline-button" onClick={() => { onClose(); openInvite(); }}>Invite new members</button>
      </div>
    </aside>
  );
}

function InviteMembersModal({ onClose, setToast }: { onClose: () => void; setToast: (message: string) => void }) {
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("Member");
  const submit = () => {
    if (!emails.trim()) return;
    const count = emails.split(",").map((email) => email.trim()).filter(Boolean).length;
    setToast(`${count} ${count === 1 ? "invitation" : "invitations"} prepared as ${role}`);
    onClose();
  };
  return (
    <div className="tl-modal-layer">
      <button className="tl-modal-scrim" onClick={onClose} aria-label="Close invite dialog" />
      <section className="tl-invite-modal" role="dialog" aria-modal="true" aria-labelledby="invite-title">
        <header><h2 id="invite-title">Invite to Tanglad</h2><button onClick={onClose} aria-label="Close invite dialog" title="Close invite dialog"><X /></button></header>
        <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
          <div className="tl-invite-modal-row"><label>Invite with email</label><button type="button" className="tl-outline-button" onClick={() => setToast("Workspace directory is ready for product integration")}><UsersThree />Workspace directory</button></div>
          <div className="tl-email-composer"><textarea value={emails} onChange={(event) => setEmails(event.target.value)} placeholder="Name@example.com, Name@example.com ..." rows={2} aria-label="Email addresses" required /><select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Invite role"><option>Member</option><option>Viewer</option></select></div>
          <label className="tl-invite-message"><span>Write a message (optional)</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add context for new members" rows={3} /></label>
          <footer><button type="button" className="tl-outline-button" onClick={onClose}>Cancel</button><button type="submit" className="tl-blue-button">Invite</button></footer>
        </form>
      </section>
    </div>
  );
}

function UtilityButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={`tl-utility-button ${active ? "is-active" : ""}`} onClick={onClick} title={label}>{icon}<span>{label}</span></button>;
}

function WorkspaceOverview({ activeTab, setActiveTab, navigate, members, cover, changeCover, setToast }: {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  navigate: (screen: Screen) => void;
  members: Member[];
  cover: number;
  changeCover: () => void;
  setToast: (message: string) => void;
}) {
  return (
    <div className="tl-workspace-page">
      <div className={`tl-cover cover-${cover}`}>
        <button className="tl-blue-button" onClick={changeCover}><PencilSimple />Change cover</button>
      </div>

      <div className="tl-workspace-overview">
        <header className="tl-workspace-identity">
          <div className="tl-workspace-tile"><AppMark /><span className="tl-home-badge"><House weight="fill" /></span></div>
          <div className="tl-workspace-title">
            <div><h1>Main workspace</h1><button onClick={() => setToast("Workspace menu opened in the full product")} aria-label="Workspace menu" title="Workspace menu"><CaretDown /></button></div>
            <button className="tl-description-button" onClick={() => setToast("Description editing is ready for product integration")}><Plus />Add workspace description</button>
          </div>
          <div className="tl-workspace-actions">
            <button onClick={() => setToast("Feedback panel is ready for product integration")}><ChatCircle />Feedback</button>
            <button onClick={() => navigate("collaborators")}><UsersThree />Collaborators</button>
            <button className="tl-outline-button" onClick={() => navigate("collaborators")}>Members</button>
            <button onClick={() => setToast("Workspace options are ready for product integration")} aria-label="More workspace options"><DotsThree weight="bold" /></button>
          </div>
        </header>

        <AnimatedTabs id="workspace-tabs" ariaLabel="Workspace sections" active={activeTab} onChange={(value) => setActiveTab(value as WorkspaceTab)} items={[{ id: "recents", label: "Recents", icon: <ClockCounterClockwise /> }, { id: "content", label: "Content", icon: <FolderSimple /> }, { id: "collaborators", label: "Collaborators", icon: <UsersThree /> }, { id: "permissions", label: "Permissions", icon: <Lock /> }]} />

        <div className="tl-tab-content">
          {activeTab === "recents" && <WorkspaceRecents navigate={navigate} />}
          {activeTab === "content" && <WorkspaceContent navigate={navigate} />}
          {activeTab === "collaborators" && <CompactMembers members={members} navigate={navigate} />}
          {activeTab === "permissions" && <CompactPermissions navigate={navigate} />}
        </div>
      </div>
    </div>
  );
}

type AnimatedTabItem = { id: string; label: string; icon?: React.ReactNode };

function AnimatedTabs({ id, items, active, onChange, ariaLabel, className = "tl-tabs" }: { id: string; items: AnimatedTabItem[]; active: string; onChange: (id: string) => void; ariaLabel: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <LayoutGroup id={id}>
      <div className={className} role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <m.button key={item.id} type="button" className={isActive ? "is-active" : ""} onClick={() => onChange(item.id)} role="tab" aria-selected={isActive} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
              {item.icon}<span>{item.label}</span>
              {isActive && <m.span layoutId={`${id}-indicator`} className="tl-tab-indicator" initial={false} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 34, mass: 0.65 }}><m.span key={active} className="tl-tab-indicator-core" initial={reduceMotion ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38, mass: 0.45 }} /></m.span>}
            </m.button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function WorkspaceRecents({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <section className="tl-list-section" aria-labelledby="recent-heading">
      <div className="tl-section-heading"><h2 id="recent-heading">Recently opened</h2><button onClick={() => navigate("board")}>View all content</button></div>
      <div className="tl-content-list">
        <button onClick={() => navigate("board")}><span className="tl-file-icon is-board"><Rows /></span><span><strong>Tanglad</strong><small>Board</small></span><span>Opened today</span><Star /></button>
        <button onClick={() => navigate("reporting")}><span className="tl-file-icon is-report"><ChartBar /></span><span><strong>Team workload</strong><small>Dashboard</small></span><span>Opened yesterday</span><Star /></button>
        <button onClick={() => navigate("my-work")}><span className="tl-file-icon is-doc"><FileText /></span><span><strong>Launch notes</strong><small>Document</small></span><span>Opened Aug 17</span><Star /></button>
      </div>
    </section>
  );
}

function WorkspaceContent({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <section className="tl-list-section" aria-labelledby="content-heading">
      <div className="tl-section-heading"><div><h2 id="content-heading">Workspace content</h2><p>Boards, dashboards, and documents available to this workspace.</p></div><button className="tl-blue-button" onClick={() => navigate("board")}><Plus />New board</button></div>
      <div className="tl-content-list is-detailed">
        <button onClick={() => navigate("board")}><span className="tl-file-icon is-board"><Rows /></span><span><strong>Tanglad</strong><small>Owned by Mara Cruz</small></span><span>Board</span><span>Today</span><DotsThree /></button>
        <button onClick={() => navigate("reporting")}><span className="tl-file-icon is-report"><ChartBar /></span><span><strong>Dashboard and reporting</strong><small>Owned by Inez Kim</small></span><span>Dashboard</span><span>Yesterday</span><DotsThree /></button>
        <button onClick={() => navigate("my-work")}><span className="tl-file-icon is-doc"><FileText /></span><span><strong>Launch notes</strong><small>Owned by Mara Cruz</small></span><span>Document</span><span>Aug 17</span><DotsThree /></button>
      </div>
    </section>
  );
}

function CompactMembers({ members, navigate }: { members: Member[]; navigate: (screen: Screen) => void }) {
  return (
    <section className="tl-list-section">
      <div className="tl-section-heading"><div><h2>Workspace collaborators</h2><p>People who can access content in Main workspace.</p></div><button className="tl-blue-button" onClick={() => navigate("collaborators")}><UserPlus />Manage members</button></div>
      <div className="tl-member-stack">
        {members.slice(0, 3).map((member) => <div key={member.email}><Avatar member={member} /><span><strong>{member.name}</strong><small>{member.email}</small></span><span>{member.role}</span></div>)}
      </div>
    </section>
  );
}

function CompactPermissions({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <section className="tl-list-section">
      <div className="tl-section-heading"><div><h2>Workspace permissions</h2><p>Set who can create, invite, and manage workspace content.</p></div><button className="tl-outline-button" onClick={() => navigate("permissions")}>Open settings</button></div>
      <div className="tl-setting-preview"><Lock /><span><strong>Workspace access</strong><small>Only invited members can open this workspace.</small></span><span>Private</span></div>
      <div className="tl-setting-preview"><UserPlus /><span><strong>Member invitations</strong><small>Owners and members can invite collaborators.</small></span><span>Members</span></div>
    </section>
  );
}

function BoardScreen({ tasks, view, setView, mineOnly, setMineOnly, cycleStatus, composerOpen, setComposerOpen, newTask, setNewTask, addTask, navigate, setToast }: {
  tasks: Task[];
  view: BoardView;
  setView: (view: BoardView) => void;
  mineOnly: boolean;
  setMineOnly: (value: boolean) => void;
  cycleStatus: (id: number) => void;
  composerOpen: boolean;
  setComposerOpen: (value: boolean) => void;
  newTask: string;
  setNewTask: (value: string) => void;
  addTask: () => void;
  navigate: (screen: Screen) => void;
  setToast: (message: string) => void;
}) {
  return (
    <div className="tl-standard-page">
      <PageHeader title="Tanglad" description="Project work for the product launch." actions={<><button className="tl-outline-button" onClick={() => navigate("collaborators")}><UserPlus />Invite</button><button onClick={() => setToast("Board options are ready for product integration")} aria-label="Board options" title="Board options"><DotsThree /></button></>} />
      <div className="tl-board-tabs">
        <AnimatedTabs id="board-tabs" ariaLabel="Board views" active={view} onChange={(value) => setView(value as BoardView)} items={[{ id: "table", label: "Main table", icon: <Rows /> }, { id: "kanban", label: "Board", icon: <Kanban /> }]} />
        <div className="tl-board-tools">
          <button className={mineOnly ? "is-selected" : ""} onClick={() => setMineOnly(!mineOnly)} aria-pressed={mineOnly}><FunnelSimple />{mineOnly ? "Mine only" : "Filter"}</button>
          <button className="tl-blue-button" onClick={() => setComposerOpen(true)}><Plus />New task</button>
        </div>
      </div>

      {composerOpen && (
        <form className="tl-inline-form" onSubmit={(event) => { event.preventDefault(); addTask(); }}>
          <label htmlFor="tl-new-task">Task name</label>
          <input id="tl-new-task" autoFocus value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task" />
          <button className="tl-blue-button" type="submit">Add</button>
          <button type="button" onClick={() => setComposerOpen(false)} aria-label="Cancel"><X /></button>
        </form>
      )}

      {tasks.length === 0 ? <EmptySearch /> : view === "table" ? <TaskTable tasks={tasks} cycleStatus={cycleStatus} onAdd={() => setComposerOpen(true)} setToast={setToast} /> : <KanbanView tasks={tasks} cycleStatus={cycleStatus} setToast={setToast} />}
    </div>
  );
}

function TaskTable({ tasks, cycleStatus, onAdd, setToast }: { tasks: Task[]; cycleStatus: (id: number) => void; onAdd?: () => void; setToast: (message: string) => void }) {
  return (
    <div className="tl-groups">
      {(["This week", "Next week"] as const).map((group) => {
        const groupTasks = tasks.filter((task) => task.group === group);
        if (!groupTasks.length) return null;
        return (
          <section className="tl-task-group" key={group}>
            <div className="tl-task-group-head"><CaretDown /><h2>{group}</h2><span>{groupTasks.length} tasks</span><button onClick={() => setToast(`${group} options are ready for product integration`)} aria-label={`${group} options`} title={`${group} options`}><DotsThree /></button></div>
            <div className="tl-task-table" role="table" aria-label={`${group} tasks`}>
              <div className="tl-task-row is-header" role="row"><span>Task</span><span>Owner</span><span>Status</span><span>Priority</span><span>Due</span><span /></div>
              {groupTasks.map((task) => <TaskRow task={task} cycleStatus={cycleStatus} setToast={setToast} key={task.id} />)}
              {onAdd && <button className="tl-add-row" onClick={onAdd}><Plus />Add task</button>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TaskRow({ task, cycleStatus, setToast }: { task: Task; cycleStatus: (id: number) => void; setToast: (message: string) => void }) {
  const member = members.find((item) => item.initials === task.owner) ?? members[0];
  return (
    <div className="tl-task-row" role="row">
      <div className="tl-task-name"><button className={task.status === "Done" ? "is-done" : ""} onClick={() => cycleStatus(task.id)} aria-label={`Change status for ${task.name}`} title={`Change status for ${task.name}`}>{task.status === "Done" && <Check />}</button><strong>{task.name}</strong></div>
      <div className="tl-task-owner"><Avatar member={member} size="small" /><span>{task.ownerName}</span></div>
      <button className="tl-status-cell" onClick={() => cycleStatus(task.id)}><StatusLabel status={task.status} /></button>
      <div><PriorityLabel priority={task.priority} /></div>
      <div className="tl-task-due"><CalendarBlank />{task.due}</div>
      <button className="tl-more-button" onClick={() => setToast(`Options for ${task.name} are ready for product integration`)} aria-label={`More options for ${task.name}`} title={`More options for ${task.name}`}><DotsThree /></button>
    </div>
  );
}

function StatusLabel({ status }: { status: TaskStatus }) {
  return <span className={`tl-status status-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>;
}

function PriorityLabel({ priority }: { priority: TaskPriority }) {
  return <span className={`tl-priority priority-${priority.toLowerCase()}`}>{priority}</span>;
}

function KanbanView({ tasks, cycleStatus, setToast }: { tasks: Task[]; cycleStatus: (id: number) => void; setToast: (message: string) => void }) {
  return (
    <div className="tl-kanban">
      {statusOrder.map((status) => {
        const statusTasks = tasks.filter((task) => task.status === status);
        return (
          <section className="tl-kanban-column" key={status}>
            <header><StatusLabel status={status} /><span>{statusTasks.length}</span><button onClick={() => setToast(`${status} column options are ready for product integration`)} aria-label={`${status} options`} title={`${status} options`}><DotsThree /></button></header>
            <div>
              {statusTasks.map((task) => {
                const member = members.find((item) => item.initials === task.owner) ?? members[0];
                return <button className="tl-kanban-card" onClick={() => cycleStatus(task.id)} key={task.id}><strong>{task.name}</strong><span><Avatar member={member} size="small" /><PriorityLabel priority={task.priority} /><small>{task.due}</small></span></button>;
              })}
              {!statusTasks.length && <div className="tl-column-empty">No tasks</div>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function MyWorkScreen({ tasks, cycleStatus, setToast }: { tasks: Task[]; cycleStatus: (id: number) => void; setToast: (message: string) => void }) {
  const [activeOnly, setActiveOnly] = useState(false);
  const [view, setView] = useState<"table" | "calendar">("table");
  const mine = tasks.filter((task) => task.owner === "MC" && (!activeOnly || task.status !== "Done"));
  return (
    <div className="tl-standard-page">
      <PageHeader title="My work" description="Tasks assigned to Mara across Main workspace." actions={<button className={activeOnly ? "tl-blue-button" : "tl-outline-button"} onClick={() => setActiveOnly(!activeOnly)} aria-pressed={activeOnly}><FunnelSimple />{activeOnly ? "Active only" : "Filter active"}</button>} />
      <AnimatedTabs id="my-work-tabs" className="tl-tabs tl-my-work-tabs" ariaLabel="My work views" active={view} onChange={(value) => setView(value as typeof view)} items={[{ id: "table", label: "Table" }, { id: "calendar", label: "Calendar", icon: <CalendarBlank /> }]} />
      {view === "table" ? <><div className="tl-summary-line"><span><strong>{mine.length}</strong> assigned</span><span><strong>{mine.filter((task) => task.status === "Done").length}</strong> completed</span><span><strong>{mine.filter((task) => task.status === "Blocked").length}</strong> blocked</span></div>{mine.length ? <TaskTable tasks={mine} cycleStatus={cycleStatus} setToast={setToast} /> : <EmptySearch />}</> : <MyWorkCalendar tasks={mine} />}
    </div>
  );
}

function MyWorkCalendar({ tasks }: { tasks: Task[] }) {
  const days = ["Mon 18", "Tue 19", "Wed 20", "Thu 21", "Fri 22"];
  return <section className="tl-calendar-view" aria-label="My work calendar"><div className="tl-calendar-grid">{days.map((day, index) => <div className="tl-calendar-day" key={day}><strong>{day}</strong><span>{index < 2 ? `${index + 1} task${index === 0 ? "" : "s"}` : "Open"}</span>{tasks.filter((task) => task.due.includes(String(19 + index))).slice(0, 2).map((task) => <div className="tl-calendar-task" key={task.id}><span className={`tl-calendar-dot status-${task.status.toLowerCase().replaceAll(" ", "-")}`} /><b>{task.name}</b></div>)}</div>)}</div></section>;
}

function InboxScreen({ navigate, setToast }: { navigate: (screen: Screen) => void; setToast: (message: string) => void }) {
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState<"all" | "mentions" | "assigned">("all");
  const [reply, setReply] = useState("");
  const updates = [
    { person: members[1], title: "Inez mentioned you in Launch page copy", body: "Can you check the final section before review?", time: "12 min" },
    { person: members[2], title: "Rafi changed a task to Review", body: "Workspace permissions is ready for a second pass.", time: "1 hour" },
    { person: members[3], title: "Sam joined Main workspace", body: "Sam can now view Tanglad and Launch notes.", time: "Yesterday" },
  ];
  return (
    <div className="tl-standard-page tl-inbox-page">
      <PageHeader title="Inbox" description="Updates, mentions, and workspace activity." actions={<button className="tl-outline-button" onClick={() => setToast("All updates marked as read")}><Check />Mark all read</button>} />
      <div className="tl-inbox-layout">
        <div className="tl-inbox-list">
          <div className="tl-inbox-filter"><button className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>All updates</button><button className={filter === "mentions" ? "is-active" : ""} onClick={() => { setFilter("mentions"); setSelected(0); }}>Mentions</button><button className={filter === "assigned" ? "is-active" : ""} onClick={() => { setFilter("assigned"); setSelected(1); }}>Assigned</button></div>
          {updates.filter((_, index) => filter === "all" || (filter === "mentions" ? index === 0 : index === 1)).map((update) => { const index = updates.indexOf(update); return <button className={selected === index ? "is-selected" : ""} onClick={() => setSelected(index)} key={update.title}><Avatar member={update.person} /><span><strong>{update.title}</strong><small>{update.body}</small></span><time>{update.time}</time></button>; })}
        </div>
        <article className="tl-inbox-detail">
          <div className="tl-inbox-detail-head"><Avatar member={updates[selected].person} size="large" /><div><strong>{updates[selected].person.name}</strong><small>{updates[selected].time} ago</small></div><button onClick={() => setToast("Update options are ready for product integration")} aria-label="Update options" title="Update options"><DotsThree /></button></div>
          <h2>{updates[selected].title}</h2>
          <p>{updates[selected].body}</p>
          <button className="tl-update-context" onClick={() => navigate("board")}><Rows /><span><strong>Tanglad</strong><small>Product launch board</small></span><CaretRight /></button>
          <form className="tl-reply-field" onSubmit={(event) => { event.preventDefault(); if (!reply.trim()) return; setToast("Reply added to this update"); setReply(""); }}><label htmlFor="tl-reply">Reply</label><textarea id="tl-reply" value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply" rows={4} /><button className="tl-blue-button" type="submit">Send</button></form>
        </article>
      </div>
    </div>
  );
}

function ReportingScreen({ tasks, members: team, navigate, setToast }: { tasks: Task[]; members: Member[]; navigate: (screen: Screen) => void; setToast: (message: string) => void }) {
  const completed = tasks.filter((task) => task.status === "Done").length;
  const working = tasks.filter((task) => task.status === "Working on it").length;
  const review = tasks.filter((task) => task.status === "Review").length;
  const blocked = tasks.filter((task) => task.status === "Blocked").length;
  return (
    <div className="tl-standard-page">
      <PageHeader title="Dashboard and reporting" description="A workspace-level view of progress and ownership." actions={<><button className="tl-outline-button" onClick={() => setToast("Dashboard customization is ready for product integration")}><SlidersHorizontal />Customize</button><button className="tl-blue-button" onClick={() => setToast("Widget picker is ready for product integration")}><Plus />Add widget</button></>} />
      <p className="tl-sample-note">Sample workspace data</p>
      <div className="tl-report-summary"><div><span>Total tasks</span><strong>{tasks.length}</strong></div><div><span>Completed</span><strong>{completed}</strong></div><div><span>In review</span><strong>{review}</strong></div><div><span>Blocked</span><strong>{blocked}</strong></div></div>
      <div className="tl-report-grid">
        <section className="tl-report-panel tl-status-chart"><header><div><h2>Status overview</h2><p>Current tasks by workflow state</p></div><button onClick={() => setToast("Chart options are ready for product integration")} aria-label="Chart options" title="Chart options"><DotsThree /></button></header><div className="tl-bar-chart" role="img" aria-label={`${completed} done, ${working} working on it, ${review} in review, ${blocked} blocked`}><Bar label="Done" value={completed} max={tasks.length} tone="blue" /><Bar label="Working on it" value={working} max={tasks.length} tone="cyan" /><Bar label="Review" value={review} max={tasks.length} tone="amber" /><Bar label="Blocked" value={blocked} max={tasks.length} tone="rose" /></div></section>
        <section className="tl-report-panel"><header><div><h2>Ownership</h2><p>Open tasks by collaborator</p></div><button onClick={() => setToast("Ownership options are ready for product integration")} aria-label="Ownership options" title="Ownership options"><DotsThree /></button></header><div className="tl-ownership-list">{team.slice(0, 3).map((member) => { const count = tasks.filter((task) => task.owner === member.initials && task.status !== "Done").length; return <div key={member.email}><Avatar member={member} /><span><strong>{member.name}</strong><small>{member.role}</small></span><b>{count}</b></div>; })}</div></section>
        <section className="tl-report-panel tl-wide-panel"><header><div><h2>Upcoming dates</h2><p>Tasks due in the next two weeks</p></div><button onClick={() => navigate("board")}>Open board</button></header><div className="tl-upcoming-list">{tasks.slice(0, 5).map((task) => <div key={task.id}><span>{task.due}</span><strong>{task.name}</strong><StatusLabel status={task.status} /></div>)}</div></section>
      </div>
    </div>
  );
}

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return <div className={`tl-bar tone-${tone}`}><span>{label}</span><div><i style={{ width: `${Math.max(8, (value / max) * 100)}%` }} /></div><strong>{value}</strong></div>;
}

function CollaboratorsScreen({ members: team, setToast, openInvite }: { members: Member[]; setToast: (message: string) => void; openInvite: () => void }) {
  return (
    <div className="tl-standard-page">
      <PageHeader title="Collaborators" description="Manage who can access Main workspace." actions={<button className="tl-blue-button" onClick={openInvite}><UserPlus />Invite member</button>} />
      <div className="tl-member-table" role="table" aria-label="Workspace collaborators">
        <div className="tl-member-row is-header"><span>Person</span><span>Role</span><span>Assigned items</span><span>Last active</span><span /></div>
        {team.map((member) => <div className="tl-member-row" key={member.email}><div><Avatar member={member} /><span><strong>{member.name}</strong><small>{member.email}</small></span></div><div><select defaultValue={member.role} onChange={(event) => setToast(`${member.name} will be a ${event.target.value}`)} aria-label={`Role for ${member.name}`}><option>Owner</option><option>Member</option><option>Viewer</option></select></div><span>{member.items}</span><span>{member.lastActive}</span><button onClick={() => setToast(`Member options for ${member.name} are ready for product integration`)} aria-label={`Options for ${member.name}`} title={`Options for ${member.name}`}><DotsThree /></button></div>)}
      </div>
    </div>
  );
}

function PermissionsScreen({ setToast }: { setToast: (message: string) => void }) {
  const [settings, setSettings] = useState({ private: true, invites: true, create: false, export: true });
  const toggle = (key: keyof typeof settings) => setSettings((current) => ({ ...current, [key]: !current[key] }));
  return (
    <div className="tl-standard-page tl-settings-page">
      <PageHeader title="Permissions" description="Control access and workspace-level actions." actions={<button className="tl-blue-button" onClick={() => setToast("Permission changes saved")}>Save changes</button>} />
      <section className="tl-settings-section"><div><h2>Workspace access</h2><p>Choose who can open Main workspace and its content.</p></div><div className="tl-settings-list"><SettingRow title="Private workspace" detail="Only invited collaborators can access this workspace." checked={settings.private} onChange={() => toggle("private")} /><SettingRow title="Member invitations" detail="Members can invite additional collaborators." checked={settings.invites} onChange={() => toggle("invites")} /></div></section>
      <section className="tl-settings-section"><div><h2>Content controls</h2><p>Set what workspace members can create and export.</p></div><div className="tl-settings-list"><SettingRow title="Create new boards" detail="Members can create boards inside Main workspace." checked={settings.create} onChange={() => toggle("create")} /><SettingRow title="Export workspace data" detail="Owners and members can export board data." checked={settings.export} onChange={() => toggle("export")} /></div></section>
      <section className="tl-settings-section"><div><h2>Default role</h2><p>Applied when a new collaborator joins the workspace.</p></div><label className="tl-select-field"><span>New collaborators join as</span><select defaultValue="Member"><option>Member</option><option>Viewer</option></select></label></section>
    </div>
  );
}

function SettingRow({ title, detail, checked, onChange }: { title: string; detail: string; checked: boolean; onChange: () => void }) {
  return <div className="tl-setting-row"><span><strong>{title}</strong><small>{detail}</small></span><button className={`tl-switch ${checked ? "is-on" : ""}`} onClick={onChange} role="switch" aria-checked={checked} aria-label={title}><i /></button></div>;
}

function PageHeader({ title, description, actions }: { title: string; description: string; actions?: React.ReactNode }) {
  return <header className="tl-page-header"><div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="tl-page-actions">{actions}</div>}</header>;
}

function EmptySearch() {
  return <div className="tl-empty-state"><MagnifyingGlass /><h2>No matching items</h2><p>Clear the search or change the current filter.</p></div>;
}
