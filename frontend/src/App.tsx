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
          <Route path="/admin" element={<AdminPublish />} />
          <Route path="/marksheet" element={<Navigate to="/marksheet/2024CS001" replace />} />
          <Route path="/marksheet/:roll_no" element={<MarksheetView />} />
          <Route path="/verify" element={<VerifyPortal />} />
          <Route path="/governance" element={<GovernancePortal />} />
          <Route path="/audit" element={<AuditDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Clean Dribbble-Style Luxury Footer with Official LPU Crest */}
      <footer className="relative z-10 bg-[#0a0f09]/95 backdrop-blur-2xl border-t border-white/[0.08] text-[#ced9df] text-xs py-12 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-white/[0.08]">
            {/* Left: Official LPU University Logo & Accreditation Badge */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <LpuLogo size="md" />
            </div>

            {/* Right: TruGrade Ledger System Tag & Verification Status */}
            <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
              <div className="flex items-center space-x-2">
                <span className="font-display text-xl font-black text-white">
                  Tru<span className="text-[#fbbf24]">Grade</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30 font-mono text-[10px] font-bold">
                  v2.4 LEDGER
                </span>
              </div>
              <p className="text-[11px] text-pine-300/90 mt-1 font-medium max-w-sm">
                Cryptographic transcript sealing &amp; offline Merkle verification engineered for Lovely Professional University.
              </p>
            </div>
          </div>

          {/* Institutional Links & Campus Address */}
          <div className="py-6 flex flex-wrap items-center justify-center lg:justify-between gap-4 text-[11px] text-pine-200 font-medium border-b border-white/[0.04]">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <span className="hover:text-white transition cursor-pointer">Official University Portal</span>
              <span className="text-pine-600">&bull;</span>
              <span className="hover:text-white transition cursor-pointer">Examination Regulations</span>
              <span className="text-pine-600">&bull;</span>
              <span className="hover:text-white transition cursor-pointer">Academic Scrutiny &amp; Grievance</span>
              <span className="text-pine-600">&bull;</span>
              <span className="hover:text-white transition cursor-pointer">Dual-Key Governance Policy</span>
            </div>
            <div className="text-[#fbbf24] font-semibold text-center">
              Jalandhar - Delhi G.T. Road, Phagwara, Punjab 144411
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-pine-400 gap-3">
            <p>
              &copy; {new Date().getFullYear()} Lovely Professional University. All Rights Reserved. TruGrade Academic Ledger.
            </p>
            <p className="text-pine-300 font-semibold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Academic Record Authentication Authority</span>
            </p>
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
