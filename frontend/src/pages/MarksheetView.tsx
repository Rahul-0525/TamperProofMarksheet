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
} from 'lucide-react';
import { StudentResult, CompactQRPayload } from '../types';
import { api } from '../services/api';
import { getCompactQRPayload, MOCK_STUDENTS } from '../utils/mockData';

export const MarksheetView: React.FC = () => {
  const { roll_no } = useParams<{ roll_no: string }>();
  const navigate = useNavigate();
  const currentRoll = roll_no ? roll_no.toUpperCase() : '2024CS001';

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
      navigate(`/marksheet/${searchRoll.trim().toUpperCase()}`);
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
      <div className="no-print mb-8 glass-card p-4 rounded-2xl border border-white/90 shadow-md flex flex-wrap items-center justify-between gap-4 fly-in is-revealed">
        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-grow max-w-md">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-[#801336]/60 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              placeholder="Search Registration / Roll No (e.g., 2024CS001)"
              className="w-full pl-10 pr-3 py-2 bg-white/70 text-[#2D142C] border border-[#801336]/15 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-[#EE4540] focus:outline-none transition placeholder:text-[#510A32]/40"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#EE4540] to-[#C72C41] hover:from-[#f05652] hover:to-[#d6354a] text-white rounded-xl text-xs font-bold transition shadow-md shadow-[#EE4540]/25 active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Quick-Pick Selector */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-[#510A32]/70 text-[11px] mr-1 hidden sm:inline">Roll:</span>
          {MOCK_STUDENTS.map((s) => (
            <button
              key={s.roll_no}
              onClick={() => {
                setSearchRoll(s.roll_no);
                navigate(`/marksheet/${s.roll_no}`);
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition active:scale-95 ${
                s.roll_no === currentRoll
                  ? 'bg-gradient-to-r from-[#EE4540] to-[#C72C41] text-white font-bold shadow-md shadow-[#EE4540]/25'
                  : 'bg-white/70 text-[#510A32] hover:text-[#2D142C] border border-[#801336]/10 hover:bg-white'
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
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#EE4540]/10 text-[#C72C41] border border-[#EE4540]/30 hover:bg-[#EE4540]/20 rounded-xl text-xs font-semibold transition active:scale-95 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#EE4540]" />
            <span>Verify Proof</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#EE4540] to-[#C72C41] hover:from-[#f05652] hover:to-[#d6354a] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#EE4540]/30 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Marksheet</span>
          </button>
        </div>
      </div>

      {loading || !student ? (
        <div className="glass-card rounded-3xl p-16 text-center border border-white/90 shadow-md">
          <div className="animate-spin w-8 h-8 border-3 border-[#EE4540] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#510A32]/75 text-sm font-medium">Retrieving official LPU transcript...</p>
        </div>
      ) : (
        /* Formal High-Prestige Academic Transcript Card */
        <div className="print-card bg-white text-slate-900 rounded-3xl shadow-2xl border border-[#801336]/15 overflow-hidden relative fly-in is-revealed">
          {/* Top LPU Coral to Plum Gradient Ribbon */}
          <div className="h-3.5 bg-gradient-to-r from-[#EE4540] via-[#C72C41] via-[#801336] to-[#2D142C]" />

          <div className="p-8 sm:p-12">
            {/* Header / University Crest */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-2xl bg-[#2D142C] flex items-center justify-center text-white border-2 border-[#EE4540] shadow-lg">
                  <div className="flex flex-col items-center">
                    <span className="font-display font-black text-xs text-[#EE4540]">LPU</span>
                    <span className="text-[8px] font-bold text-slate-300">ESTD 2005</span>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                LOVELY PROFESSIONAL UNIVERSITY
              </h1>
              <p className="text-xs font-bold tracking-widest text-[#C72C41] uppercase mt-1">
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
                  <span className="font-bold font-mono text-[#C72C41] text-base">{student.roll_no}</span>
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

            {/* Course Grade Table */}
            <div className="mb-8 overflow-hidden rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2D142C] text-white uppercase text-[10px] tracking-wider font-semibold">
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
                      <td className="py-3 px-4 text-center font-bold text-[#C72C41]">{sub.grade}</td>
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
                <span className="font-extrabold text-[#C72C41] text-lg">{student.gpa.toFixed(2)} / 10.0</span>
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
            <div className="p-4 bg-[#2D142C] text-white rounded-2xl font-mono text-[11px] space-y-2 border border-[#510A32]/40 shadow-inner">
              <div className="flex items-center space-x-2 text-[#EE4540] font-semibold mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[10px]">TruGrade Cryptographic Record</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1 border-t border-[#510A32]/40 pt-2">
                <span>Canonical Leaf Hash:</span>
                <span className="text-[#EE4540] break-all select-all">{student.leaf_hash}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1">
                <span>Active University Ledger Root:</span>
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
                <div className="h-10 flex items-end justify-center font-mono text-[10px] text-[#C72C41] font-bold">
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
