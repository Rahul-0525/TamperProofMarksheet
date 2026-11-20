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
      {/* Hero Section with Fluid Fly-In */}
      <div className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center fly-in is-revealed">
        {/* Institutional LPU Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#EE4540]/30 text-[#801336] text-xs font-semibold mb-8 shadow-sm backdrop-blur-md hover:border-[#EE4540]/60 transition">
          <Building2 className="w-3.5 h-3.5 text-[#EE4540]" />
          <span>Lovely Professional University &bull; Division of Examinations</span>
        </div>

        {/* Hero Title with Palette Gradient */}
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#2D142C] mb-6 leading-tight">
          Tamper-Proof Academic Transcripts <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EE4540] via-[#C72C41] to-[#801336]">
            Authenticated by TruGrade
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#510A32]/80 mb-10 leading-relaxed font-normal">
          Official semester marks published by Lovely Professional University are cryptographically sealed into an immutable append-only ledger. Guarantees tamper-free grade permanence and instant third-party QR verification.
        </p>

        {/* Edgeless Frosted Search Box in Lighter Tone */}
        <div className="max-w-xl mx-auto glass-card p-2 sm:p-2.5 rounded-2xl border border-white/90 glow-coral mb-6 shadow-xl">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-[#801336]/60 absolute left-4 top-3.5" />
              <input
                type="text"
                value={rollInput}
                onChange={(e) => {
                  setRollInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter Student Registration / Roll No (e.g., 2024CS001)"
                className="w-full pl-11 pr-4 py-3 bg-white/60 text-[#2D142C] rounded-xl text-sm font-mono uppercase placeholder:normal-case placeholder:text-[#510A32]/45 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#EE4540] transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#EE4540] to-[#C72C41] hover:from-[#f05652] hover:to-[#d6354a] active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-[#EE4540]/30 whitespace-nowrap"
            >
              <span>View Result</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {errorMsg && (
          <p className="text-[#C72C41] text-xs mb-4 font-semibold animate-fadeIn">{errorMsg}</p>
        )}

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#510A32]/70">
          <span className="font-medium text-[#510A32]/60">Sample Roll Records:</span>
          {MOCK_STUDENTS.slice(0, 4).map((s) => (
            <button
              key={s.roll_no}
              type="button"
              onClick={() => navigate(`/marksheet/${s.roll_no}`)}
              className="px-3 py-1 rounded-lg bg-white/70 hover:bg-[#EE4540]/15 border border-[#801336]/15 hover:border-[#EE4540]/40 font-mono text-[11px] text-[#2D142C] hover:text-[#EE4540] transition flex items-center space-x-1 shadow-sm"
            >
              <span>{s.roll_no}</span>
              <span className="text-[#801336]/60">({s.student_name.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3 Role Gateways with Fluid Fly-In on Scroll */}
      <div className="max-w-6xl mx-auto px-4 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Third-Party Verification */}
          <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between fly-in delay-100 shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EE4540]/10 border border-[#EE4540]/25 flex items-center justify-center text-[#EE4540] mb-5 shadow-sm">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#EE4540]/10 text-[#C72C41] text-[10px] font-bold border border-[#EE4540]/20 mb-3 tracking-wider">
                FOR EMPLOYERS &bull; HR &bull; BACKGROUND VERIFICATION
              </div>
              <h3 className="font-display text-lg font-bold text-[#2D142C] mb-2">
                Instant QR Verification
              </h3>
              <p className="text-[#510A32]/75 text-xs leading-relaxed mb-6 font-normal">
                Verify LPU printed transcripts using webcam or file upload. Validates cryptographic inclusion proofs directly inside the browser.
              </p>
            </div>
            <button
              onClick={() => navigate('/verify')}
              className="w-full py-2.5 px-4 bg-white/90 hover:bg-[#EE4540] hover:text-white text-[#2D142C] border border-[#801336]/15 hover:border-[#EE4540] text-xs font-bold rounded-xl transition duration-200 flex items-center justify-center space-x-2 active:scale-95 shadow-sm"
            >
              <span>Verify Marksheet</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Dual-Key Governance */}
          <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between fly-in delay-200 shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#801336]/10 border border-[#801336]/25 flex items-center justify-center text-[#801336] mb-5 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#801336]/10 text-[#801336] text-[10px] font-bold border border-[#801336]/20 mb-3 tracking-wider">
                DEAN OF ACADEMICS &bull; CONTROLLER OF EXAMS
              </div>
              <h3 className="font-display text-lg font-bold text-[#2D142C] mb-2">
                Dual-Key Governance Chamber
              </h3>
              <p className="text-[#510A32]/75 text-xs leading-relaxed mb-6 font-normal">
                Enforces institutional separation of powers. Re-evaluation grade modifications require co-signatures from both authorized university authorities.
              </p>
            </div>
            <button
              onClick={() => navigate('/governance')}
              className="w-full py-2.5 px-4 bg-white/90 hover:bg-[#801336] hover:text-white text-[#2D142C] border border-[#801336]/15 hover:border-[#801336] text-xs font-bold rounded-xl transition duration-200 flex items-center justify-center space-x-2 active:scale-95 shadow-sm"
            >
              <span>Access Governance Chamber</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Security & Forensic Audit */}
          <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between fly-in delay-300 shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C72C41]/10 border border-[#C72C41]/25 flex items-center justify-center text-[#C72C41] mb-5 shadow-sm">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#C72C41]/10 text-[#C72C41] text-[10px] font-bold border border-[#C72C41]/20 mb-3 tracking-wider">
                VIGILANCE &bull; AUDIT OPERATIONS
              </div>
              <h3 className="font-display text-lg font-bold text-[#2D142C] mb-2">
                Tamper Audit Console
              </h3>
              <p className="text-[#510A32]/75 text-xs leading-relaxed mb-6 font-normal">
                Continuous daemon that scans raw database records against the immutable ledger root to pinpoint any unauthorized direct SQL modifications.
              </p>
            </div>
            <button
              onClick={() => navigate('/audit')}
              className="w-full py-2.5 px-4 bg-white/90 hover:bg-[#C72C41] hover:text-white text-[#2D142C] border border-[#801336]/15 hover:border-[#C72C41] text-xs font-bold rounded-xl transition duration-200 flex items-center justify-center space-x-2 active:scale-95 shadow-sm"
            >
              <span>Open Audit Console</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Verification Standards Bar with Fly-in */}
      <div className="max-w-6xl mx-auto px-4 pb-12 w-full fly-in delay-400">
        <div className="glass-card rounded-2xl p-6 border border-white/90 flex flex-wrap items-center justify-between gap-4 text-xs text-[#510A32] shadow-sm">
          <div className="flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#EE4540]" />
            <span>Deterministic SHA-256 Canonical Serializer</span>
          </div>
          <div className="flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#C72C41]" />
            <span>Ed25519 Asymmetric Digital Signatures</span>
          </div>
          <div className="flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#801336]" />
            <span>Binary Merkle Tree Inclusion Proofs</span>
          </div>
          <div className="flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#EE4540]" />
            <span>Real-Time Database Tamper Pinpointing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
