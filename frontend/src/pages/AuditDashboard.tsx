import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Terminal,
  AlertOctagon,
  Activity,
  Building2
} from 'lucide-react';
import { IntegrityCheckResponse } from '../types';
import { api } from '../services/api';
import { PUBLISHED_ROOT_HASH } from '../utils/mockData';

export const AuditDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tamperSimulated, setTamperSimulated] = useState(false);
  const [auditReport, setAuditReport] = useState<IntegrityCheckResponse>({
    status: 'SECURE',
    checked_at: new Date().toISOString(),
    total_records: 55,
    active_ledger_root: PUBLISHED_ROOT_HASH,
    recomputed_db_root: PUBLISHED_ROOT_HASH,
    tampered_records: []
  });

  const runAudit = async (simulate = tamperSimulated) => {
    setLoading(true);
    try {
      const result = await api.checkIntegrity(simulate);
      setAuditReport(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTamperSimulation = async () => {
    const nextState = !tamperSimulated;
    setTamperSimulated(nextState);
    if (nextState) {
      await api.simulateTamper({
        roll_no: '2024CS003',
        subject_code: 'CS501',
        tampered_marks: 99.0
      });
    }
    runAudit(nextState);
  };

  const isSecure = auditReport.status === 'SECURE';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10 fly-in is-revealed">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-pine-100 text-xs font-bold mb-4 shadow-sm">
          <Activity className="w-3.5 h-3.5 text-[#fbbf24] animate-pulse" />
          <span>TruGrade Continuous Audit Daemon &bull; Lovely Professional University</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Database Tamper Audit Console
        </h1>
        <p className="text-pine-200/80 max-w-2xl mx-auto text-sm leading-relaxed">
          Continuously cross-references relational SQL database records against the immutable Merkle ledger root.
          Isolates unauthorized direct database manipulations within milliseconds.
        </p>
      </div>

      {/* Control & Trigger Dock in Luxury Frosted Glass */}
      <div className="floating-action-card p-5 rounded-3xl mb-8 flex flex-wrap items-center justify-between gap-4 shadow-2xl fly-in delay-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => runAudit(tamperSimulated)}
            disabled={loading}
            className="btn-pill-white flex items-center space-x-2 px-5 py-2.5 text-xs font-bold transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Auditing Database...' : 'Run Integrity Audit'}</span>
          </button>

          <span className="text-xs text-pine-300 font-mono">
            Last Checked: {new Date(auditReport.checked_at).toLocaleTimeString()}
          </span>
        </div>

        {/* Live Attack Simulator Toggle (The Evaluator Sandbox) */}
        <div className="flex items-center space-x-3 bg-black/40 p-1.5 rounded-full border border-white/[0.1] shadow-inner">
          <span className="text-xs font-semibold text-pine-300 pl-3">Evaluator Attack Sandbox:</span>
          <button
            onClick={toggleTamperSimulation}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1.5 active:scale-95 ${
              tamperSimulated
                ? 'bg-rose-600 text-white shadow-lg border border-rose-400'
                : 'btn-pill-glass text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{tamperSimulated ? 'Simulating SQL UPDATE (Tampered)' : 'Inject SQL UPDATE (99 Marks)'}</span>
          </button>
        </div>
      </div>

      {/* Hero Status Banner in Luxury Frosted Glass */}
      <div
        className={`floating-action-card p-8 rounded-3xl mb-8 transition-all duration-300 relative overflow-hidden shadow-2xl fly-in delay-200 ${
          isSecure
            ? 'border-emerald-500/50'
            : 'border-rose-500/60'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
          <div className={`p-4 rounded-2xl flex-shrink-0 ${
            isSecure ? 'bg-[#f59e0b]/20 text-[#fbbf24]' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {isSecure ? (
              <ShieldCheck className="w-16 h-16" />
            ) : (
              <ShieldAlert className="w-16 h-16 animate-pulse" />
            )}
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isSecure ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {isSecure ? 'SYSTEM STATUS: 100% INTACT' : 'CRITICAL ALERT: SQL TAMPERING DETECTED'}
              </span>
              <span className="text-pine-300 text-xs font-mono">&bull; Scanned {auditReport.total_records} Records</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-2">
              {isSecure
                ? 'Cryptographic Ledger Matches Database Records'
                : 'Unauthorized Direct Database Manipulation Detected!'}
            </h2>

            <p className="text-pine-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
              {isSecure
                ? 'Every student record in the SQL database recomputes to the exact published Merkle root. No direct database alterations or illicit mark inflations have occurred.'
                : 'Raw database rows were mutated outside the authorized dual-key governance protocol. The recomputed Merkle root deviates from the immutable published root.'}
            </p>
          </div>
        </div>

        {/* Root Hashes Diff Grid in Sunken Inset */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="inset-pill-field p-4">
            <span className="text-[10px] uppercase font-bold text-pine-300 block mb-1">
              Immutable Active Ledger Root
            </span>
            <span className="text-[#fbbf24] break-all select-all font-semibold">
              {auditReport.active_ledger_root}
            </span>
          </div>
          <div className={`inset-pill-field p-4 ${
            isSecure ? 'text-[#fbbf24]' : 'text-rose-300'
          }`}>
            <span className="text-[10px] uppercase font-bold text-pine-300 block mb-1">
              Recomputed Database Root {isSecure ? '(Match)' : '(MISMATCH DETECTED)'}
            </span>
            <span className="break-all select-all font-semibold">
              {auditReport.recomputed_db_root}
            </span>
          </div>
        </div>
      </div>

      {/* Discrepancy Breakdown Table (Shown when tampered) */}
      {!isSecure && auditReport.tampered_records.length > 0 && (
        <div className="floating-action-card rounded-3xl p-6 sm:p-8 border border-rose-500/50 mb-8 shadow-2xl fly-in is-revealed">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Pinpointed Database Discrepancies ({auditReport.tampered_records.length})
              </h3>
              <p className="text-xs text-pine-200">
                The audit daemon has isolated the exact records where stored marks disagree with the cryptographic proof.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {auditReport.tampered_records.map((item, idx) => (
              <div
                key={idx}
                className="inset-pill-field border-rose-500/40 p-5 text-xs text-slate-200 font-mono"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-rose-500/30">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-rose-300 text-sm">Target: {item.roll_no}</span>
                    <span className="text-pine-300">({item.student_name})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 text-[10px] font-bold uppercase">
                    Direct SQL Bypass
                  </span>
                </div>
                <p className="text-pine-100 leading-relaxed font-sans text-xs">
                  {item.issue}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
