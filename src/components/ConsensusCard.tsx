import { motion } from 'framer-motion';
import { GitMerge, Terminal, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { SimulationStage, Scenario_Data } from '../types';

interface ConsensusCardProps {
  stage: SimulationStage;
  data: Scenario_Data;
}

export function ConsensusCard({ stage, data }: ConsensusCardProps) {
  const isActive = stage === 'CONSENSUS' || stage === 'COMPLETED';
  const showTrace = isActive;

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
            <GitMerge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Consensus Manager</span>
              <span className="text-[10px] font-mono text-blue-300 bg-blue-950 px-1.5 py-0.2 rounded border border-blue-800">
                Llama 3.1
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              State Machine Conflict Reducer
            </div>
          </div>
        </div>

        <div>
          {stage === 'CONSENSUS' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              RESOLVING...
            </span>
          )}
          {stage === 'COMPLETED' && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold text-white shadow-sm ${
                data.mergeStatus === 'blocked' ? 'bg-red-600' : 'bg-emerald-600'
              }`}
            >
              {data.mergeStatus === 'blocked' ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  GATE BLOCKED
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  GATE APPROVED
                </>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Synthesis Trace Terminal Window */}
      {showTrace ? (
        <div className="bg-[#070B14] border border-slate-800 rounded-lg p-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px] font-bold">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>ARBITRATION SYNTHESIS TRACE</span>
          </div>

          <div className="space-y-1">
            {data.consensusTrace.map((trace, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2 leading-relaxed"
              >
                <span className="text-blue-500 font-bold">›</span>
                <span
                  className={
                    trace.includes('BLOCK')
                      ? 'text-rose-400 font-bold'
                      : trace.includes('APPROVE') || trace.includes('PASSED')
                      ? 'text-emerald-400 font-bold'
                      : trace.includes('CRITICAL')
                      ? 'text-rose-300 font-semibold'
                      : 'text-slate-300'
                  }
                >
                  {trace}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#070B14] border border-slate-800 rounded-lg p-3 text-center text-xs text-slate-500 font-mono py-4">
          Awaiting agent evaluation inputs to synthesize consensus...
        </div>
      )}
    </div>
  );
}
