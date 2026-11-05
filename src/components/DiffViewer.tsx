import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, GitPullRequest, AlertTriangle } from 'lucide-react';
import type { DiffLine, Scenario_Data, SimulationStage } from '../types';

interface DiffViewerProps {
  data: Scenario_Data;
  stage: SimulationStage;
}

export function DiffViewer({ data, stage }: DiffViewerProps) {
  const isActive = stage !== 'IDLE';

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-sm">
      {/* Diff Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#111827]">
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white">Payload Diff</span>
          <span className="text-slate-500">•</span>
          <span className="text-xs font-mono text-slate-300">PR #{data.prNumber}</span>
          <span className="text-slate-500">•</span>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            {data.prBranch}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Author: <strong className="text-slate-200 font-semibold">{data.prAuthor}</strong>
        </span>
      </div>

      {/* File Path Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0B1120] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-xs text-amber-300 font-bold">{data.prFile}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
            +{data.diffLines.filter((l) => l.type === 'added').length}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
            -{data.diffLines.filter((l) => l.type === 'removed').length}
          </span>
        </div>
      </div>

      {/* Ingestion Status Banner */}
      <AnimatePresence>
        {stage === 'INGESTING' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-950 border-b border-blue-800 px-4 py-2 flex items-center gap-2 text-xs text-blue-200 font-mono font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Webhook Verified: HMAC-SHA256 Match • HTTP 202 Ingestion ACK</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diff Code Window */}
      <div className="overflow-auto max-h-[360px] bg-[#070B14] font-mono text-xs leading-relaxed">
        {data.diffLines.map((line, i) => (
          <DiffRow key={`${line.lineNo}-${i}`} line={line} index={i} isActive={isActive} />
        ))}
      </div>
    </div>
  );
}

function DiffRow({ line }: { line: DiffLine; index: number; isActive: boolean }) {
  if (line.type === 'header') {
    return (
      <div className="flex items-center px-4 py-1.5 bg-slate-900 border-y border-slate-800 text-slate-400 text-[11px] select-none">
        <span className="text-blue-400 font-bold mr-2">@@</span>
        <span>{line.content}</span>
      </div>
    );
  }

  const isVuln = Boolean(line.isVulnerable);

  const styleMap = {
    added: isVuln
      ? 'bg-rose-950/60 border-l-4 border-rose-500 text-rose-200'
      : 'bg-emerald-950/30 border-l-4 border-emerald-500 text-emerald-200',
    removed: 'bg-rose-950/30 border-l-4 border-rose-600 text-rose-300 line-through opacity-75',
    context: 'text-slate-400 border-l-4 border-transparent hover:bg-slate-900/50',
  }[line.type] || 'text-slate-400';

  const prefix = {
    added: '+',
    removed: '-',
    context: ' ',
  }[line.type] || ' ';

  return (
    <div className={`flex items-start group font-mono text-[11px] ${styleMap}`}>
      {/* Line Number */}
      <div className="w-10 text-right pr-3 py-0.5 text-slate-600 select-none bg-[#0B1120] border-r border-slate-800 flex-shrink-0 text-[10px]">
        {line.lineNo || ''}
      </div>

      {/* Prefix */}
      <div className="w-6 text-center py-0.5 select-none font-bold text-slate-400 flex-shrink-0">
        {prefix}
      </div>

      {/* Code Text */}
      <div className="flex-1 py-0.5 px-1 whitespace-pre-wrap break-all flex items-center justify-between">
        <span>{line.content.replace(/^[+-]/, '')}</span>
        {isVuln && (
          <span className="ml-2 inline-flex items-center gap-1 bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm flex-shrink-0">
            <AlertTriangle className="w-3 h-3" />
            CWE VULNERABILITY
          </span>
        )}
      </div>
    </div>
  );
}
