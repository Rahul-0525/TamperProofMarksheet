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
import { getActiveCohort } from '../utils/mockData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const cohort = getActiveCohort();
  const defaultRoll = cohort.students[0]?.roll_no || '2024CS001';
  const [rollInput, setRollInput] = useState(defaultRoll);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = rollInput.trim();
    if (!query) {
      setErrorMsg('Please enter a valid student registration or roll number.');
      return;
    }
    setErrorMsg('');

    // Check exact or suffix in active cohort
    const match = cohort.students.find(s => {
      const r = s.roll_no.toLowerCase();
      const q = query.toLowerCase();
      return r === q || r.endsWith(q) || r.includes(q);
    });

    if (match) {
      navigate(`/marksheet/${match.roll_no}`);
    } else {
      navigate(`/marksheet/${query.toUpperCase()}`);
    }
  };

  return (
    <div className="relative overflow-hidden py-10 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-16 sm:space-y-24">
      {/* ==========================================================
          THE DRIBBBLE-INSPIRED HERO FRAME - SPACEY & EXPANSIVE
          ========================================================== */}
      <div className="lodge-card-frame relative overflow-hidden min-h-[620px] lg:min-h-[680px] p-8 sm:p-14 lg:p-18 flex flex-col justify-between fly-in is-revealed">
        {/* Warm Architectural Cabin Glow in Background */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[580px] h-[300px] cabin-window-glow rounded-full pointer-events-none" />

        {/* Top Header Badge Inside the Frame */}
        <div className="relative z-10 flex items-center justify-between mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2.5 px-4.5 py-2 rounded-full bg-white/[0.08] border border-white/[0.18] text-pine-100 text-xs font-semibold backdrop-blur-md shadow-sm">
            <Building2 className="w-4 h-4 text-[#fbbf24]" />
            <span>Lovely Professional University &bull; Division of Examinations</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2.5 text-xs text-pine-200 bg-black/25 px-3.5 py-1.5 rounded-full border border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold text-white">Ledger Active &bull; Root Sealed</span>
          </div>
        </div>

        {/* Middle Section: Massive Typography on Left + Floating Action Card on Right */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end pb-6 sm:pb-8">
          {/* Left Column: Nature's Perfect Hideaways -> Tamper-Proof Academic Ledger */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] drop-shadow-md select-none animated-gradient-heading">
              Tamper-Proof <br />
              Academic <br />
              Ledger
            </h1>

            <p className="max-w-lg text-sm sm:text-base text-pine-100/90 leading-relaxed font-normal">
              Official semester examination marks published by Lovely Professional University, cryptographically sealed into an append-only binary Merkle tree. Fully verifiable offline.
            </p>

            {/* Bottom-Left Trust / Star Rating Pill (Matches ★ 4.7 from 1,000+ stays) */}
            <div className="pt-3 flex items-center space-x-3.5 text-xs text-pine-200">
              <div className="flex items-center space-x-1.5 text-[#fbbf24] font-bold text-sm bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-sm">
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
            <div className="floating-action-card p-7 sm:p-9 w-full max-w-md space-y-6">
              {/* Card Title & Icon */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.1]">
                <div>
                  <h3 className="font-display text-xl font-bold text-white tracking-tight">
                    Examination Transcript
                  </h3>
                  <p className="text-xs text-pine-300 mt-0.5">Official Student Record Verification</p>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-[#fbbf24] shadow-sm">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
              </div>

              {/* Two Sunken Inset Fields (Matches Check-in / Check-out inputs) */}
              <form onSubmit={handleSearch} className="space-y-5">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Field 1: Registration No */}
                  <div className="inset-pill-field p-4 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-pine-300 block mb-1">
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
                    <span className="text-[10px] text-pine-400 mt-1">Computer Science</span>
                  </div>

                  {/* Field 2: Semester */}
                  <div className="inset-pill-field p-4 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-pine-300 block mb-1">
                      Academic Term
                    </span>
                    <span className="font-mono font-bold text-white text-xs">
                      Semester 5
                    </span>
                    <span className="text-[10px] text-pine-400 mt-1">2024 Session</span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-rose-400 text-xs font-semibold">{errorMsg}</p>
                )}

                {/* Bottom Stats & Pricing Equivalent: Status + Action */}
                <div className="pt-2">
                  <div className="flex items-baseline justify-between mb-4 text-xs">
                    <span className="text-pine-300 text-xs">Ledger Status:</span>
                    <span className="font-bold text-[#fbbf24] text-xs">
                      Cryptographically Sealed
                    </span>
                  </div>

                  {/* The Crisp White Pill Button (Matches Book Now in the shot) */}
                  <button
                    type="submit"
                    className="btn-pill-white w-full py-3.5 text-xs sm:text-sm flex items-center justify-center space-x-2 active:scale-95 shadow-xl font-bold"
                  >
                    <span>View Verified Transcript</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Sample Selector Pills */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-pine-300">
                <span className="text-[11px] text-pine-400 font-medium">Quick Sample:</span>
                <div className="flex space-x-2">
                  {cohort.students.slice(0, 3).map((s) => (
                    <button
                      key={s.roll_no}
                      onClick={() => setRollInput(s.roll_no)}
                      className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/20 text-white font-mono text-[11px] transition font-semibold"
                    >
                      {s.roll_no.length > 6 ? s.roll_no.substring(s.roll_no.length - 4) : s.roll_no}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          THE 3 ROLE GATEWAYS (Styled in matching luxury frosted glass) - SPACEY & RELAXED
          ========================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pt-6">
        {/* Card 1: Instant QR Verification */}
        <div className="glass-card-hover p-8 rounded-[32px] flex flex-col justify-between fly-in delay-100 space-y-6">
          <div>
            <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] mb-6 shadow-sm">
              <QrCode className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-white/[0.06] text-[#fbbf24] text-[10px] font-bold border border-[#f59e0b]/25 mb-4 tracking-wider">
              FOR EMPLOYERS &bull; HR &bull; BACKGROUND VERIFICATION
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-3">
              Instant QR Verification
            </h3>
            <p className="text-pine-200/90 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              Verify printed marksheet QR codes using your device webcam or file upload. Evaluates inclusion proofs directly inside the browser without contacting any database.
            </p>
          </div>
          <button
            onClick={() => navigate('/verify')}
            className="btn-pill-white w-full py-3 px-5 text-xs font-bold flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Verify Marksheet QR</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Dual-Key Governance Chamber */}
        <div className="glass-card-hover p-8 rounded-[32px] flex flex-col justify-between fly-in delay-200 space-y-6">
          <div>
            <div className="w-13 h-13 p-3.5 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white mb-6 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-white/[0.06] text-pine-100 text-[10px] font-bold border border-white/15 mb-4 tracking-wider">
              DEAN OF ACADEMICS &bull; CONTROLLER OF EXAMS
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-3">
              Dual-Key Governance Chamber
            </h3>
            <p className="text-pine-200/90 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              Enforces institutional separation of duties. Grade re-evaluation amendments require co-signatures with independent Ed25519 digital keys from both university authorities.
            </p>
          </div>
          <button
            onClick={() => navigate('/governance')}
            className="btn-pill-white w-full py-3 px-5 text-xs font-bold flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Access Governance Chamber</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Tamper Audit Console */}
        <div className="glass-card-hover p-8 rounded-[32px] flex flex-col justify-between fly-in delay-300 space-y-6">
          <div>
            <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] mb-6 shadow-sm">
              <Fingerprint className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-white/[0.06] text-[#fbbf24] text-[10px] font-bold border border-[#f59e0b]/25 mb-4 tracking-wider">
              SECURITY OPERATIONS &bull; EVALUATOR AUDIT
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-3">
              Tamper Audit Console
            </h3>
            <p className="text-pine-200/90 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              Continuous daemon cross-referencing raw database records against the immutable Merkle root. Features an Evaluator Sandbox to test raw SQL tamper detection live.
            </p>
          </div>
          <button
            onClick={() => navigate('/audit')}
            className="btn-pill-white w-full py-3 px-5 text-xs font-bold flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Launch Tamper Auditor</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ==========================================================
          BOTTOM TRUST & STANDARDS BAR - SPACEY
          ========================================================== */}
      <div className="glass-card-hover rounded-[28px] p-7 sm:p-8 flex flex-wrap items-center justify-between gap-6 text-xs text-pine-200 fly-in delay-400">
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
