import { useState, useCallback, useRef } from 'react';
import type { SimulationStage } from '../types';

const DELAYS = [0, 500, 1500, 3500, 4500];
const STAGES: SimulationStage[] = ['INGESTING', 'SAST_SCANNING', 'AGENT_DEBATING', 'CONSENSUS', 'COMPLETED'];

export function useSimulation() {
  const [stage, setStage] = useState<SimulationStage>('IDLE');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const simulate = useCallback(() => {
    if (stage !== 'IDLE') return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    STAGES.forEach((s, i) => {
      const t = setTimeout(() => setStage(s), DELAYS[i]);
      timers.current.push(t);
    });
  }, [stage]);

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage('IDLE');
  }, []);

  return { stage, simulate, reset };
}
