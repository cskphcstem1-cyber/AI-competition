import { useEffect, useRef } from "react";
import { mountSakura } from "./sakura";

function mountSakura2d(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const COLORS = ["#ffd6e0", "#ffb7c5", "#ffc9d6", "#ffe4ec", "#f9a8c4"];
  let w = 0;
  let h = 0;
  let raf = 0;
  let alive = true;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };

  const petals = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 6 + Math.random() * 10,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.04,
    vy: 0.15 + Math.random() * 0.35,
    vx: (Math.random() - 0.5) * 0.2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  const step = () => {
    if (!alive) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      p.y += p.vy / 180;
      p.x += p.vx / 180;
      p.rot += p.vr;
      if (p.y > 1.1) {
        p.y = -0.05;
        p.x = Math.random();
      }
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05) p.x = -0.05;
      ctx.save();
      ctx.translate(p.x * w, p.y * h);
      ctx.rotate(p.rot);
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 0.45, p.r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    raf = requestAnimationFrame(step);
  };

  resize();
  window.addEventListener("resize", resize);
  raf = requestAnimationFrame(step);
  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

export default function SakuraCanvas() {
  const glRef = useRef(null);
  const fallbackRef = useRef(null);

  useEffect(() => {
    const stopGl = glRef.current ? mountSakura(glRef.current) : null;
    if (stopGl) return stopGl;
    const fallback = fallbackRef.current;
    if (!fallback) return undefined;
    fallback.style.display = "block";
    return mountSakura2d(fallback);
  }, []);

  return (
    <>
      <canvas
        ref={glRef}
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
        aria-hidden="true"
      />
      <canvas
        ref={fallbackRef}
        className="pointer-events-none fixed inset-0 -z-10 hidden h-full w-full"
        aria-hidden="true"
      />
    </>
  );
}
