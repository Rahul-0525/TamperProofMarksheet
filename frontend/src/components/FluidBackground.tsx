import React from 'react';

export const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#182a20]">
      {/* 1. Real Cinematic Misty Pine Forest Wallpaper with Subtle Breathing Motion */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/misty_pine_background.jpg"
          alt="Misty Pine Forest"
          className="w-full h-full object-cover object-center animate-subtle-ken-burns opacity-80"
        />
        {/* Soft Dawn Daylight Ambient Glow Overlay (Brightens & Illuminates the Forest) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 1100px 700px at 50% -10%, rgba(206, 217, 223, 0.42) 0%, rgba(148, 167, 137, 0.25) 45%, transparent 75%),
              radial-gradient(circle 950px at 50% 65%, rgba(245, 158, 11, 0.18) 0%, transparent 60%),
              linear-gradient(180deg, rgba(22, 38, 29, 0.3) 0%, rgba(18, 32, 24, 0.48) 50%, rgba(14, 24, 18, 0.78) 100%)
            `
          }}
        />
      </div>

      {/* 2. Layer 1: Ethereal Rolling Mist Wave (Slow Non-Distracting Horizontal Drift) */}
      <div 
        className="absolute top-1/4 -left-1/4 w-[150%] h-[450px] animate-mist-wave-1 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(206, 217, 223, 0.35) 0%, rgba(122, 148, 161, 0.2) 45%, transparent 75%)',
          filter: 'blur(60px)'
        }}
      />

      {/* 3. Layer 2: Soft Mountain Ridge Fog (Slow Counter-Drift) */}
      <div 
        className="absolute bottom-1/3 -right-1/4 w-[150%] h-[500px] animate-mist-wave-2 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(148, 167, 137, 0.3) 0%, rgba(122, 148, 161, 0.18) 50%, transparent 80%)',
          filter: 'blur(70px)'
        }}
      />

      {/* 4. Warm Architectural Cabin Interior Glow (Glowing Windows in Forest) */}
      <div 
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[750px] h-[380px] cabin-window-glow rounded-full animate-ambient-pulse pointer-events-none"
      />

      {/* 5. Subtle Starlight / Atmospheric Grain */}
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
