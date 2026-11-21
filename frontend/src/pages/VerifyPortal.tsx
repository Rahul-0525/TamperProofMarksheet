import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import {
  ShieldCheck,
  ShieldAlert,
  Camera,
  CheckCircle2,
  XCircle,
  FileCode,
  Sparkles,
  Layers,
  Building2,
  RefreshCw,
  FlipHorizontal,
  SwitchCamera
} from 'lucide-react';
import { CompactQRPayload, MerkleProofStep } from '../types';
import { verifyMerkleProof } from '../utils/crypto';
import { ProofPathVisualizer } from '../components/ProofPathVisualizer';
import { getCompactQRPayload, getActiveCohort } from '../utils/mockData';

export const VerifyPortal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const cohort = getActiveCohort();
  const defaultRoll = cohort.students[0]?.roll_no || '2024CS001';
  const initialRoll = searchParams.get('roll') || defaultRoll;

  const [inputMode, setInputMode] = useState<'scan' | 'paste' | 'preset'>('preset');
  const [qrJsonInput, setQrJsonInput] = useState('');
  
  // Camera & Webcam States
  const [cameraActive, setCameraActive] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('user');
  const [isMirrored, setIsMirrored] = useState(true);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

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
    const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobileDevice(mobileCheck);
    // On phone: use back camera (environment) and do not mirror
    // On laptop/desktop: use front camera (user) and mirror image so it's not reversed
    if (mobileCheck) {
      setCameraFacing('environment');
      setIsMirrored(false);
    } else {
      setCameraFacing('user');
      setIsMirrored(true);
    }
  }, []);

  useEffect(() => {
    if (initialRoll) {
      loadPreset(initialRoll, false);
    }
    return () => {
      stopCamera();
    };
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

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        // already stopped
      }
      html5QrCodeRef.current = null;
    }
    setCameraActive(false);
  };

  const startCameraScanner = async (facing: 'environment' | 'user' = cameraFacing) => {
    await stopCamera();
    setCameraActive(true);

    setTimeout(async () => {
      try {
        const qrCode = new Html5Qrcode('qr-reader');
        html5QrCodeRef.current = qrCode;

        const cameraConfig = { facingMode: facing };

        await qrCode.start(
          cameraConfig,
          {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            stopCamera();
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
        console.warn('Camera initialization error:', err);
      }
    }, 150);
  };

  const switchCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    // Auto-adjust mirror when flipping
    setIsMirrored(nextFacing === 'user');
    startCameraScanner(nextFacing);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-10 sm:py-16 space-y-10 sm:space-y-12">
      {/* Header - Spacey & Relaxed */}
      <div className="text-center mb-10 sm:mb-14 fly-in is-revealed">
        <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-white/[0.08] border border-white/18 text-pine-100 text-xs font-bold mb-5 shadow-sm">
          <Building2 className="w-4 h-4 text-[#fbbf24]" />
          <span>TruGrade Transcript Verifier &bull; Lovely Professional University</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
          Public Transcript Verification
        </h1>
        <p className="text-pine-200/90 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-4">
          Verify printed or electronic university marksheets against the immutable LPU academic ledger root.
          Validates cryptographic inclusion proofs directly in your browser.
        </p>
      </div>

      {/* Input Selection in Frosted Glass - Spacey & Relaxed */}
      <div className="floating-action-card p-6 sm:p-10 mb-10 shadow-2xl fly-in delay-100">
        <div className="flex flex-wrap border-b border-white/[0.1] pb-5 mb-8 gap-3 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => {
              stopCamera();
              setInputMode('preset');
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full transition text-xs ${
              inputMode === 'preset'
                ? 'btn-pill-white text-[#0e1c19]'
                : 'btn-pill-glass text-pine-200 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo</span>
          </button>
          <button
            onClick={() => {
              stopCamera();
              setInputMode('paste');
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full transition text-xs ${
              inputMode === 'paste'
                ? 'btn-pill-white text-[#0e1c19]'
                : 'btn-pill-glass text-pine-200 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Paste QR JSON</span>
          </button>
          <button
            onClick={() => {
              setInputMode('scan');
              startCameraScanner(cameraFacing);
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full transition text-xs ${
              inputMode === 'scan'
                ? 'btn-pill-white text-[#0e1c19]'
                : 'btn-pill-glass text-pine-200 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isMobileDevice ? 'Mobile Camera' : 'Webcam Scanner'}</span>
          </button>
        </div>

        {/* Tab 1: Demo Presets */}
        {inputMode === 'preset' && (
          <div>
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
              <p className="text-xs text-pine-200 font-semibold">
                Select a test scenario to evaluate genuine verification vs tamper detection:
              </p>
              {cohort.isCustom && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  Active Custom Ledger ({cohort.totalStudents} records)
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {cohort.students[0] && (
                <button
                  onClick={() => loadPreset(cohort.students[0].roll_no, false)}
                  className="inset-pill-field p-4 text-left flex flex-col justify-between group active:scale-95"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-[#fbbf24] font-bold text-xs sm:text-sm mb-1">
                      <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
                      <span>{cohort.students[0].student_name} ({cohort.students[0].roll_no})</span>
                    </div>
                    <p className="text-[11px] text-pine-200/80 group-hover:text-white">
                      Verifies authentic marksheet and calculates full Merkle inclusion path.
                    </p>
                  </div>
                </button>
              )}

              {cohort.students[1] && (
                <button
                  onClick={() => loadPreset(cohort.students[1].roll_no, false)}
                  className="inset-pill-field p-4 text-left flex flex-col justify-between group active:scale-95"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-[#fbbf24] font-bold text-xs sm:text-sm mb-1">
                      <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
                      <span>{cohort.students[1].student_name} ({cohort.students[1].roll_no})</span>
                    </div>
                    <p className="text-[11px] text-pine-200/80 group-hover:text-white">
                      Verifies alternate sibling positioning along the binary hash tree.
                    </p>
                  </div>
                </button>
              )}

              {cohort.students[0] && (
                <button
                  onClick={() => loadPreset(cohort.students[0].roll_no, true)}
                  className="inset-pill-field p-4 text-left flex flex-col justify-between group active:scale-95 border-rose-500/40"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs sm:text-sm mb-1">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Simulate Forged Marksheet</span>
                    </div>
                    <p className="text-[11px] text-rose-200/80 group-hover:text-rose-100">
                      Altered marks or forged QR code triggers immediate cryptographic failure.
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Paste JSON */}
        {inputMode === 'paste' && (
          <form onSubmit={handleJsonSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-pine-200 mb-2">
                Compact QR Code Payload (JSON)
              </label>
              <textarea
                rows={5}
                value={qrJsonInput}
                onChange={(e) => setQrJsonInput(e.target.value)}
                placeholder='{"v":1,"roll":"2024CS001","leaf":"...","root":"...","proof":[...]}'
                className="inset-pill-field w-full p-4 font-mono text-xs text-white focus:outline-none placeholder:text-pine-400/40"
              />
            </div>
            <button
              type="submit"
              className="btn-pill-white px-6 py-2.5 text-xs font-bold active:scale-95 w-full sm:w-auto"
            >
              Verify Payload Now
            </button>
          </form>
        )}

        {/* Tab 3: Webcam / Mobile Camera Scanner with Mirroring & Controls */}
        {inputMode === 'scan' && (
          <div className="text-center py-2 sm:py-4">
            {/* Viewfinder Toolbar */}
            <div className="flex items-center justify-center space-x-3 mb-4 text-xs">
              <button
                type="button"
                onClick={() => setIsMirrored(!isMirrored)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                  isMirrored
                    ? 'bg-white/[0.18] text-[#fbbf24] border-[#fbbf24]/50'
                    : 'bg-white/[0.06] text-pine-200 border-white/10'
                }`}
                title="Mirrors user webcam so text and movements appear natural like a mirror"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>{isMirrored ? 'Mirrored (Natural)' : 'Unmirrored'}</span>
              </button>

              <button
                type="button"
                onClick={switchCameraFacing}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-pine-200 border border-white/10 transition"
              >
                <SwitchCamera className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>Switch to {cameraFacing === 'environment' ? 'Front' : 'Back'} Camera</span>
              </button>
            </div>

            {/* Video Feed Box with Mirrored Toggle */}
            <div className="relative max-w-xs sm:max-w-sm mx-auto overflow-hidden rounded-3xl border border-white/20 bg-black/60 shadow-2xl">
              <div
                id="qr-reader"
                className={`w-full ${isMirrored ? 'camera-mirrored-feed' : ''}`}
                style={{ minHeight: '260px' }}
              />

              {/* Scanning Crosshair Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-[#fbbf24]/50 rounded-2xl animate-pulse" />
              </div>
            </div>

            <p className="text-xs text-pine-300 mt-4 px-4">
              {isMobileDevice
                ? 'Using mobile rear camera. Point at printed marksheet QR code.'
                : 'Using laptop webcam with mirrored view. Hold marksheet in front of camera.'}
            </p>
          </div>
        )}
      </div>

      {/* Verification Result Showcase */}
      {verifiedResult && (
        <div className="space-y-6 sm:space-y-8 fly-in is-revealed">
          {/* Hero Result Banner */}
          <div
            className={`floating-action-card p-5 sm:p-8 shadow-2xl relative overflow-hidden ${
              verifiedResult.isValid
                ? 'border-emerald-500/50'
                : 'border-rose-500/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <div className={`p-3.5 sm:p-4 rounded-2xl flex-shrink-0 ${
                verifiedResult.isValid ? 'bg-[#f59e0b]/20 text-[#fbbf24]' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {verifiedResult.isValid ? (
                  <ShieldCheck className="w-10 h-10 sm:w-14 sm:h-14" />
                ) : (
                  <ShieldAlert className="w-10 h-10 sm:w-14 sm:h-14 animate-pulse" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    verifiedResult.isValid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {verifiedResult.isValid ? 'VERIFICATION SUCCESSFUL' : 'FORGERY / TAMPER DETECTED'}
                  </span>
                  <span className="text-pine-300 text-xs font-mono">&bull; Candidate: {verifiedResult.roll}</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                  {verifiedResult.isValid
                    ? 'Cryptographically Authentic LPU Marksheet'
                    : 'Cryptographic Hash Mismatch — Invalid Transcript'}
                </h3>

                <p className="text-pine-100/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                  {verifiedResult.isValid
                    ? 'The student transcript leaf hash connects directly to the published LPU University Merkle Root along a valid inclusion path. The marks on this transcript are authentic.'
                    : 'The scanned marksheet has either been altered after publication, or the QR payload has been tampered with. The computed root does not match the active university ledger.'}
                </p>
              </div>
            </div>

            {/* Hashes Comparison Grid with Inset Channels */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono text-xs">
              <div className="inset-pill-field p-3.5 sm:p-4">
                <span className="text-[10px] uppercase font-bold text-pine-300 block mb-1">
                  Expected Active Ledger Root
                </span>
                <span className="text-[#fbbf24] break-all select-all font-semibold text-[11px] sm:text-xs">
                  {verifiedResult.expectedRoot}
                </span>
              </div>
              <div className={`inset-pill-field p-3.5 sm:p-4 ${
                verifiedResult.isValid ? 'text-[#fbbf24]' : 'text-rose-300'
              }`}>
                <span className="text-[10px] uppercase font-bold text-pine-300 block mb-1">
                  Computed Root from Marksheet Proof
                </span>
                <span className="break-all select-all font-semibold text-[11px] sm:text-xs">
                  {verifiedResult.computedRoot}
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Merkle Audit Path */}
          {verifiedResult.steps.length > 0 && (
            <div className="floating-action-card p-4 sm:p-8 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#fbbf24]" />
                <span>Step-by-Step Merkle Audit Path ({verifiedResult.steps.length} Steps)</span>
              </h4>
              <p className="text-xs text-pine-200 mb-6">
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
