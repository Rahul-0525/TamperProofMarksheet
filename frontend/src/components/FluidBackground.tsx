import React from 'react';

export const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden atmospheric-canvas-stage">
      {/* 1. Warm Cabin Architectural Glow (Subtle Breathing Pulse Motion) */}
      <div 
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[360px] cabin-window-glow rounded-full animate-ambient-pulse"
      />

      {/* 2. Soft Muted Sage Aurora Orb (Slow Floating Motion - Top Left) */}
      <div 
        className="absolute -top-10 left-1/4 w-[650px] h-[450px] rounded-full animate-ambient-float-1"
        style={{
          background: 'radial-gradient(circle, rgba(148, 167, 137, 0.22) 0%, rgba(62, 86, 64, 0.15) 50%, transparent 75%)',
          filter: 'blur(80px)'
        }}
      />

      {/* 3. Misty Mountain Slate Fog (Slow Drifting Motion - Right) */}
      <div 
        className="absolute top-1/4 right-0 w-[580px] h-[520px] rounded-full animate-ambient-float-2"
        style={{
          background: 'radial-gradient(circle, rgba(122, 148, 161, 0.22) 0%, rgba(31, 47, 34, 0.2) 55%, transparent 75%)',
          filter: 'blur(90px)'
        }}
      />

      {/* 4. Ethereal Cloud Mist (Lower Left Counter-Balance) */}
      <div 
        className="absolute bottom-10 -left-10 w-[450px] h-[400px] rounded-full animate-ambient-float-2"
        style={{
          background: 'radial-gradient(circle, rgba(206, 217, 223, 0.1) 0%, rgba(62, 86, 64, 0.08) 50%, transparent 70%)',
          filter: 'blur(75px)'
        }}
      />

      {/* 5. Subtle Elegant Ambient Star-grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
