import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  QrCode,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building2,
  ChevronRight,
  Fingerprint,
  Award,
  ShieldAlert
} from 'lucide-react';
import { MOCK_STUDENTS } from '../utils/mockData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [rollInput, setRollInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollInput.trim()) {
      setErrorMsg('Please enter a valid student registration or roll number.');
      return;
    }
    setErrorMsg('');
    navigate(`/marksheet/${rollInput.trim().toUpperCase()}`);
  };

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-160px)] flex flex-col justify-between">
      {/* Ambient Orange & Obsidian Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-[#ff6b00]/12 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[300px] bg-amber-500/8 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center page-enter">
        {/* Institutional LPU Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#ff6b00]/30 text-[#ff944d] text-xs font-semibold mb-8 backdrop-blur-md hover:border-[#ff6b00]/60 transition">
          <Building2 className="w-3.5 h-3.5 text-[#ff6b00]" />
          <span>Lovely Professional University &bull; Division of Examinations</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Tamper-Proof Academic Transcripts <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] via-[#ff8c3b] to-amber-300">
            Authenticated by TruGrade
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 mb-10 leading-relaxed font-normal">
          Official semester marks published by Lovely Professional University are cryptographically sealed into an immutable append-only ledger. Guarantees tamper-free grade permanence and instant third-party QR verification.
        </p>

        {/* Edgeless Frosted Search Box */}
        <div className="max-w-xl mx-auto glass-card p-2 sm:p-2.5 rounded-2xl border border-white/10 glow-orange mb-6">
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
                placeholder="Enter Student Registration / Roll No (e.g., 2024CS001)"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-white rounded-xl text-sm font-mono uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:bg-white/[0.04] transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#ff6b00] to-[#ea580c] hover:from-[#ff7a1a] hover:to-[#f97316] active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-[#ff6b00]/30 whitespace-nowrap"
            >
              <span>View Result</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {errorMsg && (
          <p className="text-rose-400 text-xs mb-4 font-semibold animate-fadeIn">{errorMsg}</p>
        )}

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500">Sample Roll Records:</span>
          {MOCK_STUDENTS.slice(0, 4).map((s) => (
            <button
              key={s.roll_no}
              type="button"
              onClick={() => navigate(`/marksheet/${s.roll_no}`)}
              className="px-3 py-1 rounded-lg bg-white/[0.03] hover:bg-[#ff6b00]/15 border border-white/[0.08] hover:border-[#ff6b00]/40 font-mono text-[11px] text-slate-300 hover:text-white transition flex items-center space-x-1"
            >
              <span>{s.roll_no}</span>
              <span className="text-slate-500">({s.student_name.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3 Role-Isolated Gateways */}
      <div className="max-w-6xl mx-auto px-4 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Third-Party Verification */}
          <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#ff6b00]/10 border border-[#ff6b00]/25 flex items-center justify-center text-[#ff6b00] mb-5">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#ff6b00]/10 text-[#ff8a34] text-[10px] font-bold border border-[#ff6b00]/20 mb-3 tracking-wider">
                FOR EMPLOYERS &bull; HR &bull; BACKGROUND VERIFICATION
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">
                Instant QR Verification
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                Verify LPU printed transcripts using webcam or file upload. Validates cryptographic inclusion proofs directly inside the browser.
              </p>
            </div>
            <button
              onClick={() => navigate('/verify')}
              className="w-full py-2.5 px-4 bg-white/[0.04] hover:bg-[#ff6b00] hover:text-white text-slate-200 border border-white/[0.08] hover:border-[#ff6b00] text-xs font-bold rounded-xl transition duration-200 flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Verify Marksheet</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Dual-Key Governance */}
          <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20 mb-3 tracking-wider">
                DEAN OF ACADEMICS &bull; CONTROLLER OF EXAMS
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">
                Dual-Key Governance Chamber
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                Enforces institutional separation of powers. Re-evaluation grade modifications require co-signatures from both authorized university authorities.
              </p>
            </div>
            <button
              onClick={() => navigate('/governance')}
              className="w-full py-2.5 px-4 bg-white/[0.04] hover:bg-[#ff6b00] hover:text-white text-slate-200 border border-white/[0.08] hover:border-[#ff6b00] text-xs font-bold rounded-xl transition duration-200 flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Access Governance Chamber</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Security & Forensic Audit */}
          <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 mb-5">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 text-[10px] font-bold border border-rose-500/20 mb-3 tracking-wider">
                VIGILANCE &bull; AUDIT OPERATIONS
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">
                Tamper Audit Console
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                Continuous daemon that scans raw database records against the immutable ledger root to pinpoint any unauthorized direct SQL modifications.
              </p>
            </div>
            <button
              onClick={() => navigate('/audit')}
              className="w-full py-2.5 px-4 bg-white/[0.04] hover:bg-[#ff6b00] hover:text-white text-slate-200 border border-white/[0.08] hover:border-[#ff6b00] text-xs font-bold rounded-xl transition duration-200 flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Open Audit Console</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Verification Standards */}
      <div className="max-w-6xl mx-auto px-4 pb-12 w-full">
        <div className="glass-card rounded-2xl p-6 border border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
            <span>Deterministic SHA-256 Canonical Serializer</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
            <span>Ed25519 Asymmetric Digital Signatures</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
            <span>Binary Merkle Tree Inclusion Proofs</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
            <span>Real-Time Database Tamper Pinpointing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
