import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { FluidBackground } from './components/FluidBackground';
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
    <div className="relative min-h-screen flex flex-col text-[#2D142C] selection:bg-[#EE4540] selection:text-white">
      {/* Background with Lighter Tones, Hollow Depth Vignette & Fluid Animated Orbs */}
      <FluidBackground />

      {/* Sticky Frosted Header */}
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

      {/* Pristine Institutional LPU Footer (Light Theme) */}
      <footer className="relative z-10 bg-white/75 backdrop-blur-xl border-t border-[#801336]/10 text-[#510A32]/80 text-xs py-10 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#801336]/10">
            {/* TruGrade LPU Brand */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-1.5 font-display text-xl font-black text-[#2D142C]">
                <span>Tru</span>
                <span className="text-[#EE4540]">Grade</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C72C41] ml-0.5" />
              </div>
              <p className="text-[11px] text-[#510A32]/70 mt-1 text-center md:text-left font-medium">
                Lovely Professional University &bull; Division of Academic Affairs &amp; Examinations
              </p>
            </div>

            {/* Institutional Links & Campus Address */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#510A32]/80 font-medium">
              <span className="hover:text-[#EE4540] transition cursor-pointer">Official University Portal</span>
              <span>&bull;</span>
              <span className="hover:text-[#EE4540] transition cursor-pointer">Examination Regulations</span>
              <span>&bull;</span>
              <span className="hover:text-[#EE4540] transition cursor-pointer">Student Grievance Cell</span>
              <span>&bull;</span>
              <span className="text-[#C72C41] font-semibold">Jalandhar-Delhi G.T. Road, Phagwara, Punjab 144411</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#510A32]/60 gap-3">
            <p>
              &copy; {new Date().getFullYear()} Lovely Professional University. All Rights Reserved. TruGrade Academic Ledger.
            </p>
            <p className="text-[#801336] font-semibold">
              Official Examination Transcript Authority
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
