import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from './components/DashboardHeader';
import { MetricsStrip } from './components/MetricsStrip';
import { DiffViewer } from './components/DiffViewer';
import { SastPanel } from './components/SastPanel';
import { AgentMeshArena } from './components/AgentMeshArena';
import { ConsensusCard } from './components/ConsensusCard';
import { GitHubReviewDeliverable } from './components/GitHubReviewDeliverable';
import { MergeGateBox } from './components/MergeGateBox';
import { useSimulation } from './hooks/useSimulation';
import { SCENARIOS } from './mockData';
import type { Scenario } from './types';

export default function App() {
  const [scenario, setScenario] = useState<Scenario>('vulnerable');
  const { stage, simulate, reset } = useSimulation();

  const data = SCENARIOS[scenario];

  const handleScenarioChange = (s: Scenario) => {
    reset();
    setScenario(s);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <DashboardHeader
        scenario={scenario}
        onScenarioChange={handleScenarioChange}
        stage={stage}
        onSimulate={simulate}
        onReset={reset}
      />

      {/* Dynamic Key Performance Indicators Strip */}
      <MetricsStrip stage={stage} data={data} />

      {/* Stage Progress Rail */}
      <StageProgressRail stage={stage} />

      {/* Main 3-Column Workspace */}
      <main className="px-6 pb-8 flex-1">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── Column 1: Diff + SAST Pre-Filter ── */}
          <div className="flex flex-col gap-4">
            <SectionHeader
              step="01"
              title="Input Diff & Deterministic SAST"
              badge="Shift-Left Filter"
              badgeColor="amber"
            />
            <DiffViewer data={data} stage={stage} />
            <SastPanel data={data} stage={stage} />
          </div>

          {/* ── Column 2: Multi-Agent Parallel Mesh ── */}
          <div className="flex flex-col gap-4">
            <SectionHeader
              step="02"
              title="Parallel Agent Arena & Consensus"
              badge="LangGraph Mesh"
              badgeColor="violet"
            />
            <AgentMeshArena stage={stage} data={data} />
            <ConsensusCard stage={stage} data={data} />
          </div>

          {/* ── Column 3: Review Deliverable & Gate ── */}
          <div className="flex flex-col gap-4">
            <SectionHeader
              step="03"
              title="GitHub PR Review & Merge Gate"
              badge="CI/CD Quality Gate"
              badgeColor="blue"
            />
            <GitHubReviewDeliverable stage={stage} data={data} />
            <MergeGateBox stage={stage} data={data} />
          </div>
        </div>
      </main>

      {/* Clean Solid Footer */}
      <footer className="border-t border-slate-800 bg-[#0F172A] py-3.5 px-6 text-center text-xs text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">GUARDRAIL.AI</span>
            <span>—</span>
            <span>Multi-Agent AI Code Reviewer & CI/CD Guardrail</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>FastAPI HMAC Gateway</span>
            <span>•</span>
            <span>Tree-sitter AST</span>
            <span>•</span>
            <span>LangGraph Parallel Mesh</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% On-Premise Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Section Header (Solid & High Contrast) ── */

function SectionHeader({
  step,
  title,
  badge,
  badgeColor,
}: {
  step: string;
  title: string;
  badge: string;
  badgeColor: 'amber' | 'violet' | 'blue';
}) {
  const badgeStyles = {
    amber: 'bg-amber-950 text-amber-300 border-amber-700',
    violet: 'bg-purple-950 text-purple-300 border-purple-700',
    blue: 'bg-blue-950 text-blue-300 border-blue-700',
  }[badgeColor];

  return (
    <div className="flex items-center justify-between bg-[#0F172A] px-3.5 py-2 rounded-lg border border-slate-800">
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] font-bold flex items-center justify-center">
          {step}
        </span>
        <span className="text-xs font-bold text-white tracking-wide uppercase">
          {title}
        </span>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeStyles}`}>
        {badge}
      </span>
    </div>
  );
}

/* ── Stage Progress Rail (Solid & Clean) ── */

const STAGE_STEPS = [
  { key: 'INGESTING',      label: '1. Webhook Ingest',  color: '#0284C7' },
  { key: 'SAST_SCANNING',  label: '2. SAST Scan',       color: '#D97706' },
  { key: 'AGENT_DEBATING', label: '3. Agent Debate',    color: '#7C3AED' },
  { key: 'CONSENSUS',      label: '4. Consensus Arb',   color: '#0284C7' },
  { key: 'COMPLETED',      label: '5. Merge Gate',      color: '#059669' },
];

function StageProgressRail({ stage }: { stage: string }) {
  const currentIdx = STAGE_STEPS.findIndex(s => s.key === stage);

  return (
    <div className="px-6 pb-3">
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2 hidden md:block">
          Pipeline Status:
        </span>
        <div className="flex items-center flex-1">
          {STAGE_STEPS.map((step, i) => {
            const isDone = currentIdx > i;
            const isCurrent = currentIdx === i;

            return (
              <div key={step.key} className="flex items-center flex-1 min-w-0">
                {/* Status Dot */}
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 transition-colors duration-300 ${
                    isDone
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-blue-500 ring-4 ring-blue-900/60'
                      : 'bg-slate-700'
                  }`}
                />

                {/* Step Text */}
                <span
                  className={`mx-2 text-[11px] font-bold transition-colors whitespace-nowrap hidden lg:block ${
                    isDone
                      ? 'text-emerald-400'
                      : isCurrent
                      ? 'text-white font-extrabold'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>

                {/* Connector Line */}
                {i < STAGE_STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 bg-slate-800 relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-emerald-500"
                      initial={{ width: '0%' }}
                      animate={{ width: isDone ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
