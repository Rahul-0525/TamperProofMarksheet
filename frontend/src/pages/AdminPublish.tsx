import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  RefreshCw,
  FileText,
  Building2
} from 'lucide-react';
import { api } from '../services/api';

export const AdminPublish: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    batch_id: string;
    total_students: number;
    root_hash: string;
    published_at: string;
    sample_roll_no?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.csv')) {
        setErrorMsg('Please select a valid CSV file.');
        return;
      }
      setSelectedFile(file);
      setErrorMsg('');
      setPublishResult(null);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please choose a CSV file to upload.');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      const result = await api.publishBatch(selectedFile);
      setPublishResult(result);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to publish batch to cryptographic ledger.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10 fly-in is-revealed">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#EE4540]/30 text-[#801336] text-xs font-semibold mb-4 shadow-sm">
          <Building2 className="w-3.5 h-3.5 text-[#EE4540]" />
          <span>Lovely Professional University &bull; Office of the Registrar</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#2D142C] tracking-tight mb-3">
          Publish Semester Results
        </h1>
        <p className="text-[#510A32]/75 max-w-xl mx-auto text-sm leading-relaxed">
          Upload official exam score spreadsheets. TruGrade canonically serializes and hashes each record, builds the balanced Merkle tree, and locks the root into the immutable LPU academic ledger.
        </p>
      </div>

      {/* Main Glass Upload Box in Lighter Aesthetics */}
      <div className="glass-card rounded-3xl border border-white/90 p-8 sm:p-10 mb-8 shadow-xl fly-in delay-100">
        <form onSubmit={handlePublish}>
          <div className="border-2 border-dashed border-[#801336]/20 rounded-2xl p-10 text-center hover:border-[#EE4540]/60 transition-all duration-300 bg-white/50">
            <UploadCloud className="w-12 h-12 text-[#EE4540] mx-auto mb-4 animate-float" />
            <h3 className="font-display text-base font-bold text-[#2D142C] mb-1">
              Select Semester Results CSV
            </h3>
            <p className="text-xs text-[#510A32]/70 mb-6 font-mono">
              Columns: roll_no, student_name, course, semester, subject_code, marks_obtained, max_marks, grade
            </p>

            <label className="cursor-pointer inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#EE4540] to-[#C72C41] hover:from-[#f05652] hover:to-[#d6354a] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#EE4540]/30 transition active:scale-95">
              <span>Choose CSV File</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <div className="mt-6 p-3 bg-[#EE4540]/10 border border-[#EE4540]/25 rounded-xl inline-flex items-center space-x-2 text-xs font-medium text-[#C72C41] font-mono shadow-sm">
                <FileSpreadsheet className="w-4 h-4 text-[#EE4540]" />
                <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-xs text-[#C72C41]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <a
              href="/sample_data/results_sample.csv"
              download="results_sample.csv"
              className="text-xs text-[#C72C41] hover:text-[#EE4540] font-medium underline inline-flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download sample 55-student CSV for live testing</span>
            </a>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-6 py-3 bg-gradient-to-r from-[#EE4540] to-[#C72C41] hover:from-[#f05652] hover:to-[#d6354a] disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-lg shadow-[#EE4540]/30 transition flex items-center space-x-2 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
              <span>{uploading ? 'Hashing & Minting Merkle Tree...' : 'Publish to Immutable Ledger'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Success Banner */}
      {publishResult && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-400 bg-emerald-50/50 shadow-xl mb-8 fly-in is-revealed">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#2D142C]">
                Semester Results Minted to Ledger!
              </h3>
              <p className="text-xs text-[#510A32]/75">
                {publishResult.total_students} student transcripts have been canonically hashed and locked into the Merkle tree.
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl p-5 border border-slate-200 font-mono text-xs space-y-3 shadow-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Batch ID:</span>
              <span className="font-bold text-[#2D142C]">{publishResult.batch_id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Records Processed:</span>
              <span className="font-bold text-emerald-700">{publishResult.total_students} Students</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Commit Timestamp:</span>
              <span className="text-slate-700">{new Date(publishResult.published_at).toLocaleString()}</span>
            </div>
            <div className="pt-1">
              <span className="block text-slate-500 mb-1.5">Minted Merkle Root Hash:</span>
              <span className="block text-emerald-800 break-all select-all bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-bold">
                {publishResult.root_hash}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate(`/marksheet/${publishResult.sample_roll_no || '2024CS001'}`)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-emerald-600/30 active:scale-95"
            >
              <span>Inspect First Published Marksheet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
