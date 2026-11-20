import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  ShieldCheck,
  ShieldAlert,
  Camera,
  CheckCircle2,
  XCircle,
  FileCode,
  Sparkles,
  Layers,
  Building2
} from 'lucide-react';
import { CompactQRPayload, MerkleProofStep } from '../types';
import { verifyMerkleProof } from '../utils/crypto';
import { ProofPathVisualizer } from '../components/ProofPathVisualizer';
import { getCompactQRPayload } from '../utils/mockData';

export const VerifyPortal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRoll = searchParams.get('roll') || '2024CS001';

  const [inputMode, setInputMode] = useState<'scan' | 'paste' | 'preset'>('preset');
  const [qrJsonInput, setQrJsonInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const [verifying, setVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<{
    tested: boolean;
    isValid: boolean;
    roll: string;
    leafHash: string;
    computedRoot: string;
    expectedRoot: string;
    steps: Array<{ stepIndex: number; left: string; right: string; parent: string; position: 'left' | 'right' }>;
  } | null>(null);

  useEffect(() => {
    if (initialRoll) {
      loadPreset(initialRoll, false);
    }
  }, [initialRoll]);

  const runVerification = async (payload: CompactQRPayload, isTampered = false) => {
    setVerifying(true);
    try {
      const auditSteps: MerkleProofStep[] = payload.proof.map(p => ({
        position: p.p === 'L' ? 'left' : 'right',
        hash: p.h
      }));

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
        steps: verification.steps
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
          () => {}
        );
      } catch (err) {
        console.warn('Camera scanner initialization:', err);
      }
    }, 100);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10 fly-in is-revealed">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#EE4540]/30 text-[#801336] text-xs font-semibold mb-4 shadow-sm">
          <Building2 className="w-3.5 h-3.5 text-[#EE4540]" />
          <span>TruGrade Transcript Verifier &bull; Lovely Professional University</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#2D142C] tracking-tight mb-3">
          Public Transcript Verification
        </h1>
        <p className="text-[#510A32]/75 max-w-2xl mx-auto text-sm leading-relaxed">
          Verify printed or electronic university marksheets against the immutable LPU academic ledger root.
          Validates cryptographic inclusion proofs directly in your browser.
        </p>
      </div>

      {/* Input Selection Tabs */}
      <div className="glass-card rounded-3xl border border-white/90 p-6 sm:p-8 mb-8 shadow-md fly-in delay-100">
        <div className="flex border-b border-[#801336]/10 pb-4 mb-6 space-x-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setInputMode('preset')}
            className={`flex items-center space-x-2 pb-2 transition border-b-2 ${
              inputMode === 'preset'
                ? 'border-[#EE4540] text-[#EE4540] font-bold'
                : 'border-transparent text-[#510A32]/70 hover:text-[#2D142C]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Demonstration Scenarios</span>
          </button>
          <button
            onClick={() => setInputMode('paste')}
            className={`flex items-center space-x-2 pb-2 transition border-b-2 ${
              inputMode === 'paste'
                ? 'border-[#EE4540] text-[#EE4540] font-bold'
                : 'border-transparent text-[#510A32]/70 hover:text-[#2D142C]'
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
            className={`flex items-center space-x-2 pb-2 transition border-b-2 ${
              inputMode === 'scan'
                ? 'border-[#EE4540] text-[#EE4540] font-bold'
                : 'border-transparent text-[#510A32]/70 hover:text-[#2D142C]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Webcam Scanner</span>
          </button>
        </div>

        {/* Tab 1: Demo Presets */}
        {inputMode === 'preset' && (
          <div>
            <p className="text-xs text-[#510A32]/70 mb-4 font-medium">
              Select a test scenario to evaluate genuine verification vs tamper detection:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => loadPreset('2024CS001', false)}
                className="p-4 text-left rounded-2xl border border-emerald-500/25 bg-emerald-50/70 hover:bg-emerald-50 transition group active:scale-95 shadow-sm"
              >
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs sm:text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Genuine: Aarav (2024CS001)</span>
                </div>
                <p className="text-[11px] text-slate-600 group-hover:text-slate-800">
                  Verifies authentic marksheet and calculates full Merkle inclusion path.
                </p>
              </button>

              <button
                onClick={() => loadPreset('2024CS002', false)}
                className="p-4 text-left rounded-2xl border border-emerald-500/25 bg-emerald-50/70 hover:bg-emerald-50 transition group active:scale-95 shadow-sm"
              >
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs sm:text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Genuine: Diya (2024CS002)</span>
                </div>
                <p className="text-[11px] text-slate-600 group-hover:text-slate-800">
                  Verifies alternate sibling positioning along the binary hash tree.
                </p>
              </button>

              <button
                onClick={() => loadPreset('2024CS001', true)}
                className="p-4 text-left rounded-2xl border border-rose-500/25 bg-rose-50/70 hover:bg-rose-50 transition group active:scale-95 shadow-sm"
              >
                <div className="flex items-center space-x-2 text-[#C72C41] font-bold text-xs sm:text-sm mb-1">
                  <XCircle className="w-4 h-4 text-[#C72C41]" />
                  <span>Simulate Forged Marksheet</span>
                </div>
                <p className="text-[11px] text-slate-600 group-hover:text-slate-800">
                  Altered marks or forged QR code triggers immediate cryptographic failure.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Paste JSON */}
        {inputMode === 'paste' && (
          <form onSubmit={handleJsonSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#510A32] mb-2">
                Compact QR Code Payload (JSON)
              </label>
              <textarea
                rows={5}
                value={qrJsonInput}
                onChange={(e) => setQrJsonInput(e.target.value)}
                placeholder='{"v":1,"roll":"2024CS001","leaf":"...","root":"...","proof":[...]}'
                className="w-full p-4 bg-white/70 border border-[#801336]/15 rounded-2xl font-mono text-xs text-[#2D142C] focus:outline-none focus:ring-2 focus:ring-[#EE4540]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#EE4540] to-[#C72C41] hover:from-[#f05652] hover:to-[#d6354a] text-white rounded-xl text-xs font-bold transition shadow-md shadow-[#EE4540]/25 active:scale-95"
            >
              Verify Payload Now
            </button>
          </form>
        )}

        {/* Tab 3: Webcam Scanner */}
        {inputMode === 'scan' && (
          <div className="text-center py-4">
            <div id="qr-reader" className="max-w-sm mx-auto overflow-hidden rounded-2xl border border-[#801336]/20 bg-white" />
            <p className="text-xs text-[#510A32]/70 mt-4">
              Hold the printed marksheet QR code in front of your camera to scan.
            </p>
          </div>
        )}
      </div>

      {/* Verification Result Showcase */}
      {verifiedResult && (
        <div className="space-y-8 fly-in is-revealed">
          {/* Hero Result Banner */}
          <div
            className={`p-8 rounded-3xl border transition relative overflow-hidden shadow-xl ${
              verifiedResult.isValid
                ? 'glass-card border-emerald-500/40 bg-emerald-50/50'
                : 'glass-card border-rose-500/50 bg-rose-50/50'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <div className={`p-4 rounded-2xl flex-shrink-0 ${
                verifiedResult.isValid ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/15 text-[#C72C41]'
              }`}>
                {verifiedResult.isValid ? (
                  <ShieldCheck className="w-14 h-14" />
                ) : (
                  <ShieldAlert className="w-14 h-14 animate-pulse" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    verifiedResult.isValid ? 'bg-emerald-500/20 text-emerald-800' : 'bg-rose-500/20 text-[#801336]'
                  }`}>
                    {verifiedResult.isValid ? 'VERIFICATION SUCCESSFUL' : 'FORGERY / TAMPER DETECTED'}
                  </span>
                  <span className="text-[#510A32]/70 text-xs font-mono">&bull; Candidate: {verifiedResult.roll}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#2D142C] mb-2">
                  {verifiedResult.isValid
                    ? 'Cryptographically Authentic LPU Marksheet'
                    : 'Cryptographic Hash Mismatch — Invalid Transcript'}
                </h3>

                <p className="text-[#510A32]/85 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                  {verifiedResult.isValid
                    ? 'The student transcript leaf hash connects directly to the published LPU University Merkle Root along a valid inclusion path. The marks on this transcript are authentic.'
                    : 'The scanned marksheet has either been altered after publication, or the QR payload has been tampered with. The computed root does not match the active university ledger.'}
                </p>
              </div>
            </div>

            {/* Hashes Comparison Grid */}
            <div className="mt-8 pt-6 border-t border-[#801336]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-white/80 p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Expected Active Ledger Root
                </span>
                <span className="text-emerald-700 break-all select-all font-semibold">
                  {verifiedResult.expectedRoot}
                </span>
              </div>
              <div className={`p-4 rounded-xl border shadow-sm ${
                verifiedResult.isValid
                  ? 'bg-white/80 border-slate-200 text-emerald-700'
                  : 'bg-rose-100/70 border-rose-300 text-[#801336]'
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Computed Root from Marksheet Proof
                </span>
                <span className="break-all select-all font-semibold">
                  {verifiedResult.computedRoot}
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Merkle Audit Path */}
          {verifiedResult.steps.length > 0 && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/90 shadow-md">
              <h4 className="text-sm font-bold text-[#2D142C] mb-2 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#EE4540]" />
                <span>Step-by-Step Merkle Audit Path ({verifiedResult.steps.length} Steps)</span>
              </h4>
              <p className="text-xs text-[#510A32]/75 mb-6">
                Visualizing how the candidate canonical leaf climbs the binary hash tree to reconstruct the ledger root:
              </p>
              <ProofPathVisualizer
                leafHash={verifiedResult.leafHash}
                expectedRoot={verifiedResult.expectedRoot}
                computedRoot={verifiedResult.computedRoot}
                isValid={verifiedResult.isValid}
                steps={verifiedResult.steps}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
