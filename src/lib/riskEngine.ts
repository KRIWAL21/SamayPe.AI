import { Task, RiskLevel } from './types';

export interface RiskAssessment {
  score: number;       // 0.0 to 1.0+
  level: RiskLevel;
  recommendation: string;
  urgentInterventionRequired: boolean;
}

/**
 * Calculate deadline risk based on work remaining vs time remaining
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

  // Total uncompleted subtask minutes converted to hours
  const uncompletedSubtasks = task.subtasks || [];
  const workRemainingHours = uncompletedSubtasks
    .filter(st => !st.completed)
    .reduce((acc, st) => acc + (st.estimatedMinutes / 60), 0);

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
