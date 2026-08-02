"use client";

import { ArrowDownRight } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function ClosingExperience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const orbitARotate = useTransform(scrollYProgress, [0, 1], [-18, 32]);
  const orbitBRotate = useTransform(scrollYProgress, [0, 1], [22, -28]);
  const orbitScale = useTransform(scrollYProgress, [0.08, 0.52, 0.94], [0.86, 1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0.08, 0.52, 0.94], [46, 0, -26]);
  const contentOpacity = useTransform(scrollYProgress, [0.04, 0.24, 0.78, 0.98], [0, 1, 1, 0]);
  const contentFilter = useTransform(scrollYProgress, [0.04, 0.24, 0.8, 0.98], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  const markRotate = useTransform(scrollYProgress, [0.12, 0.82], [-16, 12]);
  const markScale = useTransform(scrollYProgress, [0.12, 0.48], [0.78, 1]);

  return (
    <section className="closing-section" ref={ref}>
      <motion.div className="closing-orbit orbit-a" style={{ rotate: orbitARotate, scale: orbitScale }} aria-hidden="true" />
      <motion.div className="closing-orbit orbit-b" style={{ rotate: orbitBRotate, scale: orbitScale }} aria-hidden="true" />
      <motion.div className="closing-ambient" style={{ scale: orbitScale }} aria-hidden="true" />
      <motion.div className="closing-content" style={{ y: contentY, opacity: contentOpacity, filter: contentFilter }}>
        <motion.span className="closing-mark" style={{ rotate: markRotate, scale: markScale }}>T</motion.span>
        <h2>Make contribution visible.</h2>
        <p>A fairer project starts with seeing the weight each person carries.</p>
        <motion.a className="primary-cta closing-cta" href="#method" whileHover={{ scale: 1.018 }} whileTap={{ scale: 0.98 }}>
          <span>See the method</span>
          <span className="cta-icon"><ArrowDownRight weight="light" /></span>
        </motion.a>
      </motion.div>
      <span className="section-dissolve" aria-hidden="true" />
    </section>
  );
}
