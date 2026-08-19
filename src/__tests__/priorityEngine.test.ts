import { calculatePriorityScore, rankTasks } from '@/lib/priorityEngine';
import { Task, Priority, RiskLevel, TaskStatus } from '@/lib/types';

function makeTask(id: string, priority: Priority, hoursUntilDeadline: number, subtaskMins = 60): Task {
  return {
    id,
    userId: 'test-user',
    title: `Task ${id}`,
    description: '',
    deadline: new Date(Date.now() + hoursUntilDeadline * 60 * 60 * 1000).toISOString(),
    priority,
    status: TaskStatus.TODO,
    category: 'Test',
    subtasks: [{ id: 's1', title: 'Sub', estimatedMinutes: subtaskMins, completed: false }],
    riskScore: 0,
    riskLevel: RiskLevel.LOW,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe('priorityEngine.calculatePriorityScore', () => {
  it('returns -1 for completed tasks', () => {
    const task = makeTask('t1', Priority.URGENT, 5);
    task.status = TaskStatus.COMPLETED;
    expect(calculatePriorityScore(task)).toBe(-1);
  });

  it('URGENT priority scores higher than LOW priority with the same deadline', () => {
    const urgent = makeTask('t1', Priority.URGENT, 10);
    const low = makeTask('t2', Priority.LOW, 10);
    expect(calculatePriorityScore(urgent)).toBeGreaterThan(calculatePriorityScore(low));
  });

  it('tight deadline scores higher than far deadline with the same priority', () => {
    const nearDeadline = makeTask('t1', Priority.HIGH, 2);    // 2h away
    const farDeadline = makeTask('t2', Priority.HIGH, 200);   // 200h away
    expect(calculatePriorityScore(nearDeadline)).toBeGreaterThan(calculatePriorityScore(farDeadline));
  });

  it('returns a positive number for active tasks', () => {
    const task = makeTask('t1', Priority.MEDIUM, 24);
    expect(calculatePriorityScore(task)).toBeGreaterThan(0);
  });
});

describe('priorityEngine.rankTasks', () => {
  it('filters out completed tasks', () => {
    const active = makeTask('t1', Priority.HIGH, 10);
    const done = makeTask('t2', Priority.URGENT, 5);
    done.status = TaskStatus.COMPLETED;
    const ranked = rankTasks([active, done]);
    expect(ranked.map(t => t.id)).not.toContain('t2');
    expect(ranked.length).toBe(1);
  });

  it('returns tasks sorted by priority score descending', () => {
    const low = makeTask('low', Priority.LOW, 100);
    const urgent = makeTask('urgent', Priority.URGENT, 2);
    const med = makeTask('med', Priority.MEDIUM, 24);
    const ranked = rankTasks([low, med, urgent]);
    const scores = ranked.map(t => t.priorityScore);
    // Each score should be >= the next
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  });

  it('each ranked task has priorityScore and reasoning fields', () => {
    const task = makeTask('t1', Priority.HIGH, 10);
    const ranked = rankTasks([task]);
    expect(ranked[0]).toHaveProperty('priorityScore');
    expect(ranked[0]).toHaveProperty('reasoning');
    expect(typeof ranked[0].priorityScore).toBe('number');
    expect(typeof ranked[0].reasoning).toBe('string');
  });
});
