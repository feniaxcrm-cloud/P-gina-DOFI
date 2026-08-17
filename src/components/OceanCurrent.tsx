"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Corrientes marinas: lineas de flujo dibujadas en canvas.
 * Motivo de la animacion: da profundidad al hero y sostiene la metafora
 * de "un mar de ideas" sin recurrir a un blob de gradiente generico.
 *
 * No toca estado de React en ningun frame. Con reduced-motion pinta un
 * unico fotograma estatico y detiene el bucle.
 */
export function OceanCurrent({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const LINES = 26;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < LINES; i++) {
        const p = i / (LINES - 1);
        const baseY = height * (0.12 + p * 0.78);
        const amp = 12 + Math.sin(p * Math.PI) * 46;
        const speed = 0.00016 + p * 0.00012;
        const phase = t * speed + p * 2.4;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const nx = x / width;
          const y =
            baseY +
            Math.sin(nx * 3.1 + phase) * amp +
            Math.sin(nx * 7.7 - phase * 1.6) * amp * 0.28;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Las lineas centrales llevan el acento naranja, el resto queda en malva
        const centerWeight = 1 - Math.abs(p - 0.42) * 2.1;
        const warm = Math.max(0, centerWeight);
        const alpha = 0.05 + warm * 0.2;
        ctx.strokeStyle =
          warm > 0.55
            ? `rgba(244, 123, 32, ${alpha})`
            : `rgba(150, 118, 220, ${0.06 + p * 0.1})`;
        ctx.lineWidth = 1 + warm * 0.7;
        ctx.stroke();
      }
    };

    let running = false;

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0);

    // El bucle solo corre con el hero visible y la pestana activa.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    visibility.observe(canvas);

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const sizeObserver = new ResizeObserver(() => {
      resize();
      if (!running) draw(0);
    });
    sizeObserver.observe(canvas);

    return () => {
      stop();
      visibility.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  );
}
