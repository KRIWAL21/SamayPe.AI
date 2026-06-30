import { Task, Priority, RankedTask } from './types';

/**
 * Calculate dynamic AI priority score
 * Formula: (Urgency × 0.45) + (Importance × 0.35) + (Effort_Advantage × 0.20)
 */
export function calculatePriorityScore(task: Task): number {
  if (task.status === 'COMPLETED') return -1;

  const now = Date.now();
  const deadlineMs = new Date(task.deadline).getTime();
  const hoursLeft = Math.max(0.5, (deadlineMs - now) / (1000 * 60 * 60));

  // 1. Urgency (closer deadline = higher score)
  const urgencyScore = Math.min(100, (1 / hoursLeft) * 200);

  // 2. Importance weight
  const importanceWeights: Record<Priority, number> = {
    [Priority.URGENT]: 100,
    [Priority.HIGH]: 80,
    [Priority.MEDIUM]: 50,
    [Priority.LOW]: 20
  };
  const importanceScore = importanceWeights[task.priority] || 50;

  // 3. Effort Advantage (quick wins get a slight boost when overwhelmed)
  const totalMinutes = (task.subtasks || []).reduce((acc, st) => acc + (st.completed ? 0 : st.estimatedMinutes), 30);
  const effortScore = Math.max(10, 100 - (totalMinutes / 3));

  const compositeScore = (urgencyScore * 0.45) + (importanceScore * 0.35) + (effortScore * 0.20);
  return Number(compositeScore.toFixed(1));
}

/**
 * Rank a list of tasks intelligently
 */
export function rankTasks(tasks: Task[]): RankedTask[] {
  return tasks
    .filter(t => t.status !== 'COMPLETED')
    .map(task => {
      const score = calculatePriorityScore(task);
      let reasoning = 'Standard schedule priority';
      if (score > 80) reasoning = '🔥 Due very soon with high strategic value';
      else if (score > 60) reasoning = '⚡ Core project requiring consistent daily focus';
      else if (score < 30) reasoning = '💡 Low urgency, can be batched later';

      return {
        ...task,
        priorityScore: score,
        reasoning
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
