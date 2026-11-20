import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  Database,
  ShieldCheck,
  RefreshCw,
  FileText
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-900 text-xs font-semibold mb-3">
          <Database className="w-3.5 h-3.5" />
          <span>Office of the Registrar &bull; Result Publishing Terminal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Publish Semester Results to Ledger
        </h1>
        <p className="mt-2 text-slate-600 max-w-xl mx-auto text-sm">
          Upload official exam score spreadsheets. VeriMark canonically hashes each student record, constructs the binary Merkle tree, and locks the root hash into the immutable append-only ledger.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <form onSubmit={handlePublish}>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition bg-slate-50/50">
            <UploadCloud className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Select Semester Results CSV
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Columns required: <code>roll_no, student_name, course, semester, subject_code, marks_obtained, max_marks, grade</code>
            </p>

            <label className="cursor-pointer inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition">
              <span>Choose CSV File</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <div className="mt-4 p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl inline-flex items-center space-x-2 text-xs font-medium text-indigo-900">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <a
              href="/sample_data/results_sample.csv"
              download="results_sample.csv"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline inline-flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download sample 55-student CSV for testing</span>
            </a>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
              <span>{uploading ? 'Hashing & Minting Merkle Tree...' : 'Publish to Immutable Ledger'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Publishing Success Banner */}
      {publishResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm mb-8 animate-fadeIn">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                Semester Results Successfully Published to Ledger!
              </h3>
              <p className="text-xs text-emerald-800">
                {publishResult.total_students} student transcripts have been canonically hashed and locked into the Merkle tree.
              </p>
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-4 border border-emerald-200 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Batch ID:</span>
              <span className="font-bold text-slate-900">{publishResult.batch_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Records Hashed:</span>
              <span className="font-bold text-slate-900">{publishResult.total_students} Students</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timestamp:</span>
              <span className="text-slate-700">{new Date(publishResult.published_at).toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="block text-slate-500 mb-1">Minted Merkle Root Hash:</span>
              <span className="block text-emerald-700 break-all bg-emerald-100/60 p-2 rounded-lg font-bold">
                {publishResult.root_hash}
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => navigate(`/marksheet/${publishResult.sample_roll_no || '2024CS001'}`)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <span>View First Published Marksheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
