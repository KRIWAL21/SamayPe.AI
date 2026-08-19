import { Task, RiskLevel } from './types';
import { getCriticalPathDuration } from './dependencyGraph';

export interface RiskAssessment {
  score: number;       // 0.0 to 1.0+
  level: RiskLevel;
  recommendation: string;
  urgentInterventionRequired: boolean;
}

/**
 * Calculate deadline risk based on work remaining vs time remaining.
 *
 * When subtasks have dependency edges (dependsOn), uses the Critical Path Method
 * duration — which accounts for parallelism and gives a more accurate risk signal
 * than summing all subtask hours serially.
 */
export function calculateRisk(task: Task): RiskAssessment {
  if (task.status === 'COMPLETED') {
    return {
      score: 0,
      level: RiskLevel.LOW,
      recommendation: 'Task completed! Keep up the momentum.',
      urgentInterventionRequired: false
    };
  }

  const now = Date.now();
  const deadlineMs = new Date(task.deadline).getTime();
  const timeRemainingHours = Math.max(0.1, (deadlineMs - now) / (1000 * 60 * 60));

  // Use Critical Path duration when dependency graph is available;
  // fall back to serial sum when no dependencies are defined (backward compat).
  const uncompletedSubtasks = (task.subtasks || []).filter(st => !st.completed);
  const criticalPathMinutes = getCriticalPathDuration(uncompletedSubtasks);
  const workRemainingHours = criticalPathMinutes / 60;

  // If there are no subtasks, estimate based on priority
  const effectiveWorkHours = workRemainingHours > 0 ? workRemainingHours : 2.0;

  // Ratio of work required vs hours left
  const ratio = effectiveWorkHours / timeRemainingHours;

  let level = RiskLevel.LOW;
  let recommendation = 'You are comfortably on schedule. Steady pace recommended.';
  let urgentInterventionRequired = false;

  if (timeRemainingHours <= 0) {
    level = RiskLevel.CRITICAL;
    recommendation = '🚨 OVERDUE: Immediate action required. AI is ready to draft an extension request.';
    urgentInterventionRequired = true;
  } else if (ratio >= 0.85 || timeRemainingHours < 3) {
    level = RiskLevel.CRITICAL;
    recommendation = `🔥 CRITICAL RISK: You need ${effectiveWorkHours.toFixed(1)}h of work but only have ${timeRemainingHours.toFixed(1)}h left. Drop non-essentials or trigger autonomous rescheduling.`;
    urgentInterventionRequired = true;
  } else if (ratio >= 0.5) {
    level = RiskLevel.HIGH;
    recommendation = `⚠️ HIGH RISK: Tight timeline detected. We suggest blocking 2 uninterrupted deep-work sessions today.`;
  } else if (ratio >= 0.3) {
    level = RiskLevel.MEDIUM;
    recommendation = `⏳ MEDIUM RISK: On track, but avoid procrastination. Complete at least 1 subtask today.`;
  }

  return {
    score: Number(ratio.toFixed(2)),
    level,
    recommendation,
    urgentInterventionRequired
  };
}
