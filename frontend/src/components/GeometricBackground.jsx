import { useEffect, useRef } from "react";

export default function GeometricBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const shapesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#6366f1", "#a78bfa"];

    shapesRef.current = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 20 + Math.random() * 60,
      type: i % 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.08 + Math.random() * 0.15,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      shapesRef.current.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;
        if (s.x < -100) s.x = W + 100;
        if (s.x > W + 100) s.x = -100;
        if (s.y < -100) s.y = H + 100;
        if (s.y > H + 100) s.y = -100;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (s.type === 0) {
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i;
            i === 0
              ? ctx.moveTo(Math.cos(a) * s.size, Math.sin(a) * s.size)
              : ctx.lineTo(Math.cos(a) * s.size, Math.sin(a) * s.size);
          }
        } else if (s.type === 1) {
          ctx.rect(-s.size / 2, -s.size / 2, s.size, s.size);
        } else {
          for (let i = 0; i < 3; i++) {
            const a = ((Math.PI * 2) / 3) * i - Math.PI / 2;
            i === 0
              ? ctx.moveTo(Math.cos(a) * s.size, Math.sin(a) * s.size)
              : ctx.lineTo(Math.cos(a) * s.size, Math.sin(a) * s.size);
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });
      animRef.current = requestAnimationFrame(draw);
    }
    draw();

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}
