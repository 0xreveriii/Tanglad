"use client";

import {
  Archive,
  ArrowLeft,
  Bell,
  CalendarBlank,
  CaretDown,
  CaretRight,
  Check,
  CirclesThreePlus,
  DotsThree,
  FunnelSimple,
  Gauge,
  House,
  Kanban,
  List,
  MagnifyingGlass,
  Plus,
  Rows,
  Sparkle,
  Star,
  TrendUp,
  UserPlus,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Status = "In progress" | "Review" | "Done" | "Stuck";
type Weight = "Light" | "Medium" | "Heavy";
type View = "table" | "board";

type Task = {
  id: number;
  name: string;
  owner: string;
  ownerName: string;
  status: Status;
  weight: Weight;
  due: string;
  group: "This week" | "Next up";
};

const initialTasks: Task[] = [
  { id: 1, name: "Map the onboarding journey", owner: "MC", ownerName: "Mara Cruz", status: "Done", weight: "Medium", due: "Aug 19", group: "This week" },
  { id: 2, name: "Finalize launch page copy", owner: "IK", ownerName: "Inez Kim", status: "Review", weight: "Light", due: "Aug 20", group: "This week" },
  { id: 3, name: "Build workspace permissions", owner: "RA", ownerName: "Rafi Ahmed", status: "In progress", weight: "Heavy", due: "Aug 21", group: "This week" },
  { id: 4, name: "Run accessibility QA", owner: "MC", ownerName: "Mara Cruz", status: "Stuck", weight: "Medium", due: "Aug 22", group: "This week" },
  { id: 5, name: "Prepare release notes", owner: "IK", ownerName: "Inez Kim", status: "In progress", weight: "Light", due: "Aug 25", group: "Next up" },
  { id: 6, name: "Review usage event schema", owner: "RA", ownerName: "Rafi Ahmed", status: "Review", weight: "Heavy", due: "Aug 26", group: "Next up" },
];

const statusOrder: Status[] = ["In progress", "Review", "Done", "Stuck"];
const viewVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

function LogoMark() {
  return (
    <span className="workspace-logo-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return <span className={`workspace-status status-${status.toLowerCase().replace(" ", "-")}`}>{status}</span>;
}

function WeightBadge({ weight }: { weight: Weight }) {
  return <span className={`workspace-weight weight-${weight.toLowerCase()}`}>{weight}</span>;
}

export function TangladWorkspace() {
  const [view, setView] = useState<View>("table");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [starred, setStarred] = useState(true);
  const reduceMotion = useReducedMotion();

  const filteredTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = !normalized || `${task.name} ${task.ownerName} ${task.status}`.toLowerCase().includes(normalized);
      const matchesOwner = !mineOnly || task.owner === "MC";
      return matchesSearch && matchesOwner;
    });
  }, [mineOnly, query, tasks]);

  const completed = tasks.filter((task) => task.status === "Done").length;
  const heavyOpen = tasks.filter((task) => task.weight === "Heavy" && task.status !== "Done").length;

  const addTask = () => {
    const name = draftName.trim();
    if (!name) return;
    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        owner: "MC",
        ownerName: "Mara Cruz",
        status: "In progress",
        weight: "Medium",
        due: "No date",
        group: "This week",
      },
    ]);
    setDraftName("");
    setComposerOpen(false);
  };

  const cycleStatus = (id: number) => {
    setTasks((current) => current.map((task) => {
      if (task.id !== id) return task;
      const next = statusOrder[(statusOrder.indexOf(task.status) + 1) % statusOrder.length];
      return { ...task, status: next };
    }));
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="workspace-shell">
        <a className="skip-link" href="#workspace-content">Skip to workspace</a>

        <AnimatePresence>
          {sidebarOpen && (
            <m.button
              className="workspace-sidebar-scrim"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        <aside className={`workspace-sidebar ${sidebarOpen ? "is-open" : ""}`} aria-label="Workspace navigation">
          <div className="workspace-sidebar-head">
            <Link className="workspace-logo" href="/" aria-label="Back to Tanglad home">
              <LogoMark />
              <strong>Tanglad</strong>
            </Link>
            <button className="workspace-icon-button mobile-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <X weight="bold" />
            </button>
          </div>

          <nav className="workspace-primary-nav">
            <a href="#overview"><House weight="regular" /><span>Home</span></a>
            <a className="is-active" href="#board" aria-current="page"><CirclesThreePlus weight="fill" /><span>My work</span><span className="workspace-nav-count">6</span></a>
            <a href="#inbox"><Archive weight="regular" /><span>Inbox</span><span className="workspace-nav-count">3</span></a>
          </nav>

          <div className="workspace-nav-section">
            <div className="workspace-nav-section-title">
              <span>Workspace</span>
              <button aria-label="Add workspace"><Plus weight="bold" /></button>
            </div>
            <button className="workspace-switcher">
              <span className="workspace-team-icon">TF</span>
              <span><strong>Tanglad Friends</strong><small>6 members</small></span>
              <CaretDown weight="bold" />
            </button>
          </div>

          <nav className="workspace-board-nav" aria-label="Boards">
            <a className="is-active" href="#board"><Kanban weight="fill" /><span>Product launch</span></a>
            <a href="#research"><Rows weight="regular" /><span>Research backlog</span></a>
            <a href="#team"><UsersThree weight="regular" /><span>Team capacity</span></a>
          </nav>

          <div className="workspace-sidebar-spacer" />
          <div className="workspace-balance-note">
            <span className="workspace-note-icon"><Sparkle weight="fill" /></span>
            <div><strong>Load looks balanced</strong><p>One high-weight task needs a second reviewer.</p></div>
            <CaretRight weight="bold" />
          </div>
          <Link className="workspace-back-link" href="/"><ArrowLeft weight="bold" />Back to website</Link>
        </aside>

        <div className="workspace-stage">
          <header className="workspace-topbar">
            <div className="workspace-topbar-left">
              <button className="workspace-icon-button mobile-sidebar-open" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <List weight="bold" />
              </button>
              <div className="workspace-global-search">
                <MagnifyingGlass weight="bold" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this workspace" aria-label="Search this workspace" />
                <kbd>/</kbd>
              </div>
            </div>
            <div className="workspace-topbar-actions">
              <button className="workspace-quiet-button"><UserPlus weight="bold" /><span>Invite</span></button>
              <button className="workspace-icon-button" aria-label="Notifications"><Bell weight="regular" /><i className="notification-dot" /></button>
              <button className="workspace-avatar" aria-label="Open Mara Cruz profile">MC</button>
            </div>
          </header>

          <main className="workspace-content" id="workspace-content">
            <section className="workspace-board-heading" id="board">
              <div>
                <div className="workspace-title-row">
                  <h1>Product launch</h1>
                  <button className={`workspace-star ${starred ? "is-starred" : ""}`} onClick={() => setStarred((value) => !value)} aria-label={starred ? "Remove from favorites" : "Add to favorites"}>
                    <Star weight={starred ? "fill" : "regular"} />
                  </button>
                  <button className="workspace-icon-button board-menu" aria-label="Board menu"><DotsThree weight="bold" /></button>
                </div>
                <p>Plan the release, make ownership clear, and keep the team’s task weight in view.</p>
              </div>
              <div className="workspace-heading-people" aria-label="Board members">
                <span className="person-avatar person-mara" title="Mara Cruz">MC</span>
                <span className="person-avatar person-inez" title="Inez Kim">IK</span>
                <span className="person-avatar person-rafi" title="Rafi Ahmed">RA</span>
                <button aria-label="Add board member"><Plus weight="bold" /></button>
              </div>
            </section>

            <section className="workspace-stats" aria-label="Board summary">
              <div><span>Open work</span><strong>{tasks.length - completed}</strong><small>tasks in motion</small></div>
              <div><span>Completion</span><strong>{completed}/{tasks.length}</strong><small>across this board</small></div>
              <div><span>Heavy work</span><strong>{heavyOpen}</strong><small>needs attention</small></div>
              <div className="workspace-guidance-card"><Gauge weight="regular" /><span><small>Tanglad guidance</small><strong>Pair Rafi with a reviewer on permissions.</strong></span></div>
            </section>

            <div className="workspace-board-toolbar">
              <div className="workspace-view-tabs" role="tablist" aria-label="Board view">
                <button className={view === "table" ? "is-active" : ""} onClick={() => setView("table")} role="tab" aria-selected={view === "table"}><Rows weight="bold" />Table</button>
                <button className={view === "board" ? "is-active" : ""} onClick={() => setView("board")} role="tab" aria-selected={view === "board"}><Kanban weight="bold" />Board</button>
              </div>
              <div className="workspace-toolbar-actions">
                <button className={`workspace-filter-button ${mineOnly ? "is-active" : ""}`} onClick={() => setMineOnly((value) => !value)} aria-pressed={mineOnly}><FunnelSimple weight="bold" />{mineOnly ? "Mine only" : "Filter"}</button>
                <button className="workspace-primary-button" onClick={() => setComposerOpen(true)}><Plus weight="bold" />New task</button>
              </div>
            </div>

            <AnimatePresence>
              {composerOpen && (
                <m.form
                  className="workspace-composer"
                  onSubmit={(event) => { event.preventDefault(); addTask(); }}
                  initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                >
                  <span className="workspace-composer-check"><Plus weight="bold" /></span>
                  <label htmlFor="new-task">Task name</label>
                  <input id="new-task" autoFocus value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="What needs to get done?" />
                  <button className="workspace-primary-button" type="submit">Add task</button>
                  <button className="workspace-icon-button" type="button" onClick={() => setComposerOpen(false)} aria-label="Cancel new task"><X weight="bold" /></button>
                </m.form>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={view}
                variants={viewVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                exit={reduceMotion ? undefined : "exit"}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              >
                {view === "table" ? (
                  <TaskTable tasks={filteredTasks} onCycleStatus={cycleStatus} />
                ) : (
                  <TaskBoard tasks={filteredTasks} onCycleStatus={cycleStatus} />
                )}
              </m.div>
            </AnimatePresence>

            {filteredTasks.length === 0 && (
              <div className="workspace-empty">
                <MagnifyingGlass weight="regular" />
                <h2>No matching work</h2>
                <p>Try another search or turn off the current filter.</p>
                <button onClick={() => { setQuery(""); setMineOnly(false); }}>Clear filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </LazyMotion>
  );
}

function TaskTable({ tasks, onCycleStatus }: { tasks: Task[]; onCycleStatus: (id: number) => void }) {
  const groups: Task["group"][] = ["This week", "Next up"];
  return (
    <div className="workspace-table-wrap">
      {groups.map((group) => {
        const groupTasks = tasks.filter((task) => task.group === group);
        if (!groupTasks.length) return null;
        return (
          <section className="workspace-task-group" key={group}>
            <div className="workspace-group-heading">
              <span className={`group-accent ${group === "Next up" ? "is-next" : ""}`} />
              <CaretDown weight="bold" />
              <h2>{group}</h2>
              <span>{groupTasks.length} tasks</span>
              <button aria-label={`${group} options`}><DotsThree weight="bold" /></button>
            </div>
            <div className="workspace-table" role="table" aria-label={`${group} tasks`}>
              <div className="workspace-table-row workspace-table-header" role="row">
                <span role="columnheader">Task</span><span role="columnheader">Owner</span><span role="columnheader">Status</span><span role="columnheader">Weight</span><span role="columnheader">Due</span><span aria-hidden="true" />
              </div>
              {groupTasks.map((task) => (
                <div className="workspace-table-row" role="row" key={task.id}>
                  <div className="workspace-task-name" role="cell"><button className="workspace-check" aria-label={`Mark ${task.name} complete`} onClick={() => onCycleStatus(task.id)}>{task.status === "Done" && <Check weight="bold" />}</button><strong>{task.name}</strong></div>
                  <div className="workspace-owner" role="cell"><span className={`person-avatar person-${task.ownerName.split(" ")[0].toLowerCase()}`}>{task.owner}</span><span>{task.ownerName}</span></div>
                  <button className="workspace-status-button" role="cell" onClick={() => onCycleStatus(task.id)} aria-label={`Change status for ${task.name}. Current status ${task.status}`}><StatusBadge status={task.status} /></button>
                  <div role="cell"><WeightBadge weight={task.weight} /></div>
                  <div className="workspace-due" role="cell"><CalendarBlank weight="regular" /><span>{task.due}</span></div>
                  <button className="workspace-row-menu" aria-label={`More options for ${task.name}`}><DotsThree weight="bold" /></button>
                </div>
              ))}
              <button className="workspace-add-row" onClick={() => document.querySelector<HTMLButtonElement>(".workspace-primary-button")?.click()}><Plus weight="bold" />Add task</button>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TaskBoard({ tasks, onCycleStatus }: { tasks: Task[]; onCycleStatus: (id: number) => void }) {
  return (
    <div className="workspace-kanban">
      {statusOrder.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <section className="workspace-kanban-column" key={status}>
            <div className="workspace-kanban-heading"><StatusBadge status={status} /><span>{columnTasks.length}</span><button aria-label={`${status} column options`}><DotsThree weight="bold" /></button></div>
            <div className="workspace-kanban-stack">
              {columnTasks.map((task) => (
                <button className="workspace-kanban-card" onClick={() => onCycleStatus(task.id)} key={task.id}>
                  <strong>{task.name}</strong>
                  <span className="workspace-kanban-meta"><span className={`person-avatar person-${task.ownerName.split(" ")[0].toLowerCase()}`}>{task.owner}</span><span><WeightBadge weight={task.weight} /></span><span className="workspace-card-due"><CalendarBlank />{task.due}</span></span>
                </button>
              ))}
              {!columnTasks.length && <div className="workspace-column-empty">Drop work here</div>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
