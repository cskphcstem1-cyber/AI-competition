import { useEffect, useRef } from "react";

const COLORS = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];
const COUNT = 30;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

export default function FireworksCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let raf = 0;
    let alive = true;
    let human = false;
    let autoTimer = 0;
    const bursts = [];

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const setDirection = (p) => {
      const angle = rand(0, 360) * (Math.PI / 180);
      const value = rand(50, 180);
      const radius = [-1, 1][rand(0, 1)] * value;
      return {
        x: p.x + radius * Math.cos(angle),
        y: p.y + radius * Math.sin(angle),
      };
    };

    const spawn = (x, y) => {
      const particles = [];
      for (let i = 0; i < COUNT; i += 1) {
        const p = { x, y };
        p.sx = x;
        p.sy = y;
        p.color = COLORS[rand(0, COLORS.length - 1)];
        p.radius = rand(16, 32);
        p.endPos = setDirection(p);
        particles.push(p);
      }
      bursts.push({
        start: performance.now(),
        duration: rand(1200, 1800),
        circleDur: rand(1200, 1800),
        particles,
        circle: {
          x,
          y,
          radius: 0.1,
          alpha: 0.5,
          lineWidth: 6,
          endRadius: rand(80, 160),
        },
      });
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = bursts.length - 1; i >= 0; i -= 1) {
        const burst = bursts[i];
        const duration = Math.max(1, burst.duration);
        const circleDur = Math.max(1, burst.circleDur);
        const t = Math.min(1, Math.max(0, (now - burst.start) / duration));
        const e = easeOutExpo(t);
        for (const p of burst.particles) {
          const x = p.sx + (p.endPos.x - p.sx) * e;
          const y = p.sy + (p.endPos.y - p.sy) * e;
          const radius = Math.max(0.05, p.radius * (1 - e) + 0.1 * e);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2, true);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
        const ct = Math.min(1, Math.max(0, (now - burst.start) / circleDur));
        const ce = easeOutExpo(ct);
        const c = burst.circle;
        const cr = Math.max(0.05, c.radius + (c.endRadius - c.radius) * ce);
        ctx.globalAlpha = Math.max(0, c.alpha * (1 - ct));
        ctx.beginPath();
        ctx.arc(c.x, c.y, cr, 0, Math.PI * 2, true);
        ctx.lineWidth = Math.max(0, 6 * (1 - ce));
        ctx.strokeStyle = "#FFF";
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (t >= 1 && ct >= 1) bursts.splice(i, 1);
      }
    };

    const loop = (now) => {
      if (!alive) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onTap = (e) => {
      human = true;
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (typeof x === "number" && typeof y === "number") spawn(x, y);
    };

    const autoClick = () => {
      if (!alive || human) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      spawn(rand(cx - 80, cx + 80), rand(cy - 80, cy + 80));
      autoTimer = window.setTimeout(autoClick, 700);
    };

    setSize();
    window.addEventListener("resize", setSize);
    window.addEventListener("mousedown", onTap);
    window.addEventListener("touchstart", onTap, { passive: true });
    raf = requestAnimationFrame(loop);
    autoTimer = window.setTimeout(autoClick, 400);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(autoTimer);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousedown", onTap);
      window.removeEventListener("touchstart", onTap);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}
