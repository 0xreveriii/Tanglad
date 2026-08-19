"use client";

import { CheckCircle, CirclesThreePlus, Gauge, Scales, SlidersHorizontal, UsersThree } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useStableReducedMotion } from "./motion-primitives";

const entranceEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const previewVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.975, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.82, ease: entranceEase, delayChildren: 0.06, staggerChildren: 0.1 },
  },
};

const layerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: entranceEase } },
};

const groupVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: entranceEase, delayChildren: 0.05, staggerChildren: 0.065 },
  },
};

const tasks = [
  { name: "Refine onboarding flow", context: "Product / In progress", owner: "AM", weight: "High", tone: "high" },
  { name: "Document edge cases", context: "Engineering / Ready", owner: "JK", weight: "Medium", tone: "medium" },
  { name: "Draft research summary", context: "Research / Review", owner: "RL", weight: "Light", tone: "light" },
];

const signals = [
  { label: "Complexity", value: "High", tone: "high" },
  { label: "Time demand", value: "Medium", tone: "medium" },
  { label: "Skill demand", value: "Light", tone: "light" },
  { label: "Project impact", value: "High", tone: "high" },
];

export function SystemUiPreview({ active }: { active: boolean }) {
  const reduce = useStableReducedMotion();

  return (
    <motion.div
      className="system-preview"
      role="img"
      aria-label="Tanglad workspace preview showing current tasks, weight signals, and a balanced recommendation"
      variants={previewVariants}
      initial={reduce ? "visible" : "hidden"}
      animate={active ? "visible" : "hidden"}
    >
      <motion.div className="system-preview-topbar" variants={layerVariants}>
        <div className="system-preview-brand">
          <span className="system-preview-brand-mark">T</span>
          <strong>Tanglad</strong>
          <span>Workspace</span>
        </div>
        <div className="system-preview-topbar-actions">
          <span className="system-preview-live"><i />Live</span>
          <span className="system-preview-avatar">AM</span>
        </div>
      </motion.div>

      <motion.div className="system-preview-body" variants={groupVariants}>
        <motion.aside className="system-preview-sidebar" aria-hidden="true" variants={layerVariants}>
          <span className="system-preview-side-label">Workspace</span>
          <div className="system-preview-nav is-active"><CirclesThreePlus weight="light" /><span>Overview</span></div>
          <div className="system-preview-nav"><Gauge weight="light" /><span>Workload</span></div>
          <div className="system-preview-nav"><UsersThree weight="light" /><span>People</span></div>
          <div className="system-preview-nav"><SlidersHorizontal weight="light" /><span>Signals</span></div>
          <div className="system-preview-sidebar-spacer" />
          <div className="system-preview-nav"><SlidersHorizontal weight="light" /><span>Settings</span></div>
        </motion.aside>

        <motion.main className="system-preview-main" variants={groupVariants}>
          <motion.div className="system-preview-main-heading" variants={layerVariants}>
            <div>
              <span className="system-preview-kicker">Team balance</span>
              <h3>Work overview</h3>
            </div>
            <span className="system-preview-add">Review work</span>
          </motion.div>

          <motion.div className="system-preview-stat-grid" variants={groupVariants}>
            <motion.div className="system-preview-stat" variants={layerVariants}>
              <span>Open work</span>
              <strong>In motion</strong>
              <small>Across the team</small>
            </motion.div>
            <motion.div className="system-preview-stat" variants={layerVariants}>
              <span>Shared load</span>
              <strong>Balanced</strong>
              <small>Context included</small>
            </motion.div>
            <motion.div className="system-preview-stat" variants={layerVariants}>
              <span>Next signal</span>
              <strong>Needs review</strong>
              <small>Before assignment</small>
            </motion.div>
          </motion.div>

          <motion.div className="system-preview-content-grid" variants={groupVariants}>
            <motion.section className="system-preview-panel system-preview-work-panel" variants={layerVariants}>
              <div className="system-preview-panel-heading">
                <div>
                  <span>Current work</span>
                  <strong>Task weight</strong>
                </div>
                <span className="system-preview-filter">All work</span>
              </div>

              <motion.div className="system-preview-task-list" variants={groupVariants}>
                {tasks.map((task) => (
                  <motion.div className="system-preview-task" key={task.name} variants={layerVariants}>
                    <span className={"system-preview-task-check is-" + task.tone}><CheckCircle weight="fill" /></span>
                    <div className="system-preview-task-copy">
                      <strong>{task.name}</strong>
                      <small>{task.context}</small>
                    </div>
                    <span className={"system-preview-weight is-" + task.tone}>{task.weight}</span>
                    <span className="system-preview-task-owner">{task.owner}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            <motion.section className="system-preview-panel system-preview-signal-panel" variants={layerVariants}>
              <div className="system-preview-panel-heading">
                <div>
                  <span>Weight signals</span>
                  <strong>Why it counts</strong>
                </div>
                <Scales weight="light" />
              </div>

              <motion.div className="system-preview-signal-list" variants={groupVariants}>
                {signals.map((signal) => (
                  <motion.div className="system-preview-signal" key={signal.label} variants={layerVariants}>
                    <span>{signal.label}</span>
                    <strong className={"is-" + signal.tone}>{signal.value}</strong>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div className="system-preview-recommendation" variants={layerVariants}>
                <span>Suggested next move</span>
                <strong>Pair high-weight work with lighter work.</strong>
              </motion.div>
            </motion.section>
          </motion.div>
        </motion.main>
      </motion.div>
    </motion.div>
  );
}