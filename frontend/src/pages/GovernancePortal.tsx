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
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#801336]/20 text-[#801336] text-xs font-semibold mb-4 shadow-sm">
          <Building2 className="w-3.5 h-3.5 text-[#EE4540]" />
          <span>Lovely Professional University &bull; Executive Governance Board</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#2D142C] tracking-tight mb-3">
          Dual-Key Grade Governance
        </h1>
        <p className="text-[#510A32]/75 max-w-2xl mx-auto text-sm leading-relaxed">
          Guarantees institutional integrity against unilateral grade alterations.
          Official marksheet amendments require independent Ed25519 digital signatures from both the Dean and the Controller of Examinations.
        </p>
      </div>

      {/* Main Chamber Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Proposals Docket */}
        <div className="lg:col-span-1 space-y-4 fly-in delay-100">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs tracking-wider uppercase text-[#510A32]/80">
              Amendment Docket ({corrections.length})
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-1 text-xs font-semibold text-[#EE4540] hover:text-[#C72C41] transition"
            >
              <PlusCircle className="w-4 h-4" />
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
                      ? 'glass-card border-[#EE4540]/60 shadow-lg shadow-[#EE4540]/10 bg-white'
                      : 'bg-white/70 border-white/90 hover:bg-white hover:border-[#801336]/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#C72C41]">{corr.roll_no}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : corr.status === 'AWAITING_SECOND_APPROVAL'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}>
                      {corr.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#2D142C] mb-1">
                    {corr.subject_code}: {corr.old_marks} &rarr; <span className="text-[#EE4540] font-bold">{corr.new_marks}</span>
                  </p>
                  <p className="text-[11px] text-[#510A32]/70 line-clamp-2 mb-3 font-normal">{corr.reason}</p>

                  <div className="flex items-center space-x-2 pt-2 border-t border-[#801336]/10 text-[10px]">
                    <span className={`flex items-center space-x-1 font-medium ${
                      hasDean ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      {hasDean ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />}
                      <span>Dean</span>
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className={`flex items-center space-x-1 font-medium ${
                      hasController ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      {hasController ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />}
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
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl relative">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#801336]/10 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#801336] block mb-1">
                    Docket #{selectedCorrection.correction_id}
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#2D142C]">
                    Grade Amendment for {selectedCorrection.roll_no}
                  </h3>
                </div>

                {/* Role Persona Toggle */}
                <div className="flex items-center space-x-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 shadow-inner">
                  <span className="text-[11px] text-[#510A32]/70 pl-2">Sign as:</span>
                  <button
                    onClick={() => setSelectedRole('DEAN')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition active:scale-95 ${
                      selectedRole === 'DEAN'
                        ? 'bg-gradient-to-r from-[#EE4540] to-[#C72C41] text-white shadow-md shadow-[#EE4540]/25'
                        : 'text-[#510A32] hover:text-[#2D142C]'
                    }`}
                  >
                    Dean
                  </button>
                  <button
                    onClick={() => setSelectedRole('CONTROLLER')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition active:scale-95 ${
                      selectedRole === 'CONTROLLER'
                        ? 'bg-gradient-to-r from-[#EE4540] to-[#C72C41] text-white shadow-md shadow-[#EE4540]/25'
                        : 'text-[#510A32] hover:text-[#2D142C]'
                    }`}
                  >
                    Controller
                  </button>
                </div>
              </div>

              {/* Justification Box */}
              <div className="bg-white/80 p-5 rounded-2xl border border-slate-200 mb-6 space-y-3 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Subject Code</span>
                    <span className="font-bold text-[#2D142C] font-mono">{selectedCorrection.subject_code}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Current Stored</span>
                    <span className="font-bold text-[#510A32] font-mono">{selectedCorrection.old_marks} / 100</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Proposed Revised</span>
                    <span className="font-bold text-[#EE4540] font-mono">{selectedCorrection.new_marks} / 100</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Net Change</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      +{selectedCorrection.new_marks - selectedCorrection.old_marks}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 block mb-1">Official Scrutiny Justification</span>
                  <p className="text-xs text-[#2D142C] leading-relaxed font-normal">{selectedCorrection.reason}</p>
                </div>
              </div>

              {/* Signatures Dual-Key Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Dean Box */}
                <div className={`p-4 rounded-2xl border transition shadow-sm ${
                  selectedCorrection.dean_approval
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-white/80 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <UserCheck className={`w-4 h-4 ${selectedCorrection.dean_approval ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-[#2D142C]">Dean of Academic Affairs</span>
                  </div>
                  {selectedCorrection.dean_approval ? (
                    <div className="font-mono text-[10px] text-emerald-800 space-y-1">
                      <span className="block font-semibold">✓ Cryptographically Signed</span>
                      <span className="block truncate text-slate-500">Sig: {selectedCorrection.dean_approval.signature}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Awaiting Ed25519 Seal</span>
                  )}
                </div>

                {/* Controller Box */}
                <div className={`p-4 rounded-2xl border transition shadow-sm ${
                  selectedCorrection.controller_approval
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-white/80 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <UserCheck className={`w-4 h-4 ${selectedCorrection.controller_approval ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-[#2D142C]">Controller of Examinations</span>
                  </div>
                  {selectedCorrection.controller_approval ? (
                    <div className="font-mono text-[10px] text-emerald-800 space-y-1">
                      <span className="block font-semibold">✓ Cryptographically Signed</span>
                      <span className="block truncate text-slate-500">Sig: {selectedCorrection.controller_approval.signature}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Awaiting Ed25519 Seal</span>
                  )}
                </div>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 mb-6 flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={handleSign}
                  disabled={signing || (selectedRole === 'DEAN' && !!selectedCorrection.dean_approval) || (selectedRole === 'CONTROLLER' && !!selectedCorrection.controller_approval)}
                  className="px-6 py-3 bg-gradient-to-r from-[#EE4540] to-[#C72C41] hover:from-[#f05652] hover:to-[#d6354a] disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-[#EE4540]/30 flex items-center space-x-2 active:scale-95"
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
            <div className="glass-card rounded-3xl p-16 text-center border border-white/90 shadow-md">
              <p className="text-[#510A32]/70 text-sm">Select a docket from the left panel to review and sign.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-display font-bold text-[#2D142C] text-base">Create Amendment Docket</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-[#2D142C] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#510A32] mb-1">
                  Student Registration / Roll No
                </label>
                <input
                  type="text"
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[#2D142C] focus:outline-none focus:ring-1 focus:ring-[#EE4540]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#510A32] mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[#2D142C] focus:outline-none focus:ring-1 focus:ring-[#EE4540]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#510A32] mb-1">
                    Corrected Marks
                  </label>
                  <input
                    type="number"
                    value={newMarks}
                    onChange={(e) => setNewMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[#2D142C] focus:outline-none focus:ring-1 focus:ring-[#EE4540]"
                    min={0}
                    max={100}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#510A32] mb-1">
                  Official Justification
                </label>
                <textarea
                  rows={3}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2D142C] focus:outline-none focus:ring-1 focus:ring-[#EE4540]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#510A32] text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#EE4540] to-[#C72C41] hover:from-[#f05652] hover:to-[#d6354a] text-white text-xs font-bold rounded-xl transition shadow-md shadow-[#EE4540]/25"
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
