"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function useStableReducedMotion() {
  const preference = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<"system" | "full" | "reduced">("system");

  useEffect(() => {
    const readMode = () => {
      const value = document.documentElement.dataset.motion;
      setMode(value === "full" || value === "reduced" ? value : "system");
      setHydrated(true);
    };

    readMode();
    window.addEventListener("tanglad-motion-change", readMode);
    return () => window.removeEventListener("tanglad-motion-change", readMode);
  }, []);

  if (!hydrated) return false;
  if (mode === "full") return false;
  if (mode === "reduced") return true;
  return Boolean(preference);
}

export function ScrollSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      className={`scroll-section ${className}`}
    >
      {children}
      <span className="section-dissolve" aria-hidden="true" />
    </motion.section>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useStableReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 32, filter: "blur(9px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ duration: 0.78, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionFade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.78, 1], [0.86, 1, 1, 0.3]);

  return (
    <motion.div ref={ref} className={className} style={{ opacity }}>
      {children}
    </motion.div>
  );
}

export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  const reduce = useStableReducedMotion();

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduce ? 0 : 0.055 } },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          className="revealed-word"
          key={`${word}-${index}`}
          variants={{
            hidden: { opacity: 0.08, y: 18, filter: "blur(7px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.56, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
}
