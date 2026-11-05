import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, AlertOctagon, TreePine, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { SastFinding, Scenario_Data, SimulationStage } from '../types';

interface SastPanelProps {
  data: Scenario_Data;
  stage: SimulationStage;
}

export function SastPanel({ data, stage }: SastPanelProps) {
  const [astExpanded, setAstExpanded] = useState(false);
  const isScanning = stage === 'SAST_SCANNING';
  const showFindings = stage === 'AGENT_DEBATING' || stage === 'CONSENSUS' || stage === 'COMPLETED';
  const hasFindings = data.sastFindings.length > 0;

  return (
    <div className="space-y-3">
      {/* SAST Pre-Filter Status Card */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              Deterministic Rule Engine
            </span>
          </div>

          {/* Dynamic Status Badge */}
          <div>
            {isScanning ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                AST SCANNING
              </span>
            ) : showFindings ? (
              hasFindings ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 text-[10px] font-bold">
                  <span>⚠</span> {data.sastFindings.length} FINDINGS DETECTED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 0 FINDINGS (CLEAN)
                </span>
              )
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold">
                STANDBY
              </span>
            )}
          </div>
        </div>

        {/* Static Analysis Tools Matrix */}
        <div className="flex flex-wrap gap-2 pt-1">
          {['Semgrep Rules', 'Bandit Security', 'Tree-sitter AST', 'Ruff Linter'].map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 rounded bg-[#0B1120] border border-slate-800 text-slate-300 font-mono text-[10px] font-semibold flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <AnimatePresence>
        {showFindings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {hasFindings ? (
              data.sastFindings.map((finding, idx) => (
                <FindingItem key={idx} finding={finding} index={idx} />
              ))
            ) : (
              <div className="bg-[#062017] border border-emerald-800 rounded-lg p-3 text-xs text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Deterministic Pre-Filter Passed (0 Alerts)
                </div>
                <p className="text-[11px] text-emerald-400/80 mt-1 ml-6">
                  Bandit AST rules and Semgrep patterns found zero OWASP Top 10 vulnerabilities in this diff.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tree-sitter AST Nodes Hierarchy (Collapsible) */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => setAstExpanded(!astExpanded)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#111827] hover:bg-slate-800/80 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <TreePine className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-slate-200">Tree-sitter AST Hierarchy</span>
            <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
              {data.astNodes.length} Nodes
            </span>
          </div>
          {astExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <AnimatePresence>
          {astExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-[#070B14] border-t border-slate-800 font-mono text-[11px] space-y-1"
            >
              {data.astNodes.map((node, idx) => (
                <div
                  key={idx}
                  className={`py-0.5 ${
                    node.includes('⚠')
                      ? 'text-amber-300 font-bold'
                      : node.includes('✓')
                      ? 'text-emerald-300'
                      : 'text-slate-400'
                  }`}
                >
                  {node}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FindingItem({ finding }: { finding: SastFinding; index: number }) {
  const isCrit = finding.severity === 'CRITICAL';

  return (
    <div
      className={`rounded-lg p-3 border ${
        isCrit
          ? 'bg-[#181119] border-rose-800/80'
          : 'bg-[#1A1610] border-amber-800/80'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <AlertOctagon
          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
            isCrit ? 'text-red-400' : 'text-amber-400'
          }`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded text-white ${
                isCrit ? 'bg-red-600' : 'bg-amber-600'
              }`}
            >
              {finding.severity}
            </span>
            {finding.cwe && (
              <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                {finding.cwe}
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400">
              Tool: <strong className="text-slate-300">{finding.tool}</strong>
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-100 leading-snug">
            {finding.message}
          </p>

          {finding.line && (
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Location: Line {finding.line} • Rule: <code className="text-amber-300">{finding.rule}</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
