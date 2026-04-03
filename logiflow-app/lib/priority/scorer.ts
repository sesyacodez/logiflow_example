// Priority scoring algorithm: Score = (DemandRatio × PriorityMultiplier) + TimeSinceLastDelivery

export interface ScoringInput {
  demandRatio: number;
  priorityMultiplier: number; // 1 | 2 | 3
  timeSinceLastDelivery: number; // hours
}

export function calculateScore(data: ScoringInput): number {
  return (data.demandRatio * data.priorityMultiplier) + data.timeSinceLastDelivery;
}
