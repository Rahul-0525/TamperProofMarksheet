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
    <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-10 py-10 sm:py-16 space-y-10">
      {/* Header - Spacey & Relaxed */}
      <div className="text-center mb-10 sm:mb-14 fly-in is-revealed">
        <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-white/[0.08] border border-white/18 text-pine-100 text-xs font-bold mb-5 shadow-sm">
          <Building2 className="w-4 h-4 text-[#fbbf24]" />
          <span>Lovely Professional University &bull; Office of the Registrar</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
          Publish Semester Results
        </h1>
        <p className="text-pine-200/90 max-w-xl mx-auto text-sm sm:text-base leading-relaxed px-4">
          Upload official exam score spreadsheets. TruGrade canonically serializes and hashes each record, builds the balanced Merkle tree, and locks the root into the immutable LPU academic ledger.
        </p>
      </div>

      {/* Main Glass Upload Box */}
      <div className="floating-action-card p-8 sm:p-12 mb-10 shadow-2xl fly-in delay-100">
        <form onSubmit={handlePublish}>
          <div className="border-2 border-dashed border-white/15 rounded-3xl p-10 text-center hover:border-[#f59e0b]/50 transition-all duration-300 bg-black/20">
            <UploadCloud className="w-12 h-12 text-[#fbbf24] mx-auto mb-4 animate-float" />
            <h3 className="font-display text-base font-bold text-white mb-1">
              Select Semester Results CSV
            </h3>
            <p className="text-xs text-pine-300 mb-6 font-mono">
              Columns: roll_no, student_name, course, semester, subject_code, marks_obtained, max_marks, grade
            </p>

            <label className="cursor-pointer inline-flex items-center space-x-2 btn-pill-white px-6 py-3 text-xs font-bold shadow-lg transition active:scale-95">
              <span>Choose CSV File</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <div className="mt-6 p-3 bg-white/[0.08] border border-white/15 rounded-2xl inline-flex items-center space-x-2 text-xs font-medium text-[#fbbf24] font-mono shadow-sm">
                <FileSpreadsheet className="w-4 h-4 text-[#fbbf24]" />
                <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center space-x-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <a
              href="/sample_data/results_sample.csv"
              download="results_sample.csv"
              className="text-xs text-pine-200 hover:text-white font-medium underline inline-flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>Download sample 55-student CSV for live testing</span>
            </a>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="btn-pill-white px-6 py-3 text-xs font-bold shadow-lg transition flex items-center space-x-2 active:scale-95 disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
              <span>{uploading ? 'Hashing & Minting Merkle Tree...' : 'Publish to Immutable Ledger'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Success Banner */}
      {publishResult && (
        <div className="floating-action-card p-6 sm:p-8 border border-emerald-500/40 shadow-2xl mb-8 fly-in is-revealed">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Semester Results Minted to Ledger!
              </h3>
              <p className="text-xs text-pine-200">
                {publishResult.total_students} student transcripts have been canonically hashed and locked into the Merkle tree.
              </p>
            </div>
          </div>

          <div className="inset-pill-field p-5 font-mono text-xs space-y-3">
            <div className="flex justify-between border-b border-white/[0.08] pb-2">
              <span className="text-pine-300">Batch ID:</span>
              <span className="font-bold text-white">{publishResult.batch_id}</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.08] pb-2">
              <span className="text-pine-300">Records Processed:</span>
              <span className="font-bold text-emerald-400">{publishResult.total_students} Students</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.08] pb-2">
              <span className="text-pine-300">Commit Timestamp:</span>
              <span className="text-pine-200">{new Date(publishResult.published_at).toLocaleString()}</span>
            </div>
            <div className="pt-1">
              <span className="block text-pine-300 mb-1.5">Minted Merkle Root Hash:</span>
              <span className="block text-[#fbbf24] break-all select-all bg-black/40 p-3 rounded-xl border border-white/[0.08] font-bold">
                {publishResult.root_hash}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate(`/marksheet/${publishResult.sample_roll_no || '2024CS001'}`)}
              className="btn-pill-white px-5 py-2.5 text-xs font-bold transition flex items-center space-x-2 shadow-lg active:scale-95"
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
