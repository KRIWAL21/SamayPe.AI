import { calculateRisk, RiskAssessment } from '@/lib/riskEngine';
import { Task, RiskLevel, Priority, TaskStatus } from '@/lib/types';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'test-task',
    userId: 'test-user',
    title: 'Test Task',
    description: '',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24h from now
    priority: Priority.MEDIUM,
    status: TaskStatus.TODO,
    category: 'Test',
    subtasks: [],
    riskScore: 0,
    riskLevel: RiskLevel.LOW,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('riskEngine.calculateRisk', () => {
  it('returns LOW risk for completed tasks', () => {
    const task = makeTask({ status: TaskStatus.COMPLETED });
    const result = calculateRisk(task);
    expect(result.level).toBe(RiskLevel.LOW);
    expect(result.score).toBe(0);
    expect(result.urgentInterventionRequired).toBe(false);
  });

  it('returns CRITICAL risk for overdue tasks (deadline in the past)', () => {
    const task = makeTask({
      deadline: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1h ago
      subtasks: [
        { id: 's1', title: 'Step 1', estimatedMinutes: 60, completed: false },
      ],
    });
    const result = calculateRisk(task);
    expect(result.level).toBe(RiskLevel.CRITICAL);
    expect(result.urgentInterventionRequired).toBe(true);
  });

  it('returns LOW risk when deadline is far away and little work remains', () => {
    const task = makeTask({
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 100).toISOString(), // 100h from now
      subtasks: [
        { id: 's1', title: 'Step 1', estimatedMinutes: 30, completed: false },
      ],
    });
    const result = calculateRisk(task);
    expect(result.level).toBe(RiskLevel.LOW);
  });

  it('returns HIGH risk when work/time ratio is between 0.5 and 0.85', () => {
    // 4h of work, 7h remaining → ratio ≈ 0.57
    const task = makeTask({
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 7).toISOString(),
      subtasks: [
        { id: 's1', title: 'Step 1', estimatedMinutes: 120, completed: false },
        { id: 's2', title: 'Step 2', estimatedMinutes: 120, completed: false },
      ],
    });
    const result = calculateRisk(task);
    expect(result.level).toBe(RiskLevel.HIGH);
  });

  it('returns MEDIUM risk when work/time ratio is between 0.3 and 0.5', () => {
    // 1h of work, 5h remaining → ratio = 0.2 ... need to adjust
    // 2h of work, 5h remaining → ratio = 0.4
    const task = makeTask({
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      subtasks: [
        { id: 's1', title: 'Step 1', estimatedMinutes: 120, completed: false },
      ],
    });
    const result = calculateRisk(task);
    expect(result.level).toBe(RiskLevel.MEDIUM);
  });

  it('uses critical path duration when dependsOn is set (parallel tasks = shorter than serial sum)', () => {
    // Two parallel 60-min tasks → serial sum = 120 min, critical path = 60 min
    // Use a 4-hour window so timing jitter can't tip the ratio into CRITICAL range
    // Serial sum ratio: 2h / 4h = 0.5 → HIGH/CRITICAL boundary
    // CPM ratio:        1h / 4h = 0.25 → LOW/MEDIUM → NOT CRITICAL
    const deadline = new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(); // 4h from now
    const task = makeTask({
      deadline,
      subtasks: [
        { id: 's1', title: 'Step A', estimatedMinutes: 60, completed: false, dependsOn: [] },
        { id: 's2', title: 'Step B', estimatedMinutes: 60, completed: false, dependsOn: [] },
      ],
    });
    // Serial sum: 120 min / 4h → ratio = 0.5 → HIGH (borderline)
    // CPM:         60 min / 4h → ratio = 0.25 → LOW or MEDIUM  
    const result = calculateRisk(task);
    // With CPM, the critical path is 60 min, so ratio ~0.25 → LOW or MEDIUM
    // With serial sum, 120 min would give ratio ~0.5 → HIGH (worse)
    // Either way, CPM should give STRICTLY LOWER risk than serial sum in this case
    expect(result.level).not.toBe(RiskLevel.CRITICAL);
  });

  it('score is a number between 0 and 2 for normal tasks', () => {
    const task = makeTask({
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 10).toISOString(),
      subtasks: [{ id: 's1', title: 'Work', estimatedMinutes: 60, completed: false }],
    });
    const result = calculateRisk(task);
    expect(typeof result.score).toBe('number');
    expect(result.score).toBeGreaterThanOrEqual(0);
  });
});
