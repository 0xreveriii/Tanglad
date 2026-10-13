"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { useStableReducedMotion } from "./motion-primitives";

const roles = [
  {
    number: "01",
    title: "Describe the task",
    panelLabel: null,
    art: "task",
  },
  {
    number: "02",
    title: "Assess the effort",
    panelLabel: "Complexity · time · skill · impact",
    art: "weight",
  },
  {
    number: "03",
    title: "Discuss the balance",
    panelLabel: null,
    art: "balance",
  },
] as const;

const itemEntrance = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const cardEntrance = {
  hidden: { opacity: 0.2, y: 82, scale: 0.84 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.018,
    transition: { type: "spring" as const, stiffness: 240, damping: 26, mass: 0.7 },
  },
};

function DisciplineArtwork({
  kind,
}: {
  kind: (typeof roles)[number]["art"];
}) {
  const artRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: artRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 28,
    mass: 0.7,
    restDelta: 0.001,
  });
  const y = useTransform(progress, [0, 0.4, 1], [22, 0, -18]);
  const scale = useTransform(progress, [0, 0.34, 0.62, 1], [0.76, 0.93, 1.1, 1.2]);
  const rotate = useTransform(progress, [0, 0.5, 1], [-3, 0, 3]);

  return (
    <motion.figure
      ref={artRef}
      className={"discipline-card-art discipline-art-" + kind}
      style={{ y, scale, rotate }}
      aria-hidden="true"
    >
      {kind === "task" && (
        <svg viewBox="0 0 260 190" focusable="false">
          <ellipse cx="135" cy="166" rx="83" ry="13" fill="currentColor" opacity=".12" />
          <g transform="rotate(-8 132 94)">
            <rect x="51" y="39" width="155" height="106" rx="16" fill="currentColor" opacity=".16" />
            <rect x="62" y="27" width="155" height="106" rx="16" fill="currentColor" opacity=".3" />
            <rect x="73" y="15" width="155" height="126" rx="17" className="discipline-art-paper" />
            <path d="M93 43h63M93 57h91" className="discipline-art-line" />
            <rect x="93" y="75" width="47" height="39" rx="10" fill="currentColor" opacity=".16" />
            <path d="M153 82h53M153 95h43M153 108h36" className="discipline-art-line" />
            <circle cx="116" cy="94" r="8" fill="currentColor" opacity=".72" />
          </g>
          <path d="M47 151c33 11 75 17 119 8" className="discipline-art-line discipline-art-line-soft" />
        </svg>
      )}
      {kind === "weight" && (
        <svg viewBox="0 0 260 190" focusable="false">
          <circle cx="132" cy="94" r="72" fill="currentColor" opacity=".13" />
          <circle cx="132" cy="94" r="58" className="discipline-art-paper" />
          <circle cx="132" cy="94" r="40" className="discipline-art-ring" />
          <path d="M132 47v85M95 70l37 24 37-24M103 126h58" className="discipline-art-line" />
          <circle cx="132" cy="94" r="10" fill="currentColor" />
          <circle cx="95" cy="70" r="8" className="discipline-art-paper" />
          <circle cx="169" cy="70" r="8" className="discipline-art-paper" />
          <circle cx="103" cy="126" r="8" className="discipline-art-paper" />
          <circle cx="161" cy="126" r="8" className="discipline-art-paper" />
          <path d="M70 161c34 10 85 11 125 0" className="discipline-art-line discipline-art-line-soft" />
        </svg>
      )}
      {kind === "balance" && (
        <svg viewBox="0 0 260 190" focusable="false">
          <ellipse cx="131" cy="163" rx="82" ry="12" fill="currentColor" opacity=".12" />
          <path d="M57 131c28-23 51-32 75-28 24 4 47 13 72 3" className="discipline-art-line" />
          <g transform="rotate(-8 87 93)">
            <rect x="49" y="51" width="67" height="71" rx="13" fill="currentColor" opacity=".24" />
            <rect x="57" y="44" width="67" height="71" rx="13" className="discipline-art-paper" />
            <path d="M71 65h38M71 78h28M71 91h34" className="discipline-art-line" />
          </g>
          <g transform="rotate(7 174 91)">
            <rect x="145" y="39" width="67" height="82" rx="13" fill="currentColor" opacity=".2" />
            <rect x="137" y="47" width="67" height="82" rx="13" className="discipline-art-paper" />
            <path d="M152 68h36M152 81h26M152 94h32" className="discipline-art-line" />
            <circle cx="187" cy="108" r="6" fill="currentColor" opacity=".72" />
          </g>
          <circle cx="131" cy="105" r="9" fill="currentColor" />
        </svg>
      )}
    </motion.figure>
  );
}

export function DisciplinesStory() {
  const reduceMotion = useStableReducedMotion();

  return (
    <section className="disciplines-story">
      <div className="disciplines-layout page-frame">
        <motion.div
          className="disciplines-copy"
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: false, amount: 0.18 }}
          variants={itemEntrance}
        >
          <h2>
            A fairer view of
            <br />
            <span>the whole team.</span>
          </h2>
          <p>
            Research, design, writing, and coordination all shape a project.
            Tanglad gives teams one shared way to talk about the effort behind
            each task.
          </p>
        </motion.div>

        <ul
          className="discipline-cards"
          aria-label="Steps for discussing task effort"
        >
          {roles.map((role, index) => (
            <motion.li
              className={"discipline-card-shell discipline-card-" + role.number}
              key={role.number}
              initial={reduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              whileHover={reduceMotion ? undefined : "hover"}
              viewport={{ once: false, amount: 0.28 }}
              variants={cardEntrance}
              transition={{
                type: "spring",
                stiffness: 108,
                damping: 23,
                mass: 0.86,
                delay: reduceMotion ? 0 : index * 0.11,
              }}
            >
              <article className="discipline-card">
                <div className="discipline-card-copy">
                  {role.panelLabel && (
                    <span className="discipline-card-kicker">{role.panelLabel}</span>
                  )}
                  <h3>{role.title}</h3>
                </div>
                <div className="discipline-card-panel">
                  <DisciplineArtwork kind={role.art} />
                  <span className="discipline-card-number">{role.number}</span>
                  <span className="discipline-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
