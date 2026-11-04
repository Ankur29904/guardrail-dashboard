import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitMerge, Lock, Unlock, AlertOctagon, CheckCircle2, Sparkles } from 'lucide-react';
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
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isCompleted, isBlocked]);

  return (
    <div className={`glass-panel relative overflow-hidden transition-all duration-700 ${
      !isCompleted ? 'border-white/[0.07]' :
      isBlocked ? 'border-rose-500/40 glow-rose' : 'border-emerald-500/40 glow-emerald'
    }`}>
      {/* Background gradient */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isBlocked
              ? 'radial-gradient(ellipse at center, rgba(244,63,94,0.06) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(16,185,129,0.06) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Confetti particles */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-4px',
                  backgroundColor: ['#06b6d4', '#10b981', '#38bdf8', '#a3e635', '#fbbf24'][i % 5],
                }}
                animate={{
                  y: [0, 200 + Math.random() * 100],
                  x: [0, (Math.random() - 0.5) * 60],
                  rotate: [0, Math.random() * 360],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 1,
                  delay: Math.random() * 0.5,
                  ease: 'easeIn',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center ${
            !isCompleted ? 'bg-slate-800' :
            isBlocked ? 'bg-rose-500/15' : 'bg-emerald-500/15'
          }`}>
            <GitMerge className={`w-3.5 h-3.5 ${
              !isCompleted ? 'text-slate-500' :
              isBlocked ? 'text-rose-400' : 'text-emerald-400'
            }`} />
          </div>
          <span className="text-xs font-semibold text-white">GitHub Commit Status Gate</span>
        </div>
        <span className="section-label">CI/CD Guardrail</span>
      </div>

      <div className="p-5 relative">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="pending"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-3 py-6"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                <GitMerge className="w-6 h-6 text-slate-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-500">Merge Gate Pending</p>
                <p className="text-[10px] text-slate-700 mt-1">Awaiting audit completion...</p>
              </div>
              <div className="flex gap-1.5">
                <div className="h-1 w-16 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-slate-600 rounded-full animate-pulse" />
                </div>
              </div>
            </motion.div>
          ) : isBlocked ? (
            <motion.div
              key="blocked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Status indicator */}
              <div className="flex items-center gap-3 p-4 bg-rose-500/10 rounded-xl border border-rose-500/30">
                <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center flex-shrink-0">
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-300">Merge Blocked by Guardrail</div>
                  <div className="text-[10px] text-rose-500/80 mt-0.5">
                    1 Critical Vulnerability must be resolved before merge
                  </div>
                </div>
              </div>

              {/* Check statuses */}
              <div className="space-y-2">
                <CheckRow icon="🔴" label="guardrail-ai / security-scan" status="FAILURE" note="SQL Injection + Hardcoded Secret" />
                <CheckRow icon="🟠" label="guardrail-ai / performance-audit" status="WARNING" note="N+1 Query Pattern detected" />
                <CheckRow icon="🟡" label="guardrail-ai / architecture-review" status="WARNING" note="SRP violation · medium risk" />
                <CheckRow icon="🟢" label="guardrail-ai / style-compliance" status="SUCCESS" note="All style checks passed" />
              </div>

              {/* Blocked merge button */}
              <motion.div
                className="flex items-center justify-between p-3 bg-rose-500/10 rounded-xl border border-rose-500/30"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-rose-300">Branch cannot be merged</span>
                </div>
                <div className="px-4 py-1.5 bg-rose-500/20 rounded-lg border border-rose-500/40 text-xs text-rose-400 font-semibold cursor-not-allowed opacity-70">
                  Merge pull request
                </div>
              </motion.div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 justify-center">
                <span className="w-4 h-px bg-slate-700" />
                Changes requested by <code className="text-rose-400/70">guardrail-ai[bot]</code>
                <span className="w-4 h-px bg-slate-700" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="approved"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Status indicator */}
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-300">All Checks Passed</div>
                  <div className="text-[10px] text-emerald-500/80 mt-0.5">
                    Branch is clean and ready to merge
                  </div>
                </div>
              </div>

              {/* Check statuses */}
              <div className="space-y-2">
                <CheckRow icon="🟢" label="guardrail-ai / security-scan" status="SUCCESS" note="No vulnerabilities detected" />
                <CheckRow icon="🟢" label="guardrail-ai / performance-audit" status="SUCCESS" note="O(1) complexity · clean patterns" />
                <CheckRow icon="🟢" label="guardrail-ai / architecture-review" status="SUCCESS" note="SOLID principles respected" />
                <CheckRow icon="🟢" label="guardrail-ai / style-compliance" status="SUCCESS" note="Full type hints · docstrings present" />
              </div>

              {/* Active merge button */}
              <motion.div
                className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">Branch ready to merge</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-1.5 bg-emerald-500/80 hover:bg-emerald-500 rounded-lg border border-emerald-400/40 text-xs text-white font-semibold transition-colors flex items-center gap-1.5"
                  style={{ boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}
                >
                  <Sparkles className="w-3 h-3" />
                  Merge pull request
                </motion.button>
              </motion.div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 justify-center">
                <span className="w-4 h-px bg-slate-700" />
                Approved by <code className="text-emerald-400/70">guardrail-ai[bot]</code>
                <span className="w-4 h-px bg-slate-700" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CheckRow({ icon, label, status, note }: {
  icon: string;
  label: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  note: string;
}) {
  const statusStyle = {
    SUCCESS: 'text-emerald-400',
    FAILURE: 'text-rose-400',
    WARNING: 'text-amber-400',
  }[status];

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-black/20 rounded-lg border border-white/[0.04]">
      <span className="text-sm flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-mono text-slate-300 truncate">{label}</div>
        <div className="text-[9px] text-slate-500 truncate">{note}</div>
      </div>
      <span className={`text-[9px] font-bold tracking-wide ${statusStyle} flex-shrink-0`}>{status}</span>
    </div>
  );
}

