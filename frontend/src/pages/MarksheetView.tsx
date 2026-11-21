import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Printer,
  ShieldCheck,
  CheckCircle,
  Award,
  Search,
  Lock,
  ArrowRight,
  Building2,
  Calendar,
  Hash,
  AlertCircle,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';
import { StudentResult, CompactQRPayload, MerkleProofResponse } from '../types';
import { api } from '../services/api';
import { getActiveCohort, resetToDefaultCohort } from '../utils/mockData';

export const MarksheetView: React.FC = () => {
  const { roll_no } = useParams<{ roll_no: string }>();
  const navigate = useNavigate();

  const cohort = getActiveCohort();
  const activeStudents = cohort.students;
  const defaultRoll = activeStudents[0]?.roll_no || '2024CS001';
  const currentRoll = roll_no ? roll_no.toUpperCase() : defaultRoll;

  const [student, setStudent] = useState<StudentResult | null>(null);
  const [proofData, setProofData] = useState<MerkleProofResponse | null>(null);
  const [searchRoll, setSearchRoll] = useState(currentRoll);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // If visiting /marksheet without param, normalize URL to first student
  useEffect(() => {
    if (!roll_no && defaultRoll) {
      navigate(`/marksheet/${defaultRoll}`, { replace: true });
    }
  }, [roll_no, defaultRoll]);

  useEffect(() => {
    setSearchRoll(currentRoll);
    loadStudent(currentRoll);
  }, [currentRoll]);

  const loadStudent = async (roll: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getStudentResult(roll);
      setStudent(data);
      const proof = await api.getMerkleProof(data.roll_no);
      setProofData(proof);
    } catch (err: any) {
      console.error(err);
      setStudent(null);
      setProofData(null);
      setErrorMsg(err?.message || `Student with roll number "${roll}" not found in current ledger.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchRoll.trim();
    if (!query) return;

    // 1. Exact match in active cohort
    const exact = activeStudents.find(s => s.roll_no.toLowerCase() === query.toLowerCase());
    if (exact) {
      navigate(`/marksheet/${exact.roll_no}`);
      return;
    }

    // 2. Suffix / number match in active cohort (e.g. user typed "23" matching roll "23" or "...023")
    const match = activeStudents.find(s => {
      const r = s.roll_no.toLowerCase();
      const q = query.toLowerCase();
      return r === q || r.endsWith(q) || r.includes(q);
    });
    if (match) {
      navigate(`/marksheet/${match.roll_no}`);
      return;
    }

    // 3. Direct navigation to show not-found card
    navigate(`/marksheet/${query.toUpperCase()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Build authentic QR payload strictly from this student's cryptographic proof
  const qrPayload: CompactQRPayload = {
    v: 1,
    roll: student?.roll_no || currentRoll,
    leaf: student?.leaf_hash || proofData?.leaf_hash || '',
    root: (student as any)?.root_hash || proofData?.root_hash || cohort.rootHash,
    proof: (proofData?.audit_path || []).map(step => ({
      p: step.position === 'left' ? 'L' : 'R',
      h: step.hash
    })),
    verify_url: `${window.location.origin}/verify?roll=${encodeURIComponent(student?.roll_no || currentRoll)}`
  };
  const qrString = JSON.stringify(qrPayload);

  // Dynamic quick-pick buttons from the active cohort (first 6 students)
  const quickRolls = activeStudents.slice(0, 6).map(s => s.roll_no);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-10 sm:py-16 space-y-8">
      {/* Active Custom Ledger Status Banner */}
      {cohort.isCustom && (
        <div className="no-print bg-amber-500/15 border border-amber-500/35 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200 shadow-lg fly-in is-revealed">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span>
              Active Custom Ledger: <strong>{cohort.totalStudents} Students</strong> ({cohort.students[0]?.roll_no} &rarr; {cohort.students[cohort.students.length - 1]?.roll_no})
            </span>
            <span className="hidden sm:inline opacity-70 font-mono text-[10px]">
              &bull; Root: {cohort.rootHash.substring(0, 10)}...
            </span>
          </div>
          <button
            onClick={() => {
              resetToDefaultCohort();
              window.location.href = '/marksheet';
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition font-semibold text-xs active:scale-95"
          >
            <RotateCcw className="w-3 h-3 text-[#fbbf24]" />
            <span>Reset to Default LPU Dataset</span>
          </button>
        </div>
      )}

      {/* Sleek Action & Selector Bar (Hidden during print) - Spacey & Relaxed */}
      <div className="no-print mb-8 floating-action-card p-5 sm:p-7 rounded-[30px] flex flex-wrap items-center justify-between gap-6 fly-in is-revealed shadow-2xl">
        {/* Search Box with Sunken Inset Input */}
        <form onSubmit={handleSearch} className="flex items-center space-x-3 flex-grow max-w-md">
          <div className="inset-pill-field relative flex-grow flex items-center px-4 py-2">
            <Search className="w-4 h-4 text-pine-300 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              placeholder={`Search Roll No (e.g., ${activeStudents[0]?.roll_no || '2024CS001'})`}
              className="bg-transparent text-white font-mono uppercase text-xs focus:outline-none w-full placeholder:text-pine-400/60 font-semibold"
            />
          </div>
          <button
            type="submit"
            className="btn-pill-white px-6 py-2.5 text-xs font-bold active:scale-95 shadow-md"
          >
            Search
          </button>
        </form>

        {/* Dynamic Quick-Pick Selector from Active Cohort */}
        <div className="flex items-center space-x-1.5 text-xs flex-wrap gap-y-1">
          <span className="text-pine-300 text-xs font-bold mr-1 hidden sm:inline">Rolls:</span>
          {quickRolls.map((roll) => (
            <button
              key={roll}
              onClick={() => {
                setSearchRoll(roll);
                navigate(`/marksheet/${roll}`);
              }}
              className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition active:scale-95 ${
                roll === currentRoll
                  ? 'btn-pill-white'
                  : 'bg-white/[0.06] hover:bg-white/[0.14] text-pine-200'
              }`}
            >
              {roll.length > 8 ? roll.substring(roll.length - 4) : roll}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/verify?roll=${currentRoll}`)}
            className="btn-pill-glass flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold"
          >
            <ShieldCheck className="w-4 h-4 text-[#fbbf24]" />
            <span>Verify Proof</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={!student}
            className="btn-pill-white flex items-center space-x-2 px-5 py-2.5 text-xs font-bold active:scale-95 disabled:opacity-40"
          >
            <Printer className="w-4 h-4" />
            <span>Print Marksheet</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="floating-action-card rounded-3xl p-16 text-center shadow-xl">
          <div className="animate-spin w-8 h-8 border-3 border-[#fbbf24] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-pine-200 text-sm font-medium">Retrieving official LPU transcript...</p>
        </div>
      ) : errorMsg || !student ? (
        <div className="floating-action-card rounded-3xl p-12 text-center shadow-xl border border-rose-500/30 fly-in is-revealed">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold text-white mb-2">Student Transcript Not Found</h3>
          <p className="text-pine-200 text-xs max-w-md mx-auto mb-6">
            {errorMsg || `Roll number "${currentRoll}" is not indexed in the active academic ledger.`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {activeStudents[0] && (
              <button
                onClick={() => navigate(`/marksheet/${activeStudents[0].roll_no}`)}
                className="btn-pill-white px-6 py-2.5 text-xs font-bold shadow-lg active:scale-95 flex items-center space-x-2"
              >
                <span>View First Record ({activeStudents[0].roll_no})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => navigate('/admin')}
              className="btn-pill-glass px-5 py-2.5 text-xs font-semibold flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>Upload CSV Batch</span>
            </button>
          </div>
        </div>
      ) : (
        /* Formal High-Prestige Academic Transcript Card */
        <div className="print-card bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-300 overflow-hidden relative fly-in is-revealed">
          {/* Top Amber & Pine Ribbon */}
          <div className="h-3.5 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#0e1c19]" />

          <div className="p-8 sm:p-12">
            {/* Header / University Crest */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-2xl bg-[#0e1c19] flex items-center justify-center text-white border-2 border-[#f59e0b] shadow-lg">
                  <div className="flex flex-col items-center">
                    <span className="font-display font-black text-xs text-[#fbbf24]">LPU</span>
                    <span className="text-[8px] font-bold text-slate-300">ESTD 2005</span>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                LOVELY PROFESSIONAL UNIVERSITY
              </h1>
              <p className="text-xs font-bold tracking-widest text-[#d97706] uppercase mt-1">
                Division of Academic Affairs &bull; Office of Examinations
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Jalandhar - Delhi G.T. Road, Phagwara, Punjab 144411 &bull; NAAC A++ Accredited
              </p>
              <div className="inline-block mt-3 px-4 py-1 bg-slate-100 border border-slate-300 rounded-full text-[11px] font-bold tracking-wider uppercase text-slate-800">
                Official Grade Transcript &bull; Academic Session {student.academic_year}
              </div>
            </div>

            {/* Student Meta & QR Code Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-slate-200">
              <div className="md:col-span-3 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Candidate Name</span>
                  <span className="font-bold text-slate-900 text-base">{student.student_name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Registration / Roll No</span>
                  <span className="font-bold font-mono text-[#d97706] text-base">{student.roll_no}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Degree &amp; Program</span>
                  <span className="font-semibold text-slate-800">{student.course}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Semester / Term</span>
                  <span className="font-semibold text-slate-800">Semester {student.semester}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Evaluation Status</span>
                  <span className="inline-flex items-center space-x-1 font-bold text-emerald-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{student.result_status}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Transcript Salt</span>
                  <span className="font-mono text-xs text-slate-600">{student.salt}</span>
                </div>
              </div>

              {/* Dynamic Cryptographic QR Code */}
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="bg-white p-2 rounded-xl border border-slate-300 shadow-sm">
                  <QRCodeSVG
                    value={qrString}
                    size={130}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[9px] font-bold tracking-wider text-slate-700 block uppercase">
                    Scan to Verify Proof
                  </span>
                  <span className="text-[8px] font-mono text-slate-500">TruGrade Digital Seal</span>
                </div>
              </div>
            </div>

            {/* Course Grade Table (Mobile Scrollable) */}
            <div className="mb-8 overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full min-w-[560px] text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0e1c19] text-white uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Subject Code</th>
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4 text-center">Max Marks</th>
                    <th className="py-3 px-4 text-center">Marks Awarded</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {student.subjects.map((sub, idx) => (
                    <tr key={sub.subject_code} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{sub.subject_code}</td>
                      <td className="py-3 px-4 text-slate-800">{sub.subject_name}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{sub.max_marks}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">{sub.marks_obtained}</td>
                      <td className="py-3 px-4 text-center font-bold text-[#d97706]">{sub.grade}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          PASSED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Performance Summary Banner */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-300 mb-8 flex flex-wrap items-center justify-between gap-4 text-sm">
              <div>
                <span className="text-xs uppercase text-slate-500 font-bold block">Cumulative Total</span>
                <span className="font-extrabold text-slate-900 text-lg">
                  {student.total_marks} / {student.max_total}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase text-slate-500 font-bold block">Semester SGPA</span>
                <span className="font-extrabold text-[#d97706] text-lg">{student.gpa.toFixed(2)} / 10.0</span>
              </div>
              <div>
                <span className="text-xs uppercase text-slate-500 font-bold block">Percentage</span>
                <span className="font-extrabold text-slate-900 text-lg">
                  {((student.total_marks / student.max_total) * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-xs uppercase text-slate-500 font-bold block">Overall Decision</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white tracking-wider">
                  FIRST CLASS WITH DISTINCTION
                </span>
              </div>
            </div>

            {/* Cryptographic Ledger Record */}
            <div className="p-4 bg-[#0e1c19] text-white rounded-2xl font-mono text-[11px] space-y-2 border border-white/10 shadow-inner">
              <div className="flex items-center space-x-2 text-[#fbbf24] font-semibold mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[10px]">TruGrade Cryptographic Record</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1 border-t border-white/[0.08] pt-2">
                <span>Canonical Leaf Hash:</span>
                <span className="text-[#fbbf24] break-all select-all font-semibold">{student.leaf_hash}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1">
                <span>Active University Ledger Root:</span>
                <span className="text-emerald-400 break-all select-all font-semibold">
                  {(student as any)?.root_hash || qrPayload.root}
                </span>
              </div>
            </div>

            {/* Institutional Signatures */}
            <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs text-slate-600">
              <div>
                <div className="h-10 flex items-end justify-center font-serif italic text-slate-800 font-bold">
                  Dr. R. K. Sharma
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold uppercase text-[10px]">
                  Dean of Academic Affairs &bull; LPU
                </div>
              </div>
              <div>
                <div className="h-10 flex items-end justify-center font-serif italic text-slate-800 font-bold">
                  Prof. M. S. Gill
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold uppercase text-[10px]">
                  Controller of Examinations &bull; LPU
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="h-10 flex items-end justify-center font-mono text-[10px] text-[#d97706] font-bold">
                  SEALED IN TRUGRADE LEDGER
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold uppercase text-[10px]">
                  Official Academic Seal
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
