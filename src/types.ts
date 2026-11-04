// Simulation state machine types
export type SimulationStage =
  | 'IDLE'
  | 'INGESTING'
  | 'SAST_SCANNING'
  | 'AGENT_DEBATING'
  | 'CONSENSUS'
  | 'COMPLETED';

export type Scenario = 'vulnerable' | 'clean';

export type AgentStatus = 'idle' | 'evaluating' | 'done' | 'skipped';

export interface AgentState {
  id: string;
  name: string;
  model: string;
  role: string;
  color: string;
  glowClass: string;
  borderClass: string;
  textClass: string;
  bgClass: string;
  status: AgentStatus;
  findings: string[];
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'pass';
  icon: string;
}

export interface DiffLine {
  type: 'added' | 'removed' | 'context' | 'header';
  lineNo?: number;
  content: string;
  isVulnerable?: boolean;
}

export interface SastFinding {
  tool: 'Semgrep' | 'Bandit' | 'Tree-sitter';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  cwe?: string;
  message: string;
  line?: number;
  rule?: string;
}

export interface Scenario_Data {
  prNumber: number;
  prTitle: string;
  prBranch: string;
  prAuthor: string;
  prFile: string;
  diffLines: DiffLine[];
  sastFindings: SastFinding[];
  astNodes: string[];
  agentFindings: Record<string, { findings: string[]; confidence: number; severity: AgentState['severity'] }>;
  consensusTrace: string[];
  githubComment: string;
  mergeStatus: 'blocked' | 'approved';
  tokenSavings: string;
  ingestionLatency: string;
}

