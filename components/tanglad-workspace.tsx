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
  CalendarCheck,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChartBar,
  ChatCircle,
  Check,
  CheckSquare,
  CirclesFour,
  ClockCounterClockwise,
  CrownSimple,
  DotsNine,
  DotsSixVertical,
  DotsThree,
  EyeSlash,
  FileText,
  Flag,
  FolderSimple,
  FunnelSimple,
  Gear,
  Gift,
  Heart,
  House,
  Kanban,
  Leaf,
  Lightbulb,
  LinkSimple,
  List,
  ListBullets,
  ListNumbers,
  Lock,
  MagnifyingGlass,
  PencilSimple,
  PaperPlaneTilt,
  Paperclip,
  Plus,
  Question,
  RocketLaunch,
  Rows,
  SidebarSimple,
  SlidersHorizontal,
  Smiley,
  Star,
  Tag,
  TextT,
  ThumbsUp,
  TrayIcon,
  User,
  UserPlus,
  UsersThree,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import "@/app/app/workspace.css";

type Screen = "manage-workspace" | "my-work" | "inbox" | "board" | "docs" | "docs-editor" | "insights" | "collaborators" | "permissions" | "favorites";
type PrimarySection = "workspace" | "my-work" | "inbox" | "favorites";
type WorkspaceTab = "recents" | "content" | "collaborators" | "permissions";
type SearchSection = "all" | "boards" | "updates" | "files" | "people" | "tags" | "docs";
type BoardView = "table" | "calendar" | "kanban";
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

const docTemplates = [
  { title: "Meeting notes", tone: "hunter" },
  { title: "Project brief", tone: "olive" },
  { title: "Project kickoff", tone: "moss" },
  { title: "Weekly update", tone: "sage" },
  { title: "Retrospective", tone: "forest" },
] as const;

const statusOrder: TaskStatus[] = ["Working on it", "Review", "Done", "Blocked"];
const boardName = "Board";
const newBoardTitle = "New Board";

const monthIndexes: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function taskDueParts(due: string) {
  const match = due.match(/^([A-Z][a-z]{2}) (\d{1,2})$/);
  if (!match) return null;
  const month = monthIndexes[match[1]];
  if (month === undefined) return null;
  return { year: 2026, month, day: Number(match[2]) };
}

function calendarDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function taskDateKey(due: string) {
  const parts = taskDueParts(due);
  return parts ? calendarDateKey(parts.year, parts.month, parts.day) : null;
}

function taskDueValue(due: string) {
  const parts = taskDueParts(due);
  return parts ? Date.UTC(parts.year, parts.month, parts.day) : Number.POSITIVE_INFINITY;
}

function calendarDaysForMonth(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: Math.max(35, totalCells) }, (_, index) => {
    const date = new Date(year, monthIndex, index - firstDayOffset + 1);
    return {
      date,
      key: calendarDateKey(date.getFullYear(), date.getMonth(), date.getDate()),
      inMonth: date.getMonth() === monthIndex,
    };
  });
}

