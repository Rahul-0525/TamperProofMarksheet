import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { FluidBackground } from './components/FluidBackground';
import { LpuLogo } from './components/LpuLogo';
import { useScrollObserver } from './utils/useScrollObserver';
import { Home } from './pages/Home';
import { AdminPublish } from './pages/AdminPublish';
import { MarksheetView } from './pages/MarksheetView';
import { VerifyPortal } from './pages/VerifyPortal';
import { GovernancePortal } from './pages/GovernancePortal';
import { AuditDashboard } from './pages/AuditDashboard';

// Internal container with scroll observer attached
const AppContent: React.FC = () => {
  useScrollObserver();

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100 selection:bg-[#fbbf24] selection:text-slate-900">
      {/* Atmospheric Cinematic Dusk Pine & Amber Glow Background */}
      <FluidBackground />

      {/* Floating Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Navigate to="/" replace />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<AdminPublish />} />
          <Route path="/marksheet" element={<MarksheetView />} />
          <Route path="/marksheet/:roll_no" element={<MarksheetView />} />
          <Route path="/verify" element={<VerifyPortal />} />
          <Route path="/governance" element={<GovernancePortal />} />
          <Route path="/audit" element={<AuditDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Sleek, Minimalist Institutional Footer */}
      <footer className="relative z-10 bg-[#14231b]/90 backdrop-blur-2xl border-t border-white/[0.1] text-pine-200 text-xs py-5 sm:py-6 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: LPU Crest + TruGrade */}
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <LpuLogo size="sm" showText={false} />
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-white text-sm">
                  Tru<span className="text-[#fbbf24]">Grade</span>
                </span>
                <span className="text-pine-400">&bull;</span>
                <span className="text-[11px] font-semibold text-pine-100">Lovely Professional University</span>
              </div>
              <span className="text-[10px] text-pine-300 font-mono">Division of Examinations &bull; NAAC A++</span>
            </div>
          </div>

          {/* Center: Essential Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-pine-300 font-medium">
            <span className="hover:text-white transition cursor-pointer">Official Portal</span>
            <span>&bull;</span>
            <span className="hover:text-white transition cursor-pointer">Regulations</span>
            <span>&bull;</span>
            <span className="text-[#fbbf24] font-medium">Phagwara, Punjab 144411</span>
          </div>

          {/* Right: Copyright & Verification Status */}
          <div className="flex items-center space-x-2 text-[11px] text-pine-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>&copy; {new Date().getFullYear()} LPU Cryptographic Ledger</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
