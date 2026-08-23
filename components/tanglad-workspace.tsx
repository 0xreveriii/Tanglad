"use client";

import {
  ArrowUUpLeft,
  ArrowLeft,
  At,
  Bell,
  BookOpen,
  BookmarkSimple,
  Briefcase,
  CalendarBlank,
  CaretDown,
  CaretRight,
  ChartBar,
  ChatCircle,
  Check,
  CirclesFour,
  ClockCounterClockwise,
  CrownSimple,
  Diamond,
  DotsNine,
  DotsSixVertical,
  DotsThree,
  FileText,
  Flag,
  FolderSimple,
  FunnelSimple,
  Gear,
  Gift,
  House,
  Kanban,
  Lightning,
  Lightbulb,
  List,
  Lock,
  MagnifyingGlass,
  PencilSimple,
  PaperPlaneTilt,
  Plus,
  Question,
  RocketLaunch,
  Rows,
  SidebarSimple,
  SlidersHorizontal,
  Star,
  Tag,
  TrayIcon,
  User,
  UserPlus,
  UsersThree,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import "@/app/app/workspace.css";

type Screen = "manage-workspace" | "my-work" | "inbox" | "board" | "insights" | "collaborators" | "permissions" | "favorites";
type PrimarySection = "workspace" | "my-work" | "inbox" | "favorites";
type WorkspaceTab = "recents" | "content" | "collaborators" | "permissions";
type SearchSection = "all" | "boards" | "updates" | "files" | "people" | "tags" | "docs";
type BoardView = "table" | "kanban";
type MyWorkView = "table" | "calendar";
type UpdateFilter = "all" | "mentions" | "assigned";
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

type SearchResult = {
  id: string;
  section: Exclude<SearchSection, "all">;
  title: string;
  detail: string;
  keywords: string;
  screen: Screen;
  dated?: boolean;
};

const searchLayerMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const searchDialogMotion = {
  initial: { opacity: 0, y: 18, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.34, ease: [0.2, 0, 0, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: 10, scale: 0.99, transition: { duration: 0.18, ease: [0.3, 0, 1, 1] as [number, number, number, number] } },
};

const searchContentMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.24, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
};

const inviteLayerMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const inviteDialogMotion = {
  initial: { opacity: 0, y: 18, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.34, ease: [0.2, 0, 0, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: 10, scale: 0.99, transition: { duration: 0.18, ease: [0.3, 0, 1, 1] as [number, number, number, number] } },
};

const searchSignals = [
  { x: 34, y: 42, width: 112, fill: "#dcecff", accent: "#0067d9", delay: 0 },
  { x: 300, y: 38, width: 124, fill: "#dff7ef", accent: "#159b78", delay: 0.16 },
  { x: 48, y: 162, width: 132, fill: "#fff1c9", accent: "#d69212", delay: 0.32 },
  { x: 286, y: 158, width: 138, fill: "#ebe7ff", accent: "#6c5ce7", delay: 0.48 },
];

const searchSignalVariants = {
  initial: { opacity: 0, scale: 0.86, y: 12 },
  animate: (delay: number) => ({
    opacity: [0, 1, 1, 0.88, 1],
    scale: [0.86, 1.03, 1, 0.985, 1],
    y: [12, 0, -3, 1, 0],
    transition: { duration: 2.8, delay, repeat: Infinity, repeatDelay: 0.25, ease: "easeInOut" as const },
  }),
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
  "manage-workspace": "Manage workspace",
  "my-work": "My work",
  inbox: "Update feed",
  board: "Tanglad",
  insights: "Insights",
  collaborators: "Collaborators",
  permissions: "Permissions",
  favorites: "Favorites",
};

function primarySectionForScreen(screen: Screen): PrimarySection {
  if (screen === "my-work") return "my-work";
  if (screen === "inbox") return "inbox";
  if (screen === "favorites") return "favorites";
  return "workspace";
}

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
  const [screen, setScreen] = useState<Screen>("manage-workspace");
  const [primarySection, setPrimarySection] = useState<PrimarySection>("workspace");
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("recents");
  const [boardView, setBoardView] = useState<BoardView>("table");
  const [myWorkView, setMyWorkView] = useState<MyWorkView>("table");
  const [myWorkActiveOnly, setMyWorkActiveOnly] = useState(false);
  const [updateFilter, setUpdateFilter] = useState<UpdateFilter>("all");
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
  const [updateFeedOpen, setUpdateFeedOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [workspaceQuery, setWorkspaceQuery] = useState("");
  const [workspaceBrowserOpen, setWorkspaceBrowserOpen] = useState(false);
  const [workspaceCreateOpen, setWorkspaceCreateOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const updateFeedTriggerRef = useRef<HTMLButtonElement>(null);
  const helpTriggerRef = useRef<HTMLButtonElement>(null);
  const helpMenuRef = useRef<HTMLDivElement>(null);
  const workspaceSwitcherRef = useRef<HTMLButtonElement>(null);
  const workspaceMenuRef = useRef<HTMLDivElement>(null);
  const workspaceSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const openFromKeyboard = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setNotificationsOpen(false);
        setInviteModalOpen(false);
        setUpdateFeedOpen(false);
        setHelpOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", openFromKeyboard);
    return () => window.removeEventListener("keydown", openFromKeyboard);
  }, []);

  useEffect(() => {
    if (!workspaceMenuOpen) return;

    workspaceSearchRef.current?.focus();

    const closeOnPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!workspaceMenuRef.current?.contains(target) && !workspaceSwitcherRef.current?.contains(target)) {
        setWorkspaceMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWorkspaceMenuOpen(false);
        workspaceSwitcherRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [workspaceMenuOpen]);

  useEffect(() => {
    if (!helpOpen) return;

    const closeOnPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!helpMenuRef.current?.contains(target) && !helpTriggerRef.current?.contains(target)) setHelpOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHelpOpen(false);
        helpTriggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [helpOpen]);

  const navigate = (next: Screen, parent: PrimarySection = primarySectionForScreen(next)) => {
    setScreen(next);
    setPrimarySection(parent);
    setSidebarOpen(false);
    setToast(null);
    setNotificationsOpen(false);
    setInviteModalOpen(false);
    setUpdateFeedOpen(false);
    setHelpOpen(false);
    setSearchOpen(false);
    setWorkspaceMenuOpen(false);
    setWorkspaceBrowserOpen(false);
    setWorkspaceCreateOpen(false);
  };

  const openSearch = () => {
    setNotificationsOpen(false);
    setInviteModalOpen(false);
    setUpdateFeedOpen(false);
    setHelpOpen(false);
    setWorkspaceMenuOpen(false);
    setWorkspaceBrowserOpen(false);
    setWorkspaceCreateOpen(false);
    setSearchOpen(true);
  };

  const openUpdateFeed = () => {
    setNotificationsOpen(false);
    setInviteModalOpen(false);
    setHelpOpen(false);
    setWorkspaceMenuOpen(false);
    setWorkspaceBrowserOpen(false);
    setWorkspaceCreateOpen(false);
    setSearchOpen(false);
    setToast(null);
    setUpdateFeedOpen(true);
  };

  const openHelp = () => {
    setNotificationsOpen(false);
    setInviteModalOpen(false);
    setUpdateFeedOpen(false);
    setWorkspaceMenuOpen(false);
    setWorkspaceBrowserOpen(false);
    setWorkspaceCreateOpen(false);
    setSearchOpen(false);
    setHelpOpen(true);
  };

  const closeHelp = () => {
    setHelpOpen(false);
    window.setTimeout(() => helpTriggerRef.current?.focus(), 190);
  };

  const closeUpdateFeed = () => {
    setUpdateFeedOpen(false);
    window.setTimeout(() => updateFeedTriggerRef.current?.focus(), 190);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    window.setTimeout(() => searchTriggerRef.current?.focus(), 190);
  };

  const openParent = (parent: PrimarySection) => {
    setNavCollapsed(false);
    setPrimarySection(parent);
    if (parent === "workspace") {
      navigate("manage-workspace", "workspace");
    } else if (parent === "my-work") {
      setMyWorkView("table");
      setMyWorkActiveOnly(false);
      navigate("my-work", "my-work");
    } else if (parent === "inbox") {
      setUpdateFilter("all");
      navigate("inbox", "inbox");
    } else {
      navigate("favorites", "favorites");
    }
  };

  const openWorkspaceNavigation = () => {
    setNavCollapsed(false);
    openParent("workspace");
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesMine = !mineOnly || task.owner === "MC";
      return matchesMine;
    });
  }, [mineOnly, tasks]);

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
          <button className="tl-wordmark" onClick={() => navigate("manage-workspace")} aria-label="Open Tanglad workspace">
            <AppMark small />
            <strong>Tanglad</strong>
          </button>
          <button className="tl-plans-button" onClick={() => setToast("Plans are not connected in this UI preview")}><Diamond weight="fill" />Plans</button>
        </div>

        <button ref={searchTriggerRef} className="tl-global-search" type="button" onClick={openSearch} aria-haspopup="dialog" aria-expanded={searchOpen} aria-controls="tl-search-dialog">
          <MagnifyingGlass weight="bold" />
          <span>Search for anything</span>
          <kbd>Ctrl K</kbd>
        </button>

        <div className="tl-topbar-actions">
          <button data-tooltip="Notifications" className={notificationsOpen ? "is-open" : ""} onClick={() => setNotificationsOpen((value) => !value)} aria-label="Open notifications" title="Notifications" aria-expanded={notificationsOpen}><Bell /><span className="tl-unread-count">3</span></button>
          <button ref={updateFeedTriggerRef} data-tooltip="Update feed" className={updateFeedOpen ? "is-open" : ""} onClick={openUpdateFeed} aria-label="Open update feed" title="Update feed" aria-haspopup="dialog" aria-expanded={updateFeedOpen}><TrayIcon /></button>
          <button data-tooltip="Invite members" onClick={() => { setNotificationsOpen(false); setInviteModalOpen(true); }} aria-label="Invite members" title="Invite members"><UserPlus /></button>
          <button data-tooltip="Settings" onClick={() => navigate("permissions")} aria-label="Open settings" title="Settings"><Gear /></button>
          <button ref={helpTriggerRef} data-tooltip="Help" className={helpOpen ? "is-open" : ""} onClick={openHelp} aria-label="Open help" title="Help" aria-haspopup="menu" aria-expanded={helpOpen}><Question /></button>
          <button data-tooltip="App launcher" onClick={() => setToast("App launcher is not connected in this UI preview")} aria-label="Open app launcher" title="App launcher"><DotsNine weight="bold" /></button>
          <button data-tooltip="Mara Cruz profile" className="tl-profile" onClick={() => setToast("Profile settings are not connected in this UI preview")} aria-label="Open Mara Cruz profile" title="Mara Cruz profile"><span className="tl-profile-avatar">MC</span></button>
        </div>
      </header>

      <aside className="tl-utility-rail" aria-label="Primary application navigation">
        <UtilityButton
          icon={<CirclesFour />}
          label="Workspace"
          active={primarySection === "workspace"}
          onClick={openWorkspaceNavigation}
        />
        <UtilityButton icon={<Lightning />} label="My work" active={primarySection === "my-work"} onClick={() => openParent("my-work")} />
        <span className="tl-rail-divider" />
        <UtilityButton icon={<Star />} label="Favorites" active={primarySection === "favorites"} onClick={() => openParent("favorites")} />
        <div className="tl-rail-spacer" />
        <Link className="tl-utility-link" href="/"><ArrowLeft /><span>Website</span></Link>
      </aside>

      {sidebarOpen && <button className="tl-drawer-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <aside className={`tl-workspace-nav ${sidebarOpen ? "is-open" : ""}`} aria-label="Workspace navigation">
        <div className="tl-workspace-nav-head">
          <strong>{primarySection === "workspace" ? "Workspace" : primarySection === "my-work" ? "My work" : primarySection === "inbox" ? "Update feed" : "Favorites"}</strong>
          <div>
            <button onClick={() => setToast("Workspace search uses the global search field above")} aria-label="Search workspace" title="Search workspace"><MagnifyingGlass /></button>
            <button onClick={() => { setWorkspaceMenuOpen(false); setNavCollapsed((value) => !value); }} aria-label={navCollapsed ? "Expand workspace navigation" : "Collapse workspace navigation"} title={navCollapsed ? "Expand workspace navigation" : "Collapse workspace navigation"}><SidebarSimple /></button>
            <button className="tl-drawer-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" title="Close navigation"><X /></button>
          </div>
        </div>

        {primarySection === "workspace" && <>
          <div className="tl-workspace-switcher-row">
            <button
              ref={workspaceSwitcherRef}
              className="tl-workspace-switcher"
              onClick={() => {
                if (navCollapsed) {
                  setNavCollapsed(false);
                  return;
                }
                setWorkspaceQuery("");
                setWorkspaceMenuOpen((value) => !value);
              }}
              aria-expanded={workspaceMenuOpen}
              aria-controls="workspace-switcher-menu"
              aria-haspopup="dialog"
            >
              <span className="tl-workspace-switcher-mark"><AppMark small /></span>
              <span><strong>Main workspace</strong></span>
              <CaretDown className={workspaceMenuOpen ? "is-open" : ""} weight="bold" />
            </button>
            <button className="tl-workspace-add" onClick={() => setToast("Workspace shortcuts are not connected in this UI preview")} aria-label="Workspace shortcuts" title="Workspace shortcuts"><Plus /></button>

            {workspaceMenuOpen && (
              <div ref={workspaceMenuRef} className="tl-workspace-menu" id="workspace-switcher-menu" role="dialog" aria-label="Switch workspace">
                <label className="tl-workspace-menu-search">
                  <MagnifyingGlass />
                  <input ref={workspaceSearchRef} value={workspaceQuery} onChange={(event) => setWorkspaceQuery(event.target.value)} placeholder="Search for a workspace" aria-label="Search for a workspace" />
                </label>

                {"Main workspace".toLowerCase().includes(workspaceQuery.trim().toLowerCase()) ? <>
                  <section aria-labelledby="recent-workspaces-label">
                    <span id="recent-workspaces-label">Recent workspaces</span>
                    <button className="is-active" onClick={() => navigate("manage-workspace", "workspace")}><span className="tl-workspace-menu-mark"><AppMark small /></span><strong>Main workspace</strong></button>
                  </section>
                  <section aria-labelledby="my-workspaces-label">
                    <span id="my-workspaces-label">My workspaces</span>
                    <button className="is-active" onClick={() => navigate("manage-workspace", "workspace")}><span className="tl-workspace-menu-mark"><AppMark small /></span><strong>Main workspace</strong></button>
                  </section>
                </> : <p className="tl-workspace-menu-empty">No workspaces found</p>}

                <footer>
                  <button onClick={() => { setWorkspaceMenuOpen(false); setWorkspaceQuery(""); setWorkspaceBrowserOpen(true); }}><CirclesFour />Browse all</button>
                  <button onClick={() => { setWorkspaceMenuOpen(false); setWorkspaceCreateOpen(true); }}><Plus />Add workspace</button>
                </footer>
              </div>
            )}
          </div>

          <nav className="tl-workspace-tree" id="workspace-children" aria-label="Main workspace sections">
            <button className={screen === "manage-workspace" ? "is-active" : ""} onClick={() => navigate("manage-workspace", "workspace")}><House /><span>Manage workspace</span></button>
            <button className={screen === "board" ? "is-active" : ""} onClick={() => navigate("board", "workspace")}><Rows /><span>Tanglad</span></button>
            <button className={screen === "insights" ? "is-active" : ""} onClick={() => navigate("insights", "workspace")}><ChartBar /><span>Insights</span></button>
            <button className={screen === "collaborators" ? "is-active" : ""} onClick={() => navigate("collaborators", "workspace")}><UsersThree /><span>Collaborators</span></button>
            <button className={screen === "permissions" ? "is-active" : ""} onClick={() => navigate("permissions", "workspace")}><Lock /><span>Permissions</span></button>
          </nav>
        </>}

        {primarySection === "my-work" && <nav className="tl-content-nav" aria-label="My work sections">
          <button className={myWorkView === "table" ? "is-active" : ""} onClick={() => setMyWorkView("table")}><List /><span>Table</span></button>
          <button className={myWorkView === "calendar" ? "is-active" : ""} onClick={() => setMyWorkView("calendar")}><CalendarBlank /><span>Calendar</span></button>
          <button className={myWorkActiveOnly ? "is-active" : ""} onClick={() => setMyWorkActiveOnly((value) => !value)}><FunnelSimple /><span>Active only</span></button>
        </nav>}

        {primarySection === "favorites" && <nav className="tl-content-nav" aria-label="Favorites sections">
          <button className="is-active" onClick={() => navigate("favorites", "favorites")}><Star /><span>All favorites</span></button>
        </nav>}

        <div className="tl-nav-spacer" />
        <div className="tl-storage-line"><span>Workspace storage</span><strong>UI preview</strong></div>
      </aside>

      <main className="tl-main" id="tl-main">
        <div className="tl-main-canvas">
          <div className="tl-mobile-context">
            <button onClick={() => setSidebarOpen(true)}><List /><span>{screenLabels[screen]}</span></button>
          </div>

          {screen === "manage-workspace" && (
            <ManageWorkspaceScreen
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
          {screen === "my-work" && <MyWorkScreen tasks={tasks} view={myWorkView} activeOnly={myWorkActiveOnly} cycleStatus={cycleStatus} setToast={setToast} />}
          {screen === "insights" && <InsightsScreen tasks={tasks} members={members} navigate={navigate} setToast={setToast} />}
          {screen === "collaborators" && <CollaboratorsScreen members={members} setToast={setToast} openInvite={() => setInviteModalOpen(true)} />}
          {screen === "permissions" && <PermissionsScreen setToast={setToast} />}
          {screen === "favorites" && <FavoritesScreen />}
        </div>
      </main>

      {notificationsOpen && <NotificationPanel onClose={() => setNotificationsOpen(false)} openInvite={() => setInviteModalOpen(true)} setToast={setToast} />}
      <AnimatePresence>
        {updateFeedOpen && <UpdateFeedPanel onClose={closeUpdateFeed} setToast={setToast} />}
        {workspaceBrowserOpen && <WorkspaceBrowser onClose={() => { setWorkspaceBrowserOpen(false); workspaceSwitcherRef.current?.focus(); }} onSelect={(name) => { setWorkspaceBrowserOpen(false); if (name === "Main workspace") navigate("manage-workspace", "workspace"); else setToast(`${name} is ready for product integration`); }} onCreate={() => { setWorkspaceBrowserOpen(false); setWorkspaceCreateOpen(true); }} />}
        {workspaceCreateOpen && <WorkspaceCreateModal onClose={() => { setWorkspaceCreateOpen(false); workspaceSwitcherRef.current?.focus(); }} setToast={setToast} />}
        {helpOpen && <HelpMenu onClose={closeHelp} setToast={setToast} menuRef={helpMenuRef} />}
        {inviteModalOpen && <InviteMembersModal onClose={() => setInviteModalOpen(false)} setToast={setToast} />}
        {searchOpen && (
          <SearchEverythingModal
            query={search}
            setQuery={setSearch}
            tasks={tasks}
            onClose={closeSearch}
            navigate={navigate}
          />
        )}
      </AnimatePresence>

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
        <label className="tl-notification-search"><MagnifyingGlass /><span className="sr-only">Search notifications</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notifications by people, boards, and more..." autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} /></label>
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

function SearchEverythingModal({ query, setQuery, tasks, onClose, navigate }: {
  query: string;
  setQuery: (value: string) => void;
  tasks: Task[];
  onClose: () => void;
  navigate: (screen: Screen) => void;
}) {
  const [activeTab, setActiveTab] = useState<SearchSection>("all");
  const [preparing, setPreparing] = useState(() => !query.trim());
  const [recentOnly, setRecentOnly] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setPreparing(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKeys);
    return () => document.removeEventListener("keydown", handleDialogKeys);
  }, [onClose]);

  const allResults = useMemo<SearchResult[]>(() => {
    const fixed: SearchResult[] = [
      { id: "board-tanglad", section: "boards", title: "Tanglad", detail: "Board · Main workspace", keywords: "tasks product launch table kanban", screen: "board", dated: true },
      { id: "board-workload", section: "boards", title: "Team workload", detail: "Dashboard · Updated today", keywords: "insights reporting ownership capacity dashboard", screen: "insights", dated: true },
      { id: "file-roadmap", section: "files", title: "Launch roadmap", detail: "Project file · Edited by Inez", keywords: "roadmap launch project file", screen: "board", dated: true },
      { id: "doc-notes", section: "docs", title: "Launch notes", detail: "Document · Opened Aug 17", keywords: "notes launch document release", screen: "my-work", dated: true },
      { id: "doc-handbook", section: "docs", title: "Workspace handbook", detail: "Document · Main workspace", keywords: "handbook workspace onboarding guide", screen: "manage-workspace", dated: true },
    ];
    const taskResults: SearchResult[] = tasks.map((task) => ({
      id: `task-${task.id}`,
      section: "updates",
      title: task.name,
      detail: `${task.ownerName} · ${task.status} · ${task.due}`,
      keywords: `${task.name} ${task.ownerName} ${task.status} ${task.priority} ${task.group}`,
      screen: "board",
      dated: true,
    }));
    const peopleResults: SearchResult[] = members.map((member) => ({
      id: `person-${member.initials}`,
      section: "people",
      title: member.name,
      detail: `${member.role} · ${member.email}`,
      keywords: `${member.name} ${member.email} ${member.role}`,
      screen: "collaborators",
    }));
    const tagResults: SearchResult[] = [...statusOrder, "High", "Medium", "Low"].map((tag) => ({
      id: `tag-${tag.toLowerCase().replaceAll(" ", "-")}`,
      section: "tags",
      title: tag,
      detail: "Tag · Used in Tanglad",
      keywords: `${tag} task status priority tag`,
      screen: "board",
    }));
    return [...fixed, ...taskResults, ...peopleResults, ...tagResults];
  }, [tasks]);

  const availableResults = useMemo(() => recentOnly ? allResults.filter((result) => result.dated) : allResults, [allResults, recentOnly]);
  const normalizedQuery = query.trim().toLowerCase();
  const scopedResults = activeTab === "all" ? availableResults : availableResults.filter((result) => result.section === activeTab);
  const matchingResults = scopedResults.filter((result) => !normalizedQuery || `${result.title} ${result.detail} ${result.keywords}`.toLowerCase().includes(normalizedQuery));
  const visibleResults = matchingResults.slice(0, 12);
  const resultCounts = availableResults.reduce<Record<SearchSection, number>>((counts, result) => {
    counts.all += 1;
    counts[result.section] += 1;
    return counts;
  }, { all: 0, boards: 0, updates: 0, files: 0, people: 0, tags: 0, docs: 0 });
  const searchTabs: Array<{ id: SearchSection; label: string }> = [
    { id: "all", label: `All ${resultCounts.all}` },
    { id: "boards", label: `Boards ${resultCounts.boards}` },
    { id: "updates", label: `Updates ${resultCounts.updates}` },
    { id: "files", label: `Files ${resultCounts.files}` },
    { id: "people", label: `People ${resultCounts.people}` },
    { id: "tags", label: `Tags ${resultCounts.tags}` },
    { id: "docs", label: `Docs ${resultCounts.docs}` },
  ];

  const chooseTab = (tab: SearchSection, index: number, event?: React.KeyboardEvent<HTMLButtonElement>) => {
    setPreparing(false);
    setActiveTab(tab);
    if (!event) return;
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % searchTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + searchTabs.length) % searchTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = searchTabs.length - 1;
    else return;
    event.preventDefault();
    const nextTab = searchTabs[nextIndex].id;
    setActiveTab(nextTab);
    window.requestAnimationFrame(() => document.getElementById(`tl-search-tab-${nextTab}`)?.focus());
  };

  return (
    <MotionConfig reducedMotion="never">
      <m.div className="tl-search-layer" {...searchLayerMotion}>
        <m.div className="tl-search-scrim" onClick={onClose} aria-hidden="true" />
        <m.section ref={dialogRef} className="tl-search-dialog" id="tl-search-dialog" role="dialog" aria-modal="true" aria-labelledby="tl-search-title" aria-describedby="tl-search-description" {...searchDialogMotion}>
          <header className="tl-search-head">
            <MagnifyingGlass weight="bold" />
            <label htmlFor="tl-search-input" className="sr-only">Search everything in Tanglad</label>
            <input id="tl-search-input" type="search" value={query} onChange={(event) => { setPreparing(false); setQuery(event.target.value); }} placeholder="Search everything..." autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} />
            <kbd>Ctrl K</kbd>
            <button type="button" onClick={onClose} aria-label="Close search" title="Close search"><X /></button>
          </header>

          <div className="tl-search-controls">
            <div className="tl-search-tabs" role="tablist" aria-label="Search categories">
              {searchTabs.map((tab, index) => {
                const isActive = tab.id === activeTab;
                return (
                  <button key={tab.id} id={`tl-search-tab-${tab.id}`} type="button" role="tab" aria-selected={isActive} aria-controls="tl-search-results" tabIndex={isActive ? 0 : -1} className={isActive ? "is-active" : ""} onClick={() => chooseTab(tab.id, index)} onKeyDown={(event) => chooseTab(tab.id, index, event)}>
                    {tab.label}
                    {isActive && <m.span className="tl-search-tab-indicator" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ type: "spring", stiffness: 620, damping: 38, mass: 0.42 }} style={{ originX: 0.5 }} />}
                  </button>
                );
              })}
            </div>
            <button type="button" className={`tl-search-date-filter ${recentOnly ? "is-active" : ""}`} onClick={() => { setPreparing(false); setRecentOnly((value) => !value); }} aria-pressed={recentOnly}><FunnelSimple />{recentOnly ? "Recent only" : "Filter by date"}</button>
          </div>

          <span className="sr-only" id="tl-search-title">Search everything</span>
          <span className="sr-only" id="tl-search-description">Search boards, updates, files, people, tags, and documents across Main workspace.</span>

          <div className="tl-search-body" id="tl-search-results" role="tabpanel" aria-labelledby={`tl-search-tab-${activeTab}`}>
            <AnimatePresence initial={false}>
              {preparing ? (
                <m.div className="tl-search-loading-panel" key="search-loading" {...searchContentMotion}>
                  <TangladSearchLoader />
                </m.div>
              ) : (
                <m.div className="tl-search-results-panel" key={`${activeTab}-${recentOnly}`} {...searchContentMotion}>
                  <div className="tl-search-results-heading">
                    <div><strong>{normalizedQuery ? `Results for “${query.trim()}”` : "Recent in Main workspace"}</strong><small>{matchingResults.length} {matchingResults.length === 1 ? "result" : "results"} in this view</small></div>
                    <kbd>Esc</kbd>
                  </div>
                  <span className="sr-only" role="status" aria-live="polite">{matchingResults.length} search results</span>
                  {visibleResults.length ? (
                    <div className="tl-search-results-grid">
                      {visibleResults.map((result) => (
                        <button type="button" key={result.id} onClick={() => navigate(result.screen)}>
                          <span className={`tl-search-result-icon is-${result.section}`}><SearchResultGlyph section={result.section} /></span>
                          <span><strong>{result.title}</strong><small>{result.detail}</small></span>
                          <span className="tl-search-result-type">{searchSectionName(result.section)}</span>
                          <CaretRight />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="tl-search-empty">
                      <span><MagnifyingGlass /></span>
                      <h2>No results found</h2>
                      <p>Try a task name, teammate, status, or board.</p>
                      {query && <button type="button" className="tl-outline-button" onClick={() => setQuery("")}>Clear search</button>}
                    </div>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </m.section>
      </m.div>
    </MotionConfig>
  );
}

function searchSectionName(section: SearchResult["section"]) {
  return ({ boards: "Board", updates: "Update", files: "File", people: "Person", tags: "Tag", docs: "Doc" } as const)[section];
}

function SearchResultGlyph({ section }: { section: SearchResult["section"] }) {
  if (section === "boards") return <Rows />;
  if (section === "updates") return <ClockCounterClockwise />;
  if (section === "files") return <FolderSimple />;
  if (section === "people") return <UsersThree />;
  if (section === "tags") return <Tag />;
  return <FileText />;
}

function TangladSearchLoader() {
  return (
    <div className="tl-search-loader" role="status" aria-live="polite">
      <svg viewBox="0 0 460 220" role="img" aria-label="Tanglad work signals weaving into an organized workspace">
        <defs>
          <linearGradient id="tl-loader-mark" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#0b78e3" /><stop offset="1" stopColor="#0055bd" /></linearGradient>
          <filter id="tl-loader-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#1b4f89" floodOpacity="0.16" /></filter>
        </defs>

        <g className="tl-search-loader-grid" aria-hidden="true">
          <path d="M82 74H378M82 110H378M82 146H378" />
          <path d="M170 30V190M230 30V190M290 30V190" />
        </g>

        <m.path d="M146 54C180 54 184 88 207 99" className="tl-loader-thread" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [0, 0.75, 0.35] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
        <m.path d="M300 50C270 50 273 85 253 99" className="tl-loader-thread is-mint" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0.3] }} transition={{ duration: 2.8, delay: 0.16, repeat: Infinity, ease: "easeInOut" }} />
        <m.path d="M180 174C192 150 205 141 216 130" className="tl-loader-thread is-amber" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [0, 0.65, 0.28] }} transition={{ duration: 2.8, delay: 0.32, repeat: Infinity, ease: "easeInOut" }} />
        <m.path d="M286 170C272 151 257 143 246 130" className="tl-loader-thread is-violet" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [0, 0.65, 0.28] }} transition={{ duration: 2.8, delay: 0.48, repeat: Infinity, ease: "easeInOut" }} />

        {searchSignals.map((signal) => (
          <m.g key={`${signal.x}-${signal.y}`} custom={signal.delay} variants={searchSignalVariants} initial="initial" animate="animate" filter="url(#tl-loader-shadow)">
            <rect x={signal.x} y={signal.y} width={signal.width} height="28" rx="8" fill={signal.fill} />
            <circle cx={signal.x + 16} cy={signal.y + 14} r="5" fill={signal.accent} />
            <rect x={signal.x + 29} y={signal.y + 10} width={signal.width - 43} height="8" rx="4" fill={signal.accent} opacity="0.72" />
          </m.g>
        ))}

        <m.g animate={{ scale: [0.94, 1.04, 1, 1], rotate: [0, -2, 0, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} style={{ originX: 0.5, originY: 0.5 }} filter="url(#tl-loader-shadow)">
          <rect x="204" y="84" width="52" height="52" rx="14" fill="url(#tl-loader-mark)" />
          <circle cx="221" cy="101" r="6" fill="#fff" /><circle cx="239" cy="101" r="6" fill="#fff" />
          <circle cx="221" cy="119" r="6" fill="#fff" /><circle cx="239" cy="119" r="6" fill="#fff" />
        </m.g>

        <m.g animate={{ x: [-112, -112, 0, 0, 0, -112], y: [58, 58, 0, -5, 0, 58], rotate: [-8, -8, 2, -2, 0, -8], opacity: [0, 1, 1, 1, 1, 0] }} transition={{ duration: 2.8, times: [0, 0.12, 0.48, 0.6, 0.78, 1], repeat: Infinity, ease: [0.2, 0, 0, 1] }} style={{ originX: 0.5, originY: 0.5 }} filter="url(#tl-loader-shadow)">
          <rect x="190" y="148" width="80" height="24" rx="7" fill="#ffffff" />
          <rect x="200" y="156" width="38" height="8" rx="4" fill="#77b7f7" />
          <circle cx="254" cy="160" r="6" fill="#40c9a2" />
        </m.g>

        <m.circle cx="174" cy="112" r="5" fill="#40c9a2" animate={{ scale: [0.7, 1.25, 0.7], opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }} />
        <m.circle cx="285" cy="105" r="4" fill="#f4b942" animate={{ y: [-4, 5, -4], opacity: [0.45, 1, 0.45] }} transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }} />
        <m.circle cx="275" cy="132" r="4" fill="#7568f5" animate={{ x: [-5, 4, -5], scale: [0.85, 1.15, 0.85] }} transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }} />
      </svg>
      <m.div className="tl-search-loader-status" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.35 }}>
        <span aria-hidden="true"><i /><i /><i /></span>
        <strong>Weaving your workspace together</strong>
      </m.div>
      <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.45 }}>Tip: Search tasks, people, statuses, and boards from one place.</m.p>
    </div>
  );
}

