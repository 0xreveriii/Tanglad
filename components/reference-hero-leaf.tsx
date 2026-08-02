"use client";

import { useEffect, useRef } from "react";
import { useStableReducedMotion } from "./motion-primitives";

const SOURCE = {
  x: 650,
  y: 96,
  width: 936,
  height: 896,
};

export function ReferenceHeroLeaf() {
  const host = useRef<HTMLDivElement>(null);
  const reduce = useStableReducedMotion();

  useEffect(() => {
    const element = host.current;
    const canvas = element?.querySelector("canvas");
    if (!element || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const source = new Image();
    source.src = "/images/old-hero-reference.png";

    let frame = 0;
    let width = 1;
    let height = 1;
    const pointer = { current: 0, target: 0 };

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
    };

    const draw = (time = 0) => {
      if (!source.complete) return;

      context.clearRect(0, 0, width, height);
      pointer.current += (pointer.target - pointer.current) * 0.045;

      const strip = Math.max(3, Math.round(height / 220));
      const sourceScaleY = SOURCE.height / height;

      for (let y = 0; y < height; y += strip) {
        const progress = y / height;
        const breeze = reduce
          ? 0
          : Math.sin(time * 0.00055 + progress * 4.8) * (1.2 + progress * 2.4);
        const pointerDrift = pointer.current * (1.5 + progress * 3.5);
        const offset = breeze + pointerDrift;
        const sourceY = SOURCE.y + y * sourceScaleY;
        const sourceHeight = Math.min(strip * sourceScaleY + 1, SOURCE.y + SOURCE.height - sourceY);

        context.drawImage(
          source,
          SOURCE.x,
          sourceY,
          SOURCE.width,
          sourceHeight,
          offset,
          y,
          width,
          strip + 1,
        );
      }

      if (!reduce) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointer.target = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    };
    const onPointerLeave = () => { pointer.target = 0; };
    const onLoad = () => draw();

    const observer = new ResizeObserver(() => {
      resize();
      if (reduce && source.complete) draw();
    });

    source.addEventListener("load", onLoad);
    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave);
    observer.observe(element);
    resize();
    if (source.complete) draw();

    return () => {
      window.cancelAnimationFrame(frame);
      source.removeEventListener("load", onLoad);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
      observer.disconnect();
    };
  }, [reduce]);

  return (
    <div className="hero-reference-media" ref={host}>
      <img
        className="hero-reference-source"
        src="/images/old-hero-reference.png"
        alt="Pixel mosaic of sweeping lemongrass blades"
      />
      <canvas className="hero-reference-canvas" aria-hidden="true" />
    </div>
  );
}