const screenLabels: Record<Screen, string> = {
  "manage-workspace": "Manage workspace",
  "my-work": "My work",
  inbox: "Update feed",
  board: boardName,
  docs: "Docs",
  "docs-editor": "New Doc",
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

function WorkspaceAddMenuItem({
  icon,
  label,
  hasSubmenu = false,
  active = false,
  controls,
  onClick,
  onPointerEnter,
  onFocus,
}: {
  icon: ReactNode;
  label: string;
  hasSubmenu?: boolean;
  active?: boolean;
  controls?: string;
  onClick: () => void;
  onPointerEnter?: () => void;
  onFocus?: () => void;
}) {
  return (
    <button
      className={`tl-workspace-add-item ${active ? "is-active" : ""}`}
      type="button"
      role="menuitem"
      aria-haspopup={hasSubmenu ? "menu" : undefined}
      aria-expanded={hasSubmenu ? active : undefined}
      aria-controls={controls}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
    >
      <span className="tl-workspace-add-item-icon">{icon}</span>
      <span>{label}</span>
      {hasSubmenu && <CaretRight aria-hidden="true" />}
    </button>
  );
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
  const [workspaceAddOpen, setWorkspaceAddOpen] = useState(false);
  const [workspaceAddSubmenu, setWorkspaceAddSubmenu] = useState<"board" | "doc" | null>(null);
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
  const workspaceAddMenuRef = useRef<HTMLDivElement>(null);
  const workspaceAddTriggerRef = useRef<HTMLButtonElement>(null);
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
    if (!workspaceAddOpen) return;

    const closeOnPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!workspaceAddMenuRef.current?.contains(target) && !workspaceAddTriggerRef.current?.contains(target)) {
        setWorkspaceAddOpen(false);
        setWorkspaceAddSubmenu(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWorkspaceAddOpen(false);
        setWorkspaceAddSubmenu(null);
        workspaceAddTriggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [workspaceAddOpen]);

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
    setWorkspaceAddOpen(false);
    setWorkspaceAddSubmenu(null);
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
    setToast(`Task added to ${boardName}`);
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
    <div className={`tl-app ${navCollapsed ? "is-nav-collapsed" : ""} ${screen === "docs" || screen === "docs-editor" ? "is-docs-context" : ""}`}>
      <a className="tl-skip-link" href="#tl-main">Skip to content</a>

      <header className="tl-topbar">
        <div className="tl-topbar-brand">
          <button className="tl-mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation" title="Open navigation"><List weight="bold" /></button>
          <button className="tl-wordmark" onClick={() => navigate("manage-workspace")} aria-label="Open Tanglad workspace">
            <AppMark small />
            <strong>Tanglad</strong>
          </button>
        </div>

        <button ref={searchTriggerRef} className="tl-global-search" type="button" onClick={openSearch} aria-haspopup="dialog" aria-expanded={searchOpen} aria-controls="tl-search-dialog">
          <MagnifyingGlass weight="bold" />
          <span>Search for anything</span>
          <kbd>Ctrl K</kbd>
        </button>

        <div className="tl-topbar-actions">
          <button data-tooltip="Notifications" className={notificationsOpen ? "is-open" : ""} onClick={() => setNotificationsOpen((value) => !value)} aria-label="Open notifications" aria-expanded={notificationsOpen}><Bell /><span className="tl-unread-count">3</span></button>
          <button ref={updateFeedTriggerRef} data-tooltip="Update feed" className={updateFeedOpen ? "is-open" : ""} onClick={openUpdateFeed} aria-label="Open update feed" aria-haspopup="dialog" aria-expanded={updateFeedOpen}><TrayIcon /></button>
          <button data-tooltip="Invite members" onClick={() => { setNotificationsOpen(false); setInviteModalOpen(true); }} aria-label="Invite members"><UserPlus /></button>
          <button data-tooltip="Settings" onClick={() => navigate("permissions")} aria-label="Open settings"><Gear /></button>
          <button ref={helpTriggerRef} data-tooltip="Help" className={helpOpen ? "is-open" : ""} onClick={openHelp} aria-label="Open help" aria-haspopup="menu" aria-expanded={helpOpen}><Question /></button>
          <button data-tooltip="App launcher" onClick={() => setToast("App launcher is not connected in this UI preview")} aria-label="Open app launcher"><DotsNine weight="bold" /></button>
          <button data-tooltip="Mara Cruz profile" className="tl-profile" onClick={() => setToast("Profile settings are not connected in this UI preview")} aria-label="Open Mara Cruz profile"><span className="tl-profile-avatar">MC</span></button>
        </div>
      </header>

      <aside className="tl-utility-rail" aria-label="Primary application navigation">
        <UtilityButton
          icon={<CirclesFour />}
          label="Workspace"
          active={primarySection === "workspace" && screen !== "docs" && screen !== "docs-editor"}
          onClick={openWorkspaceNavigation}
        />
        <UtilityButton icon={<CalendarCheck />} label="My work" active={primarySection === "my-work"} onClick={() => openParent("my-work")} />
        <span className="tl-rail-divider" />
        <UtilityButton icon={<Star />} label="Favorites" active={primarySection === "favorites"} onClick={() => openParent("favorites")} />
        <UtilityButton icon={<FileText />} label="Docs" active={screen === "docs" || screen === "docs-editor"} onClick={() => navigate("docs", "workspace")} />
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
            <button
              ref={workspaceAddTriggerRef}
              className={`tl-workspace-add ${workspaceAddOpen ? "is-open" : ""}`}
              onClick={() => {
                setWorkspaceMenuOpen(false);
                setWorkspaceAddSubmenu(null);
                setWorkspaceAddOpen((value) => !value);
              }}
              aria-label="Add to workspace"
              aria-expanded={workspaceAddOpen}
              aria-controls="workspace-add-menu"
              aria-haspopup="menu"
              title="Add to workspace"
            ><Plus /></button>

            {workspaceAddOpen && (
              <div ref={workspaceAddMenuRef} className="tl-workspace-add-menu" id="workspace-add-menu" role="menu" aria-label="Add to workspace">
                <span className="tl-workspace-add-title">Add to workspace</span>
                <div className="tl-workspace-add-entry">
                  <WorkspaceAddMenuItem icon={<Kanban />} label="Board" hasSubmenu controls="workspace-add-board-menu" active={workspaceAddSubmenu === "board"} onClick={() => setWorkspaceAddSubmenu("board")} onPointerEnter={() => setWorkspaceAddSubmenu("board")} onFocus={() => setWorkspaceAddSubmenu("board")} />
                  {workspaceAddSubmenu === "board" && (
                    <div className="tl-workspace-add-submenu" id="workspace-add-board-menu" role="menu" aria-label="Board options">
                      <WorkspaceAddMenuItem icon={<Kanban />} label="New board" active onClick={() => { setWorkspaceAddOpen(false); setWorkspaceAddSubmenu(null); navigate("board", "workspace"); }} />
                    </div>
                  )}
                </div>
                <div className="tl-workspace-add-entry">
                  <WorkspaceAddMenuItem icon={<FileText />} label="Doc" hasSubmenu controls="workspace-add-doc-menu" active={workspaceAddSubmenu === "doc"} onClick={() => setWorkspaceAddSubmenu("doc")} onPointerEnter={() => setWorkspaceAddSubmenu("doc")} onFocus={() => setWorkspaceAddSubmenu("doc")} />
                  {workspaceAddSubmenu === "doc" && (
                    <div className="tl-workspace-add-submenu" id="workspace-add-doc-menu" role="menu" aria-label="Doc options">
                      <WorkspaceAddMenuItem icon={<FileText />} label="New doc" active onClick={() => { setWorkspaceAddOpen(false); setWorkspaceAddSubmenu(null); navigate("docs", "workspace"); }} />
                    </div>
                  )}
                </div>
                <WorkspaceAddMenuItem icon={<ChartBar />} label="Dashboard" onClick={() => { setWorkspaceAddOpen(false); setWorkspaceAddSubmenu(null); navigate("insights", "workspace"); }} />
                <div className="tl-workspace-add-divider" />
                <span className="tl-workspace-add-title">Add to account</span>
                <WorkspaceAddMenuItem icon={<DotsNine />} label="New workspace" onClick={() => { setWorkspaceAddOpen(false); setWorkspaceAddSubmenu(null); setWorkspaceCreateOpen(true); }} />
              </div>
            )}

            {workspaceMenuOpen && (
              <div ref={workspaceMenuRef} className="tl-workspace-menu" id="workspace-switcher-menu" role="dialog" aria-label="Switch workspace">
                <label className="tl-workspace-menu-search tl-composite-field">
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
                </> : <TangladEmptyState compact variant="search" title="No workspaces found" description="Try another workspace name or browse all workspaces." />}

                <footer>
                  <button onClick={() => { setWorkspaceMenuOpen(false); setWorkspaceQuery(""); setWorkspaceBrowserOpen(true); }}><CirclesFour />Browse all</button>
                  <button onClick={() => { setWorkspaceMenuOpen(false); setWorkspaceCreateOpen(true); }}><Plus />Add workspace</button>
                </footer>
              </div>
            )}
          </div>

          <nav className="tl-workspace-tree" id="workspace-children" aria-label="Main workspace sections">
            <button className={screen === "manage-workspace" ? "is-active" : ""} onClick={() => navigate("manage-workspace", "workspace")}><House /><span>Manage workspace</span></button>
            <button className={screen === "board" ? "is-active" : ""} onClick={() => navigate("board", "workspace")}><Rows /><span>{boardName}</span></button>
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
          {screen === "docs" && <DocsScreen navigate={navigate} setToast={setToast} />}
          {screen === "docs-editor" && <DocsEditorScreen setToast={setToast} />}
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
        <label className="tl-notification-search tl-composite-field"><MagnifyingGlass /><span className="sr-only">Search notifications</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notifications by people, boards, and more..." autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} /></label>
        <label className="tl-notification-toggle"><input type="checkbox" checked={unreadOnly} onChange={(event) => setUnreadOnly(event.target.checked)} /><span aria-hidden="true" />Unread only</label>
      </div>
      {showTeamsCard && <div className="tl-teams-card"><div className="tl-service-icons"><ChatCircle weight="fill" /><AppMark small /></div><div><strong>Get notifications in MS Teams</strong><p>Connect now to enable real-time updates for all users in your account.</p></div><button className="tl-blue-button" onClick={() => setToast("Teams connection is ready for product integration")}>Connect users</button><button className="tl-teams-dismiss" onClick={() => setShowTeamsCard(false)} aria-label="Dismiss Teams connection" title="Dismiss Teams connection"><X /></button></div>}
      <TangladEmptyState variant={query || tab !== "all" || unreadOnly ? "search" : "content"} title={query || tab !== "all" || unreadOnly ? "No matching notifications" : "No notifications to show"} description={query || tab !== "all" || unreadOnly ? "Try another filter or clear your search." : "You'll get notified here whenever someone @mentions or replies to you."} action={<button className="tl-outline-button" onClick={() => { onClose(); openInvite(); }}>Invite new members</button>} />
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
      { id: "board-main", section: "boards", title: boardName, detail: "Board · Main workspace", keywords: "tasks product launch table kanban", screen: "board", dated: true },
      { id: "board-workload", section: "boards", title: "Team workload", detail: "Dashboard · Updated today", keywords: "insights reporting ownership capacity dashboard", screen: "insights", dated: true },
      { id: "file-roadmap", section: "files", title: "Launch roadmap", detail: "Project file · Edited by Inez", keywords: "roadmap launch project file", screen: "board", dated: true },
      { id: "doc-notes", section: "docs", title: "Launch notes", detail: "Document · Opened Aug 17", keywords: "notes launch document release", screen: "docs", dated: true },
      { id: "doc-handbook", section: "docs", title: "Workspace handbook", detail: "Document · Main workspace", keywords: "handbook workspace onboarding guide", screen: "docs", dated: true },
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
      detail: `Tag · Used in ${boardName}`,
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
        <m.div className="tl-search-scrim" aria-hidden="true" />
        <m.section ref={dialogRef} className="tl-search-dialog" id="tl-search-dialog" role="dialog" aria-modal="true" aria-labelledby="tl-search-title" aria-describedby="tl-search-description" {...searchDialogMotion}>
          <header className="tl-search-head tl-composite-field">
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
                    <TangladEmptyState variant="search" title="No results found" description="Try a task name, teammate, status, or board." action={query ? <button type="button" className="tl-outline-button" onClick={() => setQuery("")}>Clear search</button> : undefined} />
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
      <div className="tl-visible-loader" aria-hidden="true">
        <m.span className="tl-visible-loader-ring" animate={{ rotate: 360 }} transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }} />
        <m.span className="tl-visible-loader-mark" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}><AppMark small /></m.span>
        {[0, 1, 2].map((index) => <m.i key={index} animate={{ opacity: [0.22, 1, 0.22], scaleX: [0.72, 1, 0.72] }} transition={{ duration: 1.1, delay: index * 0.16, repeat: Infinity, ease: "easeInOut" }} />)}
      </div>
      <div className="tl-search-loader-status"><strong>Loading search results</strong><span aria-hidden="true"><i /><i /><i /></span></div>
      <p>Searching tasks, people, statuses, boards, and documents.</p>
    </div>
  );
}