type WorkspaceBrowserFilter = "all" | "recent" | "owner" | "member" | "collaborator";

function WorkspaceBrowser({ onClose, onSelect, onCreate }: { onClose: () => void; onSelect: (name: string) => void; onCreate: () => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<WorkspaceBrowserFilter>("recent");
  const searchRef = useRef<HTMLInputElement>(null);
  const workspaces = [
    { name: "Main workspace", role: "Owner", recent: true, mark: "main" },
    { name: "New Workspace", role: "Owner", recent: true, mark: "new" },
  ] as const;

  useEffect(() => {
    searchRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleWorkspaces = workspaces.filter((workspace) => {
    const matchesQuery = !normalizedQuery || `${workspace.name} ${workspace.role}`.toLowerCase().includes(normalizedQuery);
    const matchesFilter = filter === "all" || (filter === "recent" && workspace.recent) || workspace.role.toLowerCase() === filter;
    return matchesQuery && matchesFilter;
  });
  const heading = filter === "recent" ? "Recent workspaces" : filter === "all" ? "All workspaces" : `${filter[0].toUpperCase()}${filter.slice(1)} workspaces`;

  return (
    <m.div className="tl-workspace-browser-layer" {...inviteLayerMotion}>
      <m.button className="tl-workspace-browser-scrim" onClick={onClose} aria-label="Close workspace browser" {...inviteLayerMotion} />
      <m.section className="tl-workspace-browser" role="dialog" aria-modal="true" aria-labelledby="workspace-browser-title" {...inviteDialogMotion}>
        <header className="tl-workspace-browser-head">
          <h2 id="workspace-browser-title">Browse all workspaces</h2>
          <div className="tl-workspace-browser-tools">
            <label className="tl-workspace-browser-search"><MagnifyingGlass /><span className="sr-only">Search workspaces</span><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for a workspace" /></label>
            <button className="tl-workspace-browser-filter" type="button" onClick={() => setFilter((value) => value === "all" ? "recent" : "all")} aria-pressed={filter === "all"}><FunnelSimple />Filter</button>
          </div>
          <button className="tl-workspace-browser-close" onClick={onClose} aria-label="Close workspace browser" title="Close workspace browser"><X /></button>
        </header>

        <div className="tl-workspace-browser-body">
          <nav className="tl-workspace-browser-sidebar" aria-label="Workspace filters">
            <button className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}><CirclesFour />All workspaces</button>
            <button className={filter === "recent" ? "is-active" : ""} onClick={() => setFilter("recent")}><ClockCounterClockwise />Recent workspaces</button>
            <span>My workspaces</span>
            <button className={filter === "owner" ? "is-active" : ""} onClick={() => setFilter("owner")}><CrownSimple />Owner</button>
            <button className={filter === "member" ? "is-active" : ""} onClick={() => setFilter("member")}><User />Member</button>
            <button className={filter === "collaborator" ? "is-active" : ""} onClick={() => setFilter("collaborator")}><UsersThree />Collaborator</button>
            <button className="tl-workspace-browser-create tl-blue-button" onClick={onCreate}><Plus />Create workspace</button>
          </nav>

          <main className="tl-workspace-browser-content">
            <h1>{heading}</h1>
            {visibleWorkspaces.length ? <div className="tl-workspace-browser-grid">
              {visibleWorkspaces.map((workspace) => <button className="tl-workspace-browser-card" key={workspace.name} onClick={() => onSelect(workspace.name)}>
                <span className={`tl-workspace-browser-mark is-${workspace.mark}`}>
                  {workspace.mark === "main" ? <><strong className="tl-workspace-browser-initial">M</strong><House weight="fill" /></> : <strong>N</strong>}
                </span>
                <strong>{workspace.name}</strong>
                <span>{workspace.role}</span>
                <CaretRight />
              </button>)}
            </div> : <div className="tl-workspace-browser-empty"><CirclesFour /><h2>No workspaces found</h2><p>Try another search or filter.</p></div>}
          </main>
        </div>
      </m.section>
    </m.div>
  );
}

function WorkspaceCreateModal({ onClose, setToast }: { onClose: () => void; setToast: (message: string) => void }) {
  const [name, setName] = useState("New Workspace");
  const [privacy, setPrivacy] = useState<"open" | "closed">("open");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const submit = () => {
    const workspaceName = name.trim();
    if (!workspaceName) return;
    setToast(`${workspaceName} will be created as a ${privacy} workspace`);
    onClose();
  };
  const mark = name.trim().charAt(0).toUpperCase() || "N";

  return (
    <m.div className="tl-modal-layer" {...inviteLayerMotion}>
      <m.button className="tl-modal-scrim" onClick={onClose} aria-label="Close add workspace dialog" {...inviteLayerMotion} />
      <m.section className="tl-workspace-create-modal" role="dialog" aria-modal="true" aria-labelledby="workspace-create-title" {...inviteDialogMotion}>
        <header><h2 id="workspace-create-title">Add new workspace</h2><button onClick={onClose} aria-label="Close add workspace dialog" title="Close add workspace dialog"><X /></button></header>
        <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
          <div className="tl-workspace-create-mark" aria-hidden="true">{mark}</div>
          <label className="tl-workspace-create-field"><span>Workspace name</span><input ref={nameRef} value={name} onChange={(event) => setName(event.target.value)} required /></label>
          <fieldset className="tl-workspace-create-privacy"><legend>Privacy</legend><label><input type="radio" name="workspace-privacy" checked={privacy === "open"} onChange={() => setPrivacy("open")} /><span>Open</span></label><label><input type="radio" name="workspace-privacy" checked={privacy === "closed"} onChange={() => setPrivacy("closed")} /><span>Closed</span></label></fieldset>
          <p>{privacy === "open" ? "Every team member in the account can join" : "Only invited people can join this workspace"}</p>
          <footer><button type="button" className="tl-workspace-create-cancel" onClick={onClose}>Cancel</button><button type="submit" className="tl-blue-button">Add workspace</button></footer>
        </form>
      </m.section>
    </m.div>
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
    <m.div className="tl-modal-layer" {...inviteLayerMotion}>
      <m.button className="tl-modal-scrim" onClick={onClose} aria-label="Close invite dialog" {...inviteLayerMotion} />
      <m.section className="tl-invite-modal" role="dialog" aria-modal="true" aria-labelledby="invite-title" {...inviteDialogMotion}>
        <header><h2 id="invite-title">Invite to Tanglad</h2><button onClick={onClose} aria-label="Close invite dialog" title="Close invite dialog"><X /></button></header>
        <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
          <div className="tl-invite-modal-row"><label>Invite with email</label><button type="button" className="tl-outline-button" onClick={() => setToast("Workspace directory is ready for product integration")}><UsersThree />Workspace directory</button></div>
          <div className="tl-email-composer"><textarea value={emails} onChange={(event) => setEmails(event.target.value)} placeholder="Name@example.com, Name@example.com ..." rows={2} aria-label="Email addresses" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-gramm="false" data-enable-grammarly="false" data-1p-ignore="true" required /><select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Invite role"><option>Member</option><option>Viewer</option></select></div>
          <label className="tl-invite-message"><span>Write a message (optional)</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add context for new members" rows={3} /></label>
          <footer><button type="button" className="tl-outline-button" onClick={onClose}>Cancel</button><button type="submit" className="tl-blue-button">Invite</button></footer>
        </form>
      </m.section>
    </m.div>
  );
}

function UtilityButton({ icon, label, active, onClick, controls, expanded }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; controls?: string; expanded?: boolean }) {
  return <button className={`tl-utility-button ${active ? "is-active" : ""}`} onClick={onClick} title={label} aria-controls={controls} aria-expanded={expanded}>{icon}<span>{label}</span></button>;
}

function ManageWorkspaceScreen({ activeTab, setActiveTab, navigate, members, cover, changeCover, setToast }: {
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
  const [animationsReady, setAnimationsReady] = useState(false);

  useEffect(() => setAnimationsReady(true), []);

  return (
    <MotionConfig reducedMotion="never">
      <div className={className} role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <m.button key={item.id} type="button" className={isActive ? "is-active" : ""} onClick={() => onChange(item.id)} role="tab" aria-selected={isActive} whileTap={{ scale: 0.98 }}>
              {item.icon}<span>{item.label}</span>
              {isActive && (
                <m.span
                  key={`${id}-${item.id}`}
                  className="tl-tab-indicator"
                  initial={animationsReady ? { scaleX: 0 } : false}
                  animate={{ scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 650, damping: 38, mass: 0.4 }}
                  style={{ originX: 0.5, willChange: "transform" }}
                >
                  <span className="tl-tab-indicator-core" />
                </m.span>
              )}
            </m.button>
          );
        })}
      </div>
    </MotionConfig>
  );
}

