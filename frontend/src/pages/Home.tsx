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
  FileText,
  Building,
  Award,
  Zap,
  ExternalLink
} from 'lucide-react';
import { MOCK_STUDENTS } from '../utils/mockData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [rollInput, setRollInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollInput.trim()) {
      setErrorMsg('Please enter a valid student roll number.');
      return;
    }
    setErrorMsg('');
    navigate(`/marksheet/${rollInput.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col justify-between">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Institutional Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-sm">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            <span>National Institute of Technology &bull; Office of Examinations</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Official University Transcript &amp; <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              Cryptographic Verification Portal
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
            Welcome to the public credential portal. Transcripts published here are cryptographically hashed into an append-only binary Merkle ledger, guaranteeing that marks cannot be altered after publication.
          </p>

          {/* Student Transcript Search Card */}
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 shadow-2xl">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={rollInput}
                  onChange={(e) => {
                    setRollInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter Student Roll No (e.g., 2024CS001)"
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl text-base font-mono uppercase placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/30 text-sm whitespace-nowrap"
              >
                <span>View Transcript</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {errorMsg && (
              <p className="text-rose-400 text-xs mt-2 text-left pl-2">{errorMsg}</p>
            )}

            {/* Quick-Pick Samples for Evaluators */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 px-1 gap-2">
              <span className="text-slate-400 font-medium">Quick Sample Records:</span>
              <div className="flex flex-wrap gap-2">
                {MOCK_STUDENTS.slice(0, 4).map((s) => (
                  <button
                    key={s.roll_no}
                    type="button"
                    onClick={() => navigate(`/marksheet/${s.roll_no}`)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 font-mono text-[11px] text-indigo-200 transition"
                  >
                    {s.roll_no} ({s.student_name.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 User Gateways (The Real-World Personas) */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 sm:-mt-16 mb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Third-Party Verification (Employers & Background Check) */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wider mb-2">
                For Employers &amp; HR
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Instant QR Verification
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Verify printed paper marksheets using your camera or file upload. Validates inclusion proofs mathematically even with zero internet.
              </p>
            </div>
            <button
              onClick={() => navigate('/verify')}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-2"
            >
              <span>Launch Verification Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Executive Governance Chamber (Dean & Controller) */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <div className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded uppercase tracking-wider mb-2">
                Dean &amp; Controller of Exams
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Dual-Signature Governance
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Strict multi-sig chamber. Re-evaluation grade amendments require independent digital signatures from both Dean and Controller.
              </p>
            </div>
            <button
              onClick={() => navigate('/governance')}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-2"
            >
              <span>Enter Governance Chamber</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Forensic Security & Integrity Auditor (Judges & Security) */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="inline-block px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded uppercase tracking-wider mb-2">
                Vigilance &amp; Hackathon Judges
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Tamper Auditor &amp; Break-Test
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Continuous daemon that cross-references live database rows against the ledger root. Includes the evaluator SQL injection sandbox.
              </p>
            </div>
            <button
              onClick={() => navigate('/audit')}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-2"
            >
              <span>Open Security Audit Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Guarantees Section */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Why Traditional University Databases Fail (Problem H8)
            </h2>
            <p className="text-slate-600 text-xs mt-1">
              VeriMark solves insider bribery and SQL tampering through mathematical guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-1">Deterministic Merkle Tree</strong>
                Every student mark is canonically serialized and hashed into an immutable tree.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-1">Dual Cryptographic Approvals</strong>
                Single-admin edits are mathematically impossible; requires Ed25519 signatures from 2 independent roles.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-1">Real-Time Tamper Pinpointing</strong>
                Direct database updates bypass will trigger an instant alarm, isolating the exact row and modified score.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
