import { useEffect, useRef } from "react";

const NUM_CONFETTI = 350;
const COLORS = [
  [85, 71, 106],
  [174, 61, 99],
  [219, 56, 83],
  [244, 92, 68],
  [248, 182, 70],
];
const PI_2 = Math.PI * 2;

function range(a, b) {
  return (b - a) * Math.random() + a;
}

export default function ConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let w = 0;
    let h = 0;
    let xpos = 0.5;
    let raf = 0;
    let alive = true;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const drawCircle = (x, y, r, style) => {
      context.beginPath();
      context.arc(x, y, r, 0, PI_2, false);
      context.fillStyle = style;
      context.fill();
    };

    class Confetti {
      constructor() {
        const style = COLORS[Math.floor(range(0, 5))];
        this.rgb = `rgba(${style[0]},${style[1]},${style[2]}`;
        this.r = Math.floor(range(2, 6));
        this.r2 = 2 * this.r;
        this.replace();
      }

      replace() {
        this.opacity = 0;
        this.dop = 0.03 * range(1, 4);
        this.x = range(-this.r2, w - this.r2);
        this.y = range(-20, h - this.r2);
        this.xmax = w - this.r;
        this.ymax = h - this.r;
        this.vx = range(0, 2) + 8 * xpos - 5;
        this.vy = 0.7 * this.r + range(-1, 1);
      }

      draw() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += this.dop;
        if (this.opacity > 1) {
          this.opacity = 1;
          this.dop *= -1;
        }
        if (this.opacity < 0 || this.y > this.ymax) this.replace();
        if (!(this.x > 0 && this.x < this.xmax)) {
          this.x = (this.x + this.xmax) % this.xmax;
        }
        drawCircle(
          Math.floor(this.x),
          Math.floor(this.y),
          this.r,
          `${this.rgb},${this.opacity})`,
        );
      }
    }

    resize();
    const confetti = Array.from({ length: NUM_CONFETTI }, () => new Confetti());

    const onMove = (e) => {
      if (w) xpos = e.clientX / w;
    };

    const step = () => {
      if (!alive) return;
      context.clearRect(0, 0, w, h);
      for (const c of confetti) c.draw();
      raf = requestAnimationFrame(step);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(step);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
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
