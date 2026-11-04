import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, AlertTriangle, TreePine, Scan } from 'lucide-react';
import type { SastFinding, Scenario_Data, SimulationStage } from '../types';

interface SastPanelProps {
  data: Scenario_Data;
  stage: SimulationStage;
}

export function SastPanel({ data, stage }: SastPanelProps) {
  const [astExpanded, setAstExpanded] = useState(false);
  const isScanning = stage === 'SAST_SCANNING' || stage === 'AGENT_DEBATING' || stage === 'CONSENSUS' || stage === 'COMPLETED';
  const showFindings = stage === 'AGENT_DEBATING' || stage === 'CONSENSUS' || stage === 'COMPLETED';
  const hasFindings = data.sastFindings.length > 0;

  return (
    <div className="space-y-3">
      {/* SAST Status Header */}
      <div className={`glass-panel p-4 relative overflow-hidden transition-all duration-700 ${
        isScanning ? 'border-amber-500/30 glow-amber' : 'border-white/[0.07]'
      }`}>
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -inset-1 opacity-5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl" />
          </div>
        )}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center">
                <Scan className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-xs font-semibold text-white">Shift-Left SAST Pre-Filter</span>
            </div>
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`badge-pill ${
                    hasFindings
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  } border`}
                >
                  {stage === 'SAST_SCANNING' ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" /> SCANNING</>
                  ) : hasFindings ? (
                    '⚠ FINDINGS DETECTED'
                  ) : (
                    '✓ CLEAN PASS'
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="badge-pill bg-slate-800 text-slate-500 border border-slate-700"
                >
                  AWAITING
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tool badges */}
          <div className="flex flex-wrap gap-2">
            {['Semgrep', 'Bandit', 'Tree-sitter AST'].map((tool, i) => (
              <ToolBadge
                key={tool}
                name={tool}
                active={isScanning}
                delay={i * 0.15}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Findings */}
      <AnimatePresence>
        {showFindings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            {hasFindings ? (
              data.sastFindings.map((f, i) => (
                <FindingCard key={i} finding={f} index={i} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel-sm p-3 border-emerald-500/20"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-xs text-emerald-300 font-semibold">No security findings detected</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 ml-5">
                  Semgrep · Bandit · Tree-sitter all returned clean — 0 findings
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AST Node Tree */}
      <div className="glass-panel-sm border border-white/[0.05]">
        <button
          onClick={() => setAstExpanded(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors rounded-xl"
        >
          <div className="flex items-center gap-2">
            <TreePine className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Tree-sitter AST Analysis</span>
            <span className="badge-pill bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {data.astNodes.length} nodes
            </span>
          </div>
          {astExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        <AnimatePresence>
          {astExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/[0.04] px-4 py-3"
            >
              <div className="font-mono text-[10px] space-y-0.5">
                {data.astNodes.map((node, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`${node.includes('⚠') ? 'text-amber-300' : node.includes('✓') ? 'text-emerald-300' : 'text-slate-400'}`}
                  >
                    {node}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ToolBadge({ name, active, delay }: { name: string; active: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: active ? 1 : 0.3 }}
      transition={{ delay, duration: 0.3 }}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all duration-500 ${
        active
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-slate-800/60 border-slate-700/40 text-slate-500'
      }`}
    >
      {active && <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />}
      {name}
    </motion.div>
  );
}

function FindingCard({ finding, index }: { finding: SastFinding; index: number }) {
  const isCritical = finding.severity === 'CRITICAL';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.3 }}
      className={`glass-panel-sm p-3 border ${
        isCritical ? 'border-rose-500/30 bg-rose-500/5' : 'border-amber-500/20 bg-amber-500/5'
      }`}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-1.5 mb-1">
            <span className={`badge-pill border ${isCritical
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
              [{finding.severity}]
            </span>
            {finding.cwe && (
              <span className="badge-pill bg-slate-800 text-slate-400 border border-slate-700">
                {finding.cwe}
              </span>
            )}
            <span className="badge-pill bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {finding.tool}
            </span>
          </div>
          <p className={`text-[11px] font-semibold ${isCritical ? 'text-rose-200' : 'text-amber-200'}`}>
            {finding.message}
          </p>
          {finding.line && (
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              Line {finding.line} · {finding.rule}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

