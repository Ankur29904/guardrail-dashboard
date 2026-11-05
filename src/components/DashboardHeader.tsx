import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Zap, GitPullRequest, RotateCcw } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full bg-[#0F172A] border-b border-slate-800 shadow-md">
      <div className="flex items-center justify-between gap-4 px-6 py-2.5">

        {/* ── Brand ── */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider text-white">
                GUARDRAIL<span className="text-blue-400">.AI</span>
              </span>
              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                v2.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Multi-Agent AI Code Reviewer & CI/CD Guardrail
            </p>
          </div>
        </div>

        {/* ── Scenario Switcher (Solid & User-Friendly) ── */}
        <div className="flex items-center bg-[#0B1120] p-1 rounded-lg border border-slate-800 gap-1.5">
          <ScenarioButton
            isActive={scenario === 'vulnerable'}
            prNumber="#104"
            title="Vulnerable Auth & SQL PR"
            subtitle="CWE-89 SQLi + Secret Leak"
            theme="rose"
            onClick={() => onScenarioChange('vulnerable')}
          />
          <ScenarioButton
            isActive={scenario === 'clean'}
            prNumber="#105"
            title="Clean Cache & AST PR"
            subtitle="Optimal O(1) · Passing Guardrail"
            theme="emerald"
            onClick={() => onScenarioChange('clean')}
          />
        </div>

        {/* ── Actions & Gateway Status ── */}
        <div className="flex items-center gap-3">
          {/* Gateway Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1120] border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-mono text-[11px]">
              Port 8000 · HMAC-SHA256
            </span>
          </div>

          {/* Trigger or Reset Button */}
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.button
                key="reset"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={onReset}
                className="btn-secondary flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                Reset Demo
              </motion.button>
            ) : (
              <motion.button
                key="simulate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={onSimulate}
                disabled={isRunning}
                className="btn-primary flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Auditing Payload...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
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

function ScenarioButton({
  isActive,
  prNumber,
  title,
  subtitle,
  theme,
  onClick,
}: {
  isActive: boolean;
  prNumber: string;
  title: string;
  subtitle: string;
  theme: 'rose' | 'emerald';
  onClick: () => void;
}) {
  const activeStyles = {
    rose: 'bg-rose-900/90 border-rose-500 text-white shadow-sm',
    emerald: 'bg-emerald-900/90 border-emerald-500 text-white shadow-sm',
  }[theme];

  const inactiveStyles =
    'bg-[#0F172A] border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md border text-left transition-all ${
        isActive ? activeStyles : inactiveStyles
      }`}
    >
      <GitPullRequest className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold">{prNumber}: {title}</span>
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
          )}
        </div>
        <div className="text-[10px] opacity-75 font-mono truncate">{subtitle}</div>
      </div>
    </button>
  );
}
