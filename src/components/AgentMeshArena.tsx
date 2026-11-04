import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Layers, Code2, Cpu } from 'lucide-react';
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
    color: 'rose' as const,
    textClass: 'text-rose-300',
    bgClass: 'bg-rose-500/10',
    borderActive: 'border-rose-500/40',
    borderIdle: 'border-white/[0.07]',
    glowClass: 'glow-rose',
    gradFrom: 'from-rose-500/20',
    gradTo: 'to-red-600/5',
  },
  {
    id: 'performance',
    name: 'Performance Critic',
    model: 'Qwen 2.5 Coder',
    role: 'Complexity · N+1 Queries · Memory Profiling',
    icon: Zap,
    color: 'violet' as const,
    textClass: 'text-violet-300',
    bgClass: 'bg-violet-500/10',
    borderActive: 'border-violet-500/40',
    borderIdle: 'border-white/[0.07]',
    glowClass: 'glow-violet',
    gradFrom: 'from-violet-500/20',
    gradTo: 'to-purple-600/5',
  },
  {
    id: 'architect',
    name: 'Design Architect',
    model: 'Mistral 7B',
    role: 'SOLID Principles · DDD · Modular Layering',
    icon: Layers,
    color: 'emerald' as const,
    textClass: 'text-emerald-300',
    bgClass: 'bg-emerald-500/10',
    borderActive: 'border-emerald-500/40',
    borderIdle: 'border-white/[0.07]',
    glowClass: 'glow-emerald',
    gradFrom: 'from-emerald-500/20',
    gradTo: 'to-green-600/5',
  },
  {
    id: 'style',
    name: 'Style Compliance Officer',
    model: 'Ruff / ESLint Agent',
    role: 'Typing · DRY · Naming Conventions · PEP8',
    icon: Code2,
    color: 'sky' as const,
    textClass: 'text-sky-300',
    bgClass: 'bg-sky-500/10',
    borderActive: 'border-sky-500/40',
    borderIdle: 'border-white/[0.07]',
    glowClass: 'glow-cyan',
    gradFrom: 'from-sky-500/20',
    gradTo: 'to-blue-600/5',
  },
];

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  low: 'bg-slate-700 text-slate-400 border-slate-600',
  pass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

export function AgentMeshArena({ stage, data }: AgentMeshArenaProps) {
  const isDebating = stage === 'AGENT_DEBATING';
  const isConsensus = stage === 'CONSENSUS';
  const isCompleted = stage === 'COMPLETED';
  const showFindings = isCompleted;

  function getAgentStatus(_agentId: string): AgentStatus {
    if (stage === 'IDLE' || stage === 'INGESTING' || stage === 'SAST_SCANNING') return 'idle';
    if (isDebating) return 'evaluating';
    return 'done';
  }

  return (
    <div className="glass-panel overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-500/10 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white">LangGraph Parallel Mesh</span>
            <div className="text-[10px] text-slate-500 tracking-wider">Multi-Agent Orchestration Arena</div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {isDebating && (
            <motion.div
              key="debating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 badge-pill bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              PARALLEL EVAL
            </motion.div>
          )}
          {(isConsensus || isCompleted) && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="badge-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            >
              ✓ MESH COMPLETE
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated dataflow wire between agents */}
      {isDebating && (
        <div className="relative h-1 bg-gradient-to-r from-rose-500/0 via-indigo-500/40 to-emerald-500/0 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Agent grid */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {AGENTS.map((agent, i) => {
          const status = getAgentStatus(agent.id);
          const findings = data.agentFindings[agent.id];
          const isActive = status === 'evaluating' || status === 'done';

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`agent-card border relative ${isActive ? agent.borderActive : agent.borderIdle} ${isActive && status === 'evaluating' ? agent.glowClass : ''}`}
            >
              {/* Background gradient when active */}
              {isActive && (
                <div className={`absolute inset-0 opacity-[0.04] bg-gradient-to-br ${agent.gradFrom} ${agent.gradTo} rounded-xl pointer-events-none`} />
              )}

              {/* Shimmer overlay while evaluating */}
              {status === 'evaluating' && (
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              )}

              <div className="relative">
                {/* Agent header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${agent.bgClass} flex items-center justify-center`}>
                      <agent.icon className={`w-4 h-4 ${agent.textClass}`} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${agent.textClass}`}>{agent.name}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{agent.model}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {status === 'evaluating' && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-current rounded-full animate-spin" style={{ color: agent.textClass }}/>
                        <span className="text-[9px] text-slate-400 font-mono">EVALUATING</span>
                      </div>
                    )}
                    {status === 'done' && findings && (
                      <div className="flex items-center gap-2">
                        <ConfidenceBar value={findings.confidence} color={agent.color} />
                        <span className={`badge-pill border ${SEVERITY_BADGE[findings.severity]}`}>
                          {findings.severity.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {status === 'idle' && (
                      <span className="badge-pill bg-slate-800 text-slate-600 border border-slate-700">STANDBY</span>
                    )}
                  </div>
                </div>

                {/* Role label */}
                <div className="text-[9px] text-slate-600 tracking-wide mb-2 ml-9">{agent.role}</div>

                {/* Findings list */}
                <AnimatePresence>
                  {showFindings && findings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      className="ml-9 space-y-1"
                    >
                      {findings.findings.map((f, fi) => (
                        <motion.div
                          key={fi}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: fi * 0.08 }}
                          className={`text-[10px] font-mono ${
                            f.startsWith('CRITICAL') ? 'text-rose-300' :
                            f.startsWith('HIGH') ? 'text-orange-300' :
                            f.startsWith('MEDIUM') ? 'text-amber-300' :
                            f.startsWith('PASS') ? 'text-emerald-400' :
                            f.startsWith('INFO') || f.startsWith('LOW') ? 'text-slate-400' :
                            'text-slate-300'
                          }`}
                        >
                          <span className="opacity-40 mr-1">›</span>{f}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {status === 'evaluating' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-9"
                    >
                      <TypingIndicator color={agent.textClass} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  const colorBar: Record<string, string> = {
    rose: 'bg-rose-400',
    violet: 'bg-violet-400',
    emerald: 'bg-emerald-400',
    sky: 'bg-sky-400',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorBar[color] || 'bg-cyan-400'}`}
        />
      </div>
      <span className="text-[9px] text-slate-400 font-mono">{value}%</span>
    </div>
  );
}

function TypingIndicator({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className={`w-1 h-1 rounded-full ${color.replace('text-', 'bg-').replace('300', '400')}`}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          style={{ backgroundColor: 'currentColor' }}
        />
      ))}
      <span className="text-[9px] text-slate-500 ml-1 font-mono">analyzing code...</span>
    </div>
  );
}

