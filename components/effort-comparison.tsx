"use client";

import { ArrowsClockwise, Lightning, UsersThree } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useStableReducedMotion } from "./motion-primitives";

export function EffortComparison() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useStableReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0.03, 1]);
  const copyY = useTransform(scrollYProgress, [0, 0.66, 1], [34, 0, -24]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.1, 0.82, 1], [0.08, 1, 1, 0]);
  const copyFilter = useTransform(scrollYProgress, [0, 0.12, 0.84, 1], ["blur(9px)", "blur(0px)", "blur(0px)", "blur(7px)"]);
  const visualY = useTransform(scrollYProgress, [0, 0.58, 1], [52, 0, -18]);
  const visualScale = useTransform(scrollYProgress, [0, 0.52, 1], [0.94, 1, 0.985]);
  const sceneRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [62, 56, 60]);
  const sceneRotateZ = useTransform(scrollYProgress, [0, 1], [-16, -5]);

  return (
    <section className="product-story" id="product" ref={ref}>
      <div className="product-sticky page-frame">
        <motion.div className="product-copy" style={{ y: copyY, opacity: copyOpacity, filter: copyFilter }}>
          <span className="mono-label">Why weighting matters</span>
          <h2>Same count.<br /><span>Different work.</span></h2>
          <p>A checkbox records completion. Tanglad also considers what the task demanded from the person behind it.</p>
        </motion.div>

        <motion.div className="round-robin-visual" style={{ y: visualY, scale: visualScale }} aria-label="A continuously rotating weighted round-robin distribution across four team members">
          <div className="round-robin-heading">
            <span><UsersThree weight="light" /> Four available members</span>
            <span><Lightning weight="light" /> Weight-aware order</span>
          </div>

          <div className={`round-robin-stage${reduce ? " is-paused" : ""}`}>
            <motion.div className="round-robin-plane" style={{ rotateX: sceneRotateX, rotateZ: sceneRotateZ }}>
              <span className="rr-orbit rr-orbit-outer" />
              <span className="rr-orbit rr-orbit-inner" />

              {['A', 'B', 'C', 'D'].map((member, index) => (
                <div className={`rr-runner rr-member rr-member-${index + 1}`} key={member}>
                  <span className="rr-face">
                    <strong>{member}</strong>
                    <small>Member</small>
                  </span>
                </div>
              ))}

              {['T12', 'T13', 'T14'].map((task, index) => (
                <div className={`rr-runner rr-task rr-task-${index + 1}`} key={task}>
                  <span className="rr-task-face">{task}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="rr-core"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <ArrowsClockwise weight="light" />
              <span>Weighted<br />round-robin</span>
            </motion.div>
          </div>

          <div className="round-robin-caption">
            <span>Next assignment</span>
            <strong>Moves with capacity</strong>
          </div>
        </motion.div>

        <div className="product-progress" aria-hidden="true"><motion.span style={{ scaleX: progress }} /></div>
      </div>
    </section>
  );
}
