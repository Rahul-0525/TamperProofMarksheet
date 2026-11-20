import React from 'react';

export const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden atmospheric-canvas-stage">
      {/* Warm Cabin Architectural Interior Glow (Matching the glowing windows in Dribbble shot) */}
      <div 
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] cabin-window-glow rounded-full"
      />

      {/* Atmospheric Misty Dusk Pine Fog Overlays */}
      <div 
        className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(62, 106, 96, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      <div 
        className="absolute top-1/3 right-10 w-[500px] h-[450px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 61, 55, 0.25) 0%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />

      {/* Subtle Mist/Atmospheric Noise */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />
    </div>
  );
};
