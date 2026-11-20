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
    <div className="bg-white/85 border border-[#801336]/15 rounded-2xl p-6 text-[#2D142C] shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-[#801336]/10">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-5 h-5 text-[#EE4540]" />
          <h3 className="font-semibold text-sm sm:text-base text-[#2D142C]">Merkle Cryptographic Audit Path</h3>
        </div>
        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
          isValid
            ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/25'
            : 'bg-rose-500/10 text-[#C72C41] border-rose-500/25'
        }`}>
          {isValid ? 'Hash Chain Intact' : 'Chain Broken'}
        </span>
      </div>

      <div className="mt-6 space-y-4 font-mono text-xs">
        {/* Leaf Node */}
        <div className="bg-white border border-[#EE4540]/30 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="font-bold text-[#EE4540] uppercase tracking-wider text-[10px]">
              Level 0: Student Canonical Leaf
            </span>
            <span className="text-[10px] bg-[#EE4540]/15 text-[#C72C41] px-2 py-0.5 rounded-md font-bold">
              H_0
            </span>
          </div>
          <p className="break-all text-[#2D142C] select-all font-semibold">{leafHash}</p>
        </div>

        {/* Audit Steps */}
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="flex justify-center -my-1 text-slate-400">
              <ArrowDown className="w-4 h-4 text-[#C72C41] animate-bounce" />
            </div>

            <div className="bg-white/90 border border-slate-200 rounded-2xl p-4 mt-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="font-semibold text-[#510A32] uppercase tracking-wider text-[10px]">
                  Level {step.stepIndex}: Merkle Parent Node
                </span>
                <span className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                  Sibling Sourced: {step.position}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] mb-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Left Sibling:</span>
                  <span className="break-all text-slate-700 font-mono">{step.left.substring(0, 16)}...{step.left.substring(48)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Right Sibling:</span>
                  <span className="break-all text-slate-700 font-mono">{step.right.substring(0, 16)}...{step.right.substring(48)}</span>
                </div>
              </div>

              <div className="mt-1 pt-2 border-t border-slate-100">
                <span className="text-[10px] text-[#801336] font-medium">Computed Parent Hash = SHA256(Left + Right):</span>
                <p className="break-all text-[#C72C41] font-bold mt-0.5">{step.parent}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Root Node Comparison */}
        <div className="flex justify-center -my-1 text-slate-400">
          <ArrowDown className="w-4 h-4 text-[#C72C41]" />
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm ${
          isValid
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
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
