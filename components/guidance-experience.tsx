"use client";

import { CirclesThreePlus, Scales, SlidersHorizontal, UsersThree } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const evidence = [
  { label: "Task weight", icon: SlidersHorizontal },
  { label: "Team load", icon: Scales },
  { label: "Project context", icon: CirclesThreePlus },
];

const particles = Array.from({ length: 42 }, (_, index) => {
  const track = index % 3;
  const step = Math.floor(index / 3) / 13;
  const origins = [19, 50, 81];
  const eased = step * step * (3 - 2 * step);
  return {
    left: 27 + step * 42,
    top: origins[track] + (50 - origins[track]) * eased,
    size: 3 + ((index * 7) % 6),
    delay: -((index % 14) * 0.13),
  };
});

export function GuidanceExperience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const copyY = useTransform(scrollYProgress, [0, 0.48, 1], [34, 0, -24]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.12, 0.82, 1], [0.08, 1, 1, 0]);
  const copyFilter = useTransform(scrollYProgress, [0, 0.14, 0.84, 1], ["blur(9px)", "blur(0px)", "blur(0px)", "blur(7px)"]);
  const fieldScale = useTransform(scrollYProgress, [0.02, 0.55], [0.94, 1]);
  const fieldOpacity = useTransform(scrollYProgress, [0.02, 0.34], [0.35, 1]);
  const recommendationScale = useTransform(scrollYProgress, [0.28, 0.62], [0.82, 1]);
  const decisionX = useTransform(scrollYProgress, [0.5, 0.8], [28, 0]);
  const decisionOpacity = useTransform(scrollYProgress, [0.5, 0.72], [0.25, 1]);

  return (
    <section className="guidance-story" id="principles" ref={ref}>
      <div className="guidance-sticky page-frame">
        <motion.div className="guidance-copy" style={{ y: copyY, opacity: copyOpacity, filter: copyFilter }}>
          <h2>Guidance, with the team still in control.</h2>
          <p>Tanglad turns task and workload context into evidence-based recommendations. The final decision always stays with the team.</p>
        </motion.div>

        <motion.div className="guidance-field" style={{ scale: fieldScale, opacity: fieldOpacity }} aria-label="Task weight, team load, and project context flow into a recommendation, while the team retains the final decision">
          <div className="guidance-evidence">
            {evidence.map((item) => {
              const Icon = item.icon;
              return <div className="guidance-source" key={item.label}><Icon weight="light" /><span>{item.label}</span></div>;
            })}
          </div>

          <div className="guidance-streams" aria-hidden="true">
            <span className="guidance-stream stream-top" />
            <span className="guidance-stream stream-middle" />
            <span className="guidance-stream stream-bottom" />
            <div className="guidance-particles">
              {particles.map((particle, index) => (
                <i key={index} style={{ left: `${particle.left}%`, top: `${particle.top}%`, width: particle.size, height: particle.size, animationDelay: `${particle.delay}s` }} />
              ))}
            </div>
          </div>

          <motion.div className="guidance-recommendation" style={{ scale: recommendationScale }}>
            <small>Evidence-based</small><strong>Recommendation</strong>
          </motion.div>
          <span className="authority-gap" aria-hidden="true"><i /><i /><i /></span>
          <motion.div className="guidance-decision" style={{ x: decisionX, opacity: decisionOpacity }}>
            <UsersThree weight="light" /><small>Final authority</small><strong>Team decision</strong>
          </motion.div>
        </motion.div>
      </div>
      <span className="section-dissolve" aria-hidden="true" />
    </section>
  );
}
