import React from 'react';

export const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-hollow-stage">
      {/* Central Hollow Depth Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 75% 55% at 50% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(250, 246, 248, 0.4) 60%, rgba(240, 226, 232, 0.8) 100%)',
          boxShadow: 'inset 0 0 100px rgba(81, 10, 50, 0.04)'
        }}
      />

      {/* Floating Fluid Orb 1 - Lighter Warm Coral Tone */}
      <div 
        className="fluid-orb fluid-orb-coral animate-fluid-float-1 w-[550px] h-[550px] -top-24 -left-20"
      />

      {/* Floating Fluid Orb 2 - Lighter Ruby Red Tone */}
      <div 
        className="fluid-orb fluid-orb-ruby animate-fluid-float-2 w-[600px] h-[600px] top-1/3 -right-28"
      />

      {/* Floating Fluid Orb 3 - Soft Mulberry Plum Tone */}
      <div 
        className="fluid-orb fluid-orb-plum animate-fluid-float-3 w-[500px] h-[500px] -bottom-32 left-1/4"
      />

      {/* Floating Fluid Orb 4 - Luminous Peach/Coral Glow */}
      <div 
        className="fluid-orb fluid-orb-peach animate-fluid-float-1 w-[450px] h-[450px] top-2/3 right-1/3 opacity-40"
      />

      {/* Subtle organic noise/mesh overlay for ultra-tactile glass feel */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(#2D142C 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