type WorkspaceBrowserFilter = "all" | "recent" | "owner" | "member" | "collaborator";
type WorkspaceMembership = Exclude<WorkspaceBrowserFilter, "all" | "recent">;
type WorkspacePrivacy = "closed" | "open";

const workspaceMembershipLabels: Record<WorkspaceMembership, string> = {
  owner: "Workspaces owned by me",
  member: "Workspaces I'm a member of",
  collaborator: "Workspaces I collaborate in",
};

const workspaceMembershipShortLabels: Record<WorkspaceMembership, string> = {
  owner: "Owner",
  member: "Member",
  collaborator: "Collaborator",
};

function WorkspaceBrowserEmpty({ filter, searching }: { filter: WorkspaceBrowserFilter; searching: boolean }) {
  const emptyCopy = searching
    ? { title: "No workspaces found", body: "Try another search or filter." }
    : filter === "owner"
      ? { title: "You don't own any workspaces", body: "Create a workspace to get started." }
      : filter === "member"
        ? { title: "You aren't a member of any workspace", body: "Join a workspace to start collaborating." }
        : filter === "collaborator"
          ? { title: "You aren't a collaborator in any workspace", body: "Start your work by joining or creating a new workspace." }
          : { title: "No workspaces found", body: "Try another search or filter." };

  return <TangladEmptyState variant="search" title={emptyCopy.title} description={emptyCopy.body} />;
}

function WorkspaceBrowser({ onClose, onSelect, onCreate }: { onClose: () => void; onSelect: (name: string) => void; onCreate: () => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<WorkspaceBrowserFilter>("recent");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMemberships, setSelectedMemberships] = useState<WorkspaceMembership[]>([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState<WorkspacePrivacy[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const workspaces = [
    { name: "Main workspace", role: "Owner", recent: true, mark: "main" },
    { name: "New Workspace", role: "Owner", recent: true, mark: "new" },
  ] as const;

  useEffect(() => {
    searchRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (filterOpen) {
        setFilterOpen(false);
        return;
      }
      onClose();
    };
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnPointerDown);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnPointerDown);
    };
  }, [filterOpen, onClose]);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleWorkspaces = workspaces.filter((workspace) => {
    const matchesQuery = !normalizedQuery || `${workspace.name} ${workspace.role}`.toLowerCase().includes(normalizedQuery);
    const matchesFilter = filter === "all" || (filter === "recent" && workspace.recent) || workspace.role.toLowerCase() === filter;
    return matchesQuery && matchesFilter;
  });
  const heading = filter === "recent" ? "Recent workspaces" : filter === "all" ? "All workspaces" : workspaceMembershipLabels[filter];
  const activeFilterCount = selectedMemberships.length + selectedPrivacy.length;
  const toggleMembership = (membership: WorkspaceMembership) => {
    setFilter("all");
    setSelectedMemberships((current) => current.includes(membership) ? current.filter((value) => value !== membership) : [...current, membership]);
  };
  const togglePrivacy = (privacy: WorkspacePrivacy) => {
    setFilter("all");
    setSelectedPrivacy((current) => current.includes(privacy) ? current.filter((value) => value !== privacy) : [...current, privacy]);
  };

  return (
    <m.div className="tl-workspace-browser-layer" {...inviteLayerMotion}>
      <m.div className="tl-workspace-browser-scrim" aria-hidden="true" {...inviteLayerMotion} />
      <m.section className="tl-workspace-browser" role="dialog" aria-modal="true" aria-labelledby="workspace-browser-title" {...inviteDialogMotion}>
        <header className="tl-workspace-browser-head">
          <h2 id="workspace-browser-title">Browse all workspaces</h2>
          <div className="tl-workspace-browser-tools">
            <label className="tl-workspace-browser-search tl-composite-field"><MagnifyingGlass /><span className="sr-only">Search workspaces</span><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for a workspace" /></label>
            <div ref={filterRef} className="tl-workspace-browser-filter-wrap">
              <button className={`tl-workspace-browser-filter ${activeFilterCount ? "is-active" : ""}`} type="button" onClick={() => setFilterOpen((value) => !value)} aria-haspopup="dialog" aria-expanded={filterOpen} aria-pressed={activeFilterCount > 0}><SlidersHorizontal />Filter{activeFilterCount ? ` / ${activeFilterCount}` : ""}</button>
              {filterOpen && <div className="tl-workspace-browser-filter-popover" role="dialog" aria-label="Workspace filters">
                <div className="tl-workspace-browser-filter-popover-head"><strong>Filter by</strong><button type="button" onClick={() => { setFilter("all"); setSelectedMemberships([]); setSelectedPrivacy([]); }}>Clear all</button></div>
                <div className="tl-workspace-browser-filter-columns">
                  <div className="tl-workspace-browser-filter-group"><span>Product</span><button type="button" className="is-selected" aria-pressed="true"><Leaf className="tl-workspace-browser-product-mark" weight="fill" aria-hidden="true" />Tanglad</button></div>
                  <div className="tl-workspace-browser-filter-group"><span>Membership{selectedMemberships.length ? ` / ${selectedMemberships.length}` : ""}</span>{(["owner", "member", "collaborator"] as const).map((membership) => <button key={membership} type="button" className={selectedMemberships.includes(membership) ? "is-selected" : ""} aria-pressed={selectedMemberships.includes(membership)} onClick={() => toggleMembership(membership)}>{workspaceMembershipShortLabels[membership]}</button>)}</div>
                  <div className="tl-workspace-browser-filter-group"><span>Privacy{selectedPrivacy.length ? ` / ${selectedPrivacy.length}` : ""}</span>{(["closed", "open"] as const).map((privacy) => <button key={privacy} type="button" className={selectedPrivacy.includes(privacy) ? "is-selected" : ""} aria-pressed={selectedPrivacy.includes(privacy)} onClick={() => togglePrivacy(privacy)}>{privacy[0].toUpperCase() + privacy.slice(1)}</button>)}</div>
                </div>
              </div>}
            </div>
          </div>
          <button className="tl-workspace-browser-close" onClick={onClose} aria-label="Close workspace browser" title="Close workspace browser"><X /></button>
        </header>

        <div className="tl-workspace-browser-body">
          <nav className="tl-workspace-browser-sidebar" aria-label="Workspace filters">
            <button className={filter === "all" && !activeFilterCount ? "is-active" : ""} onClick={() => { setFilter("all"); setSelectedMemberships([]); setSelectedPrivacy([]); }}><CirclesFour />All workspaces</button>
            <button className={filter === "recent" && !activeFilterCount ? "is-active" : ""} onClick={() => { setFilter("recent"); setSelectedMemberships([]); setSelectedPrivacy([]); }}><ClockCounterClockwise />Recent workspaces</button>
            <span>My workspaces</span>
            <button className={filter === "owner" && !activeFilterCount ? "is-active" : ""} onClick={() => { setFilter("owner"); setSelectedMemberships([]); setSelectedPrivacy([]); }}><CrownSimple />{workspaceMembershipShortLabels.owner}</button>
            <button className={filter === "member" && !activeFilterCount ? "is-active" : ""} onClick={() => { setFilter("member"); setSelectedMemberships([]); setSelectedPrivacy([]); }}><User />{workspaceMembershipShortLabels.member}</button>
            <button className={filter === "collaborator" && !activeFilterCount ? "is-active" : ""} onClick={() => { setFilter("collaborator"); setSelectedMemberships([]); setSelectedPrivacy([]); }}><UsersThree />{workspaceMembershipShortLabels.collaborator}</button>
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
            </div> : <WorkspaceBrowserEmpty filter={filter} searching={Boolean(normalizedQuery)} />}
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
      <m.div className="tl-modal-scrim" aria-hidden="true" {...inviteLayerMotion} />
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
      <m.div className="tl-modal-scrim" aria-hidden="true" {...inviteLayerMotion} />
      <m.section className="tl-invite-modal" role="dialog" aria-modal="true" aria-labelledby="invite-title" {...inviteDialogMotion}>
        <header><h2 id="invite-title">Invite to Tanglad</h2><button onClick={onClose} aria-label="Close invite dialog" title="Close invite dialog"><X /></button></header>
        <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
          <div className="tl-invite-modal-row"><label>Invite with email</label><button type="button" className="tl-outline-button" onClick={() => setToast("Workspace directory is ready for product integration")}><UsersThree />Workspace directory</button></div>
          <div className="tl-email-composer tl-composite-field"><textarea value={emails} onChange={(event) => setEmails(event.target.value)} placeholder="Name@example.com, Name@example.com ..." rows={2} aria-label="Email addresses" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-gramm="false" data-enable-grammarly="false" data-1p-ignore="true" required /><select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Invite role"><option>Member</option><option>Viewer</option></select></div>
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
    <MotionConfig reducedMotion="user">
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
        <button onClick={() => navigate("board")}><span className="tl-file-icon is-board"><Rows /></span><span><strong>{boardName}</strong><small>Board</small></span><span>Opened today</span><Star /></button>
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
        <button onClick={() => navigate("board")}><span className="tl-file-icon is-board"><Rows /></span><span><strong>{boardName}</strong><small>Owned by Mara Cruz</small></span><span>Board</span><span>Today</span><DotsThree /></button>
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

