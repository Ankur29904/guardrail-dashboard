import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitMerge, Lock, Unlock, AlertOctagon, CheckCircle2 } from 'lucide-react';
import type { SimulationStage, Scenario_Data } from '../types';

interface MergeGateBoxProps {
  stage: SimulationStage;
  data: Scenario_Data;
}

export function MergeGateBox({ stage, data }: MergeGateBoxProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const isCompleted = stage === 'COMPLETED';
  const isBlocked = data.mergeStatus === 'blocked';

  useEffect(() => {
    if (isCompleted && !isBlocked) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3500);
      return () => clearTimeout(t);
    }
  }, [isCompleted, isBlocked]);

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg overflow-hidden shadow-sm relative">
      {/* Confetti Particles */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-xs"
                style={{
                  left: `${(i * 3.3) % 100}%`,
                  top: '-8px',
                  backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'][i % 5],
                }}
                animate={{
                  y: [0, 260],
                  rotate: [0, 360],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2 + (i % 3) * 0.4,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#111827]">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            GitHub Commit Status Gate
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded">
          CI/CD Policy
        </span>
      </div>

      <div className="p-4">
        {!isCompleted ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
              <GitMerge className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-300">Merge Gate Pending</div>
            <div className="text-[11px] text-slate-500 font-mono">
              Waiting for LangGraph multi-agent consensus decision...
            </div>
          </div>
        ) : isBlocked ? (
          <div className="space-y-3">
            {/* Red Alert Banner */}
            <div className="flex items-center gap-3 p-3.5 bg-[#2A0E13] rounded-lg border border-rose-800">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Merge Blocked by GuardRail</div>
                <div className="text-[11px] text-rose-300 mt-0.5">
                  1 Critical CWE-89 Vulnerability & Hardcoded Secret detected.
                </div>
              </div>
            </div>

            {/* Check Matrix */}
            <div className="space-y-1.5 font-mono text-[11px]">
              <CheckRow label="guardrail / security-sentinel" status="FAILURE" detail="CWE-89 SQLi + CWE-798 Secret" />
              <CheckRow label="guardrail / performance-critic" status="WARNING" detail="N+1 Query Pattern Loop" />
              <CheckRow label="guardrail / design-architect" status="WARNING" detail="SRP Violation in Auth Handler" />
              <CheckRow label="guardrail / style-compliance" status="SUCCESS" detail="PEP8 & Type Hints Passed" />
            </div>

            {/* Blocked Merge Button */}
            <div className="flex items-center justify-between p-2.5 bg-[#0B1120] rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <Lock className="w-4 h-4 text-rose-500" />
                <span>Protected Branch Locked</span>
              </div>
              <button
                disabled
                className="px-3.5 py-1.5 bg-slate-800 text-slate-500 border border-slate-700 text-xs font-bold rounded cursor-not-allowed"
              >
                Merge pull request
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Green Success Banner */}
            <div className="flex items-center gap-3 p-3.5 bg-[#062419] rounded-lg border border-emerald-800">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">All Checks Have Passed</div>
                <div className="text-[11px] text-emerald-300 mt-0.5">
                  0 vulnerabilities • Branch is verified safe to merge.
                </div>
              </div>
            </div>

            {/* Check Matrix */}
            <div className="space-y-1.5 font-mono text-[11px]">
              <CheckRow label="guardrail / security-sentinel" status="SUCCESS" detail="Clean Pass · No OWASP Flaws" />
              <CheckRow label="guardrail / performance-critic" status="SUCCESS" detail="O(1) Redis Lookup Optimal" />
              <CheckRow label="guardrail / design-architect" status="SUCCESS" detail="SOLID Principles Respected" />
              <CheckRow label="guardrail / style-compliance" status="SUCCESS" detail="Full Typing & Docstrings" />
            </div>

            {/* Active Merge Button */}
            <div className="flex items-center justify-between p-2.5 bg-[#0B1120] rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Unlock className="w-4 h-4 text-emerald-500" />
                <span>Ready to Merge</span>
              </div>
              <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
                <span>✓</span>
                <span>Merge pull request</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckRow({
  label,
  status,
  detail,
}: {
  label: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  detail: string;
}) {
  const badgeStyle = {
    SUCCESS: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    FAILURE: 'bg-rose-950 text-rose-300 border-rose-800',
    WARNING: 'bg-amber-950 text-amber-300 border-amber-800',
  }[status];

  return (
    <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#0B1120] rounded border border-slate-800/80">
      <div className="min-w-0 pr-2">
        <div className="text-slate-200 font-semibold truncate">{label}</div>
        <div className="text-[10px] text-slate-500 truncate">{detail}</div>
      </div>
      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border flex-shrink-0 ${badgeStyle}`}>
        {status}
      </span>
    </div>
  );
}