function WorkspaceRecents({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <section className="tl-list-section" aria-labelledby="recent-heading">
      <div className="tl-section-heading"><h2 id="recent-heading">Recently opened</h2><button onClick={() => navigate("board")}>View all content</button></div>
      <div className="tl-content-list">
        <button onClick={() => navigate("board")}><span className="tl-file-icon is-board"><Rows /></span><span><strong>Tanglad</strong><small>Board</small></span><span>Opened today</span><Star /></button>
        <button onClick={() => navigate("insights")}><span className="tl-file-icon is-report"><ChartBar /></span><span><strong>Team workload</strong><small>Insights</small></span><span>Opened yesterday</span><Star /></button>
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
        <button onClick={() => navigate("insights")}><span className="tl-file-icon is-report"><ChartBar /></span><span><strong>Team insights</strong><small>Owned by Inez Kim</small></span><span>Dashboard</span><span>Yesterday</span><DotsThree /></button>
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

function MyWorkScreen({ tasks, view, activeOnly, cycleStatus, setToast }: { tasks: Task[]; view: MyWorkView; activeOnly: boolean; cycleStatus: (id: number) => void; setToast: (message: string) => void }) {
  const mine = tasks.filter((task) => task.owner === "MC" && (!activeOnly || task.status !== "Done"));
  return (
    <div className="tl-standard-page">
      <PageHeader title="My work" description="Tasks assigned to Mara across Main workspace." />
      {view === "table" ? <><div className="tl-summary-line"><span><strong>{mine.length}</strong> assigned</span><span><strong>{mine.filter((task) => task.status === "Done").length}</strong> completed</span><span><strong>{mine.filter((task) => task.status === "Blocked").length}</strong> blocked</span></div>{mine.length ? <TaskTable tasks={mine} cycleStatus={cycleStatus} setToast={setToast} /> : <EmptySearch />}</> : <MyWorkCalendar tasks={mine} />}
    </div>
  );
}

function MyWorkCalendar({ tasks }: { tasks: Task[] }) {
  const days = ["Mon 18", "Tue 19", "Wed 20", "Thu 21", "Fri 22"];
  return <section className="tl-calendar-view" aria-label="My work calendar"><div className="tl-calendar-grid">{days.map((day, index) => <div className="tl-calendar-day" key={day}><strong>{day}</strong><span>{index < 2 ? `${index + 1} task${index === 0 ? "" : "s"}` : "Open"}</span>{tasks.filter((task) => task.due.includes(String(19 + index))).slice(0, 2).map((task) => <div className="tl-calendar-task" key={task.id}><span className={`tl-calendar-dot status-${task.status.toLowerCase().replaceAll(" ", "-")}`} /><b>{task.name}</b></div>)}</div>)}</div></section>;
}

type UpdateFeedPanelTab = "all" | "mentioned" | "bookmarked" | "account" | "scheduled";

function UpdateFeedPanel({ onClose, setToast }: { onClose: () => void; setToast: (message: string) => void }) {
  const [tab, setTab] = useState<UpdateFeedPanelTab>("all");
  const [boardFilter, setBoardFilter] = useState<"all" | "without">("all");
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [showFilterOpen, setShowFilterOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const showFilterRef = useRef<HTMLDivElement>(null);
  const updates = [
    { person: members[1], title: "Inez mentioned you in Launch page copy", body: "Can you check the final section before review?", time: "12 min ago", board: "Launch roadmap", unread: true, mentioned: true, bookmarked: false, scheduled: false },
    { person: members[2], title: "Rafi changed a task to Review", body: "Workspace permissions is ready for a second pass.", time: "1 hour ago", board: "Tanglad", unread: true, mentioned: false, bookmarked: true, scheduled: false },
    { person: members[3], title: "Sam joined Main workspace", body: "Sam can now view Tanglad and Launch notes.", time: "Yesterday", board: "", unread: false, mentioned: false, bookmarked: false, scheduled: true },
  ];

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (showFilterOpen) {
        setShowFilterOpen(false);
        return;
      }
      onClose();
    };
    const closeFilterOnPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!showFilterRef.current?.contains(target)) setShowFilterOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeFilterOnPointerDown);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeFilterOnPointerDown);
    };
  }, [onClose, showFilterOpen]);

  const filteredUpdates = updates.filter((update) => {
    if (boardFilter === "without" && update.board) return false;
    if (tab === "mentioned" && !update.mentioned) return false;
    if (tab === "bookmarked" && !update.bookmarked) return false;
    if (tab === "scheduled" && !update.scheduled) return false;
    return !unreadOnly || update.unread;
  });
  const activeUpdate = filteredUpdates[0] ?? updates[0];
  const tabs: Array<{ id: UpdateFeedPanelTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: "all", label: "All updates", icon: <TrayIcon />, badge: "3" },
    { id: "mentioned", label: "I was mentioned", icon: <At />, badge: "1" },
    { id: "bookmarked", label: "Bookmarked", icon: <BookmarkSimple /> },
    { id: "account", label: "All account", icon: <Briefcase /> },
    { id: "scheduled", label: "Scheduled", icon: <PaperPlaneTilt />, badge: "New" },
  ];

  return (
    <m.div className="tl-update-feed-layer" {...inviteLayerMotion}>
      <m.button className="tl-update-feed-scrim" onClick={onClose} aria-label="Close update feed" {...inviteLayerMotion} />
      <m.section className="tl-update-feed-dialog" role="dialog" aria-modal="true" aria-labelledby="update-feed-title" {...inviteDialogMotion}>
        <aside className="tl-update-feed-sidebar">
          <header><h2 id="update-feed-title">Update feed</h2><ChatCircle /></header>
          <p>What goes in my feed? <button onClick={() => setToast("Feed guidance is ready for product integration")}>See more</button></p>
          <div className="tl-update-feed-board-head"><h3>Filter by Board</h3><button onClick={() => setToast("Feed settings are ready for product integration")} aria-label="Feed settings" title="Feed settings"><Gear /><span>Feed settings</span></button></div>
          <nav aria-label="Update feed board filters">
            <button className={boardFilter === "all" ? "is-active" : ""} onClick={() => setBoardFilter("all")}><span>All boards in my feed</span><b>1</b></button>
            <button className={boardFilter === "without" ? "is-active" : ""} onClick={() => setBoardFilter("without")}><span>Updates without boards</span><b>1</b></button>
          </nav>
        </aside>

        <div className="tl-update-feed-content">
          <header className="tl-update-feed-tabs" role="tablist" aria-label="Update feed categories">
            {tabs.map((item) => <button key={item.id} role="tab" aria-selected={tab === item.id} className={tab === item.id ? "is-active" : ""} onClick={() => setTab(item.id)}>{item.icon}<span>{item.label}</span>{item.badge && <small className={item.badge === "New" ? "is-new" : ""}>{item.badge}</small>}</button>)}
            <button ref={closeRef} className="tl-update-feed-close" onClick={onClose} aria-label="Close update feed" title="Close update feed"><X /></button>
          </header>
          <div className="tl-update-feed-toolbar">
            <div ref={showFilterRef} className="tl-update-feed-filter">
              <button type="button" aria-haspopup="menu" aria-expanded={showFilterOpen} onClick={() => setShowFilterOpen((value) => !value)}><strong>Show</strong> {unreadOnly ? "Unread updates" : "Read and Unread updates"}<CaretDown /></button>
              {showFilterOpen && <div className="tl-update-feed-filter-menu" role="menu" aria-label="Update visibility">
                <button type="button" role="menuitemradio" aria-checked={!unreadOnly} className={!unreadOnly ? "is-active" : ""} onClick={() => { setUnreadOnly(false); setShowFilterOpen(false); }}>Read and Unread updates</button>
                <button type="button" role="menuitemradio" aria-checked={unreadOnly} className={unreadOnly ? "is-active" : ""} onClick={() => { setUnreadOnly(true); setShowFilterOpen(false); }}>Unread updates</button>
              </div>}
            </div>
          </div>
          <main className="tl-update-feed-main">
            <article className="tl-update-feed-card">
              <header><Avatar member={activeUpdate.person} /><div><strong>{activeUpdate.person.name}</strong><small>{activeUpdate.time}</small></div><button className="tl-update-feed-read" onClick={() => setToast("Update marked as read")} aria-label="Mark update as read" title="Mark update as read"><Check /></button></header>
              <p>Hi <span className="tl-update-feed-mention">@Mara Cruz</span>,<br />We’re glad you’re here.<br />This is the beginning of your team’s journey to <strong>exceptional teamwork.</strong></p>
              <ol><li><strong>Plan and manage work:</strong> Keep complex projects organized in one place.</li><li><strong>Adjust to your exact needs:</strong> Make the board fit the way your team works.</li><li><strong>Easy onboarding:</strong> Start quickly with a clear, guided workspace.</li></ol>
              <button className="tl-update-feed-more" onClick={() => setToast("Full update details are ready for product integration")}>… See more</button>
            </article>
          </main>
        </div>
      </m.section>
    </m.div>
  );
}

