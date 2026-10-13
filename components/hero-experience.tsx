"use client";

import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useStableReducedMotion } from "./motion-primitives";

export function HeroExperience() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useStableReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <section className="studio-hero" id="top" ref={ref} aria-labelledby="studio-hero-heading">
      <div className="studio-hero-stage">
        <div className="studio-hero-atmosphere" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <motion.div className="studio-hero-art" aria-hidden="true"
          style={reduce ? undefined : { y: artY, scale: artScale }}>
          <motion.div className="studio-hero-art-drift"
            animate={reduce ? { y: 0 } : { y: [0, -7, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
            <Image className="studio-hero-art-wide" src="/images/tanglad-task-still-life-refined.png" alt="" fill priority unoptimized
              sizes="(max-width: 767px) 100vw, 1600px" />
            <Image className="studio-hero-art-compact" src="/images/tanglad-task-still-life-mobile-refined.png" alt="" fill unoptimized
              sizes="(max-width: 767px) 100vw, 600px" />
          </motion.div>
        </motion.div>

        <motion.div className="studio-hero-copy-motion" style={reduce ? undefined : { y: copyY }}>
          <motion.div className="studio-hero-copy"
            initial={reduce ? false : { opacity: 1, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <span className="studio-hero-kicker">Less guesswork. More perspective.</span>
            <h1 id="studio-hero-heading">Fair work<br /><span>has weight.</span></h1>
            <p>Plan together. Track progress. See the effort behind every task, so your team can share the work with more context.</p>
            <Link className="studio-hero-cta" href="/app">
              <span>Explore Tanglad</span>
              <ArrowRight size={18} weight="regular" aria-hidden="true" />
            </Link>
            <a className="studio-hero-method" href="#method">See how task weight works <ArrowDown size={16} aria-hidden="true" /></a>
          </motion.div>
        </motion.div>

        <div className="studio-hero-footnote">
          <span>Task weight considers</span>
          <p>Complexity <i aria-hidden="true" /> Time demand <i aria-hidden="true" /> Skill demand <i aria-hidden="true" /> Project impact</p>
        </div>
      </div>
    </section>
  );
}
