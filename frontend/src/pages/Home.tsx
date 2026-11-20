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
  Star,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { MOCK_STUDENTS } from '../utils/mockData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [rollInput, setRollInput] = useState('2024CS001');
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
    <div className="relative overflow-hidden py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* ==========================================================
          THE DRIBBBLE-INSPIRED HERO FRAME
          ========================================================== */}
      <div className="lodge-card-frame relative overflow-hidden min-h-[580px] lg:min-h-[640px] p-8 sm:p-12 lg:p-16 flex flex-col justify-between fly-in is-revealed">
        {/* Warm Architectural Cabin Glow in Background */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[500px] h-[260px] cabin-window-glow rounded-full pointer-events-none" />

        {/* Top Header Badge Inside the Frame */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.15] text-pine-100 text-xs font-semibold backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>Lovely Professional University &bull; Division of Examinations</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-pine-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">Ledger Active &bull; Root Sealed</span>
          </div>
        </div>

        {/* Middle Section: Massive Typography on Left + Floating Action Card on Right */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end pb-4">
          {/* Left Column: Nature's Perfect Hideaways -> Tamper-Proof Academic Ledger */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] drop-shadow-md select-none animated-gradient-heading">
              Tamper-Proof <br />
              Academic <br />
              Ledger
            </h1>

            <p className="max-w-md text-sm sm:text-base text-pine-100/80 leading-relaxed font-normal">
              Official semester examination marks published by Lovely Professional University, cryptographically sealed into an append-only binary Merkle tree. Fully verifiable offline.
            </p>

            {/* Bottom-Left Trust / Star Rating Pill (Matches ★ 4.7 from 1,000+ stays) */}
            <div className="pt-2 flex items-center space-x-3 text-xs text-pine-200">
              <div className="flex items-center space-x-1 text-[#fbbf24] font-bold text-sm bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                <Star className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                <span>4.9</span>
              </div>
              <span className="text-pine-200/90 font-medium">
                from 1,500+ verified student transcripts &bull; NAAC A++ Accredited
              </span>
            </div>
          </div>

          {/* Right Column: Floating Dark Frosted Booking Card (Matches Evergreen Pine Lodge card) */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="floating-action-card p-6 sm:p-7 w-full max-w-sm space-y-5">
              {/* Card Title & Icon */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">
                    Examination Transcript
                  </h3>
                  <p className="text-[11px] text-pine-300">Official Student Record Verification</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-[#fbbf24]">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Two Sunken Inset Fields (Matches Check-in / Check-out inputs) */}
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Field 1: Registration No */}
                  <div className="inset-pill-field p-3 flex flex-col justify-between">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-pine-300 block mb-1">
                      Roll Number
                    </span>
                    <input
                      type="text"
                      value={rollInput}
                      onChange={(e) => {
                        setRollInput(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="2024CS001"
                      className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none uppercase w-full"
                    />
                    <span className="text-[9px] text-pine-400 mt-1">Computer Science</span>
                  </div>

                  {/* Field 2: Semester */}
                  <div className="inset-pill-field p-3 flex flex-col justify-between">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-pine-300 block mb-1">
                      Academic Term
                    </span>
                    <span className="font-mono font-bold text-white text-xs">
                      Semester 5
                    </span>
                    <span className="text-[9px] text-pine-400 mt-1">2024 Session</span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-rose-400 text-xs font-semibold">{errorMsg}</p>
                )}

                {/* Bottom Stats & Pricing Equivalent: Status + Action */}
                <div className="pt-2">
                  <div className="flex items-baseline justify-between mb-3 text-xs">
                    <span className="text-pine-300 text-[11px]">Ledger Status:</span>
                    <span className="font-bold text-[#fbbf24] text-xs">
                      Cryptographically Sealed
                    </span>
                  </div>

                  {/* The Crisp White Pill Button (Matches Book Now in the shot) */}
                  <button
                    type="submit"
                    className="btn-pill-white w-full py-3 text-xs sm:text-sm flex items-center justify-center space-x-2 active:scale-95 shadow-lg"
                  >
                    <span>View Verified Transcript</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Sample Selector Pills */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-pine-300">
                <span className="text-[10px] text-pine-400">Sample Rolls:</span>
                <div className="flex space-x-1.5">
                  {MOCK_STUDENTS.slice(0, 3).map((s) => (
                    <button
                      key={s.roll_no}
                      onClick={() => setRollInput(s.roll_no)}
                      className="px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-white/20 text-white font-mono text-[10px] transition"
                    >
                      {s.roll_no.substring(6)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          THE 3 ROLE GATEWAYS (Styled in matching luxury frosted glass)
          ========================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Card 1: Instant QR Verification */}
        <div className="glass-card-hover p-6 rounded-3xl flex flex-col justify-between fly-in delay-100">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] mb-5 shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#fbbf24] text-[10px] font-bold border border-[#f59e0b]/25 mb-3 tracking-wider">
              FOR EMPLOYERS &bull; HR &bull; BACKGROUND VERIFICATION
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Instant QR Verification
            </h3>
            <p className="text-pine-200/80 text-xs leading-relaxed mb-6 font-normal">
              Verify printed marksheet QR codes using your device webcam or file upload. Evaluates inclusion proofs directly inside the browser without contacting any database.
            </p>
          </div>
          <button
            onClick={() => navigate('/verify')}
            className="btn-pill-white w-full py-2.5 px-4 text-xs flex items-center justify-center space-x-2"
          >
            <span>Verify Marksheet QR</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Dual-Key Governance Chamber */}
        <div className="glass-card-hover p-6 rounded-3xl flex flex-col justify-between fly-in delay-200">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white mb-5 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.06] text-pine-100 text-[10px] font-bold border border-white/15 mb-3 tracking-wider">
              DEAN OF ACADEMICS &bull; CONTROLLER OF EXAMS
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Dual-Key Governance Chamber
            </h3>
            <p className="text-pine-200/80 text-xs leading-relaxed mb-6 font-normal">
              Enforces institutional separation of duties. Grade re-evaluation amendments require co-signatures with independent Ed25519 digital keys from both university authorities.
            </p>
          </div>
          <button
            onClick={() => navigate('/governance')}
            className="btn-pill-white w-full py-2.5 px-4 text-xs flex items-center justify-center space-x-2"
          >
            <span>Access Governance Chamber</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Tamper Audit Console */}
        <div className="glass-card-hover p-6 rounded-3xl flex flex-col justify-between fly-in delay-300">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] mb-5 shadow-sm">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#fbbf24] text-[10px] font-bold border border-[#f59e0b]/25 mb-3 tracking-wider">
              SECURITY OPERATIONS &bull; EVALUATOR AUDIT
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Tamper Audit Console
            </h3>
            <p className="text-pine-200/80 text-xs leading-relaxed mb-6 font-normal">
              Continuous daemon cross-referencing raw database records against the immutable Merkle root. Features an Evaluator Sandbox to test raw SQL tamper detection live.
            </p>
          </div>
          <button
            onClick={() => navigate('/audit')}
            className="btn-pill-white w-full py-2.5 px-4 text-xs flex items-center justify-center space-x-2"
          >
            <span>Open Audit Console</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ==========================================================
          BOTTOM TRUST & STANDARDS BAR
          ========================================================== */}
      <div className="glass-card-hover rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 text-xs text-pine-200 fly-in delay-400">
        <div className="flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
          <span>Deterministic SHA-256 Canonical Serializer</span>
        </div>
        <div className="flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
          <span>Ed25519 Asymmetric Digital Signatures</span>
        </div>
        <div className="flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
          <span>Binary Merkle Tree Inclusion Proofs</span>
        </div>
        <div className="flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
          <span>Real-Time Database Tamper Pinpointing</span>
        </div>
      </div>
    </div>
  );
};
