import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, GitPullRequest, Radio } from 'lucide-react';
import type { Scenario, SimulationStage } from '../types';

interface DashboardHeaderProps {
  scenario: Scenario;
  onScenarioChange: (s: Scenario) => void;
  stage: SimulationStage;
  onSimulate: () => void;
  onReset: () => void;
}

export function DashboardHeader({
  scenario,
  onScenarioChange,
  stage,
  onSimulate,
  onReset,
}: DashboardHeaderProps) {
  const isRunning = stage !== 'IDLE' && stage !== 'COMPLETED';
  const isCompleted = stage === 'COMPLETED';

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-[#070B14]/80 backdrop-blur-2xl border-b border-white/[0.06]" />

      <div className="relative flex items-center justify-between gap-4 px-6 py-3">
        {/* ── Brand ── */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            {/* Animated radar dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider text-white text-glow-cyan">
                GUARDRAIL<span className="text-cyan-400">.AI</span>
              </span>
              <span className="badge-pill bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.1
              </span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-wider hidden sm:block">
              Hybrid SAST + Agentic CI/CD Guardrail
            </p>
          </div>
        </div>

        {/* ── Scenario Switcher ── */}
        <div className="flex-1 flex justify-center">
          <div className="glass-panel-sm flex items-center gap-1 p-1 rounded-xl">
            <ScenarioBtn
              active={scenario === 'vulnerable'}
              label="PR #104: Auth & SQL Query"
              sub="SQL Injection + Exposed Secret"
              color="rose"
              onClick={() => onScenarioChange('vulnerable')}
            />
            <ScenarioBtn
              active={scenario === 'clean'}
              label="PR #105: Refactor Caching Layer"
              sub="Passing · Optimal Performance"
              color="emerald"
              onClick={() => onScenarioChange('clean')}
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Gateway status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono tracking-wide">
              :8000 · HMAC-SHA256
            </span>
          </div>

          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.button
                key="reset"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onReset}
                className="btn-secondary text-xs"
              >
                <Radio className="w-3.5 h-3.5" />
                Reset
              </motion.button>
            ) : (
              <motion.button
                key="simulate"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onSimulate}
                disabled={isRunning}
                className="btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Simulate PR Webhook
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function ScenarioBtn({
  active,
  label,
  sub,
  color,
  onClick,
}: {
  active: boolean;
  label: string;
  sub: string;
  color: 'rose' | 'emerald';
  onClick: () => void;
}) {
  const colorMap = {
    rose: {
      active: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
      dot: 'bg-rose-400',
    },
    emerald: {
      active: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
      dot: 'bg-emerald-400',
    },
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-left
        ${active
          ? `${colorMap[color].active} shadow-sm`
          : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
        }`}
    >
      <GitPullRequest className={`w-3.5 h-3.5 flex-shrink-0 ${active ? '' : 'opacity-50'}`} />
      <div className="min-w-0">
        <div className="text-[11px] font-semibold truncate max-w-[160px]">{label}</div>
        <div className="text-[9px] opacity-60 tracking-wide truncate max-w-[160px]">{sub}</div>
      </div>
      {active && <span className={`w-1.5 h-1.5 rounded-full ${colorMap[color].dot} flex-shrink-0 animate-pulse`} />}
    </button>
  );
}

