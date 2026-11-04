import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageSquare, FileText } from 'lucide-react';
import type { SimulationStage, Scenario_Data } from '../types';

interface GitHubReviewDeliverableProps {
  stage: SimulationStage;
  data: Scenario_Data;
}

export function GitHubReviewDeliverable({ stage, data }: GitHubReviewDeliverableProps) {
  const isVisible = stage === 'COMPLETED';

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-sky-500/10 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="text-xs font-semibold text-white">Consolidated GitHub Comment</span>
        </div>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="badge-pill bg-green-500/10 text-green-400 border border-green-500/20"
          >
            ✓ POSTED
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isVisible ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-xs text-slate-600 text-center font-mono">
              Awaiting consensus to generate<br />GitHub PR comment…
            </p>
            {(stage === 'CONSENSUS') && (
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-sky-500/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="comment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-auto max-h-[420px]"
          >
            {/* GitHub-style comment card */}
            <div className="border-b border-white/[0.06] bg-black/20 px-4 py-2.5 flex items-center gap-3">
              {/* Bot avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">guardrail-ai[bot]</span>
                  <span className="badge-pill bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">bot</span>
                  <span className="text-[10px] text-slate-500">reviewed just now</span>
                </div>
              </div>
            </div>

            {/* Comment body */}
            <div className="px-4 py-4">
              <CommentBody
                comment={data.githubComment}
                isVulnerable={data.mergeStatus === 'blocked'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CommentBody({ comment }: { comment: string; isVulnerable?: boolean }) {
  // Parse the comment into sections with simple markdown-like rendering
  const lines = comment.split('\n');
  
  return (
    <div className="font-mono text-[11px] space-y-1 leading-relaxed">
      {lines.map((line, i) => {
        // H2
        if (line.startsWith('## ')) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="text-sm font-bold text-white mt-3 mb-1 font-sans"
            >
              {line.replace('## ', '')}
            </motion.div>
          );
        }
        // H3
        if (line.startsWith('### ')) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="text-xs font-bold text-slate-200 mt-2 font-sans"
            >
              {line.replace('### ', '')}
            </motion.div>
          );
        }
        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="border-l-2 border-slate-600 pl-3 text-slate-400 italic"
            >
              {line.replace('> ', '')}
            </motion.div>
          );
        }
        // Table row
        if (line.startsWith('|')) {
          const cells = line.split('|').filter(c => c.trim() !== '');
          if (line.includes('---')) {
            return <div key={i} className="border-t border-white/[0.06] my-1" />;
          }
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="grid gap-2 py-1 border-b border-white/[0.03]"
              style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}
            >
              {cells.map((cell, ci) => (
                <div
                  key={ci}
                  className={`${ci === 0 ? 'text-slate-300' : 'text-slate-400'} truncate`}
                  dangerouslySetInnerHTML={{ __html: renderInline(cell.trim()) }}
                />
              ))}
            </motion.div>
          );
        }
        // Code block
        if (line.startsWith('```')) {
          return (
            <div key={i} className={line === '```' ? 'rounded-b-md mb-2' : 'bg-black/40 rounded-t-md px-3 pt-2 mt-2 border border-white/[0.05]'} />
          );
        }
        // Horizontal rule
        if (line === '---') {
          return <hr key={i} className="border-white/[0.08] my-2" />;
        }
        // Empty line
        if (line.trim() === '') {
          return <div key={i} className="h-1" />;
        }
        // Regular line
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
            className="text-slate-300"
            dangerouslySetInnerHTML={{ __html: renderInline(line) }}
          />
        );
      })}
    </div>
  );
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-slate-800 text-cyan-300 px-1 rounded text-[10px]">$1</code>')
    .replace(/🔴/g, '<span class="text-rose-400">🔴</span>')
    .replace(/🟠/g, '<span class="text-orange-400">🟠</span>')
    .replace(/🟡/g, '<span class="text-yellow-400">🟡</span>')
    .replace(/✅/g, '<span class="text-emerald-400">✅</span>')
    .replace(/💡/g, '<span>💡</span>')
    .replace(/🛡️/g, '<span>🛡️</span>')
    .replace(/📊/g, '<span>📊</span>')
    .replace(/🤖/g, '<span>🤖</span>');
}

