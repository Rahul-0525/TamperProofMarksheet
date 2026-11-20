import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileSpreadsheet,
  QrCode,
  AlertTriangle,
  Lock,
  ArrowRight,
  Database,
  Key,
  Cpu,
  CheckCircle2,
  Users
} from 'lucide-react';

export const Home: React.FC = () => {
  const steps = [
    {
      step: '1',
      title: 'Admin CSV Publishing',
      role: 'Registrar / Exam Office',
      desc: 'Upload semester marks in CSV format. The system computes canonical SHA-256 leaves and builds an immutable binary Merkle tree.',
      path: '/admin',
      button: 'Upload & Publish Batch',
      icon: FileSpreadsheet,
      color: 'indigo'
    },
    {
      step: '2',
      title: 'Student Marksheet & QR',
      role: 'Students & Employers',
      desc: 'View formal transcript with dynamic QR code encoding the compact Merkle proof. Print-friendly single-page PDF formatting.',
      path: '/marksheet/2024CS001',
      button: 'View Sample Marksheet',
      icon: ShieldCheck,
      color: 'blue'
    },
    {
      step: '3',
      title: 'Public QR Verification',
      role: 'Verification Agencies & Recruiters',
      desc: 'Scan the printed marksheet via webcam or file upload. Verifies authenticity mathematically in 12ms even in offline airplane mode.',
      path: '/verify',
      button: 'Open QR Verifier',
      icon: QrCode,
      color: 'emerald'
    },
    {
      step: '4',
      title: 'Direct DB Tamper Audit',
      role: 'Hackathon Judges & Security Auditors',
      desc: 'Simulate a rogue DBA executing raw SQL to alter marks. The daemon compares raw rows with ledger root and pinpoints the exact modified student.',
      path: '/audit',
      button: 'Run Tamper Break-Test',
      icon: AlertTriangle,
      color: 'rose'
    },
    {
      step: '5',
      title: 'Dual-Key Governance',
      role: 'Dean of Academics & Controller of Examinations',
      desc: 'Separation of powers: Legitimate grade amendments require independent Ed25519 digital signatures from two distinct university leaders.',
      path: '/governance',
      button: 'Dual-Approval Portal',
      icon: Lock,
      color: 'purple'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold mb-4">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Code Fuzion 2026 &bull; Problem H8 (Tamper-Proof Exam Result Ledger)</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Cryptographically Verifiable Academic Transcripts
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Marks cannot be tampered with after publication. VeriMark eliminates insider corruption through 
          <strong> binary Merkle trees</strong>, <strong>dual-key Ed25519 signatures</strong>, and <strong>continuous raw SQL database auditing</strong>.
        </p>

        {/* Quick Launch Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/admin"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition flex items-center space-x-2"
          >
            <span>Start Evaluator Walkthrough</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/audit"
            className="px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 rounded-xl transition flex items-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Judge Attack Simulator</span>
          </Link>
        </div>
      </div>

      {/* 5-Step Hackathon Flow */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">The 5-Step Interactive Demonstration Flow</h2>
          <p className="text-xs text-slate-500 mt-1">Click any step below to test that specific module</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center font-mono">
                      {s.step}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {s.role}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {s.desc}
                  </p>
                </div>

                <Link
                  to={s.path}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition border border-slate-200 hover:border-transparent"
                >
                  <Icon className="w-4 h-4" />
                  <span>{s.button}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Concept Explainer for Judges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Key className="w-4 h-4" />
            <span>Separation of Powers</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Why Two Roles (Dean & Controller)?</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            In standard universities, a corrupt database administrator or a single compromised clerk can quietly change a mark. In VeriMark:
          </p>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-indigo-400 font-bold">&bull;</span>
              <span><strong>The Dean of Academics</strong> verifies academic justification (e.g. approved re-evaluation appeal).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-400 font-bold">&bull;</span>
              <span><strong>The Controller of Examinations (COE)</strong> controls the official seal and independent cryptographic key.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-400 font-bold">&bull;</span>
              <span>The database <strong>strictly rejects</strong> any grade amendment unless both mathematical signatures are attached.</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Database className="w-4 h-4" />
            <span>Real-Time Tamper Daemon</span>
          </div>
          <h3 className="text-xl font-bold mb-3">How Direct Database Hacks Get Caught</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            If an attacker bypasses the application and runs <code className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-300">UPDATE subject_marks SET marks_obtained = 99</code> directly in SQL:
          </p>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">&bull;</span>
              <span>The raw database rows now produce a completely different SHA-256 leaf hash.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">&bull;</span>
              <span>Reconstructing the Merkle tree yields a root hash that <strong>mismatches the immutable ledger root</strong>.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">&bull;</span>
              <span>The audit daemon flags the tampering and <strong>pinpoints the exact student roll number and tampered subject</strong>.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
