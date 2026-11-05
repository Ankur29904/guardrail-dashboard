import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Layers, Code2, Cpu, CheckCircle } from 'lucide-react';
import type { AgentStatus, SimulationStage, Scenario_Data } from '../types';

interface AgentMeshArenaProps {
  stage: SimulationStage;
  data: Scenario_Data;
}

const AGENTS = [
  {
    id: 'security',
    name: 'Security Sentinel',
    model: 'DeepSeek / Qwen 2.5',
    role: 'OWASP Top 10 · CVE Detection · CWE Mapping',
    icon: Shield,
    accentBorder: 'border-rose-700',
    accentText: 'text-rose-400',
    iconBg: 'bg-rose-950 text-rose-300 border border-rose-800',
    barColor: 'bg-rose-500',
  },
  {
    id: 'performance',
    name: 'Performance Critic',
    model: 'Qwen 2.5 Coder',
    role: 'Time/Space Complexity · N+1 DB Loops',
    icon: Zap,
    accentBorder: 'border-purple-700',
    accentText: 'text-purple-400',
    iconBg: 'bg-purple-950 text-purple-300 border border-purple-800',
    barColor: 'bg-purple-500',
  },
  {
    id: 'architect',
    name: 'Design Architect',
    model: 'Mistral 7B Instruct',
    role: 'SOLID Principles · Layering · Coupling',
    icon: Layers,
    accentBorder: 'border-emerald-700',
    accentText: 'text-emerald-400',
    iconBg: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
    barColor: 'bg-emerald-500',
  },
  {
    id: 'style',
    name: 'Style Compliance Officer',
    model: 'Ruff / ESLint Agent',
    role: 'Type Hints · PEP8 · DRY · Clean Code',
    icon: Code2,
    accentBorder: 'border-blue-700',
    accentText: 'text-blue-400',
    iconBg: 'bg-blue-950 text-blue-300 border border-blue-800',
    barColor: 'bg-blue-500',
  },
];

export function AgentMeshArena({ stage, data }: AgentMeshArenaProps) {
  const isDebating = stage === 'AGENT_DEBATING';
  const isCompleted = stage === 'COMPLETED';
  const showFindings = isCompleted;

  function getAgentStatus(_agentId: string): AgentStatus {
    if (stage === 'IDLE' || stage === 'INGESTING' || stage === 'SAST_SCANNING') return 'idle';
    if (isDebating) return 'evaluating';
    return 'done';
  }

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-sm">
      {/* Mesh Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#111827]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            LangGraph Multi-Agent Mesh
          </span>
        </div>

        <AnimatePresence mode="wait">
          {isDebating ? (
            <motion.span
              key="eval"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700 text-[10px] font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              PARALLEL DEBATE
            </motion.span>
          ) : isCompleted ? (
            <motion.span
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold"
            >
              <CheckCircle className="w-3 h-3 text-emerald-400" /> EVALUATION COMPLETE
            </motion.span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold">
              STANDBY
            </span>
          )}
        </AnimatePresence>
      </div>

      {/* Agents Stack */}
      <div className="p-3.5 space-y-3">
        {AGENTS.map((agent) => {
          const status = getAgentStatus(agent.id);
          const findings = data.agentFindings[agent.id];
          const isDone = status === 'done';

          return (
            <div
              key={agent.id}
              className={`rounded-lg p-3 bg-[#111827] border transition-colors ${
                status === 'evaluating'
                  ? 'border-blue-500'
                  : isDone
                  ? agent.accentBorder
                  : 'border-slate-800'
              }`}
            >
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${agent.iconBg}`}>
                    <agent.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{agent.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        ({agent.model})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">{agent.role}</div>
                  </div>
                </div>

                {/* Status or Confidence */}
                <div>
                  {status === 'evaluating' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-400 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      Analyzing...
                    </span>
                  )}
                  {isDone && findings && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-[#0B1120] px-2 py-0.5 rounded border border-slate-800">
                        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${agent.barColor}`}
                            style={{ width: `${findings.confidence}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-300">
                          {findings.confidence}%
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded text-white ${
                          findings.severity === 'critical'
                            ? 'bg-red-600'
                            : findings.severity === 'high'
                            ? 'bg-amber-600'
                            : findings.severity === 'medium'
                            ? 'bg-yellow-600 text-slate-900 font-bold'
                            : 'bg-emerald-600'
                        }`}
                      >
                        {findings.severity.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {status === 'idle' && (
                    <span className="text-[10px] text-slate-500 font-mono">Standby</span>
                  )}
                </div>
              </div>

              {/* Findings Bullets */}
              {showFindings && findings && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 font-mono text-[11px] space-y-1">
                  {findings.findings.map((item, fIdx) => (
                    <div
                      key={fIdx}
                      className={`flex items-start gap-1.5 ${
                        item.startsWith('CRITICAL')
                          ? 'text-rose-300 font-bold'
                          : item.startsWith('HIGH')
                          ? 'text-amber-300'
                          : item.startsWith('PASS')
                          ? 'text-emerald-300'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="text-slate-500 flex-shrink-0">›</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
