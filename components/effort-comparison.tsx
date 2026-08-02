"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SystemUiPreview } from "./system-ui-preview";
import { useStableReducedMotion } from "./motion-primitives";

const copyEntranceEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const copyEntranceVariants = {
  hidden: { opacity: 0, y: 26, filter: "blur(9px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.78, ease: copyEntranceEase },
  },
};

export function EffortComparison() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useStableReducedMotion();
  const sectionInView = useInView(ref, { amount: 0.12 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0.03, 1]);
  const copyY = useTransform(scrollYProgress, [0, 0.66, 1], [34, 0, -24]);
  const visualY = useTransform(scrollYProgress, [0, 0.58, 1], [52, 0, -18]);
  const visualScale = useTransform(scrollYProgress, [0, 0.52, 1], [0.94, 1, 0.985]);
  const entranceActive = reduce || sectionInView;

  return (
    <section className="product-story" id="product" ref={ref}>
      <div className="product-sticky page-frame">
        <motion.div className="product-copy" style={{ y: copyY }}>
          <motion.div
            className="product-copy-entrance"
            variants={copyEntranceVariants}
            initial={reduce ? "visible" : "hidden"}
            animate={entranceActive ? "visible" : "hidden"}
          >
            <span className="mono-label">Why weighting matters</span>
            <h2>Same count.<br /><span>Different work.</span></h2>
            <p>A checkbox records completion. Tanglad also considers what the task demanded from the person behind it.</p>
          </motion.div>
        </motion.div>

        <motion.div className="system-preview-motion" style={{ y: reduce ? 0 : visualY, scale: reduce ? 1 : visualScale }}>
          <SystemUiPreview active={entranceActive} />
        </motion.div>

        <div className="product-progress" aria-hidden="true"><motion.span style={{ scaleX: progress }} /></div>
      </div>
    </section>
  );
}