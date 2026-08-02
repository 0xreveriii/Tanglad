"use client";

import { CheckCircle, Gauge, Scales, Sparkle } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useStableReducedMotion } from "./motion-primitives";

const stages = [
  {
    title: "Give the task context.",
    body: "Complexity, time demand, skill demand, and project impact become a shared basis for task weight.",
    icon: Sparkle,
  },
  {
    title: "See the actual load.",
    body: "Tanglad reads cumulative weight across the team, not the number of completed checkboxes.",
    icon: Gauge,
  },
  {
    title: "Find a fairer balance.",
    body: "Weighted distribution identifies overloaded and underutilized members, then proposes a clearer assignment.",
    icon: Scales,
  },
  {
    title: "Keep people in control.",
    body: "Recommendations remain suggestive. Final decisions always stay with the team.",
    icon: CheckCircle,
  },
];

export function WeightStory() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useStableReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const railScale = useTransform(scrollYProgress, [0, 1], [0.04, 1]);
  const fieldRotate = useTransform(scrollYProgress, [0, 0.32, 0.68, 0.75, 1], [-4, -1, 1, 0, 0]);
  const fieldScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.02, 1]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const copyFilter = useTransform(scrollYProgress, [0, 0.07, 0.93, 1], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(8px)"]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(stages.length - 1, Math.floor(value * stages.length));
    if (next !== active) setActive(next);
  });

  const ActiveIcon = stages[active].icon;

  return (
    <section className="method-story" id="method" ref={ref}>
      <div className="method-sticky">
        <motion.div className="method-copy" style={{ opacity: copyOpacity, filter: copyFilter }}>
          <span className="method-kicker">A weight-aware method</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="method-stage-copy"
              initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -24, filter: "blur(6px)" }}
              transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="stage-count">0{active + 1}</span>
              <ActiveIcon className="stage-icon" weight="light" />
              <h2>{stages[active].title}</h2>
              <p>{stages[active].body}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div className="weight-field-shell" style={{ rotate: fieldRotate, scale: fieldScale }}>
          <div className="weight-field">
            <div className="weight-orbit orbit-one" />
            <div className="weight-orbit orbit-two" />
            <AnimatePresence mode="popLayout">
              {stages.map((stage, index) => (
                index <= active && (
                  <motion.div
                    className={`weight-node node-${index + 1}`}
                    key={stage.title}
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.65 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  >
                    <span>{["Complexity", "Time", "Impact", "Choice"][index]}</span>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            <motion.div className="balance-core" animate={{ rotate: 0 }}>
              <Scales weight="light" />
              <span>Balanced view</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="method-rail" aria-hidden="true">
          <span className="method-rail-track" />
          <motion.span className="method-rail-progress" style={{ scaleY: railScale }} />
          <div className="method-rail-steps">
            {stages.map((stage, index) => (
              <span className={`method-rail-step${index === active ? " is-active" : ""}${index < active ? " is-complete" : ""}`} key={stage.title}>
                <em>0{index + 1}</em>
                <i />
              </span>
            ))}
          </div>
        </div>
        <span className="section-dissolve" aria-hidden="true" />
      </div>
    </section>
  );
}
