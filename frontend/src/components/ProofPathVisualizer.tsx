import React from 'react';
import { ArrowDown, CheckCircle2, ShieldAlert, GitCommit, Layers } from 'lucide-react';

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
    <div className="glass-panel border border-white/10 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-sm sm:text-base text-white">Merkle Cryptographic Audit Path</h3>
        </div>
        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
          isValid
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
        }`}>
          {isValid ? 'Hash Chain Intact' : 'Chain Broken'}
        </span>
      </div>

      <div className="mt-6 space-y-4 font-mono text-xs">
        {/* Leaf Node */}
        <div className="bg-white/[0.02] border border-indigo-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px]">
              Level 0: Student Canonical Leaf
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-bold">
              H_0
            </span>
          </div>
          <p className="break-all text-slate-200 select-all font-semibold">{leafHash}</p>
        </div>

        {/* Audit Steps */}
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="flex justify-center -my-1 text-slate-600">
              <ArrowDown className="w-4 h-4 text-slate-500 animate-bounce" />
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 mt-2">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                  Level {step.stepIndex}: Merkle Parent Node
                </span>
                <span className="text-[9px] bg-white/[0.06] text-slate-300 px-2 py-0.5 rounded font-bold uppercase">
                  Sibling Sourced: {step.position}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] mb-2 bg-black/20 p-2.5 rounded-xl border border-white/[0.04]">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Left Sibling:</span>
                  <span className="break-all text-slate-300 font-mono">{step.left.substring(0, 16)}...{step.left.substring(48)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Right Sibling:</span>
                  <span className="break-all text-slate-300 font-mono">{step.right.substring(0, 16)}...{step.right.substring(48)}</span>
                </div>
              </div>

              <div className="mt-1 pt-2 border-t border-white/[0.04]">
                <span className="text-[10px] text-indigo-400 font-medium">Computed Parent Hash = SHA256(Left + Right):</span>
                <p className="break-all text-indigo-200 font-bold mt-0.5">{step.parent}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Root Node Comparison */}
        <div className="flex justify-center -my-1 text-slate-600">
          <ArrowDown className="w-4 h-4 text-slate-500" />
        </div>

        <div className={`p-4 rounded-2xl border ${
          isValid
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
              {isValid ? 'Merkle Root Match — Authenticity Guaranteed' : 'Root Hash Mismatch — Tampering Detected'}
            </span>
          </div>
          <div className="text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Computed Root:</span>
              <span className="font-bold break-all select-all">{computedRoot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Published Ledger Root:</span>
              <span className="font-bold break-all select-all">{expectedRoot}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
