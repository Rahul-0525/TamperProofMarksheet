import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  Search,
  QrCode,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building2,
  Sparkles,
  Cpu,
  Layers,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { MOCK_STUDENTS } from '../utils/mockData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [rollInput, setRollInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollInput.trim()) {
      setErrorMsg('Please enter a student roll number.');
      return;
    }
    setErrorMsg('');
    navigate(`/marksheet/${rollInput.trim().toUpperCase()}`);
  };

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Prestige University Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md hover:border-indigo-500/40 transition">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>National Institute of Technology &bull; Examination Authority</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span className="text-slate-400">Ledger v1.0</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Cryptographically Verifiable <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-300">
            Academic Credentials
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 mb-10 leading-relaxed font-normal">
          Published marks are permanently sealed into an append-only binary Merkle ledger.
          Guarantees zero unauthorized grade modifications, 100% offline QR verification, and instant forensic tampering detection.
        </p>

        {/* Floating Edgeless Search Box */}
        <div className="max-w-xl mx-auto glass-panel p-2 sm:p-2.5 rounded-2xl border border-white/10 shadow-2xl glow-indigo mb-6">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={rollInput}
                onChange={(e) => {
                  setRollInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter Student Roll No (e.g., 2024CS001)"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-white rounded-xl text-sm font-mono uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:bg-white/[0.04] transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-indigo-600/30 active:scale-95 whitespace-nowrap"
            >
              <span>View Marksheet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {errorMsg && (
          <p className="text-rose-400 text-xs mb-4 font-medium animate-fadeIn">{errorMsg}</p>
        )}

        {/* Quick Sample Selector for Evaluators */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500">Quick Test Records:</span>
          {MOCK_STUDENTS.slice(0, 4).map((s) => (
            <button
              key={s.roll_no}
              type="button"
              onClick={() => navigate(`/marksheet/${s.roll_no}`)}
              className="px-3 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] font-mono text-[11px] text-slate-300 hover:text-white transition flex items-center space-x-1"
            >
              <span>{s.roll_no}</span>
              <span className="text-slate-500">({s.student_name.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3 Role-Isolated Gateway Portals */}
      <div className="max-w-6xl mx-auto px-4 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Third-Party Verification */}
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition duration-300">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 mb-3 tracking-wider">
                THIRD-PARTY &bull; HR &bull; RECRUITERS
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition">
                Offline QR Verification
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Scan printed marksheet QR codes using a webcam or file upload. Validates inclusion proofs directly inside the browser using Web Crypto API.
              </p>
            </div>
            <button
              onClick={() => navigate('/verify')}
              className="w-full py-2.5 px-4 bg-white/[0.05] hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/[0.08] hover:border-emerald-500/30 text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-2"
            >
              <span>Launch Verification Portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Dual-Key Governance */}
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] hover:border-indigo-500/30 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition duration-300">
                <Lock className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20 mb-3 tracking-wider">
                DEAN &bull; CONTROLLER OF EXAMS
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition">
                Dual-Signature Chamber
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Enforces institutional separation of powers. Re-evaluation grade modifications require independent Ed25519 digital signatures from both leaders.
              </p>
            </div>
            <button
              onClick={() => navigate('/governance')}
              className="w-full py-2.5 px-4 bg-white/[0.05] hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-200 border border-white/[0.08] hover:border-indigo-500/30 text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-2"
            >
              <span>Enter Governance Chamber</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Security & Forensic Audit */}
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] hover:border-rose-500/30 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5 group-hover:scale-105 transition duration-300">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-semibold border border-rose-500/20 mb-3 tracking-wider">
                SECURITY &bull; EVALUATOR SANDBOX
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-rose-300 transition">
                Tamper Audit Console
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Continuous daemon that scans raw database rows against the immutable Merkle Root. Features the live SQL injection sandbox for judge testing.
              </p>
            </div>
            <button
              onClick={() => navigate('/audit')}
              className="w-full py-2.5 px-4 bg-white/[0.05] hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-2"
            >
              <span>Open Audit Console</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mathematical Trust Guarantees */}
      <div className="max-w-6xl mx-auto px-4 pb-12 w-full">
        <div className="glass-panel rounded-2xl p-6 border border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Deterministic SHA-256 Canonical Serializer</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Ed25519 Asymmetric Digital Signatures</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>$O(\log N)$ Merkle Inclusion Proofs</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
            <span>Real-Time Database Tamper Pinpointing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
