import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { MarksheetView } from './pages/MarksheetView';
import { VerifyPortal } from './pages/VerifyPortal';
import { GovernancePortal } from './pages/GovernancePortal';
import { AuditDashboard } from './pages/AuditDashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/marksheet/2024CS001" replace />} />
            <Route path="/marksheet" element={<Navigate to="/marksheet/2024CS001" replace />} />
            <Route path="/marksheet/:roll_no" element={<MarksheetView />} />
            <Route path="/verify" element={<VerifyPortal />} />
            <Route path="/governance" element={<GovernancePortal />} />
            <Route path="/audit" element={<AuditDashboard />} />
            <Route path="*" element={<Navigate to="/marksheet/2024CS001" replace />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-300">
                VeriMark — Problem H8 (Tamper-Proof Exam Result Ledger)
              </p>
              <p className="text-[11px] text-slate-500">
                Code Fuzion 2026 &bull; Cryptographic Merkle Trees &bull; Dual-Key Governance &bull; Direct DB Tamper Audit
              </p>
            </div>
            <div className="flex items-center space-x-4 text-[11px]">
              <span className="font-mono text-indigo-400">Branch: feature/frontend-ui</span>
              <span>&bull;</span>
              <span>1-Click Vercel Ready</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
