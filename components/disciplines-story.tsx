"use client";

import { CirclesFour, Code, Flask, GraduationCap, PenNib, UsersThree } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const disciplines = [
  { name: "Developers", icon: Code },
  { name: "Researchers", icon: Flask },
  { name: "Designers", icon: CirclesFour },
  { name: "Writers", icon: PenNib },
  { name: "Students", icon: GraduationCap },
  { name: "Team leads", icon: UsersThree },
];

export function DisciplinesStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const outerRotate = useTransform(scrollYProgress, [0, 1], [-34, 96]);
  const innerRotate = useTransform(scrollYProgress, [0, 1], [26, -72]);
  const ringScale = useTransform(scrollYProgress, [0.05, 0.72], [0.72, 1.08]);
  const chipsScale = useTransform(scrollYProgress, [0.08, 0.55], [0.52, 1]);
  const chipsOpacity = useTransform(scrollYProgress, [0.08, 0.34], [0, 1]);
  const coreScale = useTransform(scrollYProgress, [0.15, 0.55], [0.82, 1]);
  const copyY = useTransform(scrollYProgress, [0, 0.5], [42, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.12, 0.82, 1], [0.08, 1, 1, 0]);
  const copyFilter = useTransform(scrollYProgress, [0, 0.14, 0.84, 1], ["blur(9px)", "blur(0px)", "blur(0px)", "blur(7px)"]);

  return (
    <section className="disciplines-story" ref={ref}>
      <div className="disciplines-sticky page-frame">
        <motion.div className="disciplines-copy" style={{ y: copyY, opacity: copyOpacity, filter: copyFilter }}>
          <h2>One system.<br />Every discipline.</h2>
          <p>Technical and non-technical contributions belong in the same conversation. Tanglad values both without forcing teams into role-specific workflows.</p>
        </motion.div>

        <div className="discipline-field" aria-label="Teams Tanglad is designed for">
          <motion.div className="discipline-ring ring-outer" style={{ rotate: outerRotate, scale: ringScale }} />
          <motion.div className="discipline-ring ring-inner" style={{ rotate: innerRotate, scale: ringScale }} />
          <motion.div className="discipline-core" style={{ scale: coreScale }}>
            <span>Role-agnostic</span><strong>by design</strong>
          </motion.div>
          <motion.div className="discipline-chips" style={{ scale: chipsScale, opacity: chipsOpacity }}>
            {disciplines.map((discipline, index) => {
              const Icon = discipline.icon;
              return (
                <div className={`discipline-chip chip-${index + 1}`} key={discipline.name}>
                  <Icon weight="light" />
                  <span>{discipline.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
      <span className="section-dissolve" aria-hidden="true" />
    </section>
  );
}
