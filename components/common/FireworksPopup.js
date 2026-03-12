"use client";
import React, { useEffect, useRef, useState } from 'react';

const FireworksPopup = () => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Timer to remove the component after 2 seconds
    const timer = setTimeout(() => setIsVisible(false), 12000);

    // 2. Setup Canvas Logic
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let cannonballs = [];
    let explosions = [];
    let gravity = 0.1; // Adjusted gravity for better physics

    // --- Core Classes (Simplified for the popup effect) ---
    function Particle(x, y, dx, dy, color) {
      this.x = x; this.y = y; this.dx = dx; this.dy = dy;
      this.color = color; this.timeToLive = 1;
      this.update = () => {
        this.x += this.dx; this.y += this.dy;
        this.draw();
        this.timeToLive -= 0.02;
      };
      this.draw = () => {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, 2, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowBlur = 10;
        c.shadowColor = this.color;
        c.fill();
        c.restore();
      };
    }

    function Cannonball(x, y, dx, dy, color, pColors) {
      this.x = x; this.y = y; this.dx = dx; this.dy = dy;
      this.color = color; this.pColors = pColors; this.ttl = 60;
      this.update = () => {
        this.dy += gravity;
        this.x += this.dx; this.y += this.dy;
        this.draw();
        this.ttl--;
      };
      this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, 4, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
      };
    }

    // --- Animation Loop ---
    const animate = () => {
  if (!isVisible) return;
  requestAnimationFrame(animate);

  // Clear instead of dark overlay
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.1) {
    cannonballs.push(
      new Cannonball(
        canvas.width / 2,
        canvas.height,
        (Math.random() - 0.5) * 6,
        -(Math.random() * 5 + 10),
        "#affdf4",
        ["#ff4747", "#00ceed", "#fff", "pink"]
      )
    );
  }

  cannonballs.forEach((ball, i) => {
    ball.update();
    if (ball.ttl <= 0) {
      for (let j = 0; j < 20; j++) {
        explosions.push(
          new Particle(
            ball.x,
            ball.y,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            ball.pColors[Math.floor(Math.random() * ball.pColors.length)]
          )
        );
      }
      cannonballs.splice(i, 1);
    }
  });

  explosions.forEach((p, i) => {
    p.update();
    if (p.timeToLive <= 0) explosions.splice(i, 1);
  });
};

    animate();
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', top: 100, left: 0, width: '100vw', height: '70vh',
      zIndex: 9999, pointerEvents: 'none',
    }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <h1 style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
        color: 'white', fontFamily: 'sans-serif', fontSize: '3rem', textAlign: 'center'
      }}>
        
      </h1>
    </div>
  );
};

export default FireworksPopup;

// "use client";
// import React, { useEffect, useRef } from "react";

// /* ==================== Particle ==================== */
// class Particle {
//   x: number;
//   y: number;
//   dx: number;
//   dy: number;
//   color: string;
//   life: number;

//   constructor(
//     x: number,
//     y: number,
//     dx: number,
//     dy: number,
//     color: string
//   ) {
//     this.x = x;
//     this.y = y;
//     this.dx = dx;
//     this.dy = dy;
//     this.color = color;
//     this.life = 1;
//   }

//   update(ctx: CanvasRenderingContext2D) {
//     this.x += this.dx;
//     this.y += this.dy;
//     this.life -= 0.03;
//     this.draw(ctx);
//   }

//   draw(ctx: CanvasRenderingContext2D) {
//     ctx.save();
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
//     ctx.fillStyle = this.color;
//     ctx.shadowBlur = 12;
//     ctx.shadowColor = this.color;
//     ctx.fill();
//     ctx.restore();
//   }
// }

// /* ==================== Cannonball ==================== */
// class Cannonball {
//   x: number;
//   y: number;
//   dx: number;
//   dy: number;
//   ttl: number;
//   colors: string[];

//   constructor(
//     x: number,
//     y: number,
//     dx: number,
//     dy: number,
//     colors: string[]
//   ) {
//     this.x = x;
//     this.y = y;
//     this.dx = dx;
//     this.dy = dy;
//     this.colors = colors;
//     this.ttl = 40; // 🔥 shorter life = faster explosion
//   }

//   update(ctx: CanvasRenderingContext2D, gravity: number) {
//     this.dy += gravity;
//     this.x += this.dx;
//     this.y += this.dy;
//     this.ttl--;
//     this.draw(ctx);
//   }

//   draw(ctx: CanvasRenderingContext2D) {
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, 4.5, 0, Math.PI * 2);
//     ctx.fillStyle = "#affdf4";
//     ctx.fill();
//   }
// }

// /* ==================== Component ==================== */
// const FireworksPopup: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const container = containerRef.current;
//     if (!canvas || !container) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const resizeCanvas = () => {
//       const rect = container.getBoundingClientRect();
//       canvas.width = rect.width;
//       canvas.height = rect.height;
//     };

//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     const gravity = 0.18;
//     const cannonballs: Cannonball[] = [];
//     const particles: Particle[] = [];

//     const colors = ["#ff4747", "#00ceed", "#ffffff", "#ff9cf0"];

//     let animationId = 0;
//     let lastFireTime = 0;
//     const FIRE_DELAY = 900; // ⏱️ delay between fires (ms)

//     const animate = (time: number) => {
//       animationId = requestAnimationFrame(animate);
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       /* -------- SINGLE FIRE WITH DELAY -------- */
//       if (
//         cannonballs.length === 0 &&
//         time - lastFireTime > FIRE_DELAY
//       ) {
//         lastFireTime = time;

//         const centerWidth = canvas.width * 0.4; // 40% width
//         const startX = (canvas.width - centerWidth) / 2;
//         const spawnX = startX + Math.random() * centerWidth;

//         cannonballs.push(
//           new Cannonball(
//             spawnX,
//             canvas.height * 0.4,
//             (Math.random() - 0.5) * 4,
//             -(Math.random() * 5 + 10),
//             colors
//           )
//         );
//       }

//       /* -------- UPDATE CANNONBALL -------- */
//       cannonballs.forEach((ball, i) => {
//         ball.update(ctx, gravity);

//         if (ball.y < canvas.height * 0.45 || ball.ttl <= 0) {
//           for (let j = 0; j < 25; j++) {
//             particles.push(
//               new Particle(
//                 ball.x,
//                 ball.y,
//                 (Math.random() - 0.5) * 10,
//                 (Math.random() - 0.5) * 10,
//                 ball.colors[
//                   Math.floor(Math.random() * ball.colors.length)
//                 ]
//               )
//             );
//           }
//           cannonballs.splice(i, 1);
//         }
//       });

//       /* -------- UPDATE PARTICLES -------- */
//       particles.forEach((p, i) => {
//         p.update(ctx);
//         if (p.life <= 0) particles.splice(i, 1);
//       });
//     };

//     animationId = requestAnimationFrame(animate);

//     return () => {
//       cancelAnimationFrame(animationId);
//       window.removeEventListener("resize", resizeCanvas);
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="absolute inset-0 z-20 pointer-events-none"
//     >
//       <canvas
//         ref={canvasRef}
//         className="w-full h-full block bg-transparent"
//       />
//     </div>
//   );
// };

// export default FireworksPopup;
