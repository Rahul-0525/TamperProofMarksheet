import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Printer,
  ShieldCheck,
  CheckCircle,
  Award,
  Search,
  ExternalLink,
  Lock,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  Hash
} from 'lucide-react';
import { StudentResult, CompactQRPayload } from '../types';
import { api } from '../services/api';
import { getCompactQRPayload, MOCK_STUDENTS } from '../utils/mockData';

export const MarksheetView: React.FC = () => {
  const { roll_no } = useParams<{ roll_no: string }>();
  const navigate = useNavigate();
  const currentRoll = roll_no || '2024CS001';

  const [student, setStudent] = useState<StudentResult | null>(null);
  const [searchRoll, setSearchRoll] = useState(currentRoll);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent(currentRoll);
  }, [currentRoll]);

  const loadStudent = async (roll: string) => {
    setLoading(true);
    try {
      const data = await api.getStudentResult(roll);
      setStudent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRoll.trim()) {
      navigate(`/marksheet/${searchRoll.trim()}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const baseQr = getCompactQRPayload(student?.roll_no || currentRoll);
  const qrPayload: CompactQRPayload = {
    ...baseQr,
    root: (student as any)?.root_hash || baseQr.root,
    leaf: student?.leaf_hash || baseQr.leaf
  };
  const qrString = JSON.stringify(qrPayload);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Sleek Action & Selector Bar (Hidden during print) */}
      <div className="no-print mb-8 glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-grow max-w-md">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              placeholder="Search Roll No (e.g., 2024CS001)"
              className="w-full pl-10 pr-3 py-2 bg-white/[0.04] text-white border border-white/[0.08] rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
          >
            Load
          </button>
        </form>

        {/* Quick-Pick Selector */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-400 text-[11px] mr-1">Switch:</span>
          {MOCK_STUDENTS.map((s) => (
            <button
              key={s.roll_no}
              onClick={() => {
                setSearchRoll(s.roll_no);
                navigate(`/marksheet/${s.roll_no}`);
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${
                s.roll_no === currentRoll
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-white/[0.03] text-slate-300 hover:text-white border border-white/[0.06] hover:bg-white/[0.08]'
              }`}
            >
              {s.roll_no}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/verify?roll=${currentRoll}`)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 rounded-xl text-xs font-semibold transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verify Proof</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Transcript</span>
          </button>
        </div>
      </div>

      {loading || !student ? (
        <div className="glass-panel rounded-3xl p-16 text-center border border-white/10">
          <div className="animate-spin w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium">Retrieving official ledger transcript...</p>
        </div>
      ) : (
        /* Formal High-Prestige Academic Transcript Card */
        <div className="print-card bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
          {/* Top Gold & Indigo Crest Ribbon */}
          <div className="h-3 bg-gradient-to-r from-indigo-800 via-blue-700 to-amber-600" />

          <div className="p-8 sm:p-12">
            {/* Header / Crest */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white border-2 border-amber-400 shadow-md">
                  <Award className="w-8 h-8 text-amber-300" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-900 font-serif">
                National Institute of Technology
              </h1>
              <p className="text-xs font-bold tracking-widest text-slate-600 uppercase mt-1">
                Office of Examinations &bull; Cryptographic Ledger Division
              </p>
              <div className="inline-block mt-3 px-4 py-1 bg-slate-100 border border-slate-300 rounded-full text-[11px] font-bold tracking-wider uppercase text-slate-700">
                Official Grade Report &bull; Academic Session {student.academic_year}
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
                  <span className="font-bold font-mono text-indigo-700 text-base">{student.roll_no}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Degree &amp; Program</span>
                  <span className="font-semibold text-slate-800">{student.course}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Semester / Level</span>
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
                  <span className="text-[9px] font-bold tracking-wider text-slate-600 block uppercase">
                    Scan to Verify Proof
                  </span>
                  <span className="text-[8px] font-mono text-slate-400">Offline WebCrypto Capable</span>
                </div>
              </div>
            </div>

            {/* Course Grade Table */}
            <div className="mb-8 overflow-hidden rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-semibold">
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
                      <td className="py-3 px-4 text-center font-bold text-indigo-700">{sub.grade}</td>
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
                <span className="text-xs uppercase text-slate-500 font-bold block">Semester GPA</span>
                <span className="font-extrabold text-indigo-700 text-lg">{student.gpa.toFixed(2)} / 10.0</span>
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

            {/* Cryptographic Ledger Record (The Mathematical Guarantee) */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-[11px] space-y-2 border border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-300 font-semibold mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[10px]">Cryptographic Inclusion Proof Metadata</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 gap-1 border-t border-slate-800 pt-2">
                <span>Canonical Leaf Hash:</span>
                <span className="text-indigo-300 break-all select-all">{student.leaf_hash}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 gap-1">
                <span>Active Ledger Merkle Root:</span>
                <span className="text-emerald-400 break-all select-all">
                  {(student as any)?.root_hash || baseQr.root}
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
                  Dean of Academic Affairs
                </div>
              </div>
              <div>
                <div className="h-10 flex items-end justify-center font-serif italic text-slate-800 font-bold">
                  Prof. M. S. Gill
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold uppercase text-[10px]">
                  Controller of Examinations
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="h-10 flex items-end justify-center font-mono text-[10px] text-emerald-700 font-bold">
                  SEALED IN MERKLE LEDGER
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold uppercase text-[10px]">
                  Immutable Record
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
