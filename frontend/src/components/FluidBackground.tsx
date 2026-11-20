import React, { useEffect, useRef } from 'react';

interface FluidOrb {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  vx: number;
  vy: number;
  colorStop0: string;
  colorStop1: string;
  phase: number;
  phaseSpeed: number;
}

export const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse influence for visceral fluid interactivity
    let mouseX = width / 2;
    let mouseY = height / 3;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll influence
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6 Fluid Orbs with palette colors in lighter, radiant tones
    const orbs: FluidOrb[] = [
      {
        x: width * 0.25,
        y: height * 0.25,
        baseRadius: Math.min(width, height) * 0.38,
        radius: Math.min(width, height) * 0.38,
        vx: 0.6,
        vy: 0.45,
        colorStop0: 'rgba(238, 69, 64, 0.42)',   // Lighter Coral
        colorStop1: 'rgba(238, 69, 64, 0.0)',
        phase: 0,
        phaseSpeed: 0.018,
      },
      {
        x: width * 0.75,
        y: height * 0.35,
        baseRadius: Math.min(width, height) * 0.42,
        radius: Math.min(width, height) * 0.42,
        vx: -0.5,
        vy: 0.55,
        colorStop0: 'rgba(199, 44, 65, 0.36)',   // Lighter Crimson Ruby
        colorStop1: 'rgba(199, 44, 65, 0.0)',
        phase: Math.PI * 0.5,
        phaseSpeed: 0.015,
      },
      {
        x: width * 0.5,
        y: height * 0.7,
        baseRadius: Math.min(width, height) * 0.45,
        radius: Math.min(width, height) * 0.45,
        vx: 0.4,
        vy: -0.4,
        colorStop0: 'rgba(255, 138, 120, 0.45)', // Radiant Peach / Coral glow
        colorStop1: 'rgba(255, 138, 120, 0.0)',
        phase: Math.PI,
        phaseSpeed: 0.02,
      },
      {
        x: width * 0.15,
        y: height * 0.75,
        baseRadius: Math.min(width, height) * 0.35,
        radius: Math.min(width, height) * 0.35,
        vx: 0.55,
        vy: -0.35,
        colorStop0: 'rgba(128, 19, 54, 0.25)',   // Berry Wine tint
        colorStop1: 'rgba(128, 19, 54, 0.0)',
        phase: Math.PI * 1.5,
        phaseSpeed: 0.016,
      },
      {
        x: width * 0.85,
        y: height * 0.8,
        baseRadius: Math.min(width, height) * 0.36,
        radius: Math.min(width, height) * 0.36,
        vx: -0.45,
        vy: -0.5,
        colorStop0: 'rgba(238, 69, 64, 0.35)',   // Warm Coral float
        colorStop1: 'rgba(238, 69, 64, 0.0)',
        phase: Math.PI * 0.75,
        phaseSpeed: 0.019,
      },
      {
        x: width * 0.5,
        y: height * 0.2,
        baseRadius: Math.min(width, height) * 0.32,
        radius: Math.min(width, height) * 0.32,
        vx: -0.3,
        vy: 0.4,
        colorStop0: 'rgba(81, 10, 50, 0.18)',    // Soft Plum core
        colorStop1: 'rgba(81, 10, 50, 0.0)',
        phase: Math.PI * 1.25,
        phaseSpeed: 0.014,
      },
    ];

    let time = 0;

    const render = () => {
      time += 0.01;
      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Base Light Stage with Recessed Hollow Lighting
      const baseGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35 + (scrollY * 0.05) % 100,
        width * 0.05,
        width * 0.5,
        height * 0.4,
        Math.max(width, height) * 0.85
      );
      // Center is luminous & hollowed, perimeter gracefully deepens
      baseGrad.addColorStop(0, '#FFFFFF');
      baseGrad.addColorStop(0.35, '#FCF7F9');
      baseGrad.addColorStop(0.7, '#F6EAEF');
      baseGrad.addColorStop(1, '#EDD8E2');

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Moving Fluid Orbs with Smooth Wave Physics
      ctx.save();
      // Use blend mode for luminous organic fluid fusion
      ctx.globalCompositeOperation = 'multiply';

      orbs.forEach((orb, i) => {
        // Organic pulse and motion
        orb.phase += orb.phaseSpeed;
        orb.radius = orb.baseRadius * (1 + 0.15 * Math.sin(orb.phase));

        // Position drift
        orb.x += orb.vx + 0.4 * Math.sin(time * 0.8 + i);
        orb.y += orb.vy + 0.4 * Math.cos(time * 0.7 + i) + (scrollY * 0.0008);

        // Gentle mouse ripple pull
        const dx = mouseX - orb.x;
        const dy = mouseY - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400) {
          orb.x += (dx / dist) * 0.4;
          orb.y += (dy / dist) * 0.4;
        }

        // Soft bounce at boundaries
        const pad = orb.radius * 0.3;
        if (orb.x < -pad) orb.vx = Math.abs(orb.vx);
        if (orb.x > width + pad) orb.vx = -Math.abs(orb.vx);
        if (orb.y < -pad) orb.vy = Math.abs(orb.vy);
        if (orb.y > height + pad) orb.vy = -Math.abs(orb.vy);

        // Radial Gradient for the fluid drop
        const orbGrad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        orbGrad.addColorStop(0, orb.colorStop0);
        orbGrad.addColorStop(0.45, orb.colorStop0);
        orbGrad.addColorStop(1, orb.colorStop1);

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // 3. Draw 3D Hollow Vignette (Sunken Chamber Depth)
      ctx.save();
      const hollowVignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.32,
        Math.min(width, height) * 0.25,
        width * 0.5,
        height * 0.32,
        Math.max(width, height) * 0.85
      );
      hollowVignette.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      hollowVignette.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
      hollowVignette.addColorStop(0.85, 'rgba(81, 10, 50, 0.08)');
      hollowVignette.addColorStop(1, 'rgba(45, 20, 44, 0.18)');

      ctx.fillStyle = hollowVignette;
      ctx.fillRect(0, 0, width, height);

      // Subtle top/bottom rim lighting for tactile hollow sensation
      const rimTop = ctx.createLinearGradient(0, 0, 0, 180);
      rimTop.addColorStop(0, 'rgba(45, 20, 44, 0.08)');
      rimTop.addColorStop(1, 'rgba(45, 20, 44, 0.0)');
      ctx.fillStyle = rimTop;
      ctx.fillRect(0, 0, width, 180);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Real 60fps HTML5 Canvas Fluid Simulation */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