function HelpMenu({ onClose, setToast, menuRef }: { onClose: () => void; setToast: (message: string) => void; menuRef: React.RefObject<HTMLDivElement | null> }) {
  const [showGettingStarted, setShowGettingStarted] = useState(true);
  const actions = [
    { label: "Contact support", icon: <ChatCircle /> },
    { label: "Hire an expert", icon: <UserPlus /> },
    { label: "Support history", icon: <Flag /> },
    { label: "Contact our CEO", icon: <Lightbulb /> },
    { label: "Explore & learn", icon: <BookOpen />, arrow: true },
    { label: "What’s new", icon: <Gift /> },
  ];
  const choose = (label: string) => {
    setToast(`${label} is ready for product integration`);
    onClose();
  };

  return (
    <m.div ref={menuRef} className="tl-help-menu" role="menu" aria-label="Help menu" {...inviteDialogMotion}>
      <div className="tl-help-menu-actions">
        {actions.map((action) => <button key={action.label} role="menuitem" onClick={() => choose(action.label)}>{action.icon}<span>{action.label}</span>{action.arrow && <CaretRight />}</button>)}
      </div>
      {showGettingStarted && <section className="tl-help-getting-started"><header><RocketLaunch /><button onClick={() => setShowGettingStarted(false)} aria-label="Dismiss getting started" title="Dismiss getting started"><X /></button></header><strong>Get started</strong><p>Set up Tanglad to work the way your team does.</p><button onClick={() => choose("Getting started")}>Get started</button></section>}
      <button className="tl-help-privacy" onClick={() => choose("Privacy Policy")}>Privacy Policy</button>
    </m.div>
  );
}

