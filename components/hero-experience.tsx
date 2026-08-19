"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ChibiTanglad } from "./chibi-tanglad";
import { useStableReducedMotion } from "./motion-primitives";

const heroCopyVisible = { opacity: 1, y: 0, filter: "blur(0px)" };
const heroHeadingHidden = { opacity: 0, y: 30, filter: "blur(8px)" };
const heroSummaryHidden = { opacity: 0, y: 22, filter: "blur(7px)" };
const heroCtaHidden = { opacity: 0, y: 18, filter: "blur(6px)" };
const heroVisualHidden = { opacity: 0, y: 42, scale: 0.92, filter: "blur(14px)" };
const heroVisualVisible = { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };

export function HeroExperience() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useStableReducedMotion();
  const heroInView = useInView(ref, { amount: 0.12 });
  const entranceActive = reduce || heroInView;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 0.72], [0, -88]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.62, 0.92], [1, 0.88, 0]);
  const lineScale = useTransform(scrollYProgress, [0, 0.8], [0.2, 1]);

  return (
    <section className="hero-shell" id="top" ref={ref}>
      <div className="hero-sticky">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <motion.h1
            initial={reduce ? heroCopyVisible : heroHeadingHidden}
            animate={entranceActive ? heroCopyVisible : heroHeadingHidden}
            transition={{ delay: 0.24, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Fair work<br /><span>has weight.</span>
          </motion.h1>
          <motion.p
            className="hero-summary"
            initial={reduce ? heroCopyVisible : heroSummaryHidden}
            animate={entranceActive ? heroCopyVisible : heroSummaryHidden}
            transition={{ delay: 0.4, duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
          >
            Tanglad is a collaborative project tracker that brings clarity to commitments, context to progress, and fairness to every contribution.
          </motion.p>
          <motion.a
            className="primary-cta"
            href="/app"
            initial={reduce ? heroCopyVisible : heroCtaHidden}
            animate={entranceActive ? heroCopyVisible : heroCtaHidden}
            transition={{ delay: 0.54, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reduce ? undefined : { scale: 1.018 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
          >
            <span>Get Started</span>
            <span className="cta-icon"><ArrowRight weight="light" /></span>
          </motion.a>
        </motion.div>

        <motion.div
          className="hero-visual-shell"
          initial={reduce ? heroVisualVisible : heroVisualHidden}
          animate={entranceActive ? heroVisualVisible : heroVisualHidden}
          transition={{ delay: 0.16, duration: 1.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChibiTanglad />
        </motion.div>

        <motion.div className="hero-progress" style={{ scaleX: lineScale }} aria-hidden="true" />
      </div>
    </section>
  );
}
