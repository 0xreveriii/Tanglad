"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useStableReducedMotion } from "@/components/motion-primitives";
import { initialTasks } from "./tanglad-sample-data";

const taskDimensions = ["Complexity", "Time demand", "Skill demand", "Project impact"] as const;
const assignedTaskCount = initialTasks.filter((task) => task.owner.length > 0).length;
const chartBounds = { left: 16, right: 424, top: 20, bottom: 162 };
const chartRanges = [
  { label: "3 days", shortLabel: "3d", path: "M 16 150 C 71 116, 93 91, 142 112 S 223 149, 273 137 S 354 74, 424 26" },
  { label: "1 week", shortLabel: "1w", path: "M 16 132 C 68 98, 87 143, 139 109 S 222 74, 273 128 S 356 151, 424 61" },
  { label: "1 month", shortLabel: "1m", path: "M 16 150 C 64 148, 81 85, 137 100 S 219 177, 270 137 S 351 49, 424 69" },
  { label: "3 months", shortLabel: "3m", path: "M 16 162 C 66 127, 92 151, 142 119 S 221 55, 277 102 S 354 125, 424 50" },
  { label: "6 months", shortLabel: "6m", path: "M 16 145 C 66 94, 93 138, 145 115 S 221 73, 277 126 S 355 98, 424 38" },
  { label: "1 year", shortLabel: "1y", path: "M 16 142 C 68 166, 92 112, 143 128 S 224 89, 277 93 S 352 140, 424 59" },
] as const;

const slides = [
  {
    label: "Task weight",
    description: "Complexity, time demand, skill demand, and project impact shape the weight of a task.",
    kind: "weight",
  },
  {
    label: "Team load",
    description: "Current work and upcoming commitments give the team a fuller workload view.",
    kind: "load",
  },
  {
    label: "Shared decision",
    description: "Tanglad offers evidence-based guidance while the team keeps the final decision.",
    kind: "decision",
  },
] as const;

function CountUpValue({ value, delay = 0 }: { value: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.75 });
  const reduceMotion = useStableReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => String(Math.round(latest)));

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }
    count.set(0);
    const controls = animate(count, value, { duration: Math.max(0.42, value * 0.34), delay, ease: "linear" });
    return () => controls.stop();
  }, [count, isInView, reduceMotion, value]);

  return <motion.span ref={ref} aria-label={String(value)}>{rounded}</motion.span>;
}

