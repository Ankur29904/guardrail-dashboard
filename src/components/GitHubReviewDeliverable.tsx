import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageSquare, CheckCircle2 } from 'lucide-react';
import type { SimulationStage, Scenario_Data } from '../types';

interface GitHubReviewDeliverableProps {
  stage: SimulationStage;
  data: Scenario_Data;
}

export function GitHubReviewDeliverable({ stage, data }: GitHubReviewDeliverableProps) {
  const isVisible = stage === 'COMPLETED';

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#111827]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            Automated PR Review Comment
          </span>
        </div>
        {isVisible && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> POSTED TO GITHUB
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isVisible ? (
          <div className="p-8 flex flex-col items-center justify-center gap-3 min-h-[220px] bg-[#070B14]">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
              <Bot className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 text-center font-mono">
              Awaiting consensus reducer to generate
              <br />
              consolidated GitHub PR Markdown report...
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-auto max-h-[380px] bg-[#070B14]"
          >
            {/* GitHub Bot Avatar Bar */}
            <div className="px-4 py-2 bg-[#0B1120] border-b border-slate-800 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">guardrail-ai</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.2 rounded font-mono font-semibold">
                  bot
                </span>
                <span className="text-[11px] text-slate-500">• left a review</span>
              </div>
            </div>

            {/* Comment Body */}
            <div className="p-4">
              <CommentBody comment={data.githubComment} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CommentBody({ comment }: { comment: string; isVulnerable?: boolean }) {
  const lines = comment.split('\n');

  return (
    <div className="font-mono text-xs space-y-1.5 leading-relaxed text-slate-200">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <div key={i} className="text-sm font-bold text-white mt-3 mb-1 font-sans">
              {line.replace('## ', '')}
            </div>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <div key={i} className="text-xs font-bold text-slate-200 mt-2.5 mb-1 font-sans">
              {line.replace('### ', '')}
            </div>
          );
        }
        if (line.startsWith('> ')) {
          return (
            <div key={i} className="border-l-2 border-slate-600 pl-3 text-slate-400 italic">
              {line.replace('> ', '')}
            </div>
          );
        }
        if (line.startsWith('|')) {
          const cells = line.split('|').filter((c) => c.trim() !== '');
          if (line.includes('---')) {
            return <div key={i} className="border-t border-slate-700 my-1" />;
          }
          return (
            <div
              key={i}
              className="grid gap-2 py-1 border-b border-slate-800/80 text-[11px]"
              style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}
            >
              {cells.map((cell, ci) => (
                <div
                  key={ci}
                  className={`${ci === 0 ? 'text-slate-200 font-semibold' : 'text-slate-300'}`}
                  dangerouslySetInnerHTML={{ __html: renderInline(cell.trim()) }}
                />
              ))}
            </div>
          );
        }
        if (line.startsWith('```')) {
          return (
            <div
              key={i}
              className={
                line === '```'
                  ? 'rounded-b-md mb-2'
                  : 'bg-[#0B1120] rounded-t-md px-3 pt-2 mt-2 border border-slate-800'
              }
            />
          );
        }
        if (line === '---') {
          return <hr key={i} className="border-slate-800 my-2" />;
        }
        if (line.trim() === '') {
          return <div key={i} className="h-1" />;
        }
        return (
          <div
            key={i}
            className="text-slate-300 text-[11px]"
            dangerouslySetInnerHTML={{ __html: renderInline(line) }}
          />
        );
      })}
    </div>
  );
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-[#1E293B] text-blue-300 px-1 py-0.2 rounded text-[11px] font-bold border border-slate-700">$1</code>')
    .replace(/🔴/g, '<span class="text-rose-400 font-bold">🔴</span>')
    .replace(/🟠/g, '<span class="text-amber-400 font-bold">🟠</span>')
    .replace(/🟡/g, '<span class="text-yellow-400 font-bold">🟡</span>')
    .replace(/✅/g, '<span class="text-emerald-400 font-bold">✅</span>');
}
