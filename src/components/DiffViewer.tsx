import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, GitPullRequest } from 'lucide-react';
import type { DiffLine, Scenario_Data, SimulationStage } from '../types';

interface DiffViewerProps {
  data: Scenario_Data;
  stage: SimulationStage;
}

export function DiffViewer({ data, stage }: DiffViewerProps) {
  const isActive = stage !== 'IDLE';

  return (
    <div className="glass-panel overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/10 flex items-center justify-center">
            <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white">Incoming Pull Request</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="section-label">
                PR #{data.prNumber}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[10px] text-slate-500 font-mono">{data.prBranch}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-pill bg-slate-800 text-slate-400 border border-slate-700">
            by {data.prAuthor}
          </span>
        </div>
      </div>

      {/* File tab bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-black/20 border-b border-white/[0.04]">
        <FileCode className="w-3 h-3 text-amber-400" />
        <span className="font-mono text-[11px] text-amber-300">{data.prFile}</span>
        <span className="ml-auto badge-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          +{data.diffLines.filter(l => l.type === 'added').length}
        </span>
        <span className="badge-pill bg-rose-500/10 text-rose-400 border border-rose-500/20">
          -{data.diffLines.filter(l => l.type === 'removed').length}
        </span>
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-auto font-mono text-[11px] leading-relaxed">
        <AnimatePresence>
          {data.diffLines.map((line, i) => (
            <DiffLineRow key={`${line.lineNo}-${i}`} line={line} index={i} isActive={isActive} />
          ))}
        </AnimatePresence>
      </div>

      {/* Webhook ingestion pulse overlay */}
      <AnimatePresence>
        {stage === 'INGESTING' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top left, rgba(6,182,212,0.08) 0%, transparent 70%)',
              boxShadow: 'inset 0 0 40px rgba(6,182,212,0.1)',
            }}
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs text-cyan-300 font-mono font-semibold">HMAC-SHA256 Validated · HTTP 202</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DiffLineRow({ line, index, isActive }: { line: DiffLine; index: number; isActive: boolean }) {
  if (line.type === 'header') {
    return (
      <div className="flex items-center px-4 py-1.5 bg-indigo-500/5 border-y border-indigo-500/10">
        <span className="text-indigo-400/70 select-none mr-2">···</span>
        <span className="text-slate-500">{line.content}</span>
      </div>
    );
  }

  const bgClass = {
    added: 'diff-added',
    removed: 'diff-removed',
    context: 'diff-context',
  }[line.type] ?? 'diff-context';

  const prefix = {
    added: '+',
    removed: '-',
    context: ' ',
  }[line.type] ?? ' ';

  return (
    <motion.div
      initial={isActive ? { opacity: 0, x: -4 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.015, duration: 0.2 }}
      className={`flex group relative ${bgClass}`}
    >
      {/* Line number */}
      <div className="select-none w-10 text-right pr-3 py-0.5 text-slate-700 text-[10px] flex-shrink-0 border-r border-white/[0.04]">
        {line.lineNo || ''}
      </div>

      {/* Prefix */}
      <div className={`select-none w-5 text-center py-0.5 flex-shrink-0 font-bold
        ${line.type === 'added' ? 'text-emerald-500' : line.type === 'removed' ? 'text-rose-500' : 'text-slate-700'}`}>
        {prefix}
      </div>

      {/* Content */}
      <div className={`flex-1 py-0.5 px-1 ${line.isVulnerable ? 'vuln-underline' : ''}`}>
        {line.content.replace(/^[+-]/, '')}
        {line.isVulnerable && (
          <span className="ml-2 badge-pill bg-rose-500/15 text-rose-400 border border-rose-500/20 align-middle">
            ⚠ VULN
          </span>
        )}
      </div>
    </motion.div>
  );
}

