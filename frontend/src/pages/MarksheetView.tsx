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
  ArrowRight
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
      {/* Search & Actions Bar (Hidden during print) */}
      <div className="no-print mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        {/* Roll Search Form */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-grow max-w-md">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              placeholder="Search Roll No (e.g., 2024CS001)"
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
          >
            Load
          </button>
        </form>

        {/* Quick Student Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Quick Select:</span>
          {MOCK_STUDENTS.map((s) => (
            <button
              key={s.roll_no}
              onClick={() => {
                setSearchRoll(s.roll_no);
                navigate(`/marksheet/${s.roll_no}`);
              }}
              className={`px-2.5 py-1 rounded border font-mono transition ${
                s.roll_no === currentRoll
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Proof</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Marksheet</span>
          </button>
        </div>
      </div>

      {loading || !student ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Retrieving official ledger transcript...</p>
        </div>
      ) : (
        /* Formal Marksheet Layout */
        <div className="print-card bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
          {/* Top Decorative Border */}
          <div className="h-3 bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-900"></div>

          <div className="p-8 sm:p-12">
            {/* University Crest & Header */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white border-2 border-amber-400 shadow-md">
                  <Award className="w-9 h-9 text-amber-300" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-900 font-serif">
                National Institute of Advanced Technology
              </h1>
              <p className="text-sm font-semibold tracking-wider text-slate-600 uppercase mt-1">
                Office of the Controller of Examinations — Immutable Ledger Division
              </p>
              <div className="inline-block mt-3 px-4 py-1 bg-slate-100 border border-slate-300 rounded-full text-xs font-semibold tracking-wider uppercase text-slate-700">
                Official Grade Report (Academic Session {student.academic_year})
              </div>
            </div>

            {/* Student Meta Details & QR Verification Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-slate-200">
              <div className="md:col-span-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">Student Name</span>
                  <span className="font-bold text-slate-900 text-base">{student.student_name}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">Roll Number</span>
                  <span className="font-bold font-mono text-indigo-700 text-base">{student.roll_no}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">Degree & Program</span>
                  <span className="font-semibold text-slate-800">{student.course}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">Semester / Level</span>
                  <span className="font-semibold text-slate-800">Semester {student.semester}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">Result Status</span>
                  <span className="inline-flex items-center space-x-1 font-bold text-emerald-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{student.result_status}</span>
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">Ledger Salt</span>
                  <span className="font-mono text-xs text-slate-600">{student.salt}</span>
                </div>
              </div>

              {/* Dynamic Compact QR Code */}
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-300 rounded-xl">
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                  <QRCodeSVG
                    value={qrString}
                    size={130}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[10px] font-bold tracking-tight text-slate-700 block uppercase">
                    Scan to Verify
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono block">
                    Payload: {qrPayload.leaf.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Course Grade Table */}
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                <span>Course Performance Details</span>
                <span className="text-xs font-normal text-slate-500">Evaluation Scheme: CBCS 2026</span>
              </h2>

              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 border-b border-slate-300 text-xs uppercase font-bold text-slate-700">
                    <tr>
                      <th className="py-3 px-4">Subject Code</th>
                      <th className="py-3 px-4">Subject Title</th>
                      <th className="py-3 px-4 text-center">Max Marks</th>
                      <th className="py-3 px-4 text-center">Marks Obtained</th>
                      <th className="py-3 px-4 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {student.subjects.map((subj) => (
                      <tr key={subj.subject_code} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">{subj.subject_code}</td>
                        <td className="py-3 px-4 text-slate-800 font-medium">{subj.subject_name}</td>
                        <td className="py-3 px-4 text-center text-slate-600">{subj.max_marks}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900">{subj.marks_obtained}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 font-bold rounded text-xs bg-indigo-100 text-indigo-800">
                            {subj.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 uppercase text-xs tracking-wider">
                        Overall Aggregate & Performance
                      </td>
                      <td className="py-3 px-4 text-center">{student.max_total}</td>
                      <td className="py-3 px-4 text-center text-indigo-700 text-base">{student.total_marks}</td>
                      <td className="py-3 px-4 text-center bg-indigo-50 text-indigo-900">
                        GPA: {student.gpa.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Cryptographic Security Watermark Banner */}
            <div className="bg-slate-900 text-white rounded-xl p-4 text-xs font-mono space-y-1.5 mb-8">
              <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold uppercase text-[11px]">
                <Lock className="w-3.5 h-3.5" />
                <span>VeriMark Immutable Ledger Anchor</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                <div className="truncate">
                  <span className="text-slate-400">Canonical Leaf Hash: </span>
                  <span className="text-slate-200">{student.leaf_hash}</span>
                </div>
                <div className="truncate">
                  <span className="text-slate-400">Published Merkle Root: </span>
                  <span className="text-slate-200">{qrPayload.root}</span>
                </div>
              </div>
            </div>

            {/* Signatures Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-center text-xs">
              <div>
                <div className="h-10 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-slate-700 text-sm font-semibold">Dr. A. K. Verma</span>
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-600 uppercase text-[10px]">
                  Dean of Academics
                </div>
              </div>
              <div>
                <div className="h-10 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-slate-700 text-sm font-semibold">Prof. S. R. Mukherjee</span>
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-600 uppercase text-[10px]">
                  Controller of Examinations
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 flex flex-col justify-end text-slate-500 text-[10px] sm:text-right">
                <p>System Generated Document</p>
                <p className="font-mono">Security Hash: {student.leaf_hash.substring(0, 12)}...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
