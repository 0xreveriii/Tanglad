"use client";

import { useEffect, useRef } from "react";
import { useStableReducedMotion } from "./motion-primitives";

type MosaicCell = { x: number; y: number; nx: number; ny: number; seed: number };
type Blade = {
  base: number;
  controlA: number;
  controlB: number;
  tip: number;
  tipY: number;
  width: number;
  phase: number;
  tone: number;
};

// A low crown opening into a broad, asymmetric fan. The crown lives below
// the canvas so the visible blades do not collapse into a point at the edge.
const blades: Blade[] = [
  { base: 0.04, controlA: 0.02, controlB: -0.29, tip: -0.47, tipY: 0.3, width: 0.026, phase: 0.0, tone: 2 },
  { base: 0.1, controlA: 0.05, controlB: -0.23, tip: -0.39, tipY: 0.16, width: 0.029, phase: 0.7, tone: 0 },
  { base: 0.06, controlA: 0.01, controlB: -0.2, tip: -0.32, tipY: 0.25, width: 0.026, phase: 1.4, tone: 3 },
  { base: 0.14, controlA: 0.05, controlB: -0.14, tip: -0.25, tipY: 0.1, width: 0.03, phase: 2.1, tone: 1 },
  { base: 0.09, controlA: 0.02, controlB: -0.1, tip: -0.17, tipY: 0.2, width: 0.027, phase: 2.8, tone: 4 },
  { base: 0.16, controlA: 0.07, controlB: -0.05, tip: -0.09, tipY: 0.06, width: 0.029, phase: 3.5, tone: 0 },
  { base: 0.11, controlA: 0.06, controlB: 0.0, tip: -0.01, tipY: 0.15, width: 0.026, phase: 4.2, tone: 2 },
  { base: 0.19, controlA: 0.12, controlB: 0.05, tip: 0.06, tipY: 0.035, width: 0.029, phase: 4.9, tone: 5 },
  { base: 0.13, controlA: 0.12, controlB: 0.1, tip: 0.14, tipY: 0.13, width: 0.027, phase: 5.6, tone: 1 },
  { base: 0.21, controlA: 0.18, controlB: 0.16, tip: 0.22, tipY: 0.07, width: 0.03, phase: 6.3, tone: 3 },
  { base: 0.16, controlA: 0.18, controlB: 0.22, tip: 0.3, tipY: 0.18, width: 0.027, phase: 7.0, tone: 0 },
  { base: 0.23, controlA: 0.23, controlB: 0.28, tip: 0.36, tipY: 0.09, width: 0.03, phase: 7.7, tone: 5 },
  { base: 0.18, controlA: 0.22, controlB: 0.34, tip: 0.42, tipY: 0.2, width: 0.027, phase: 8.4, tone: 2 },
  { base: 0.25, controlA: 0.28, controlB: 0.4, tip: 0.47, tipY: 0.13, width: 0.029, phase: 9.1, tone: 1 },
  { base: 0.2, controlA: 0.27, controlB: 0.45, tip: 0.51, tipY: 0.32, width: 0.026, phase: 9.8, tone: 3 },
];

export function MosaicLemongrass() {
  const host = useRef<HTMLDivElement>(null);
  const reduce = useStableReducedMotion();

  useEffect(() => {
    const element = host.current;
    const canvas = element?.querySelector("canvas");
    if (!element || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let cells: MosaicCell[] = [];
    let width = 1;
    let height = 1;
    let cellSize = 9;
    const pointer = { x: 0, target: 0 };

    const resize = () => {
      const rect = element.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      cellSize = width < 520 ? 7 : 10;
      cells = [];
      for (let y = cellSize * 0.5; y < height; y += cellSize) {
        for (let x = cellSize * 0.5; x < width; x += cellSize) {
          const nx = x / width - 0.5;
          const ny = y / height;
          cells.push({ x, y, nx, ny, seed: Math.sin(x * 12.91 + y * 78.23) * 0.5 + 0.5 });
        }
      }
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      pointer.x += (pointer.target - pointer.x) * 0.045;
      const seconds = time * 0.001;

      for (const cell of cells) {
        let strength = 0;
        let tone = 0;

        blades.forEach((blade) => {
          const baseY = 1.5;
          const t = (baseY - cell.ny) / (baseY - blade.tipY);
          if (t < 0 || t > 1) return;

          const sway = reduce ? 0 : Math.sin(seconds * 0.62 + blade.phase) * 0.012 * t;
          const cursorSway = pointer.x * 0.022 * t;
          const inverse = 1 - t;
          const center =
            inverse ** 3 * blade.base +
            3 * inverse ** 2 * t * blade.controlA +
            3 * inverse * t ** 2 * blade.controlB +
            t ** 3 * blade.tip +
            sway +
            cursorSway;
          const bladeWidth = blade.width * (1 - t * 0.67);
          const distance = Math.abs(cell.nx - center);
          if (distance < bladeWidth) {
            const edge = 1 - distance / bladeWidth;
            const wave = reduce ? 0.82 : 0.82 + Math.sin(seconds * 1.2 - cell.ny * 8 + blade.phase) * 0.12;
            const next = edge * wave * (0.7 + cell.seed * 0.3);
            if (next > strength) {
              strength = next;
              tone = blade.tone;
            }
          }
        });

        const backgroundField = Math.max(0, 0.055 - Math.hypot(cell.nx * 0.8, cell.ny - 0.5) * 0.045);
        if (strength < 0.06 && cell.seed > 0.28) {
          context.fillStyle = `rgba(119, 139, 92, ${backgroundField * cell.seed})`;
          context.fillRect(cell.x - cellSize * 0.37, cell.y - cellSize * 0.37, cellSize * 0.72, cellSize * 0.72);
          continue;
        }
        if (strength < 0.06) continue;

        const hues = [76, 83, 90, 69, 96, 60];
        const pale = tone === 5;
        const light = pale ? 48 + strength * 40 : 24 + strength * 42;
        const saturation = pale ? 8 + strength * 12 : 29 + strength * 33;
        context.fillStyle = `hsla(${hues[tone]}, ${saturation}%, ${light}%, ${0.22 + strength * 0.8})`;
        const size = cellSize * (0.54 + strength * 0.25);
        context.beginPath();
        context.roundRect(cell.x - size / 2, cell.y - size / 2, size, size, Math.max(1, size * 0.15));
        context.fill();
      }

      if (!reduce) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointer.target = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    };
    const onPointerLeave = () => {
      pointer.target = 0;
    };

    const observer = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    observer.observe(element);
    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave);
    resize();
    draw();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduce]);

  return (
    <div className="mosaic-lemongrass" ref={host}>
      <canvas role="img" aria-label="Animated mosaic of long lemongrass blades moving together" />
    </div>
  );
}

