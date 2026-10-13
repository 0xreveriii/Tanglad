"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useStableReducedMotion } from "@/components/motion-primitives";

const headline = "What does the next task ask of your team?";
const words = headline.split(" ");
const letterStagger = 0.045;
const letterTransition = { duration: 0.54, ease: [0.16, 1, 0.3, 1] as const };
const sequenceDuration = (headline.length - 1) * letterStagger + letterTransition.duration;
const transition = { duration: sequenceDuration, ease: [0.16, 1, 0.3, 1] as const };
const reducedTransition = { duration: 0 };
const mascotSettleTransition = {
  opacity: { duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] as const },
  y: { duration: 1.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] as const },
  rotate: { duration: 1.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] as const },
  scale: { duration: 1.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] as const },
};
const wordOffsets = words.map((_, wordIndex) =>
  words.slice(0, wordIndex).reduce((count, word) => count + word.length + 1, 0),
);

function getLetterDelay(wordIndex: number, letterIndex: number) {
  return (wordOffsets[wordIndex] + letterIndex) * letterStagger;
}

export function ClosingExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.28 });
  const reduceMotion = useStableReducedMotion();
  const animationState = isInView || reduceMotion ? "arrived" : "rest";
  const motionTransition = reduceMotion || !isInView ? reducedTransition : transition;

  return (
    <section
      className="closing-section"
      id="closing"
      aria-labelledby="closing-title"
      ref={sectionRef}
    >
      <div className="closing-content">
        <div className="closing-main">
          <h2 className="closing-title" id="closing-title" aria-label={headline}>
            <span className="closing-title-visual" aria-hidden="true">
              {words.map((word, wordIndex) => (
                <span className="closing-word-group" key={`word-${wordIndex}`}>
                  <span className="closing-word">
                    {Array.from(word).map((letter, letterIndex) => (
                      <span className="closing-letter-mask" key={`letter-${wordIndex}-${letterIndex}`}>
                        <motion.span
                          className="closing-letter"
                          initial="rest"
                          animate={animationState}
                          variants={{
                            rest: { y: "110%", opacity: 0 },
                            arrived: { y: "0%", opacity: 1 },
                          }}
                          transition={
                            reduceMotion || !isInView
                              ? reducedTransition
                              : { ...letterTransition, delay: getLetterDelay(wordIndex, letterIndex) }
                          }
                        >
                          {letter}
                        </motion.span>
                      </span>
                    ))}
                  </span>
                  {wordIndex < words.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          </h2>

          <div className="closing-actions">
            <motion.div
              className="closing-cta-motion"
              initial="waiting"
              animate={animationState === "arrived" ? "arrived" : "waiting"}
              variants={{
                waiting: { opacity: 0.84, x: 20, y: 10, scale: 0.97 },
                arrived: { opacity: 1, x: 0, y: 0, scale: 1 },
              }}
              transition={motionTransition}
            >
              <Link className="closing-cta" href="/app">
                <span>Explore the workspace</span>
                <span className="closing-cta-icon" aria-hidden="true">
                  <ArrowUpRight size={18} weight="regular" />
                </span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="closing-mascot"
            aria-hidden="true"
            initial={reduceMotion ? "arrived" : "rest"}
            animate={animationState}
            variants={{
              rest: { opacity: 0, y: 30, rotate: -8, scale: 0.94 },
              arrived: { opacity: 1, y: 0, rotate: [-8, 4, -2, 0], scale: [0.94, 1.02, 0.99, 1] },
            }}
            transition={reduceMotion || !isInView ? reducedTransition : mascotSettleTransition}
          >
            <motion.div
              className="closing-mascot-idle"
              initial={false}
              animate={
                isInView && !reduceMotion
                  ? { y: [0, -3, 0], rotate: [0, 0.8, -0.6, 0] }
                  : { y: 0, rotate: 0 }
              }
              transition={
                isInView && !reduceMotion
                  ? { duration: 6.2, ease: "easeInOut", repeat: Infinity, delay: 1.9 }
                  : reducedTransition
              }
            >
              <Image
                src="/images/tanglad-chibi-mascot-muted.png"
                alt=""
                width={1254}
                height={1254}
                sizes="(max-width: 767px) 48vw, (max-width: 900px) 28vw, (max-width: 1199px) 24vw, 300px"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
