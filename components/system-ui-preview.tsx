"use client";

import {
  ArrowLeft,
  Bell,
  CalendarCheck,
  CaretDown,
  ChartBar,
  ChatCircle,
  CirclesFour,
  ClockCounterClockwise,
  DotsNine,
  DotsThree,
  FileText,
  FolderSimple,
  Gear,
  House,
  Lock,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Question,
  Rows,
  SidebarSimple,
  Star,
  TrayIcon,
  UserPlus,
  UsersThree,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useStableReducedMotion } from "./motion-primitives";

const entranceEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const previewVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.82,
      ease: entranceEase,
      delayChildren: 0.08,
      staggerChildren: 0.085,
    },
  },
};

const groupVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: entranceEase,
      delayChildren: 0.06,
      staggerChildren: 0.055,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: entranceEase } },
};

const workspaceSections = [
  { label: "Manage workspace", icon: House, active: true },
  { label: "Board", icon: Rows, active: false },
  { label: "Insights", icon: ChartBar, active: false },
  { label: "Collaborators", icon: UsersThree, active: false },
  { label: "Permissions", icon: Lock, active: false },
];

const workspaceTabs = [
  { label: "Recents", icon: ClockCounterClockwise, active: true },
  { label: "Content", icon: FolderSimple, active: false },
  { label: "Collaborators", icon: UsersThree, active: false },
  { label: "Permissions", icon: Lock, active: false },
];

const recentlyOpened = [
  { title: "Board", type: "Board", opened: "Opened today", icon: Rows, tone: "board" },
  { title: "Team workload", type: "Insights", opened: "Opened yesterday", icon: ChartBar, tone: "report" },
  { title: "Launch notes", type: "Document", opened: "Opened Aug 17", icon: FileText, tone: "doc" },
];

export function SystemUiPreview({ active }: { active: boolean }) {
  const reduce = useStableReducedMotion();

  return (
    <motion.div
      className="system-preview"
      role="img"
      aria-label="Animated preview of Tanglad’s main workspace, with workspace navigation, recent items, and member controls"
      variants={previewVariants}
      initial={reduce ? "visible" : "hidden"}
      animate={active ? "visible" : "hidden"}
    >
      <motion.header className="system-preview-topbar" variants={itemVariants} aria-hidden="true">
        <div className="system-preview-wordmark">
          <span className="system-preview-app-mark"><CirclesFour weight="fill" /></span>
          <strong>Tanglad</strong>
        </div>
        <div className="system-preview-global-search">
          <MagnifyingGlass weight="bold" />
          <span>Search for anything</span>
          <kbd>Ctrl K</kbd>
        </div>
        <div className="system-preview-topbar-actions">
          <span className="system-preview-notification"><Bell /><i>3</i></span>
          <TrayIcon />
          <UserPlus />
          <Gear />
          <Question />
          <DotsNine weight="bold" />
          <span className="system-preview-avatar">MC</span>
        </div>
      </motion.header>

      <motion.div className="system-preview-body" variants={groupVariants} aria-hidden="true">
        <motion.aside className="system-preview-utility-rail" variants={groupVariants}>
          <div className="system-preview-utility is-active"><CirclesFour /><span>Workspace</span></div>
          <div className="system-preview-utility"><CalendarCheck /><span>My work</span></div>
          <i className="system-preview-rail-divider" />
          <div className="system-preview-utility"><Star /><span>Favorites</span></div>
          <div className="system-preview-utility"><FileText /><span>Docs</span></div>
          <span className="system-preview-rail-spacer" />
          <div className="system-preview-utility system-preview-website"><ArrowLeft /><span>Website</span></div>
        </motion.aside>

        <motion.aside className="system-preview-workspace-nav" variants={groupVariants}>
          <motion.div className="system-preview-workspace-nav-head" variants={itemVariants}>
            <strong>Workspace</strong>
            <span><MagnifyingGlass /><SidebarSimple /></span>
          </motion.div>
          <motion.div className="system-preview-switcher-row" variants={itemVariants}>
            <div className="system-preview-switcher">
              <span className="system-preview-small-mark"><CirclesFour weight="fill" /></span>
              <strong>Main workspace</strong>
              <CaretDown />
            </div>
            <span className="system-preview-add"><Plus /></span>
          </motion.div>
          <nav className="system-preview-workspace-sections">
            {workspaceSections.map(({ label, icon: Icon, active: isActive }) => (
              <motion.div
                className={`system-preview-workspace-link${isActive ? " is-active" : ""}`}
                key={label}
                variants={itemVariants}
              >
                <Icon /><span>{label}</span>
              </motion.div>
            ))}
          </nav>
          <motion.div className="system-preview-storage" variants={itemVariants}>
            <span>Workspace storage</span><strong>UI preview</strong>
          </motion.div>
        </motion.aside>

        <motion.section className="system-preview-main" variants={groupVariants}>
          <div className="system-preview-cover">
            <span><PencilSimple />Change cover</span>
          </div>

          <div className="system-preview-workspace-content">
            <motion.header className="system-preview-workspace-identity" variants={itemVariants}>
              <div className="system-preview-workspace-tile">
                <span className="system-preview-large-mark"><CirclesFour weight="fill" /></span>
                <span className="system-preview-home-badge"><House weight="fill" /></span>
              </div>
              <div className="system-preview-workspace-title">
                <div><h3>Main workspace</h3><CaretDown /></div>
                <span><Plus />Add workspace description</span>
              </div>
              <div className="system-preview-workspace-actions">
                <span><ChatCircle />Feedback</span>
                <span><UsersThree />Collaborators</span>
                <strong>Members</strong>
                <DotsThree weight="bold" />
              </div>
            </motion.header>

            <motion.nav className="system-preview-tabs" variants={itemVariants}>
              {workspaceTabs.map(({ label, icon: Icon, active: isActive }) => (
                <span className={isActive ? "is-active" : ""} key={label}>
                  <Icon />{label}
                </span>
              ))}
            </motion.nav>

            <motion.section className="system-preview-recents" variants={groupVariants}>
              <motion.header variants={itemVariants}>
                <h4>Recently opened</h4><span>View all content</span>
              </motion.header>
              <div className="system-preview-recent-list">
                {recentlyOpened.map(({ title, type, opened, icon: Icon, tone }) => (
                  <motion.div className="system-preview-recent-row" key={title} variants={itemVariants}>
                    <span className={`system-preview-recent-icon is-${tone}`}><Icon /></span>
                    <span className="system-preview-recent-copy"><strong>{title}</strong><small>{type}</small></span>
                    <span className="system-preview-recent-date">{opened}</span>
                    <Star />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
