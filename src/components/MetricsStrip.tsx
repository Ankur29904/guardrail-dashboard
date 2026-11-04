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
    if (!isCompleted) return { label: 'PENDING...', color: 'amber', pulse: true };
    if (data.mergeStatus === 'blocked') return { label: 'BLOCKED', sub: 'CHANGES REQUESTED', color: 'rose', pulse: false };
    return { label: 'APPROVED', sub: 'MERGE READY', color: 'emerald', pulse: false };
  };

  const merge = getMergeStatus();

  const cards = [
    {
      icon: Clock,
      label: 'Ingestion Latency',
      value: isActive ? data.ingestionLatency : '— ms',
      sub: 'Target <500ms · HTTP 202 ACK',
      color: 'cyan',
      glowClass: isActive ? 'border-cyan-500/30 glow-cyan' : '',
      active: isActive,
    },
    {
      icon: Coins,
      label: 'Shift-Left Token Savings',
      value: isActive ? data.tokenSavings : '—',
      sub: 'SAST Pre-Filter Token Reduction',
      color: 'amber',
      glowClass: stage === 'SAST_SCANNING' || isCompleted ? 'border-amber-500/30 glow-amber' : '',
      active: stage === 'SAST_SCANNING' || isCompleted,
    },
    {
      icon: Lock,
      label: 'Local Mesh Privacy',
      value: '100%',
      sub: 'On-Premise · Zero Cloud Data Egress',
      color: 'violet',
      glowClass: 'border-violet-500/20',
      active: true,
    },
    {
      icon: GitMerge,
      label: 'CI/CD Merge Gate',
      value: null,
      sub: null,
      color: merge.color,
      merge,
      glowClass: isCompleted
        ? merge.color === 'emerald'
          ? 'border-emerald-500/40 glow-emerald'
          : 'border-rose-500/40 glow-rose'
        : '',
      active: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 py-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className={`metric-card border ${card.glowClass || 'border-white/[0.07]'} transition-all duration-700`}
        >
          {/* Background shimmer when active */}
          {card.active && (
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className={`absolute -inset-1 opacity-5 bg-gradient-to-br ${colorGradient(card.color as string)}`} />
            </div>
          )}

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="section-label">{card.label}</span>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${iconBg(card.color as string)}`}>
                <card.icon className={`w-3.5 h-3.5 ${iconColor(card.color as string)}`} />
              </div>
            </div>

            {card.merge ? (
              <MergeStatusDisplay merge={card.merge} isCompleted={isCompleted} />
            ) : (
              <motion.div
                key={card.value}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-2xl font-bold font-mono ${valueColor(card.color as string)}`}
              >
                {card.value}
              </motion.div>
            )}

            {card.sub && (
              <p className="text-[10px] text-slate-600 mt-1 leading-tight">{card.sub}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MergeStatusDisplay({
  merge,
  isCompleted,
}: {
  merge: { label: string; sub?: string; color: string; pulse: boolean };
  isCompleted: boolean;
}) {
  const colorText: Record<string, string> = {
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    emerald: 'text-emerald-400',
  };
  const colorBadge: Record<string, string> = {
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  };

  return (
    <div className="flex flex-col gap-1">
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-bold tracking-wider w-fit ${colorBadge[merge.color]}`}>
        {merge.pulse && <span className={`w-1.5 h-1.5 rounded-full ${merge.color === 'amber' ? 'bg-amber-400' : ''} animate-pulse`} />}
        {merge.label}
      </div>
      {merge.sub && (
        <p className={`text-[10px] font-semibold tracking-widest ${colorText[merge.color]}`}>
          {merge.sub}
        </p>
      )}
      {!isCompleted && (
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-0.5 flex-1 rounded-full bg-amber-500/30 overflow-hidden"
            >
              <div
                className="h-full bg-amber-400/60 rounded-full"
                style={{
                  animation: `shimmer 1.5s ${i * 0.3}s ease-in-out infinite`,
                  width: '40%',
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function colorGradient(c: string) {
  const map: Record<string, string> = {
    cyan: 'from-cyan-500 to-blue-600',
    amber: 'from-amber-500 to-yellow-600',
    violet: 'from-violet-500 to-purple-600',
    rose: 'from-rose-500 to-red-600',
    emerald: 'from-emerald-500 to-green-600',
  };
  return map[c] || map.cyan;
}

function iconBg(c: string) {
  const map: Record<string, string> = {
    cyan: 'bg-cyan-500/10',
    amber: 'bg-amber-500/10',
    violet: 'bg-violet-500/10',
    rose: 'bg-rose-500/10',
    emerald: 'bg-emerald-500/10',
  };
  return map[c] || map.cyan;
}

function iconColor(c: string) {
  const map: Record<string, string> = {
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    violet: 'text-violet-400',
    rose: 'text-rose-400',
    emerald: 'text-emerald-400',
  };
  return map[c] || map.cyan;
}

function valueColor(c: string) {
  const map: Record<string, string> = {
    cyan: 'text-cyan-300 text-glow-cyan',
    amber: 'text-amber-300 text-glow-amber',
    violet: 'text-violet-300 text-glow-violet',
    rose: 'text-rose-300 text-glow-rose',
    emerald: 'text-emerald-300 text-glow-emerald',
  };
  return map[c] || map.cyan;
}

