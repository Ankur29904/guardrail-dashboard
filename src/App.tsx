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
    <div className="min-h-screen relative">
      {/* Atmospheric background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
          style={{ background: '#4f46e5', top: '-10%', left: '-5%' }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px]"
          style={{ background: '#06b6d4', top: '20%', right: '-5%' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[120px]"
          style={{ background: '#f43f5e', bottom: '10%', left: '30%' }}
        />
      </div>

      {/* Header */}
      <DashboardHeader
        scenario={scenario}
        onScenarioChange={handleScenarioChange}
        stage={stage}
        onSimulate={simulate}
        onReset={reset}
      />

      {/* Metrics strip */}
      <MetricsStrip stage={stage} data={data} />

      {/* Stage progress rail */}
      <StageProgressRail stage={stage} />

      {/* Main workspace */}
      <main className="px-6 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* ── Column 1: Diff + SAST ── */}
          <div className="flex flex-col gap-4">
            <SectionLabel label="Input & Deterministic Pre-Filter" color="amber" />
            <DiffViewer data={data} stage={stage} />
            <SastPanel data={data} stage={stage} />
          </div>

          {/* ── Column 2: Agent mesh + Consensus ── */}
          <div className="flex flex-col gap-4">
            <SectionLabel label="Multi-Agent Orchestration Arena" color="violet" />
            <AgentMeshArena stage={stage} data={data} />
            <ConsensusCard stage={stage} data={data} />
          </div>

          {/* ── Column 3: Review deliverable + Merge gate ── */}
          <div className="flex flex-col gap-4">
            <SectionLabel label="Review Deliverable & CI/CD Gate" color="sky" />
            <GitHubReviewDeliverable stage={stage} data={data} />
            <MergeGateBox stage={stage} data={data} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pb-6 text-[10px] text-slate-700 tracking-widest font-mono">
        GUARDRAIL.AI · Multi-Agent PR Auditor · LangGraph v0.2 · Capstone 2026
      </footer>
    </div>
  );
}

/* ── Helpers ── */

function SectionLabel({ label, color }: { label: string; color: 'amber' | 'violet' | 'sky' }) {
  const colorMap = {
    amber: 'text-amber-500 border-amber-500/30 bg-amber-500/5',
    violet: 'text-violet-400 border-violet-500/30 bg-violet-500/5',
    sky: 'text-sky-400 border-sky-500/30 bg-sky-500/5',
  };
  return (
    <div className={`inline-flex self-start items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase ${colorMap[color]}`}>
      <span className="w-1 h-1 rounded-full bg-current opacity-70" />
      {label}
    </div>
  );
}

const STAGE_STEPS = [
  { key: 'INGESTING',      label: 'Webhook Ingest',  color: 'bg-cyan-400' },
  { key: 'SAST_SCANNING',  label: 'SAST Pre-Filter', color: 'bg-amber-400' },
  { key: 'AGENT_DEBATING', label: 'Agent Debate',    color: 'bg-violet-400' },
  { key: 'CONSENSUS',      label: 'Consensus',       color: 'bg-sky-400' },
  { key: 'COMPLETED',      label: 'Gate Decision',   color: 'bg-emerald-400' },
];

function StageProgressRail({ stage }: { stage: string }) {
  const currentIdx = STAGE_STEPS.findIndex(s => s.key === stage);

  return (
    <div className="px-6 pb-3">
      <div className="glass-panel-sm px-5 py-2.5 flex items-center">
        {STAGE_STEPS.map((step, i) => {
          const done = currentIdx > i;
          const active = currentIdx === i;

          return (
            <div key={step.key} className="flex items-center flex-1 min-w-0">
              {/* Dot */}
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-500 ${
                done   ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
                active ? `${step.color} animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.3)]` :
                         'bg-slate-700'
              }`} />

              {/* Label (hidden on mobile) */}
              <span className={`mx-2 text-[9px] font-bold tracking-wider uppercase transition-colors duration-300 whitespace-nowrap hidden sm:block ${
                done   ? 'text-emerald-400' :
                active ? 'text-white' :
                         'text-slate-600'
              }`}>
                {active && '▶ '}{step.label}
              </span>

              {/* Connector */}
              {i < STAGE_STEPS.length - 1 && (
                <div className="flex-1 h-px mx-1 relative overflow-hidden min-w-[12px] bg-slate-800">
                  <motion.div
                    className={`absolute inset-y-0 left-0 ${done ? 'bg-emerald-400/50' : 'bg-transparent'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
