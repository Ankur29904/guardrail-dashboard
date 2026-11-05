import { motion } from 'framer-motion';
import { Clock, Coins, Lock, GitMerge } from 'lucide-react';
import type { SimulationStage, Scenario_Data } from '../types';

interface MetricsStripProps {
  stage: SimulationStage;
  data: Scenario_Data;
}

export function MetricsStrip({ stage, data }: MetricsStripProps) {
  const isActive = stage !== 'IDLE';
  const isCompleted = stage === 'COMPLETED';

  const getMergeStatus = () => {
    if (!isCompleted) return { label: 'PENDING AUDIT', sub: 'Pipeline in evaluation', color: 'amber' };
    if (data.mergeStatus === 'blocked') return { label: 'BLOCKED', sub: 'Changes Requested', color: 'rose' };
    return { label: 'APPROVED', sub: 'Ready to Merge', color: 'emerald' };
  };

  const merge = getMergeStatus();

  const cards = [
    {
      icon: Clock,
      label: 'Ingestion Latency',
      value: isActive ? data.ingestionLatency : '184 ms',
      sub: 'Target <500ms · HTTP 202 Non-Blocking',
      badge: 'FastAPI HMAC',
      accentColor: 'text-blue-400',
      badgeBg: 'bg-blue-950 text-blue-300 border-blue-800',
    },
    {
      icon: Coins,
      label: 'Shift-Left Token Savings',
      value: isActive ? data.tokenSavings : '73.4%',
      sub: 'Prompt Token Overhead Reduction',
      badge: 'Tree-sitter AST',
      accentColor: 'text-amber-400',
      badgeBg: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      icon: Lock,
      label: 'Local Mesh Privacy',
      value: '100%',
      sub: 'Zero Cloud Data Egress · On-Premise',
      badge: 'Zero Egress',
      accentColor: 'text-purple-400',
      badgeBg: 'bg-purple-950 text-purple-300 border-purple-800',
    },
    {
      icon: GitMerge,
      label: 'CI/CD Merge Gate',
      value: null,
      sub: null,
      isMerge: true,
      merge,
      badge: 'GitHub Gate',
      accentColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 px-6 py-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.25 }}
          className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              {card.label}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${card.badgeBg}`}>
              {card.badge}
            </span>
          </div>

          {card.isMerge && card.merge ? (
            <div className="my-1">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-bold tracking-wider ${
                  card.merge.color === 'rose'
                    ? 'bg-rose-950 text-rose-300 border-rose-700'
                    : card.merge.color === 'emerald'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}
              >
                {card.merge.color === 'amber' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
                {card.merge.color === 'rose' && <span>⛔</span>}
                {card.merge.color === 'emerald' && <span>✓</span>}
                <span>{card.merge.label}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                {card.merge.sub}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {card.value}
              </div>
              {card.sub && (
                <p className="text-[11px] text-slate-400 mt-1 font-medium leading-tight">
                  {card.sub}
                </p>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
