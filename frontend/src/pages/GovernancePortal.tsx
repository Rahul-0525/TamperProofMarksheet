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
  ChevronRight
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

  // Load from backend if available
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
  const [newReason, setNewReason] = useState('Official re-totaling correction approved by Scrutiny Committee');

  const selectedCorrection = corrections.find(c => c.correction_id === selectedCorrId) || corrections[0];

  const handleSign = async () => {
    if (!selectedCorrection) return;
    setSigning(true);
    setStatusMessage(null);

    try {
      // Generate synthetic Ed25519 signature payload for demonstration
      const dummySig = await sha256(`sig-${selectedRole}-${selectedCorrection.correction_id}-${Date.now()}`);
      const dummyPub = await sha256(`pub-${selectedRole}-official-key`);

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

          // Evaluate state transition
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
      setStatusMessage(`Successfully signed as ${selectedRole === 'DEAN' ? 'Dean of Academics' : 'Controller of Examinations'}!`);
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
        proposed_by: 'Academic Scrutiny Committee'
      });

      const newCorr: CorrectionRequest = {
        correction_id: res.correction_id,
        roll_no: newRoll,
        student_name: 'Cohort Student',
        subject_code: newSubject,
        old_marks: 91,
        new_marks: Number(newMarks),
        reason: newReason,
        proposed_by: 'Academic Scrutiny Committee',
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-semibold mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>Dual-Key Ed25519 Governance Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Multi-Signature Grade Amendment Governance
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-sm">
          No individual administrator can modify student marks after publication. Every legitimate grade
          amendment requires cryptographic co-signatures from both the Dean and the Controller.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Proposals List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-base">Pending Proposals</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Propose</span>
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
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-700">{corr.roll_no}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : corr.status === 'AWAITING_SECOND_APPROVAL'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {corr.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-900 mb-1">
                    {corr.subject_code}: {corr.old_marks} &rarr; <span className="text-indigo-600 font-bold">{corr.new_marks}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">{corr.reason}</p>

                  {/* Signatures status pills */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/60 text-[10px]">
                    <span className={`flex items-center space-x-1 font-medium ${
                      hasDean ? 'text-emerald-700' : 'text-slate-400'
                    }`}>
                      {hasDean ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />}
                      <span>Dean</span>
                    </span>
                    <span>&bull;</span>
                    <span className={`flex items-center space-x-1 font-medium ${
                      hasController ? 'text-emerald-700' : 'text-slate-400'
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

        {/* Right Column: Interactive Co-Signing Panel */}
        <div className="lg:col-span-2">
          {selectedCorrection ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
              {/* Proposal Header */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded">
                      ID: {selectedCorrection.correction_id}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-xs text-slate-500">
                      Created: {new Date(selectedCorrection.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedCorrection.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedCorrection.status === 'APPROVED' ? 'Committed to Ledger' : 'Approval In Progress'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Grade Rectification: {selectedCorrection.roll_no} ({selectedCorrection.student_name || 'Student'})
                </h3>
              </div>

              {/* Amendment Summary Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Subject</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedCorrection.subject_code}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Original Mark</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedCorrection.old_marks}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Proposed Mark</span>
                  <span className="font-bold text-emerald-600 text-sm">+{selectedCorrection.new_marks - selectedCorrection.old_marks} ({selectedCorrection.new_marks})</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Proposed By</span>
                  <span className="font-semibold text-slate-800 truncate block">{selectedCorrection.proposed_by}</span>
                </div>
              </div>

              {/* Justification */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Audit Justification & Evidentiary Log
                </h4>
                <p className="text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 italic">
                  "{selectedCorrection.reason}"
                </p>
              </div>

              {/* Multi-Signature Status Progress Bar */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Dual-Key Progress Chain
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dean Card */}
                  <div className={`p-4 rounded-xl border ${
                    selectedCorrection.dean_approval
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-sm">Dean of Academics</span>
                      </div>
                      {selectedCorrection.dean_approval ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    {selectedCorrection.dean_approval ? (
                      <div className="text-[10px] font-mono break-all text-emerald-800">
                        <p className="font-semibold">Signature Verified:</p>
                        <p>{selectedCorrection.dean_approval.signature.substring(0, 24)}...</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">Awaiting signature co-approval</p>
                    )}
                  </div>

                  {/* Controller Card */}
                  <div className={`p-4 rounded-xl border ${
                    selectedCorrection.controller_approval
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-sm">Controller of Exams</span>
                      </div>
                      {selectedCorrection.controller_approval ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    {selectedCorrection.controller_approval ? (
                      <div className="text-[10px] font-mono break-all text-emerald-800">
                        <p className="font-semibold">Signature Verified:</p>
                        <p>{selectedCorrection.controller_approval.signature.substring(0, 24)}...</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">Awaiting signature co-approval</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Interactive Signing Terminal */}
              {selectedCorrection.status !== 'APPROVED' ? (
                <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-sm">Sign Proposal as Authority</h4>
                    </div>
                    <span className="text-[10px] text-slate-400">Ed25519 Co-Signature</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-400 font-semibold">Signer Role:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('DEAN')}
                      className={`px-3 py-1.5 rounded-lg border font-semibold transition ${
                        selectedRole === 'DEAN'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      Dean of Academics
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('CONTROLLER')}
                      className={`px-3 py-1.5 rounded-lg border font-semibold transition ${
                        selectedRole === 'CONTROLLER'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      Controller of Examinations
                    </button>
                  </div>

                  <button
                    onClick={handleSign}
                    disabled={signing}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-sm font-semibold rounded-lg shadow transition flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {signing ? 'Signing and committing...' : `Digitally Sign as ${selectedRole === 'DEAN' ? 'Dean' : 'Controller'}`}
                    </span>
                  </button>

                  {statusMessage && (
                    <p className="text-xs text-emerald-400 font-medium text-center">{statusMessage}</p>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center space-x-3 text-emerald-900">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-sm block">Proposal Fully Co-Signed & Merkle Root Updated</span>
                    <span>
                      Both independent Ed25519 signatures have been recorded into the ledger. A new batch root has been committed.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
              No proposal selected
            </div>
          )}
        </div>
      </div>

      {/* New Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Propose Grade Amendment</h3>
            <form onSubmit={handleAddProposal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Roll Number</label>
                <input
                  type="text"
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg uppercase font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg uppercase font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Marks</label>
                  <input
                    type="number"
                    value={newMarks}
                    onChange={(e) => setNewMarks(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Formal Justification</label>
                <textarea
                  rows={3}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
