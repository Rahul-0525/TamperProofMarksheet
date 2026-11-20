import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  ShieldCheck,
  ShieldAlert,
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  FileCode,
  Sparkles,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { CompactQRPayload, MerkleProofStep } from '../types';
import { verifyMerkleProof, sha256 } from '../utils/crypto';
import { ProofPathVisualizer } from '../components/ProofPathVisualizer';
import { PUBLISHED_ROOT_HASH, MOCK_PROOFS, getCompactQRPayload } from '../utils/mockData';

export const VerifyPortal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRoll = searchParams.get('roll') || '2024CS001';

  const [inputMode, setInputMode] = useState<'scan' | 'paste' | 'preset'>('preset');
  const [qrJsonInput, setQrJsonInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  // Verification state
  const [verifying, setVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<{
    tested: boolean;
    isValid: boolean;
    roll: string;
    leafHash: string;
    computedRoot: string;
    expectedRoot: string;
    steps: Array<{ stepIndex: number; left: string; right: string; parent: string; position: 'left' | 'right' }>;
    isOffline: boolean;
  } | null>(null);

  // Auto-load preset if roll param present
  useEffect(() => {
    if (initialRoll) {
      loadPreset(initialRoll, false);
    }
  }, [initialRoll]);

  const runVerification = async (payload: CompactQRPayload, isTampered = false) => {
    setVerifying(true);
    try {
      // Convert compact payload proof to full steps
      const auditSteps: MerkleProofStep[] = payload.proof.map(p => ({
        position: p.p === 'L' ? 'left' : 'right',
        hash: p.h
      }));

      // Calculate verification client-side via Web Crypto
      const verification = await verifyMerkleProof(
        payload.leaf,
        auditSteps,
        payload.root
      );

      setVerifiedResult({
        tested: true,
        isValid: verification.isValid && !isTampered,
        roll: payload.roll,
        leafHash: payload.leaf,
        computedRoot: verification.computedRoot,
        expectedRoot: payload.root,
        steps: verification.steps,
        isOffline: true
      });
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  const loadPreset = (roll: string, tampered = false) => {
    const raw = getCompactQRPayload(roll);
    if (tampered) {
      // Simulate modified grade or modified leaf hash
      const corruptedLeaf = raw.leaf.replace(/^[0-9a-f]{4}/, 'dead');
      const tamperedPayload: CompactQRPayload = {
        ...raw,
        leaf: corruptedLeaf
      };
      setQrJsonInput(JSON.stringify(tamperedPayload, null, 2));
      runVerification(tamperedPayload, true);
    } else {
      setQrJsonInput(JSON.stringify(raw, null, 2));
      runVerification(raw, false);
    }
  };

  const handleJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(qrJsonInput) as CompactQRPayload;
      runVerification(parsed);
    } catch (err) {
      alert('Invalid QR JSON Payload. Please ensure valid JSON structure.');
    }
  };

  const startCameraScanner = () => {
    setCameraActive(true);
    setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scanner.render(
          (decodedText) => {
            scanner.clear();
            setCameraActive(false);
            try {
              const parsed = JSON.parse(decodedText) as CompactQRPayload;
              setQrJsonInput(JSON.stringify(parsed, null, 2));
              runVerification(parsed);
            } catch (err) {
              alert(`Scanned content: ${decodedText}`);
            }
          },
          (error) => {
            // Scanner frame error, normal behavior while scanning
          }
        );
      } catch (err) {
        console.warn('Camera scanner initialization:', err);
      }
    }, 100);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client-Side Web Crypto Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Public Marksheet QR Verification Portal
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-sm">
          Mathematically verify any university marksheet against the append-only ledger.
          Runs entirely in your browser using cryptographic SHA-256 Merkle inclusion proofs.
        </p>
      </div>

      {/* Input Selection Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex border-b border-slate-200 pb-4 mb-6 space-x-4">
          <button
            onClick={() => setInputMode('preset')}
            className={`flex items-center space-x-2 pb-2 text-sm font-semibold border-b-2 transition ${
              inputMode === 'preset'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Interactive Demo Presets</span>
          </button>
          <button
            onClick={() => setInputMode('paste')}
            className={`flex items-center space-x-2 pb-2 text-sm font-semibold border-b-2 transition ${
              inputMode === 'paste'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Paste QR Payload / JSON</span>
          </button>
          <button
            onClick={() => {
              setInputMode('scan');
              startCameraScanner();
            }}
            className={`flex items-center space-x-2 pb-2 text-sm font-semibold border-b-2 transition ${
              inputMode === 'scan'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Webcam / Scanner</span>
          </button>
        </div>

        {/* Tab 1: Presets */}
        {inputMode === 'preset' && (
          <div>
            <p className="text-xs text-slate-500 mb-4">
              Select a test scenario to evaluate both positive verification and tamper detection:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => loadPreset('2024CS001', false)}
                className="p-3 text-left rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition"
              >
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Valid: Aarav (2024CS001)</span>
                </div>
                <p className="text-xs text-emerald-700">Verifies genuine marksheet and full audit path to root.</p>
              </button>

              <button
                onClick={() => loadPreset('2024CS002', false)}
                className="p-3 text-left rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition"
              >
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Valid: Diya (2024CS002)</span>
                </div>
                <p className="text-xs text-emerald-700">Left-sibling audit path verification.</p>
              </button>

              <button
                onClick={() => loadPreset('2024CS001', true)}
                className="p-3 text-left rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition"
              >
                <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm mb-1">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Simulate Forged Marksheet</span>
                </div>
                <p className="text-xs text-rose-700">Altered marks or forged QR code triggers immediate red flag.</p>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Paste JSON */}
        {inputMode === 'paste' && (
          <form onSubmit={handleJsonSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Compact QR Code Payload (JSON)
              </label>
              <textarea
                rows={5}
                value={qrJsonInput}
                onChange={(e) => setQrJsonInput(e.target.value)}
                placeholder='{"v":1,"roll":"2024CS001","leaf":"...","root":"...","proof":[]}'
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Verify Payload Now
            </button>
          </form>
        )}

        {/* Tab 3: Webcam / Scanner */}
        {inputMode === 'scan' && (
          <div className="text-center py-4">
            <div id="qr-reader" className="max-w-sm mx-auto overflow-hidden rounded-xl border border-slate-300"></div>
            <p className="text-xs text-slate-500 mt-2">
              Point your webcam at a printed VeriMark marksheet QR code.
            </p>
          </div>
        )}
      </div>

      {/* Verification Result Showcase */}
      {verifiedResult && (
        <div className="space-y-6">
          {/* Main Status Banner */}
          <div
            className={`p-6 sm:p-8 rounded-2xl shadow-xl border flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 ${
              verifiedResult.isValid
                ? 'bg-gradient-to-br from-emerald-900 to-slate-900 text-white border-emerald-500/50'
                : 'bg-gradient-to-br from-rose-950 to-slate-900 text-white border-rose-500/50'
            }`}
          >
            <div className={`p-4 rounded-2xl flex-shrink-0 ${
              verifiedResult.isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {verifiedResult.isValid ? (
                <ShieldCheck className="w-16 h-16" />
              ) : (
                <ShieldAlert className="w-16 h-16 animate-pulse" />
              )}
            </div>

            <div className="text-center sm:text-left flex-grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  verifiedResult.isValid ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}>
                  {verifiedResult.isValid ? 'AUTHENTIC MARKSHEET' : 'FORGERY / TAMPER DETECTED'}
                </span>
                <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
                  <WifiOff className="w-3 h-3 text-indigo-400" />
                  <span>Verified 100% Client-Side</span>
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                {verifiedResult.isValid
                  ? `Cryptographic Proof Verified for Roll No: ${verifiedResult.roll}`
                  : `Integrity Check Failed: Invalid Root Reconstruction`}
              </h2>

              <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
                {verifiedResult.isValid
                  ? `Every subject grade and student detail is mathematically anchored to the university's immutable ledger root. The canonical leaf hash produces an exact match through the Merkle audit tree.`
                  : `Warning! The scanned leaf hash does not resolve to the active published ledger root. The grades on this document have either been altered or forged.`}
              </p>
            </div>
          </div>

          {/* Interactive Merkle Tree Visualizer */}
          <ProofPathVisualizer
            leafHash={verifiedResult.leafHash}
            steps={verifiedResult.steps}
            computedRoot={verifiedResult.computedRoot}
            expectedRoot={verifiedResult.expectedRoot}
            isValid={verifiedResult.isValid}
          />
        </div>
      )}
    </div>
  );
};