function TeamLoadArtwork() {
  return (
    <div className="guidance-artwork guidance-artwork-load" aria-hidden="true">
      <span className="guidance-art-overline">ILLUSTRATIVE WORKLOAD</span>
      <div className="guidance-load-board">
        <div className="guidance-load-feature">
          <span>TEAM CAPACITY</span>
          <strong>Work, in<br />context.</strong>
          <div className="guidance-load-context">
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </div>
        </div>
        <div className="guidance-load-highlights">
          <div className="guidance-load-highlight is-yellow">
            <span>IN PROGRESS</span>
            <strong>Current work</strong>
          </div>
          <div className="guidance-load-highlight is-pink">
            <span>COMING UP</span>
            <strong>Upcoming work</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideArtwork({ kind }: { kind: typeof slides[number]["kind"] }) {
  if (kind === "weight") {
    return (
      <div className="guidance-artwork guidance-artwork-weight" aria-hidden="true">
        <div className="guidance-weight-total">
          <strong>04</strong>
          <span>dimensions<br />of task weight</span>
        </div>
        <ul className="guidance-weight-factors">
          {taskDimensions.map((dimension, index) => (
            <li key={dimension} className={"weight-factor-" + (index + 1)}>
              <i />
              <span>{dimension}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (kind === "load") {
    return <TeamLoadArtwork />;
  }

  return (
    <div className="guidance-artwork guidance-artwork-decision" aria-hidden="true">
      <span className="guidance-art-overline">GUIDANCE, NOT AUTHORITY</span>
      <div className="guidance-decision-board">
        <div className="guidance-decision-inputs">
          <div className="guidance-decision-input is-yellow">
            <span>01</span>
            <strong>Task weight</strong>
          </div>
          <div className="guidance-decision-input is-pink">
            <span>02</span>
            <strong>Team load</strong>
          </div>
          <div className="guidance-decision-input is-neutral">
            <span>03</span>
            <strong>Project context</strong>
          </div>
        </div>
        <div className="guidance-decision-outcome">
          <div>
            <span>EVIDENCE-BASED GUIDANCE</span>
            <strong>Recommendation</strong>
          </div>
          <div className="guidance-decision-authority">
            <span>FINAL CALL</span>
            <strong>Team choice</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuidanceExperience() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeRange, setActiveRange] = useState(2);
  const reduceMotion = useStableReducedMotion();
  const metricsPanelRef = useRef<HTMLElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);
  const metricsPanelInView = useInView(metricsPanelRef, { once: true, amount: 0.3 });
  const chartProgress = useMotionValue(0);
  const chartCursorX = useMotionValue(chartBounds.left);
  const chartCursorY = useMotionValue(chartBounds.bottom);
  const chartTooltipX = useTransform(chartCursorX, (x) => Math.max(8, Math.min(370, x - 31)));
  const chartTooltipY = useTransform(chartCursorY, (y) => y < 52 ? y + 12 : y - 35);
  const chartTooltipCenterX = useTransform(chartTooltipX, (x) => x + 31);
  const chartTooltipTextY = useTransform(chartTooltipY, (y) => y + 15);
  const slide = slides[activeSlide];
  const range = chartRanges[activeRange];

  useEffect(() => {
    if (reduceMotion) return;
    const timeout = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6200);
    return () => window.clearTimeout(timeout);
  }, [activeSlide, reduceMotion]);

  useEffect(() => {
    if (!metricsPanelInView) return;
    if (reduceMotion) {
      chartProgress.set(1);
      return;
    }
    chartProgress.set(0);
    const controls = animate(chartProgress, 1, { duration: 5.8, ease: "linear" });
    return () => controls.stop();
  }, [activeRange, chartProgress, metricsPanelInView, reduceMotion]);

  useEffect(() => {
    const path = chartPathRef.current;
    if (!path) return;
    const pathLength = path.getTotalLength();
    const syncCursorToPath = (progress: number) => {
      const point = path.getPointAtLength(pathLength * Math.min(1, Math.max(0, progress)));
      chartCursorX.set(point.x);
      chartCursorY.set(point.y);
    };
    syncCursorToPath(chartProgress.get());
    return chartProgress.on("change", syncCursorToPath);
  }, [activeRange, chartCursorX, chartCursorY, chartProgress]);

  return (
    <section className="guidance-story" id="principles">
      <div className="page-frame guidance-frame">
        <motion.div
          className="guidance-intro"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reduceMotion ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="guidance-eyebrow">A more balanced way to plan</span>
          <h2>See the work clearly.<br /><span>People make the call.</span></h2>
          <p>Bring task demands, team load, and project context into one clearer conversation.</p>
        </motion.div>

        <div className="guidance-dashboard-grid">
          <motion.section
            className="guidance-carousel-panel"
            aria-label="Tanglad planning views"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: reduceMotion ? 0 : 0.52, delay: reduceMotion ? 0 : 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="guidance-panel-heading">
              <h3>Work, in focus</h3>
            </div>

            <div className="guidance-carousel" aria-live="off">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  className="guidance-slide"
                  key={slide.label}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={(activeSlide + 1) + " of " + slides.length + ": " + slide.label + ". " + slide.description}
                  initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion
                    ? { opacity: 1, x: 0, transition: { duration: 0 } }
                    : { opacity: 0, x: -10, transition: { duration: 0.18, ease: [0.3, 0, 1, 1] } }}
                  transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SlideArtwork kind={slide.kind} />
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="guidance-progress-controls" role="group" aria-label="Choose a planning view">
              {slides.map((item, index) => (
                <button
                  className="guidance-progress-button"
                  key={item.label}
                  type="button"
                  aria-label={"Show " + item.label + " slide"}
                  aria-pressed={activeSlide === index}
                  onClick={() => setActiveSlide(index)}
                >
                  <span className="guidance-progress-track" aria-hidden="true">
                    <motion.span
                      key={index + "-" + activeSlide}
                      className="guidance-progress-fill"
                      initial={{ scaleX: index < activeSlide || (reduceMotion && index === activeSlide) ? 1 : 0 }}
                      animate={{ scaleX: index <= activeSlide ? 1 : 0 }}
                      transition={{ duration: reduceMotion ? 0 : index === activeSlide ? 6.2 : 0, ease: "linear" }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </motion.section>

          <motion.section
            ref={metricsPanelRef}
            className="guidance-metrics-panel"
            aria-label="Sample workspace metrics and an illustrative animated trend"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: reduceMotion ? 0 : 0.52, delay: reduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="guidance-panel-heading">
              <div>
                <span className="guidance-label">Sample data · illustrative trend</span>
                <h3>Workload over time</h3>
              </div>
            </div>

            <div className="guidance-metrics-layout">
              <div className="guidance-stat-stack" role="group" aria-label="Sample board metrics">
                <article className="guidance-stat-block is-yellow">
                  <div className="guidance-stat-copy">
                    <span>Tasks on board</span>
                  </div>
                  <strong><CountUpValue value={initialTasks.length} /></strong>
                </article>
                <article className="guidance-stat-block is-pink">
                  <div className="guidance-stat-copy">
                    <span>Assigned tasks</span>
                  </div>
                  <strong><CountUpValue value={assignedTaskCount} delay={0.18} /></strong>
                </article>
              </div>

              <div className="guidance-chart-column">
                <div className="guidance-range-control" role="group" aria-label="Illustrative chart period">
                  {chartRanges.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      aria-label={item.label}
                      aria-pressed={activeRange === index}
                      className={activeRange === index ? "guidance-range-active" : undefined}
                      onClick={() => setActiveRange(index)}
                    >
                      {activeRange === index && (
                        <motion.span
                          className="guidance-range-indicator"
                          layoutId="guidance-range-indicator"
                          transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.16, 1, 0.3, 1] }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="guidance-range-full">{item.label}</span>
                      <span className="guidance-range-short" aria-hidden="true">{item.shortLabel}</span>
                    </button>
                  ))}
                </div>
                <svg
                  className="guidance-chart"
                  viewBox="0 0 440 200"
                  role="img"
                  aria-label={`Illustrative animated workload curve for ${range.label}. Historical workload data is not available in this prototype.`}
                >
                  <defs>
                    <linearGradient id="guidance-chart-fade" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="var(--guidance-pink)" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="var(--guidance-pink)" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path className="guidance-chart-gridline" d="M 8 20 H 432 M 8 67 H 432 M 8 114 H 432 M 8 162 H 432" />
                  <motion.path
                    ref={chartPathRef}
                    key={range.label}
                    className="guidance-chart-line"
                    d={range.path}
                    initial={reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.72 }}
                    animate={reduceMotion ? { pathLength: 1, opacity: 1 } : metricsPanelInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.72 }}
                    transition={{ pathLength: { duration: reduceMotion ? 0 : 5.8, ease: "linear" }, opacity: { duration: reduceMotion ? 0 : 0.36 } }}
                  />
                  <motion.line className="guidance-chart-cursor" x1={chartCursorX} x2={chartCursorX} y1="12" y2={chartCursorY} />
                  <motion.rect className="guidance-chart-tooltip" x={chartTooltipX} y={chartTooltipY} width="62" height="23" rx="11.5" />
                  <motion.text className="guidance-chart-tooltip-text" x={chartTooltipCenterX} y={chartTooltipTextY} textAnchor="middle">
                    SAMPLE
                  </motion.text>
                  <motion.circle className="guidance-chart-point" cx={chartCursorX} cy={chartCursorY} r="5.5" />
                </svg>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </section>
  );
}
