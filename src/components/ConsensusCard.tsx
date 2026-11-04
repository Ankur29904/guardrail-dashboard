import { motion, AnimatePresence } from 'framer-motion';
import { GitMerge, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';
import type { SimulationStage, Scenario_Data } from '../types';

interface ConsensusCardProps {
  stage: SimulationStage;
  data: Scenario_Data;
}

export function ConsensusCard({ stage, data }: ConsensusCardProps) {
  const isActive = stage === 'CONSENSUS' || stage === 'COMPLETED';
  const showTrace = isActive;

  return (
    <motion.div
      animate={{
        borderColor: isActive ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255,255,255,0.07)',
        boxShadow: isActive
          ? '0 0 40px rgba(56, 189, 248, 0.2), inset 0 1px 0 rgba(56, 189, 248, 0.1)'
          : 'none',
      }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 relative overflow-hidden"
    >
      {/* Background glow */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.06) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Funnel animation — inputs converging */}
      {stage === 'CONSENSUS' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute w-0.5 bg-gradient-to-b from-indigo-400/0 via-sky-400/50 to-sky-400/0"
              style={{
                left: `${20 + i * 20}%`,
                height: '60%',
                top: '20%',
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scaleY: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center relative">
              <GitMerge className="w-4 h-4 text-sky-400" />
              {stage === 'CONSENSUS' && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-sky-200">Consensus Manager</span>
              <div className="text-[9px] text-slate-500 font-mono">Llama 3.1 · State Machine Reducer</div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {stage === 'CONSENSUS' && (
              <motion.div
                key="resolving"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="badge-pill bg-sky-500/15 text-sky-400 border border-sky-500/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                RESOLVING
              </motion.div>
            )}
            {stage === 'COMPLETED' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`badge-pill border ${
                  data.mergeStatus === 'blocked'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {data.mergeStatus === 'blocked' ? '🔴 BLOCK' : '🟢 APPROVE'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trace log */}
        <AnimatePresence>
          {showTrace && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/40 rounded-lg p-3 border border-white/[0.05]"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Terminal className="w-3 h-3 text-slate-500" />
                <span className="section-label">Synthesis Trace</span>
              </div>
              <div className="space-y-1">
                {data.consensusTrace.map((trace, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 + 0.1 }}
                    className="font-mono text-[10px] flex items-start gap-1.5"
                  >
                    <span className="text-sky-500/60 mt-0.5 flex-shrink-0">›</span>
                    <span className={
                      trace.includes('BLOCK') ? 'text-rose-300' :
                      trace.includes('APPROVE') || trace.includes('PASS') ? 'text-emerald-300' :
                      trace.includes('CRITICAL') ? 'text-rose-400' :
                      'text-slate-400'
                    }>
                      {trace}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showTrace && (
          <div className="text-[10px] text-slate-600 font-mono py-2">
            Waiting for agent critiques to aggregate...
          </div>
        )}
      </div>
    </motion.div>
  );
}