function UpdateFeedScreen({ filter, navigate, setToast }: { filter: UpdateFilter; navigate: (screen: Screen) => void; setToast: (message: string) => void }) {
  const [selected, setSelected] = useState(0);
  const [reply, setReply] = useState("");
  useEffect(() => setSelected(filter === "assigned" ? 1 : 0), [filter]);
  const updates = [
    { person: members[1], title: "Inez mentioned you in Launch page copy", body: "Can you check the final section before review?", time: "12 min" },
    { person: members[2], title: "Rafi changed a task to Review", body: "Workspace permissions is ready for a second pass.", time: "1 hour" },
    { person: members[3], title: "Sam joined Main workspace", body: "Sam can now view Tanglad and Launch notes.", time: "Yesterday" },
  ];
  return (
    <div className="tl-standard-page tl-inbox-page">
      <PageHeader title="Update feed" description="Updates, mentions, and workspace activity." actions={<button className="tl-outline-button" onClick={() => setToast("All updates marked as read")}><Check />Mark all read</button>} />
      <div className="tl-inbox-layout">
        <div className="tl-inbox-list">
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

function InsightsScreen({ tasks, members: team, navigate, setToast }: { tasks: Task[]; members: Member[]; navigate: (screen: Screen) => void; setToast: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTasks = tasks.filter((task) => !normalizedQuery || `${task.name} ${task.ownerName} ${task.status} ${task.priority}`.toLowerCase().includes(normalizedQuery));
  const allTasks = filteredTasks.length;
  const inProgress = filteredTasks.filter((task) => task.status === "Working on it" || task.status === "Review").length;
  const stuck = filteredTasks.filter((task) => task.status === "Blocked").length;
  const done = filteredTasks.filter((task) => task.status === "Done").length;
  const working = filteredTasks.filter((task) => task.status === "Working on it" || task.status === "Review").length;
  const workingPercent = allTasks ? (working / allTasks) * 100 : 0;
  const donePercent = allTasks ? (done / allTasks) * 100 : 0;
  const ownerCounts = team.map((member) => ({ member, count: filteredTasks.filter((task) => task.owner === member.initials).length }));
  const ownerMax = Math.max(1, ...ownerCounts.map(({ count }) => count));
  const overdueTasks = filteredTasks.filter((task) => Number(task.due.match(/\d+/)?.[0] ?? 0) < 21);
  const overdueByStatus = [
    { label: "Working", value: overdueTasks.filter((task) => task.status === "Working on it" || task.status === "Review").length, tone: "amber" },
    { label: "Stuck", value: overdueTasks.filter((task) => task.status === "Blocked").length, tone: "rose" },
    { label: "Done", value: overdueTasks.filter((task) => task.status === "Done").length, tone: "green" },
  ];
  const dueDates = Array.from(new Set(filteredTasks.map((task) => task.due))).sort((a, b) => Number(a.match(/\d+/)?.[0] ?? 0) - Number(b.match(/\d+/)?.[0] ?? 0));
  const dueMax = Math.max(1, ...dueDates.map((date) => filteredTasks.filter((task) => task.due === date).length));
  const showToast = (message: string) => setToast(message);

  return (
    <div className="tl-standard-page tl-insights-page">
      <header className="tl-insights-header">
        <h1>Insights</h1>
        <div className="tl-insights-header-actions">
          <button className="tl-outline-button" onClick={() => showToast("Insights export is ready for product integration")}>Export <CaretDown /></button>
          <button className="tl-outline-button" onClick={() => showToast("Invite flow opened from Insights")}><UserPlus />Invite</button>
          <button onClick={() => showToast("Insights options are ready for product integration")} aria-label="Insights options" title="Insights options"><DotsThree /></button>
        </div>
      </header>

      <div className="tl-insights-toolbar">
        <button className="tl-blue-button" onClick={() => showToast("Widget picker is ready for product integration")}><Plus />Add widget</button>
        <button className="tl-insights-source" onClick={() => navigate("board")}><Rows /><span><strong>1 connected board</strong><small>Tanglad</small></span><CaretRight /></button>
        <label className="tl-insights-search"><MagnifyingGlass /><span className="sr-only">Filter insights</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type to filter" /></label>
        <button className="tl-insights-save" onClick={() => showToast("Insights view saved")} aria-label="Save insights view" title="Save insights view"><Check /></button>
        <button className="tl-insights-control" onClick={() => showToast("People filter is ready for product integration")}><UsersThree />People</button>
        <button className="tl-insights-control" onClick={() => showToast("Global insight filters are ready for product integration")}><FunnelSimple />Filter</button>
        <div className="tl-insights-view-actions">
          <button onClick={() => navigate("permissions")}><Gear />Settings</button>
        </div>
      </div>

      <div className="tl-insights-kpis">
        <InsightMetric label="All tasks" value={allTasks} tone="blue" onFilter={() => showToast("All tasks filter options are ready")} onMenu={() => showToast("All tasks metric options are ready")} />
        <InsightMetric label="In progress" value={inProgress} tone="amber" onFilter={() => showToast("In progress filter options are ready")} onMenu={() => showToast("In progress metric options are ready")} />
        <InsightMetric label="Stuck" value={stuck} tone="rose" onFilter={() => showToast("Stuck filter options are ready")} onMenu={() => showToast("Stuck metric options are ready")} />
        <InsightMetric label="Done" value={done} tone="green" onFilter={() => showToast("Done filter options are ready")} onMenu={() => showToast("Done metric options are ready")} />
      </div>

      <div className="tl-insights-grid tl-insights-middle-grid">
        <InsightWidget title="Tasks by status" onMenu={() => showToast("Status widget options are ready")}>
          <div className="tl-status-donut" style={{ background: `conic-gradient(#e3b64f 0 ${workingPercent}%, #65b38a ${workingPercent}% ${workingPercent + donePercent}%, #d7656f ${workingPercent + donePercent}% 100%)` }}><div><strong>{allTasks}</strong><span>tasks</span></div></div>
          <div className="tl-insights-legend"><span><i className="is-amber" />Working on it <b>{working}</b></span><span><i className="is-green" />Done <b>{done}</b></span><span><i className="is-rose" />Stuck <b>{stuck}</b></span></div>
        </InsightWidget>
        <InsightWidget title="Tasks by owner" onMenu={() => showToast("Owner widget options are ready")}>
          <div className="tl-owner-chart" role="img" aria-label="Task counts by owner">
            <div className="tl-owner-y-axis" aria-hidden="true">{[ownerMax, ownerMax * 0.75, ownerMax * 0.5, ownerMax * 0.25, 0].map((tick) => <span key={tick}>{Number.isInteger(tick) ? tick : tick.toFixed(2).replace(/0$/, "")}</span>)}</div>
            <div className="tl-owner-plot">{ownerCounts.map(({ member, count }) => <div className="tl-owner-bar" key={member.initials}><strong>{count}</strong><i style={{ height: `${Math.max(count ? 10 : 0, (count / ownerMax) * 100)}%` }} /><Avatar member={member} size="small" /></div>)}</div>
          </div>
          <div className="tl-owner-axis">{ownerCounts.map(({ member }) => <span key={member.initials}>{member.name.split(" ")[0]}</span>)}</div>
        </InsightWidget>
      </div>

      <div className="tl-insights-grid tl-insights-bottom-grid">
        <InsightWidget title="Overdue tasks" onMenu={() => showToast("Overdue widget options are ready")}>
          <div className="tl-insights-horizontal-bars">{overdueByStatus.map((item) => <div className="tl-insights-horizontal-bar" key={item.label}><span>{item.label}</span><div><i className={`is-${item.tone}`} style={{ width: `${Math.max(item.value ? 12 : 0, (item.value / Math.max(1, overdueTasks.length)) * 100)}%` }} /></div><b>{item.value}</b></div>)}</div>
        </InsightWidget>
        <InsightWidget title="Tasks by due date" onMenu={() => showToast("Due date widget options are ready")}>
          <div className="tl-due-chart" role="img" aria-label="Tasks grouped by due date">{dueDates.map((date) => <div className="tl-due-bar" key={date}><strong>{filteredTasks.filter((task) => task.due === date).length}</strong><i style={{ height: `${Math.max(8, (filteredTasks.filter((task) => task.due === date).length / dueMax) * 100)}%` }} /><span>{date.replace("Aug ", "")}</span></div>)}</div>
        </InsightWidget>
      </div>
    </div>
  );
}

function InsightMetric({ label, value, tone, onFilter, onMenu }: { label: string; value: number; tone: string; onFilter: () => void; onMenu: () => void }) {
  return <article className={`tl-insight-metric is-${tone}`}><div><span className="tl-insight-label"><DotsSixVertical weight="bold" /><span>{label}</span></span><span className="tl-insight-metric-actions"><button onClick={onFilter} aria-label={`Filter ${label}`} title={`Filter ${label}`}><FunnelSimple weight="bold" /></button><button onClick={onMenu} aria-label={`${label} options`} title={`${label} options`}><DotsThree weight="bold" /></button></span></div><strong>{value}</strong></article>;
}

function InsightWidget({ title, onMenu, children }: { title: string; onMenu: () => void; children: React.ReactNode }) {
  return <section className="tl-insight-widget"><header><div><span className="tl-insight-widget-title"><DotsSixVertical className="tl-insight-widget-drag" weight="bold" /><h2>{title}</h2><button onClick={onMenu} aria-label={`Filter ${title}`} title={`Filter ${title}`}><FunnelSimple /></button></span></div><button onClick={onMenu} aria-label={`${title} options`} title={`${title} options`}><DotsThree /></button></header>{children}</section>;
}

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return <div className={`tl-bar tone-${tone}`}><span>{label}</span><div><i style={{ width: `${Math.max(8, (value / max) * 100)}%` }} /></div><strong>{value}</strong></div>;
}

function FavoritesScreen() {
  return (
    <div className="tl-standard-page tl-favorites-page">
      <PageHeader title="Favorites" description="Saved boards, updates, and workspace items in one place." />
      <section className="tl-favorites-empty" aria-label="No favorites saved">
        <Star weight="duotone" />
        <h2>No favorites yet</h2>
        <p>Items you save will appear here for quick access.</p>
      </section>
    </div>
  );
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
