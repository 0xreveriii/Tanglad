"use client";

import { ArrowDown, CheckCircle, Scales, SlidersHorizontal } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function DecisionVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pathScale = useTransform(scrollYProgress, [0.08, 0.72], [0, 1]);
  const inputX = useTransform(scrollYProgress, [0.08, 0.45], [-30, 0]);
  const loadX = useTransform(scrollYProgress, [0.08, 0.45], [30, 0]);
  const resultScale = useTransform(scrollYProgress, [0.28, 0.66], [0.78, 1]);

  return (
    <div className="decision-visual-shell" ref={ref} aria-label="Tanglad turns task and workload evidence into a recommendation while the team keeps the final decision">
      <div className="decision-visual">
        <div className="decision-inputs">
          <motion.div className="decision-node" style={{ x: inputX }}>
            <SlidersHorizontal weight="light" />
            <span>Task weight</span>
          </motion.div>
          <motion.div className="decision-node" style={{ x: loadX }}>
            <Scales weight="light" />
            <span>Team load</span>
          </motion.div>
        </div>

        <div className="decision-path" aria-hidden="true">
          <motion.span style={{ scaleY: pathScale }} />
          <ArrowDown weight="light" />
        </div>

        <motion.div className="recommendation-node" style={{ scale: resultScale }}>
          <small>Evidence-based</small>
          <strong>Recommendation</strong>
        </motion.div>

        <div className="decision-path path-short" aria-hidden="true">
          <motion.span style={{ scaleY: pathScale }} />
          <ArrowDown weight="light" />
        </div>

        <motion.div className="team-choice-node" style={{ scale: resultScale }}>
          <CheckCircle weight="light" />
          <div><small>Final authority</small><strong>The team decides</strong></div>
        </motion.div>
      </div>
    </div>
  );
}
