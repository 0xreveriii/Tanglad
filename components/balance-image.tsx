"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useStableReducedMotion } from "./motion-primitives";

export function BalanceImage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useStableReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-34, 34]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  return (
    <motion.div className="balance-image-shell" ref={ref} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
      <div className="balance-image-core">
        <motion.div className="balance-image-inner" style={{ y, scale }}>
          <Image src="/images/tanglad-balance.png" alt="Lemongrass pieces moving from scattered work into a balanced shared structure" fill sizes="(max-width: 768px) 92vw, 58vw" />
        </motion.div>
      </div>
    </motion.div>
  );
}
