import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { AdminPublish } from './pages/AdminPublish';
import { MarksheetView } from './pages/MarksheetView';
import { VerifyPortal } from './pages/VerifyPortal';
import { GovernancePortal } from './pages/GovernancePortal';
import { AuditDashboard } from './pages/AuditDashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#08090c] text-slate-100 selection:bg-[#ff6b00] selection:text-white">
        <Navbar />

        <main className="flex-grow page-enter">
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

        {/* Clean, Official LPU Institutional Footer */}
        <footer className="bg-[#050608] border-t border-white/[0.08] text-slate-400 text-xs py-10 no-print mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
              {/* TruGrade LPU Brand */}
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center space-x-1.5 font-display text-xl font-black text-white">
                  <span>Tru</span>
                  <span className="text-[#ff6b00]">Grade</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] ml-0.5" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 text-center md:text-left">
                  Lovely Professional University &bull; Division of Academic Affairs &amp; Examinations
                </p>
              </div>

              {/* Institutional Links & Helpdesk */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400 font-medium">
                <span className="hover:text-white transition">Official University Portal</span>
                <span>&bull;</span>
                <span className="hover:text-white transition">Examination Regulations</span>
                <span>&bull;</span>
                <span className="hover:text-white transition">Student Grievance Cell</span>
                <span>&bull;</span>
                <span className="text-[#ff8a34]">Jalandhar-Delhi G.T. Road, Phagwara, Punjab 144411</span>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
              <p>
                &copy; {new Date().getFullYear()} Lovely Professional University. All Rights Reserved. TruGrade Academic Ledger.
              </p>
              <p className="text-slate-400">
                Official Examination Transcript Authority
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