function DocsScreen({ navigate, setToast }: { navigate: (screen: Screen) => void; setToast: (message: string) => void }) {
  const [docSearchOpen, setDocSearchOpen] = useState(false);
  const [docQuery, setDocQuery] = useState("");
  const [creatorFilter, setCreatorFilter] = useState<"anyone" | "me" | "others">("anyone");
  const creatorFilterRef = useRef<HTMLDetailsElement>(null);
  const hasRecentDoc = "Launch notes".toLowerCase().includes(docQuery.trim().toLowerCase()) && creatorFilter !== "others";
  const creatorFilterLabel = creatorFilter === "anyone" ? "Created by anyone" : creatorFilter === "me" ? "Created by me" : "Created by others";

  useEffect(() => {
    const closeCreatorFilter = (event: PointerEvent) => {
      if (!creatorFilterRef.current?.contains(event.target as Node)) creatorFilterRef.current?.removeAttribute("open");
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") creatorFilterRef.current?.removeAttribute("open");
    };
    document.addEventListener("pointerdown", closeCreatorFilter);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeCreatorFilter);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const selectCreatorFilter = (filter: "anyone" | "me" | "others") => {
    setCreatorFilter(filter);
    creatorFilterRef.current?.removeAttribute("open");
  };

  return (
    <section className="tl-standard-page tl-docs-page" aria-labelledby="docs-title">
      <header className="tl-docs-header">
        <h1 id="docs-title">Docs</h1>
        <button className="tl-blue-button" type="button" onClick={() => navigate("docs-editor")}><Plus />Create new doc</button>
      </header>

      <section className="tl-doc-templates" aria-labelledby="doc-templates-title">
        <header>
          <h2 id="doc-templates-title">Start with a template</h2>
          <button type="button" onClick={() => setToast("All document templates are shown in this preview")}>See all templates</button>
        </header>
        <div className="tl-doc-template-grid">
          {docTemplates.map((template) => (
            <button className={`tl-doc-template tone-${template.tone}`} type="button" key={template.title} onClick={() => setToast(`${template.title} is ready for product integration`)}>
              <span className="tl-doc-template-preview" aria-hidden="true">
                <span className="tl-doc-template-paper">
                  <i /><i /><i /><i /><i />
                </span>
              </span>
              <span className="tl-doc-template-copy"><strong>{template.title}</strong><small>by Tanglad</small></span>
            </button>
          ))}
        </div>
      </section>

      <section className="tl-recent-docs" aria-labelledby="recent-docs-title">
        <header>
          <h2 id="recent-docs-title">Recent documents</h2>
          <div className="tl-recent-doc-controls">
            {docSearchOpen ? (
              <label className="tl-doc-search-field tl-composite-field">
                <MagnifyingGlass />
                <span className="tl-visually-hidden">Search documents</span>
                <input autoFocus value={docQuery} onChange={(event) => setDocQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setDocSearchOpen(false); }} placeholder="Search docs" />
              </label>
            ) : (
              <button type="button" onClick={() => setDocSearchOpen(true)}><MagnifyingGlass /><span>Search</span></button>
            )}
            <details className="tl-doc-creator-filter" ref={creatorFilterRef}>
              <summary><UserCircle /><span>{creatorFilterLabel}</span><CaretDown /></summary>
              <div role="menu" aria-label="Filter documents by creator">
                <button className={creatorFilter === "anyone" ? "is-active" : ""} type="button" role="menuitem" onClick={() => selectCreatorFilter("anyone")}><UserCircle />Created by anyone</button>
                <button className={creatorFilter === "me" ? "is-active" : ""} type="button" role="menuitem" onClick={() => selectCreatorFilter("me")}><UserCircle />Created by me</button>
                <button className={creatorFilter === "others" ? "is-active" : ""} type="button" role="menuitem" onClick={() => selectCreatorFilter("others")}><UserCircle />Created by others</button>
              </div>
            </details>
          </div>
        </header>
        <div className="tl-doc-table-wrap">
          <table className="tl-doc-table">
            <thead><tr><th>Name</th><th>Owner</th><th>Last viewed</th><th>Workspace</th><th>Location</th></tr></thead>
            <tbody>
              {hasRecentDoc ? <tr>
                <td><button type="button" onClick={() => navigate("docs-editor")}><FileText /><span>Launch notes</span></button></td>
                <td><span className="tl-doc-owner"><Avatar member={members[0]} size="small" />Mara Cruz</span></td>
                <td>3 days ago</td>
                <td><span className="tl-doc-workspace"><AppMark small />Main workspace</span></td>
                <td><em>Workspace level</em></td>
              </tr> : <tr className="tl-doc-empty-row"><td colSpan={5}><TangladEmptyState compact variant="search" title="No documents found" description="Try another search or creator filter." /></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function DocsEditorScreen({ setToast }: { setToast: (message: string) => void }) {
  const [title, setTitle] = useState("New Doc");
  const [body, setBody] = useState("");
  const [textStyleOpen, setTextStyleOpen] = useState(false);
  const [textStyle, setTextStyle] = useState("Normal text");
  const [alignmentOpen, setAlignmentOpen] = useState(false);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  const [docStyleOpen, setDocStyleOpen] = useState(false);
  const [docOptionsOpen, setDocOptionsOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentComposerOpen, setCommentComposerOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [docLayout, setDocLayout] = useState("Narrow");
  const [fontStyle, setFontStyle] = useState("Default");
  const [fontSize, setFontSize] = useState("Normal");
  const [headerSettings, setHeaderSettings] = useState({ cover: false, title: true, contents: true, info: true });
  const docToolbarRef = useRef<HTMLDivElement>(null);
  const toolbarAction = (label: string) => setToast(`${label} is ready for product integration`);
  const closeToolbarMenus = () => { setTextStyleOpen(false); setAlignmentOpen(false); };

  useEffect(() => {
    if (!docOptionsOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!docToolbarRef.current?.contains(event.target as Node)) setDocOptionsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDocOptionsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [docOptionsOpen]);

  const chooseDocOption = (label: string) => {
    setDocOptionsOpen(false);
    toolbarAction(label);
  };

  return (
    <section className="tl-doc-editor" aria-labelledby="doc-editor-title">
      <div ref={docToolbarRef} className="tl-doc-editor-toolbar" role="toolbar" aria-label="Document formatting">
        <button className="tl-blue-button" type="button" data-tooltip="Add block" aria-label="Add block" onClick={() => toolbarAction("Add block")}><Plus />Add</button>
        <span className="tl-doc-toolbar-divider" />
        <button type="button" data-tooltip="Undo" aria-label="Undo" onClick={() => toolbarAction("Undo")}><ArrowUUpLeft /></button>
        <button type="button" data-tooltip="Redo" aria-label="Redo" onClick={() => toolbarAction("Redo")}><ArrowUUpLeft className="is-redo" /></button>
        <span className="tl-doc-toolbar-divider" />
        <button className={`has-label ${textStyleOpen ? "is-active" : ""}`} type="button" data-tooltip="Text style" aria-label="Text style" aria-haspopup="menu" aria-expanded={textStyleOpen} onClick={() => { setTextStyleOpen((value) => !value); setAlignmentOpen(false); }}><TextT /><span>{textStyle}</span><CaretDown /></button>
        {textStyleOpen && <div className="tl-doc-toolbar-menu tl-doc-text-style-menu" role="menu" aria-label="Text styles">
          {["Normal text", "Large title", "Medium title", "Small title"].map((option, index) => <button className={textStyle === option ? "is-selected" : ""} type="button" role="menuitemradio" aria-checked={textStyle === option} key={option} onClick={() => { setTextStyle(option); closeToolbarMenus(); }}><strong>{index === 0 ? "T" : `H${index}`}</strong><span>{option}</span></button>)}
        </div>}
        <button className={alignmentOpen ? "is-active" : ""} type="button" data-tooltip="Change alignment" aria-label="Change alignment" aria-haspopup="menu" aria-expanded={alignmentOpen} onClick={() => { setAlignmentOpen((value) => !value); setTextStyleOpen(false); }}><span className={`tl-align-icon is-${alignment}`} aria-hidden="true"><i /><i /><i /></span><CaretDown /></button>
        {alignmentOpen && <div className="tl-doc-toolbar-menu tl-doc-alignment-menu" role="menu" aria-label="Text alignment">
          {(["left", "center", "right"] as const).map((option) => <button className={alignment === option ? "is-selected" : ""} type="button" role="menuitemradio" aria-label={`Align ${option}`} aria-checked={alignment === option} key={option} onClick={() => { setAlignment(option); closeToolbarMenus(); }}><span className={`tl-align-icon is-${option}`} aria-hidden="true"><i /><i /><i /></span></button>)}
        </div>}
        <button type="button" data-tooltip="Bulleted list" aria-label="Bulleted list" onClick={() => toolbarAction("Bulleted list")}><ListBullets /></button>
        <button type="button" data-tooltip="Numbered list" aria-label="Numbered list" onClick={() => toolbarAction("Numbered list")}><ListNumbers /></button>
        <button type="button" data-tooltip="Checklist" aria-label="Checklist" onClick={() => toolbarAction("Checklist")}><CheckSquare /></button>
        <span className="tl-doc-toolbar-divider" />
        <button className={`has-label ${docStyleOpen ? "is-active" : ""}`} type="button" data-tooltip="Document style" aria-label="Document style" aria-expanded={docStyleOpen} onClick={() => { setDocStyleOpen((value) => !value); setCommentsOpen(false); setCommentComposerOpen(false); closeToolbarMenus(); }}><span>Style</span></button>
        <button className="has-label" type="button" data-tooltip="Mention" aria-label="Mention" onClick={() => toolbarAction("Mention")}><At /><span>Mention</span></button>
        <div className="tl-doc-toolbar-spacer" />
        <button className={commentsOpen ? "is-active" : ""} type="button" data-tooltip="Comments" aria-label="Comments" aria-expanded={commentsOpen} onClick={() => { setCommentsOpen((value) => { const nextOpen = !value; setCommentComposerOpen(nextOpen); return nextOpen; }); setDocStyleOpen(false); setDocOptionsOpen(false); closeToolbarMenus(); }}><ChatCircle /></button>
        <button className="has-label tl-doc-share" type="button" data-tooltip="Share document" aria-label="Share document" onClick={() => toolbarAction("Share")}><UserPlus /><span>Share</span></button>
        <button className={docOptionsOpen ? "is-active" : ""} type="button" data-tooltip="More actions" aria-label="More document actions" aria-haspopup="menu" aria-expanded={docOptionsOpen} aria-controls="tl-doc-options-menu" onClick={() => { setDocOptionsOpen((value) => !value); setDocStyleOpen(false); closeToolbarMenus(); }}><DotsThree /></button>
        {docOptionsOpen && <div className="tl-doc-options-menu" id="tl-doc-options-menu" role="menu" aria-label="Document options">
          <span className="tl-doc-options-label">Doc options</span>
          <DocOption icon={<UsersThree />} label="Manage members" onClick={chooseDocOption} />
          <div className="tl-doc-options-divider" />
          <DocOption icon={<PencilSimple />} label="Rename" onClick={chooseDocOption} />
          <DocOption icon={<Rows />} label="Change type" trailing={<CaretRight />} onClick={chooseDocOption} />
          <div className="tl-doc-options-divider" />
          <DocOption icon={<FileText />} label="Duplicate" onClick={chooseDocOption} />
          <DocOption icon={<SidebarSimple />} label="Full screen" onClick={chooseDocOption} />
          <div className="tl-doc-options-divider" />
          <DocOption icon={<BookmarkSimple />} label="Save as a template" onClick={chooseDocOption} />
          <DocOption icon={<Lightbulb />} label="Create skill from doc" onClick={chooseDocOption} />
          <DocOption icon={<PaperPlaneTilt />} label="Export" trailing={<CaretRight />} onClick={chooseDocOption} />
          <DocOption icon={<FileText />} label="Print" onClick={chooseDocOption} />
          <DocOption icon={<ClockCounterClockwise />} label="Version history" onClick={chooseDocOption} />
          <DocOption icon={<MagnifyingGlass />} label="Find and replace" trailing={<span className="tl-doc-new-badge">New</span>} onClick={chooseDocOption} />
          <DocOption icon={<CirclesFour />} label="Activity Log" onClick={chooseDocOption} />
          <div className="tl-doc-options-divider" />
          <DocOption icon={<X />} label="Delete / Archive" trailing={<CaretRight />} onClick={chooseDocOption} />
          <div className="tl-doc-options-divider" />
          <DocOption icon={<BookOpen />} label="Knowledge base" onClick={chooseDocOption} />
          <DocOption icon={<ChatCircle />} label="Contact support" onClick={chooseDocOption} />
          <DocOption icon={<ChatCircle />} label="Give feedback" onClick={chooseDocOption} />
        </div>}
      </div>

      <div className={`tl-doc-editor-stage ${docStyleOpen || commentsOpen ? "is-side-panel-open" : ""}`}>
      <button className="tl-doc-outline-toggle" type="button" data-tooltip="Document outline" aria-label="Toggle document outline" onClick={() => toolbarAction("Document outline")}><List /></button>

      <div className="tl-doc-editor-canvas">
        <header className="tl-doc-editor-heading">
          <div className="tl-doc-title-row">
            <input id="doc-editor-title" size={Math.max(7, title.length)} value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Document title" />
            <button type="button" aria-label="Add document to favorites" title="Add document to favorites" onClick={() => setToast("Document added to favorites")}><Star /></button>
          </div>
          <div className="tl-doc-meta" aria-label="Document details">
            <span><UserCircle />Creator Mara Cruz</span>
            <span><CirclesFour />Created today</span>
            <span><ClockCounterClockwise />Last updated just now</span>
          </div>
        </header>

        <label className="tl-doc-writing-line">
          <span className="tl-doc-writing-add"><Plus /></span>
          <span className="tl-visually-hidden">Document content</span>
          <input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Type ‘/’ to start with a block, ‘{’ to surface board data, or simply start writing" />
        </label>

        <div className="tl-doc-block-choices" aria-label="Document starting blocks">
          <button type="button" onClick={() => toolbarAction("Start with AI")}><Leaf /><span>Start with AI</span></button>
          <button type="button" onClick={() => toolbarAction("Templates")}><FileText /><span>Templates</span></button>
          <button type="button" onClick={() => toolbarAction("Table")}><Rows /><span>Table</span></button>
          <button type="button" onClick={() => toolbarAction("Chart")}><ChartBar /><span>Chart</span></button>
          <button type="button" onClick={() => toolbarAction("Board values")}><SlidersHorizontal /><span>Board values</span></button>
          <button type="button" onClick={() => toolbarAction("Board")}><Kanban /><span>Board</span></button>
        </div>

        <button className="tl-doc-prompt-card" type="button" onClick={() => toolbarAction("AI document prompt")}>
          <span><Leaf /><strong>Start with AI</strong></span>
          <small>Describe the doc you want to create</small>
        </button>
      </div>

      {docStyleOpen && <aside className="tl-doc-style-panel" aria-label="Document style settings">
        <header><strong>Doc style</strong><div><button type="button" onClick={() => { setDocLayout("Narrow"); setFontStyle("Default"); setFontSize("Normal"); setHeaderSettings({ cover: false, title: true, contents: true, info: true }); }}>Reset</button><button type="button" aria-label="Close document style" onClick={() => setDocStyleOpen(false)}><X /></button></div></header>
        <DocStyleChoice label="Doc Layout" options={["Narrow", "Wide", "Frame"]} value={docLayout} onChange={setDocLayout} visual="layout" />
        <DocStyleChoice label="Font style" options={["Default", "Serif", "Mono"]} value={fontStyle} onChange={setFontStyle} visual="font" />
        <DocStyleChoice label="Font size" options={["Small", "Normal", "Large"]} value={fontSize} onChange={setFontSize} />
        <div className="tl-doc-background-row"><span>Background</span><button type="button" aria-label="Choose document background"><i /><CaretDown /></button></div>
        <section className="tl-doc-header-settings"><strong>Header</strong>
          {([['cover', 'Cover image'], ['title', 'Title'], ['contents', 'Table of contents'], ['info', 'Doc info']] as const).map(([key, label]) => <div key={key}><span>{label}</span><button className={headerSettings[key] ? "is-on" : ""} type="button" role="switch" aria-checked={headerSettings[key]} aria-label={label} onClick={() => setHeaderSettings((current) => ({ ...current, [key]: !current[key] }))}><i /></button></div>)}
        </section>
      </aside>}
      {commentsOpen && <aside className="tl-doc-comments-panel" aria-label="Document comments">
        <header><strong>Comments</strong><button type="button" aria-label="Close comments" onClick={() => { setCommentsOpen(false); setCommentComposerOpen(false); }}><X /></button></header>
        <div className={`tl-doc-comment-composer tl-composite-field ${commentComposerOpen ? "is-expanded" : "is-collapsed"}`} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !commentDraft.trim()) setCommentComposerOpen(false); }}>
          {commentComposerOpen && <div className="tl-doc-comment-format" aria-label="Comment formatting"><button type="button" aria-label="Paragraph">¶</button><button type="button" aria-label="Bold"><strong>B</strong></button><button type="button" aria-label="Italic"><em>I</em></button><button type="button" aria-label="Underline"><u>U</u></button><button type="button" aria-label="Strikethrough"><s>S</s></button><button type="button" aria-label="Text color">A</button><button type="button" aria-label="List"><ListBullets /></button><button type="button" aria-label="Alignment"><span className="tl-align-icon is-left"><i /><i /><i /></span></button></div>}
          <textarea autoFocus={commentComposerOpen} rows={commentComposerOpen ? 4 : 1} value={commentDraft} onFocus={() => setCommentComposerOpen(true)} onChange={(event) => setCommentDraft(event.target.value)} aria-label="Write a comment" aria-expanded={commentComposerOpen} placeholder={commentComposerOpen ? "Comment and mention others with @" : "Write an update and mention others with @"} />
          <footer><div><button type="button" aria-label="Mention someone" onClick={() => setCommentComposerOpen(true)}><At /></button><button type="button" aria-label="Attach a file" onClick={() => setCommentComposerOpen(true)}><Paperclip /></button><button type="button" aria-label="Add emoji" onClick={() => setCommentComposerOpen(true)}><Smiley /></button><button type="button" aria-label="Writing assistant" onClick={() => setCommentComposerOpen(true)}><PencilSimple /></button></div>{commentComposerOpen && <button className="tl-doc-comment-submit" type="button" disabled={!commentDraft.trim()} onClick={() => { const next = commentDraft.trim(); if (!next) return; setComments((current) => [...current, next]); setCommentDraft(""); setCommentComposerOpen(false); }}>Update<CaretDown /></button>}</footer>
        </div>
        {comments.length === 0 ? <TangladEmptyState variant="comments" title="No comments yet on this doc" description="Share progress, mention a teammate, or upload a file to get things moving." /> : <div className="tl-doc-comment-list">{comments.map((comment, index) => <DocCommentCard comment={comment} onDelete={() => setComments((current) => current.filter((_, itemIndex) => itemIndex !== index))} key={`${comment}-${index}`} />)}</div>}
      </aside>}
      </div>

      <button className="tl-doc-ai-fab" type="button" aria-label="Open AI document assistant" title="Open AI document assistant" onClick={() => toolbarAction("AI document assistant")}><Leaf weight="fill" /></button>
    </section>
  );
}

function DocStyleChoice({ label, options, value, onChange, visual }: { label: string; options: string[]; value: string; onChange: (value: string) => void; visual?: "layout" | "font" }) {
  return <fieldset className={`tl-doc-style-choice ${visual ? `is-${visual}` : ""}`}><legend>{label}</legend><div>{options.map((option) => <button className={value === option ? "is-selected" : ""} type="button" aria-pressed={value === option} key={option} onClick={() => onChange(option)}>{visual === "layout" && <span className={`tl-layout-preview is-${option.toLowerCase()}`}><i /><i /><i /><i /></span>}{visual === "font" && <strong>Aa</strong>}<span>{option}</span></button>)}</div></fieldset>;
}

function DocOption({ icon, label, trailing, onClick }: { icon: ReactNode; label: string; trailing?: ReactNode; onClick: (label: string) => void }) {
  return <button type="button" role="menuitem" onClick={() => onClick(label)}><span className="tl-doc-option-icon">{icon}</span><span>{label}</span>{trailing && <span className="tl-doc-option-trailing">{trailing}</span>}</button>;
}

function DocCommentCard({ comment, onDelete }: { comment: string; onDelete: () => void }) {
  const [reaction, setReaction] = useState<"like" | "love" | "celebrate" | "smile" | null>(null);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyDraft, setReplyDraft] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [commentText, setCommentText] = useState(comment);
  const [editing, setEditing] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [notifyMentionsOnly, setNotifyMentionsOnly] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const reactionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!optionsOpen) return;
    const closeMenu = (event: MouseEvent) => { if (!optionsRef.current?.contains(event.target as Node)) setOptionsOpen(false); };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [optionsOpen]);

  useEffect(() => {
    if (!reactionPickerOpen) return;
    const closePicker = (event: MouseEvent) => { if (!reactionRef.current?.contains(event.target as Node)) setReactionPickerOpen(false); };
    document.addEventListener("mousedown", closePicker);
    return () => document.removeEventListener("mousedown", closePicker);
  }, [reactionPickerOpen]);

  const reactionIcon = reaction === "love" ? <Heart className="tl-reaction-icon is-love" weight="fill" /> : reaction === "celebrate" ? <Star className="tl-reaction-icon is-celebrate" weight="fill" /> : reaction === "smile" ? <Smiley className="tl-reaction-icon is-smile" weight="fill" /> : <ThumbsUp className="tl-reaction-icon is-like" weight="fill" />;
  const reactionLabel = reaction === "love" ? "Loved" : reaction === "celebrate" ? "Celebrated" : reaction === "smile" ? "Smiled" : reaction === "like" ? "Liked" : "Like";

  const submitReply = () => {
    const nextReply = replyDraft.trim();
    if (!nextReply) return;
    setReplies((current) => [...current, nextReply]);
    setReplyDraft("");
    setReplyOpen(false);
  };

  return <article className={`tl-doc-comment-card ${resolved ? "is-resolved" : ""}`}>
    <header><UserCircle weight="fill" /><div><strong>Rayver Punzalan</strong><span>Just now</span></div><div ref={optionsRef} className="tl-doc-comment-card-menu"><button type="button" aria-label="Add comment to document"><FileText /></button><button type="button" aria-label="Comment notifications"><Bell /></button><button className={optionsOpen ? "is-active" : ""} type="button" aria-label="More comment actions" aria-haspopup="menu" aria-expanded={optionsOpen} onClick={() => setOptionsOpen((value) => !value)}><DotsThree /></button>{optionsOpen && <div className="tl-doc-comment-options" role="menu">
      <button type="button" role="menuitem" onClick={() => { setEditing(true); setOptionsOpen(false); }}><PencilSimple /><span>Edit comment</span></button>
      <button type="button" role="menuitemcheckbox" aria-checked={notifyMentionsOnly} onClick={() => setNotifyMentionsOnly((value) => !value)}><Bell /><span>Notify me only when mentioned</span>{notifyMentionsOnly && <Check />}</button>
      <button type="button" role="menuitem" onClick={() => { setResolved(false); setOptionsOpen(false); }}><Check /><span>Re-open</span></button>
      <i />
      <button type="button" role="menuitemcheckbox" aria-checked={bookmarked} onClick={() => setBookmarked((value) => !value)}><BookmarkSimple /><span>{bookmarked ? "Remove bookmark" : "Bookmark this comment"}</span>{bookmarked && <Check />}</button>
      <i />
      <button type="button" role="menuitem" onClick={() => setOptionsOpen(false)}><LinkSimple /><span>Copy link to comment</span></button>
      <i />
      <button className="is-danger" type="button" role="menuitem" onClick={onDelete}><X /><span>Delete comment</span></button>
    </div>}</div></header>
    {editing ? <div className="tl-doc-comment-edit tl-composite-field"><textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} aria-label="Edit comment" autoFocus /><div><button type="button" onClick={() => setEditing(false)}>Cancel</button><button className="tl-blue-button" type="button" onClick={() => setEditing(false)}>Save</button></div></div> : <p className="tl-doc-comment-copy">{commentText}</p>}
    {reaction && <span className={`tl-doc-comment-reaction is-${reaction}`} aria-label={`One ${reaction}`}>{reactionIcon}1</span>}
     <div className="tl-doc-comment-actions"><div><div ref={reactionRef} className="tl-doc-reaction-control" onMouseEnter={() => setReactionPickerOpen(true)} onMouseLeave={() => setReactionPickerOpen(false)} onFocusCapture={() => setReactionPickerOpen(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setReactionPickerOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); setReactionPickerOpen(false); } }}><button className={reaction ? "is-active" : ""} type="button" aria-pressed={Boolean(reaction)} onClick={() => setReaction((value) => value ? null : "like")}>{reaction ? reactionIcon : <ThumbsUp />}<span>{reactionLabel}</span></button><button type="button" aria-label="Choose another reaction" aria-haspopup="menu" aria-expanded={reactionPickerOpen} onClick={() => setReactionPickerOpen((value) => !value)}><CaretDown /></button>{reactionPickerOpen && <div className="tl-doc-reaction-picker" role="menu" aria-label="Choose a reaction"><button className="is-like" type="button" role="menuitem" aria-label="Like" onClick={() => { setReaction("like"); setReactionPickerOpen(false); }}><ThumbsUp weight="fill" /></button><button className="is-love" type="button" role="menuitem" aria-label="Love" onClick={() => { setReaction("love"); setReactionPickerOpen(false); }}><Heart weight="fill" /></button><button className="is-celebrate" type="button" role="menuitem" aria-label="Celebrate" onClick={() => { setReaction("celebrate"); setReactionPickerOpen(false); }}><Star weight="fill" /></button><button className="is-smile" type="button" role="menuitem" aria-label="Smile" onClick={() => { setReaction("smile"); setReactionPickerOpen(false); }}><Smiley weight="fill" /></button></div>}</div><button className={replyOpen ? "is-active" : ""} type="button" aria-expanded={replyOpen} onClick={() => setReplyOpen(true)}><ArrowUUpLeft /><span>Reply</span></button></div><button className={resolved ? "is-active" : ""} type="button" aria-pressed={resolved} onClick={() => setResolved((value) => !value)}><Check /><span>{resolved ? "Resolved" : "Resolve"}</span></button></div>
    {replies.map((reply, index) => <div className="tl-doc-comment-reply" key={`${reply}-${index}`}><UserCircle weight="fill" /><div><strong>Rayver Punzalan</strong><span>Just now</span><p>{reply}</p></div></div>)}
    <div className={`tl-doc-reply-composer tl-composite-field ${replyOpen ? "is-expanded" : "is-collapsed"}`}>
      <UserCircle weight="fill" />
      <div><textarea autoFocus={replyOpen} rows={replyOpen ? 3 : 1} value={replyDraft} onFocus={() => setReplyOpen(true)} onChange={(event) => setReplyDraft(event.target.value)} aria-label="Write a reply" placeholder="Write a reply and mention others with @" />{replyOpen && <footer><div><button type="button" aria-label="Mention someone"><At /></button><button type="button" aria-label="Attach a file"><Paperclip /></button><button type="button" aria-label="Add emoji"><Smiley /></button><button type="button" aria-label="Writing assistant"><PencilSimple /></button></div><button type="button" disabled={!replyDraft.trim()} onClick={submitReply}>Reply<CaretDown /></button></footer>}</div>
    </div>
  </article>;
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
  const [query, setQuery] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...tasks]
      .filter((task) => !normalizedQuery || `${task.name} ${task.ownerName} ${task.status} ${task.priority}`.toLowerCase().includes(normalizedQuery))
      .sort((first, second) => {
        const difference = taskDueValue(first.due) - taskDueValue(second.due);
        return sortAscending ? difference : -difference;
      });
  }, [query, sortAscending, tasks]);

  return (
    <div className="tl-standard-page tl-board-page">
      <header className="tl-board-header">
        <div className="tl-board-title"><h1>{newBoardTitle}</h1><button type="button" onClick={() => setToast("Board name options are ready for this UI preview")} aria-label="Board name options" title="Board name options"><CaretDown /></button></div>
        <div className="tl-board-header-actions"><button className="tl-outline-button" onClick={() => navigate("collaborators")}><UserPlus />Invite</button><button type="button" onClick={() => setToast("Board options are ready for this UI preview")} aria-label="Board options" title="Board options"><DotsThree /></button></div>
      </header>

      <div className="tl-board-tabs">
        <AnimatedTabs id="board-tabs" ariaLabel="Board views" active={view} onChange={(value) => setView(value as BoardView)} items={[{ id: "table", label: "Main table", icon: <Rows /> }, { id: "calendar", label: "Calendar", icon: <CalendarBlank /> }, { id: "kanban", label: "Kanban", icon: <Kanban /> }]} />
      </div>

      <div className="tl-board-toolbar" aria-label="Board tools">
        <button className="tl-blue-button tl-new-item-button" type="button" onClick={() => setComposerOpen(true)}><Plus />New item<CaretDown /></button>
        <label className="tl-board-search tl-composite-field"><MagnifyingGlass /><span className="sr-only">Search board items</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /></label>
        <button className={mineOnly ? "tl-board-tool is-selected" : "tl-board-tool"} type="button" onClick={() => setMineOnly(!mineOnly)} aria-pressed={mineOnly}><User />Person</button>
        <button className="tl-board-tool" type="button" onClick={() => setToast("Filter options are ready for this UI preview")}><FunnelSimple />Filter<CaretDown /></button>
        <button className={sortAscending ? "tl-board-tool is-selected" : "tl-board-tool"} type="button" onClick={() => setSortAscending((value) => !value)} aria-pressed={sortAscending}><ListNumbers />Sort</button>
        <button className="tl-board-tool tl-board-optional-tool" type="button" onClick={() => setToast("Column visibility options are ready for this UI preview")}><EyeSlash />Hide</button>
        <button className="tl-board-tool tl-board-optional-tool" type="button" onClick={() => setToast("Grouping options are ready for this UI preview")}><Rows />Group by</button>
      </div>

      {composerOpen && (
        <form className="tl-inline-form tl-composite-field" onSubmit={(event) => { event.preventDefault(); addTask(); }}>
          <label htmlFor="tl-new-task">Task name</label>
          <input id="tl-new-task" autoFocus value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add an item" />
          <button className="tl-blue-button" type="submit">Add</button>
          <button type="button" onClick={() => setComposerOpen(false)} aria-label="Cancel"><X /></button>
        </form>
      )}

      {visibleTasks.length === 0 ? <EmptySearch /> : view === "table" ? <TaskTable tasks={visibleTasks} cycleStatus={cycleStatus} onAdd={() => setComposerOpen(true)} setToast={setToast} itemLabel="Item" addLabel="Add item" /> : view === "calendar" ? <BoardCalendarView tasks={visibleTasks} cycleStatus={cycleStatus} setToast={setToast} /> : <KanbanView tasks={visibleTasks} cycleStatus={cycleStatus} setToast={setToast} />}
    </div>
  );
}

