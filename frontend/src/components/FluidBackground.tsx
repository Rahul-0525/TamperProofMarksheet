import React from 'react';

export const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden atmospheric-canvas-stage">
      {/* 1. Luminous Atmospheric Top Daylight Fog (Softens & Brightens the Top) */}
      <div 
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] rounded-full animate-ambient-pulse"
        style={{
          background: 'radial-gradient(ellipse, rgba(206, 217, 223, 0.2) 0%, rgba(148, 167, 137, 0.25) 45%, transparent 75%)',
          filter: 'blur(90px)'
        }}
      />

      {/* 2. Warm Cabin Architectural Glow (Radiant Amber Window Light) */}
      <div 
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[420px] cabin-window-glow rounded-full animate-ambient-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.16) 45%, transparent 75%)',
          filter: 'blur(50px)'
        }}
      />

      {/* 3. Soft Muted Sage Aurora Orb (Slow Floating Motion - Top Left) */}
      <div 
        className="absolute -top-10 left-1/4 w-[750px] h-[500px] rounded-full animate-ambient-float-1"
        style={{
          background: 'radial-gradient(circle, rgba(148, 167, 137, 0.32) 0%, rgba(62, 86, 64, 0.22) 50%, transparent 75%)',
          filter: 'blur(85px)'
        }}
      />

      {/* 4. Misty Mountain Slate Fog (Slow Drifting Motion - Right) */}
      <div 
        className="absolute top-1/4 right-0 w-[650px] h-[550px] rounded-full animate-ambient-float-2"
        style={{
          background: 'radial-gradient(circle, rgba(122, 148, 161, 0.3) 0%, rgba(31, 47, 34, 0.25) 55%, transparent 75%)',
          filter: 'blur(95px)'
        }}
      />

      {/* 5. Ethereal Cloud Mist (Lower Left Ambient Counter-Balance) */}
      <div 
        className="absolute bottom-10 -left-10 w-[550px] h-[450px] rounded-full animate-ambient-float-2"
        style={{
          background: 'radial-gradient(circle, rgba(206, 217, 223, 0.18) 0%, rgba(148, 167, 137, 0.15) 50%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />

      {/* 6. Subtle Elegant Ambient Star-grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
