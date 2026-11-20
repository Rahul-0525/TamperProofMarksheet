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
    <div className="floating-action-card p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-5 h-5 text-[#fbbf24]" />
          <h3 className="font-semibold text-sm sm:text-base text-white">Merkle Cryptographic Audit Path</h3>
        </div>
        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
          isValid
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        }`}>
          {isValid ? 'Hash Chain Intact' : 'Chain Broken'}
        </span>
      </div>

      <div className="mt-6 space-y-4 font-mono text-xs">
        {/* Leaf Node */}
        <div className="inset-pill-field p-4">
          <div className="flex items-center justify-between text-pine-300 mb-1.5">
            <span className="font-bold text-[#fbbf24] uppercase tracking-wider text-[10px]">
              Level 0: Student Canonical Leaf
            </span>
            <span className="text-[10px] bg-[#fbbf24]/20 text-[#fbbf24] px-2 py-0.5 rounded-full font-bold">
              H_0
            </span>
          </div>
          <p className="break-all text-white select-all font-semibold">{leafHash}</p>
        </div>

        {/* Audit Steps */}
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="flex justify-center -my-1 text-pine-400">
              <ArrowDown className="w-4 h-4 text-[#fbbf24] animate-bounce" />
            </div>

            <div className="inset-pill-field p-4 mt-2">
              <div className="flex items-center justify-between text-pine-300 mb-2">
                <span className="font-semibold text-white uppercase tracking-wider text-[10px]">
                  Level {step.stepIndex}: Merkle Parent Node
                </span>
                <span className="text-[9px] bg-white/[0.08] text-pine-200 px-2 py-0.5 rounded-full font-bold uppercase">
                  Sibling Sourced: {step.position}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] mb-2 bg-black/40 p-2.5 rounded-xl border border-white/[0.05]">
                <div>
                  <span className="text-pine-400 block text-[9px] uppercase">Left Sibling:</span>
                  <span className="break-all text-pine-200 font-mono">{step.left.substring(0, 16)}...{step.left.substring(48)}</span>
                </div>
                <div>
                  <span className="text-pine-400 block text-[9px] uppercase">Right Sibling:</span>
                  <span className="break-all text-pine-200 font-mono">{step.right.substring(0, 16)}...{step.right.substring(48)}</span>
                </div>
              </div>

              <div className="mt-1 pt-2 border-t border-white/[0.06]">
                <span className="text-[10px] text-[#fbbf24] font-medium">Computed Parent Hash = SHA256(Left + Right):</span>
                <p className="break-all text-white font-bold mt-0.5">{step.parent}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Root Node Comparison */}
        <div className="flex justify-center -my-1 text-pine-400">
          <ArrowDown className="w-4 h-4 text-[#fbbf24]" />
        </div>

        <div className={`p-4 rounded-2xl border shadow-inner ${
          isValid
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              {isValid ? 'Verified Reconstructed Root' : 'Discrepant Recomputed Root'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold">
              {isValid ? 'MATCH' : 'MISMATCH'}
            </span>
          </div>
          <p className="break-all font-bold select-all">{computedRoot}</p>
        </div>
      </div>
    </div>
  );
};