function TaskTable({ tasks, cycleStatus, onAdd, setToast, itemLabel = "Task", addLabel = "Add task" }: { tasks: Task[]; cycleStatus: (id: number) => void; onAdd?: () => void; setToast: (message: string) => void; itemLabel?: string; addLabel?: string }) {
  return (
    <div className="tl-groups">
      {(["This week", "Next week"] as const).map((group) => {
        const groupTasks = tasks.filter((task) => task.group === group);
        if (!groupTasks.length) return null;
        return (
          <section className="tl-task-group" key={group}>
            <div className="tl-task-group-head"><CaretDown /><h2>{group}</h2><span>{groupTasks.length} tasks</span><button onClick={() => setToast(`${group} options are ready for product integration`)} aria-label={`${group} options`} title={`${group} options`}><DotsThree /></button></div>
            <div className="tl-task-table" role="table" aria-label={`${group} tasks`}>
              <div className="tl-task-row is-header" role="row"><span>{itemLabel}</span><span>Owner</span><span>Status</span><span>Priority</span><span>Due</span><span /></div>
              {groupTasks.map((task) => <TaskRow task={task} cycleStatus={cycleStatus} setToast={setToast} key={task.id} />)}
              {onAdd && <button className="tl-add-row" onClick={onAdd}><Plus />{addLabel}</button>}
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
      <div className="tl-task-name"><button className={task.status === "Done" ? "is-done" : ""} onClick={() => cycleStatus(task.id)} aria-label={`Change status for ${task.name}`} title={`Change status for ${task.name}`}>{task.status === "Done" && <Check />}</button><strong title={task.name}>{task.name}</strong></div>
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
          <section className={`tl-kanban-column status-${status.toLowerCase().replaceAll(" ", "-")}`} key={status}>
            <header><StatusLabel status={status} /><span>{statusTasks.length}</span><button onClick={() => setToast(`${status} column options are ready for product integration`)} aria-label={`${status} options`} title={`${status} options`}><DotsThree /></button></header>
            <div>
              {statusTasks.map((task) => {
                const member = members.find((item) => item.initials === task.owner) ?? members[0];
                return <button type="button" className="tl-kanban-card" onClick={() => cycleStatus(task.id)} aria-label={`Change status for ${task.name}`} title={`Change status for ${task.name}`} key={task.id}><strong>{task.name}</strong><span><Avatar member={member} size="small" /><PriorityLabel priority={task.priority} /><small>{task.due}</small></span></button>;
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
    { person: members[2], title: "Rafi changed a task to Review", body: "Workspace permissions is ready for a second pass.", time: "1 hour ago", board: boardName, unread: true, mentioned: false, bookmarked: true, scheduled: false },
    { person: members[3], title: "Sam joined Main workspace", body: `Sam can now view ${boardName} and Launch notes.`, time: "Yesterday", board: "", unread: false, mentioned: false, bookmarked: false, scheduled: true },
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
      <m.div className="tl-update-feed-scrim" aria-hidden="true" {...inviteLayerMotion} />
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
          <header className="tl-update-feed-tabs">
            <AnimatedTabs id="update-feed-tabs" className="tl-update-feed-tabs-list" ariaLabel="Update feed categories" active={tab} onChange={(value) => setTab(value as UpdateFeedPanelTab)} items={tabs} />
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

function BoardCalendarView({ tasks, cycleStatus, setToast }: { tasks: Task[]; cycleStatus: (id: number) => void; setToast: (message: string) => void }) {
  const [month, setMonth] = useState(() => new Date(2026, 7, 1));
  const days = useMemo(() => calendarDaysForMonth(month), [month]);
  const monthLabel = useMemo(() => new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(month), [month]);
  const today = new Date();
  const todayKey = calendarDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const moveMonth = (offset: number) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));

  return (
    <section className="tl-board-calendar" aria-label="Board calendar">
      <header className="tl-board-calendar-head">
        <div className="tl-board-calendar-month"><button type="button" className="tl-calendar-nav-button" onClick={() => moveMonth(-1)} aria-label="Previous month" title="Previous month"><CaretLeft /></button><button type="button" className="tl-calendar-nav-button" onClick={() => moveMonth(1)} aria-label="Next month" title="Next month"><CaretRight /></button><h2>{monthLabel}</h2></div>
        <div className="tl-board-calendar-actions"><button type="button" className="tl-outline-button" onClick={() => { const now = new Date(); setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); }}>Today</button><button type="button" className="tl-outline-button" onClick={() => setToast("Month view is the only calendar view in this UI preview")} aria-label="Calendar display mode" title="Calendar display mode">Month <CaretDown /></button></div>
      </header>
      <div className="tl-board-calendar-weekdays" aria-hidden="true">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="tl-board-calendar-grid">
        {days.map(({ date, key, inMonth }) => {
          const dayTasks = tasks.filter((task) => taskDateKey(task.due) === key);
          const dateLabel = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
          return (
            <div className={`tl-board-calendar-day ${inMonth ? "" : "is-outside-month"} ${key === todayKey ? "is-today" : ""}`} key={key}>
              <time dateTime={key}>{date.getDate()}</time>
              <div className="tl-board-calendar-items">
                {dayTasks.slice(0, 3).map((task) => <button type="button" className={`tl-board-calendar-task status-${task.status.toLowerCase().replaceAll(" ", "-")}`} key={task.id} onClick={() => cycleStatus(task.id)} aria-label={`${task.name}, ${task.status}, due ${dateLabel}`} title={`${task.name} · ${task.status}`}><span aria-hidden="true" /><strong>{task.name}</strong></button>)}
                {dayTasks.length > 3 && <span className="tl-board-calendar-more">+{dayTasks.length - 3} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
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
    { person: members[3], title: "Sam joined Main workspace", body: `Sam can now view ${boardName} and Launch notes.`, time: "Yesterday" },
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
          <button className="tl-update-context" onClick={() => navigate("board")}><Rows /><span><strong>{boardName}</strong><small>Product launch board</small></span><CaretRight /></button>
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
        <button className="tl-insights-source" onClick={() => navigate("board")}><Rows /><span><strong>1 connected board</strong><small>{boardName}</small></span><CaretRight /></button>
        <label className="tl-insights-search tl-composite-field"><MagnifyingGlass /><span className="sr-only">Filter insights</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type to filter" /></label>
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
      <TangladEmptyState variant="favorites" title="No favorites yet" description="Items you save will appear here for quick access." />
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
  return <TangladEmptyState variant="search" title="No matching items" description="Clear the search or change the current filter." />;
}

function TangladEmptyState({ title, description, variant = "content", compact = false, action }: { title: string; description: string; variant?: "search" | "comments" | "favorites" | "content"; compact?: boolean; action?: ReactNode }) {
  return <div className={`tl-shared-empty is-${variant} ${compact ? "is-compact" : ""}`} role="status">
    <div className="tl-shared-empty-art" aria-hidden="true">
      <span className="is-back">{variant === "search" ? <MagnifyingGlass /> : <FileText />}</span>
      <span className="is-front">{variant === "favorites" ? <Star weight="fill" /> : variant === "comments" ? <ChatCircle weight="fill" /> : <Leaf weight="fill" />}</span>
      <i />
    </div>
    <h2>{title}</h2>
    <p>{description}</p>
    {action && <div className="tl-shared-empty-action">{action}</div>}
  </div>;
}
