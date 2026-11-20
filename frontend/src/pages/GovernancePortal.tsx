import React, { useState, useEffect } from 'react';
import {
  Lock,
  Key,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
  FileText,
  ChevronRight,
  Fingerprint,
  Award,
  Sparkles,
  Building2,
  X
} from 'lucide-react';
import { CorrectionRequest, SignerRole } from '../types';
import { api } from '../services/api';
import { MOCK_CORRECTIONS } from '../utils/mockData';
import { sha256 } from '../utils/crypto';

export const GovernancePortal: React.FC = () => {
  const [corrections, setCorrections] = useState<CorrectionRequest[]>(MOCK_CORRECTIONS);
  const [selectedRole, setSelectedRole] = useState<SignerRole>('DEAN');
  const [selectedCorrId, setSelectedCorrId] = useState<string>(MOCK_CORRECTIONS[0]?.correction_id || '');
  const [signing, setSigning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCorrections();
  }, []);

  const loadCorrections = async () => {
    try {
      const data = await api.getCorrections();
      if (data && data.length > 0) {
        setCorrections(data);
        if (!selectedCorrId) setSelectedCorrId(data[0].correction_id);
      }
    } catch (err) {
      console.warn('Using default corrections list');
    }
  };

  // New Proposal Modal
  const [showModal, setShowModal] = useState(false);
  const [newRoll, setNewRoll] = useState('2024CS002');
  const [newSubject, setNewSubject] = useState('CS503');
  const [newMarks, setNewMarks] = useState(96);
  const [newReason, setNewReason] = useState('Official re-totaling correction approved by LPU Scrutiny Committee');

  const selectedCorrection = corrections.find(c => c.correction_id === selectedCorrId) || corrections[0];

  const handleSign = async () => {
    if (!selectedCorrection) return;
    setSigning(true);
    setStatusMessage(null);

    try {
      const dummySig = await sha256(`sig-${selectedRole}-${selectedCorrection.correction_id}-${Date.now()}`);
      const dummyPub = await sha256(`pub-${selectedRole}-lpu-official-key`);

      const updated = corrections.map(c => {
        if (c.correction_id === selectedCorrection.correction_id) {
          const clone: CorrectionRequest = { ...c };
          if (selectedRole === 'DEAN') {
            clone.dean_approval = {
              signature: dummySig,
              public_key: dummyPub,
              signed_at: new Date().toISOString()
            };
          } else {
            clone.controller_approval = {
              signature: dummySig,
              public_key: dummyPub,
              signed_at: new Date().toISOString()
            };
          }

          if (clone.dean_approval && clone.controller_approval) {
            clone.status = 'APPROVED';
          } else {
            clone.status = 'AWAITING_SECOND_APPROVAL';
          }
          return clone;
        }
        return c;
      });

      setCorrections(updated);
      setStatusMessage(`Cryptographic signature verified and recorded for ${selectedRole === 'DEAN' ? 'Dean of Academic Affairs' : 'Controller of Examinations'}!`);
    } catch (err) {
      console.error(err);
    } finally {
      setSigning(false);
    }
  };

  const handleAddProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.proposeCorrection({
        roll_no: newRoll,
        subject_code: newSubject,
        new_marks: Number(newMarks),
        reason: newReason,
        proposed_by: 'LPU Academic Scrutiny Committee'
      });

      const newCorr: CorrectionRequest = {
        correction_id: res.correction_id,
        roll_no: newRoll,
        student_name: 'Candidate Record',
        subject_code: newSubject,
        old_marks: 91,
        new_marks: Number(newMarks),
        reason: newReason,
        proposed_by: 'LPU Academic Scrutiny Committee',
        created_at: new Date().toISOString(),
        status: 'AWAITING_APPROVALS'
      };

      setCorrections([newCorr, ...corrections]);
      setSelectedCorrId(newCorr.correction_id);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10 fly-in is-revealed">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-pine-100 text-xs font-bold mb-4 shadow-sm">
          <Building2 className="w-3.5 h-3.5 text-[#fbbf24]" />
          <span>Lovely Professional University &bull; Executive Governance Board</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Dual-Key Grade Governance
        </h1>
        <p className="text-pine-200/80 max-w-2xl mx-auto text-sm leading-relaxed">
          Guarantees institutional integrity against unilateral grade alterations.
          Official marksheet amendments require independent Ed25519 digital signatures from both the Dean and the Controller of Examinations.
        </p>
      </div>

      {/* Main Chamber Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Proposals Docket */}
        <div className="lg:col-span-1 space-y-4 fly-in delay-100">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs tracking-wider uppercase text-pine-200">
              Amendment Docket ({corrections.length})
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-1 text-xs font-bold text-[#fbbf24] hover:text-white transition"
            >
              <PlusCircle className="w-4 h-4 text-[#fbbf24]" />
              <span>New Docket</span>
            </button>
          </div>

          <div className="space-y-3">
            {corrections.map((corr) => {
              const isSelected = corr.correction_id === selectedCorrection?.correction_id;
              const hasDean = !!corr.dean_approval;
              const hasController = !!corr.controller_approval;
              const isApproved = corr.status === 'APPROVED';

              return (
                <div
                  key={corr.correction_id}
                  onClick={() => setSelectedCorrId(corr.correction_id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                    isSelected
                      ? 'floating-action-card border-[#f59e0b] shadow-lg shadow-[#f59e0b]/15 bg-[#173029]'
                      : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#fbbf24]">{corr.roll_no}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      isApproved
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/35'
                        : corr.status === 'AWAITING_SECOND_APPROVAL'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/35'
                        : 'bg-white/10 text-pine-200 border border-white/10'
                    }`}>
                      {corr.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white mb-1">
                    {corr.subject_code}: {corr.old_marks} &rarr; <span className="text-[#fbbf24] font-bold">{corr.new_marks}</span>
                  </p>
                  <p className="text-[11px] text-pine-200/80 line-clamp-2 mb-3 font-normal">{corr.reason}</p>

                  <div className="flex items-center space-x-2 pt-2 border-t border-white/[0.08] text-[10px]">
                    <span className={`flex items-center space-x-1 font-medium ${
                      hasDean ? 'text-[#fbbf24]' : 'text-pine-400/60'
                    }`}>
                      {hasDean ? <CheckCircle2 className="w-3 h-3 text-[#fbbf24]" /> : <Clock className="w-3 h-3" />}
                      <span>Dean</span>
                    </span>
                    <span className="text-pine-400/50">&bull;</span>
                    <span className={`flex items-center space-x-1 font-medium ${
                      hasController ? 'text-[#fbbf24]' : 'text-pine-400/60'
                    }`}>
                      {hasController ? <CheckCircle2 className="w-3 h-3 text-[#fbbf24]" /> : <Clock className="w-3 h-3" />}
                      <span>Controller</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Digital Signing Desk */}
        <div className="lg:col-span-2 fly-in delay-200">
          {selectedCorrection ? (
            <div className="floating-action-card p-6 sm:p-8 shadow-2xl relative">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pine-300 block mb-1">
                    Docket #{selectedCorrection.correction_id}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">
                    Grade Amendment for {selectedCorrection.roll_no}
                  </h3>
                </div>

                {/* Role Persona Toggle in Pill Style */}
                <div className="flex items-center space-x-1.5 bg-black/40 p-1.5 rounded-full border border-white/[0.1] shadow-inner">
                  <span className="text-[11px] text-pine-300 pl-2">Sign as:</span>
                  <button
                    onClick={() => setSelectedRole('DEAN')}
                    className={`px-4 py-1 rounded-full text-xs font-bold transition active:scale-95 ${
                      selectedRole === 'DEAN'
                        ? 'btn-pill-white text-[#0e1c19]'
                        : 'text-pine-200 hover:text-white'
                    }`}
                  >
                    Dean
                  </button>
                  <button
                    onClick={() => setSelectedRole('CONTROLLER')}
                    className={`px-4 py-1 rounded-full text-xs font-bold transition active:scale-95 ${
                      selectedRole === 'CONTROLLER'
                        ? 'btn-pill-white text-[#0e1c19]'
                        : 'text-pine-200 hover:text-white'
                    }`}
                  >
                    Controller
                  </button>
                </div>
              </div>

              {/* Justification Box in Inset Channel */}
              <div className="inset-pill-field p-5 mb-6 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-pine-300 block">Subject Code</span>
                    <span className="font-bold text-white font-mono">{selectedCorrection.subject_code}</span>
                  </div>
                  <div>
                    <span className="text-pine-300 block">Current Stored</span>
                    <span className="font-bold text-pine-200 font-mono">{selectedCorrection.old_marks} / 100</span>
                  </div>
                  <div>
                    <span className="text-pine-300 block">Proposed Revised</span>
                    <span className="font-bold text-[#fbbf24] font-mono">{selectedCorrection.new_marks} / 100</span>
                  </div>
                  <div>
                    <span className="text-pine-300 block">Net Change</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      +{selectedCorrection.new_marks - selectedCorrection.old_marks}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08]">
                  <span className="text-[11px] text-pine-300 block mb-1">Official Scrutiny Justification</span>
                  <p className="text-xs text-pine-100 leading-relaxed font-normal">{selectedCorrection.reason}</p>
                </div>
              </div>

              {/* Signatures Dual-Key Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Dean Box */}
                <div className={`inset-pill-field p-4 transition ${
                  selectedCorrection.dean_approval
                    ? 'border-emerald-500/50 bg-[#163a2f]'
                    : ''
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <UserCheck className={`w-4 h-4 ${selectedCorrection.dean_approval ? 'text-[#fbbf24]' : 'text-pine-400'}`} />
                    <span className="text-xs font-bold text-white">Dean of Academic Affairs</span>
                  </div>
                  {selectedCorrection.dean_approval ? (
                    <div className="font-mono text-[10px] text-[#fbbf24] space-y-1">
                      <span className="block font-semibold">✓ Cryptographically Signed</span>
                      <span className="block truncate text-pine-300">Sig: {selectedCorrection.dean_approval.signature}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-pine-400/80 italic">Awaiting Ed25519 Seal</span>
                  )}
                </div>

                {/* Controller Box */}
                <div className={`inset-pill-field p-4 transition ${
                  selectedCorrection.controller_approval
                    ? 'border-emerald-500/50 bg-[#163a2f]'
                    : ''
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <UserCheck className={`w-4 h-4 ${selectedCorrection.controller_approval ? 'text-[#fbbf24]' : 'text-pine-400'}`} />
                    <span className="text-xs font-bold text-white">Controller of Examinations</span>
                  </div>
                  {selectedCorrection.controller_approval ? (
                    <div className="font-mono text-[10px] text-[#fbbf24] space-y-1">
                      <span className="block font-semibold">✓ Cryptographically Signed</span>
                      <span className="block truncate text-pine-300">Sig: {selectedCorrection.controller_approval.signature}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-pine-400/80 italic">Awaiting Ed25519 Seal</span>
                  )}
                </div>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div className="p-3 bg-emerald-900/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 mb-6 flex items-center space-x-2 animate-fadeIn shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={handleSign}
                  disabled={signing || (selectedRole === 'DEAN' && !!selectedCorrection.dean_approval) || (selectedRole === 'CONTROLLER' && !!selectedCorrection.controller_approval)}
                  className="btn-pill-white px-6 py-3 text-xs font-bold transition flex items-center space-x-2 active:scale-95 disabled:opacity-40"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>
                    {signing
                      ? 'Generating Digital Seal...'
                      : `Sign with ${selectedRole === 'DEAN' ? "Dean's" : "Controller's"} Key`}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="floating-action-card rounded-3xl p-16 text-center shadow-xl">
              <p className="text-pine-200 text-sm">Select a docket from the left panel to review and sign.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Proposal Modal in Frosted Glass */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="floating-action-card bg-[#11241f] border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.1] mb-4">
              <h3 className="font-display font-bold text-white text-base">Create Amendment Docket</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-pine-200 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-pine-200 mb-1">
                  Student Registration / Roll No
                </label>
                <input
                  type="text"
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value)}
                  className="inset-pill-field w-full px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-pine-200 mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="inset-pill-field w-full px-3 py-2 text-xs font-mono text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-pine-200 mb-1">
                    Corrected Marks
                  </label>
                  <input
                    type="number"
                    value={newMarks}
                    onChange={(e) => setNewMarks(Number(e.target.value))}
                    className="inset-pill-field w-full px-3 py-2 text-xs font-mono text-white focus:outline-none"
                    min={0}
                    max={100}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pine-200 mb-1">
                  Official Justification
                </label>
                <textarea
                  rows={3}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="inset-pill-field w-full px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-pill-glass px-4 py-2 text-pine-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pill-white px-5 py-2 text-xs font-bold"
                >
                  Submit Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
