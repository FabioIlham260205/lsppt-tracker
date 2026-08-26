export const PHASES: Record<string, string[]> = {
  TS: ['Completed', 'Documentation', 'On Hold', 'In Progress', 'Plan'],
  QA: [
    'Completed',
    'Completed Testing',
    'Completed with Feedback',
    'Testing',
    'On Queue Testing',
    'Plan',
  ],
};

export type PhaseKey = keyof typeof PHASES;

export function isStatusValidForPhase(phase: string, status: string): boolean {
  const statuses = PHASES[phase];
  return Array.isArray(statuses) && statuses.includes(status);
}
