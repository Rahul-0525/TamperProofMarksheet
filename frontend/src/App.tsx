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
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
        <Navbar />

        <main className="flex-grow">
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

        <footer className="bg-[#080c14] border-t border-white/[0.06] text-slate-400 text-xs py-8 no-print mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-200">
                VeriMark &bull; Problem H8 (Tamper-Proof Exam Result Ledger)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Code Fuzion 2026 &bull; Binary Merkle Trees &bull; Ed25519 Dual Governance &bull; Direct DB Tamper Audit
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
              <span className="text-indigo-400 font-semibold">Branch: frontend2</span>
              <span>&bull;</span>
              <span className="text-emerald-400">100% Offline WebCrypto Capable</span>
              <span>&bull;</span>
              <span>1-Click Vercel Deploy</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
