import React from 'react';
import { ArrowDown, CheckCircle2, ShieldAlert, GitCommit } from 'lucide-react';

interface Step {
  stepIndex: number;
  left: string;
  right: string;
  parent: string;
  position: 'left' | 'right';
}

interface ProofPathVisualizerProps {
  leafHash: string;
  steps: Step[];
  computedRoot: string;
  expectedRoot: string;
  isValid: boolean;
}

export const ProofPathVisualizer: React.FC<ProofPathVisualizerProps> = ({
  leafHash,
  steps,
  computedRoot,
  expectedRoot,
  isValid
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg text-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-base text-slate-100">Merkle Cryptographic Audit Path</h3>
        </div>
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
          isValid
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
            : 'bg-rose-950/80 text-rose-300 border-rose-700/60'
        }`}>
          {isValid ? 'Hash Chain Intact' : 'Chain Broken'}
        </span>
      </div>

      <div className="mt-5 space-y-4 font-mono text-xs">
        {/* Leaf Node */}
        <div className="bg-slate-950/80 border border-indigo-900/40 rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[11px]">Level 0: Student Canonical Leaf</span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded">H_0</span>
          </div>
          <p className="break-all text-slate-200 select-all font-medium">{leafHash}</p>
        </div>

        {/* Audit Steps */}
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="flex justify-center -my-1 text-slate-600">
              <ArrowDown className="w-4 h-4 text-slate-500 animate-bounce" />
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 mt-2">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                  Level {step.stepIndex}: Merkle Parent Node
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Sibling Sourced: {step.position.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] mb-2 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[10px]">Left Sibling:</span>
                  <span className="break-all text-slate-300 font-mono">{step.left.substring(0, 16)}...{step.left.substring(48)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Right Sibling:</span>
                  <span className="break-all text-slate-300 font-mono">{step.right.substring(0, 16)}...{step.right.substring(48)}</span>
                </div>
              </div>

              <div className="mt-1 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-indigo-400 font-medium">Computed Parent Hash = SHA256(Left + Right):</span>
                <p className="break-all text-indigo-200 font-medium mt-0.5">{step.parent}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Root Node Comparison */}
        <div className="flex justify-center -my-1 text-slate-600">
          <ArrowDown className="w-4 h-4 text-slate-500" />
        </div>

        <div className={`p-4 rounded-xl border ${
          isValid
            ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
            : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <h4 className="font-semibold text-sm">
              {isValid ? 'Published Root Hash Matched' : 'Merkle Root Mismatch / Tamper Detected'}
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">Reconstructed Root Hash:</span>
              <p className="break-all font-mono font-bold text-slate-100">{computedRoot}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">Active Ledger Published Root:</span>
              <p className="break-all font-mono font-bold text-slate-100">{expectedRoot}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
