"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useStableReducedMotion } from "./motion-primitives";
import { MosaicLemongrass } from "./mosaic-lemongrass";

export function HeroExperience() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useStableReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 0.72], [0, -88]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.62, 0.92], [1, 0.88, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.86]);
  const imageX = useTransform(scrollYProgress, [0, 0.85], [0, 74]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.85], [0, 2.5]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 0.92, 0.1]);
  const lineScale = useTransform(scrollYProgress, [0, 0.8], [0.2, 1]);

  return (
    <section className="hero-shell" id="top" ref={ref}>
      <div className="hero-sticky">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Fair work<br /><span>has weight.</span>
          </motion.h1>
          <motion.p
            className="hero-summary"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.75 }}
          >
            Tanglad is a collaborative project tracker that brings clarity to commitments, context to progress, and fairness to every contribution.
          </motion.p>
          <motion.a
            className="primary-cta"
            href="#method"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.7 }}
            whileHover={reduce ? undefined : { scale: 1.018 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
          >
            <span>Get Started</span>
            <span className="cta-icon"><ArrowRight weight="light" /></span>
          </motion.a>
        </motion.div>

        <motion.div
          className="hero-visual-shell"
          style={{ scale: imageScale, x: imageX, rotate: imageRotate, opacity: imageOpacity }}
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.18, duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-isometric-shell">
            <div className="hero-visual-core hero-mosaic-core">
              <MosaicLemongrass />
              <span className="hero-mosaic-vignette" aria-hidden="true" />
            </div>
          </div>
        </motion.div>

        <motion.div className="hero-progress" style={{ scaleX: lineScale }} aria-hidden="true" />
      </div>
    </section>
  );
}
