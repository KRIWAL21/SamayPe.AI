import { detectCycle, topologicalSort, computeCriticalPath, getCriticalPathDuration } from '@/lib/dependencyGraph';
import { SubTask } from '@/lib/types';

// stDep: creates a subtask WITH a dependsOn array (triggers CPM mode in getCriticalPathDuration)
function stDep(id: string, mins: number, dependsOn: string[] = []): SubTask {
  return { id, title: `Task ${id}`, estimatedMinutes: mins, completed: false, dependsOn };
}

// stNoDep: creates a subtask WITHOUT dependsOn (triggers serial-sum fallback)
function stNoDep(id: string, mins: number): SubTask {
  return { id, title: `Task ${id}`, estimatedMinutes: mins, completed: false };
}

// Default helper (with dependsOn, for graph tests)
function st(id: string, mins: number, dependsOn: string[] = []): SubTask {
  return stDep(id, mins, dependsOn);
}

// ── detectCycle ───────────────────────────────────────────────────────────────

describe('detectCycle', () => {
  it('returns null for a linear chain (no cycle)', () => {
    const tasks = [st('a', 30), st('b', 30, ['a']), st('c', 30, ['b'])];
    expect(detectCycle(tasks)).toBeNull();
  });

  it('returns null for independent tasks (no edges)', () => {
    const tasks = [st('a', 30), st('b', 45), st('c', 60)];
    expect(detectCycle(tasks)).toBeNull();
  });

  it('returns null for a diamond DAG (a → b, a → c, b → d, c → d)', () => {
    const tasks = [st('a', 10), st('b', 20, ['a']), st('c', 20, ['a']), st('d', 10, ['b', 'c'])];
    expect(detectCycle(tasks)).toBeNull();
  });

  it('detects a direct self-loop (a → a)', () => {
    const tasks = [st('a', 30, ['a'])];
    expect(detectCycle(tasks)).not.toBeNull();
  });

  it('detects a two-node cycle (a → b, b → a)', () => {
    const tasks = [st('a', 30, ['b']), st('b', 30, ['a'])];
    expect(detectCycle(tasks)).not.toBeNull();
  });

  it('detects a three-node cycle (a → b → c → a)', () => {
    const tasks = [st('a', 30, ['c']), st('b', 30, ['a']), st('c', 30, ['b'])];
    expect(detectCycle(tasks)).not.toBeNull();
  });

  it('returned string mentions the cycle nodes', () => {
    const tasks = [st('a', 30, ['b']), st('b', 30, ['a'])];
    const result = detectCycle(tasks);
    expect(result).toContain('Task a');
    expect(result).toContain('Task b');
  });
});

// ── topologicalSort ──────────────────────────────────────────────────────────

describe('topologicalSort', () => {
  it('returns empty array for empty input', () => {
    expect(topologicalSort([])).toEqual([]);
  });

  it('places dependencies before dependents in a linear chain', () => {
    const tasks = [st('c', 30, ['b']), st('b', 30, ['a']), st('a', 30)];
    const sorted = topologicalSort(tasks);
    const ids = sorted.map(t => t.id);
    expect(ids.indexOf('a')).toBeLessThan(ids.indexOf('b'));
    expect(ids.indexOf('b')).toBeLessThan(ids.indexOf('c'));
  });

  it('handles diamond DAG — a before b and c, both before d', () => {
    const tasks = [st('d', 10, ['b', 'c']), st('b', 20, ['a']), st('c', 20, ['a']), st('a', 10)];
    const sorted = topologicalSort(tasks);
    const ids = sorted.map(t => t.id);
    expect(ids.indexOf('a')).toBeLessThan(ids.indexOf('b'));
    expect(ids.indexOf('a')).toBeLessThan(ids.indexOf('c'));
    expect(ids.indexOf('b')).toBeLessThan(ids.indexOf('d'));
    expect(ids.indexOf('c')).toBeLessThan(ids.indexOf('d'));
  });

  it('handles tasks with no dependencies (any order is valid)', () => {
    const tasks = [st('x', 10), st('y', 20), st('z', 15)];
    const sorted = topologicalSort(tasks);
    expect(sorted.length).toBe(3);
  });
});

// ── computeCriticalPath ──────────────────────────────────────────────────────

describe('computeCriticalPath', () => {
  it('returns empty array for empty input', () => {
    expect(computeCriticalPath([])).toEqual([]);
  });

  it('marks the only task as critical path for a single task', () => {
    const tasks = [st('a', 60)];
    const result = computeCriticalPath(tasks);
    expect(result[0].isCriticalPath).toBe(true);
    expect(result[0].earliestStart).toBe(0);
    expect(result[0].earliestFinish).toBe(60);
  });

  it('linear chain: all tasks on critical path', () => {
    const tasks = [st('a', 30), st('b', 60, ['a']), st('c', 30, ['b'])];
    const result = computeCriticalPath(tasks);
    expect(result.every(t => t.isCriticalPath)).toBe(true);
  });

  it('parallel branches: only longer path is critical', () => {
    // a (30min) → c
    // b (60min) → c
    // c (20min)
    // Critical path: b → c = 80min
    // a → c = 50min → NOT critical (slack = 30)
    const tasks = [st('a', 30), st('b', 60), st('c', 20, ['a', 'b'])];
    const result = computeCriticalPath(tasks);
    const byId = Object.fromEntries(result.map(t => [t.id, t]));

    expect(byId['b'].isCriticalPath).toBe(true);
    expect(byId['c'].isCriticalPath).toBe(true);
    expect(byId['a'].isCriticalPath).toBe(false);
    expect(byId['a'].slack).toBeGreaterThan(0);
  });

  it('annotates all tasks with CPM fields', () => {
    const tasks = [st('a', 30), st('b', 45, ['a'])];
    const result = computeCriticalPath(tasks);
    for (const t of result) {
      expect(typeof t.earliestStart).toBe('number');
      expect(typeof t.earliestFinish).toBe('number');
      expect(typeof t.latestStart).toBe('number');
      expect(typeof t.latestFinish).toBe('number');
      expect(typeof t.slack).toBe('number');
      expect(typeof t.isCriticalPath).toBe('boolean');
    }
  });
});

// ── getCriticalPathDuration ──────────────────────────────────────────────────

describe('getCriticalPathDuration', () => {
  it('returns 0 for empty input', () => {
    expect(getCriticalPathDuration([])).toBe(0);
  });

  it('returns 0 when all subtasks are completed', () => {
    const tasks = [{ ...st('a', 60), completed: true }];
    expect(getCriticalPathDuration(tasks)).toBe(0);
  });

  it('returns serial sum when no dependsOn edges are set', () => {
    // Backward compat: subtasks have no dependsOn field at all → serial sum
    const tasks = [stNoDep('a', 60), stNoDep('b', 45), stNoDep('c', 30)];
    expect(getCriticalPathDuration(tasks)).toBe(135);
  });

  it('returns critical path length (NOT serial sum) when deps are defined', () => {
    // Two parallel 60-min tasks → critical path = 60, not 120
    const tasks = [st('a', 60, []), st('b', 60, [])];
    // Has dependsOn arrays → CPM mode
    // Both tasks have ES=0, EF=60 → project duration = 60
    expect(getCriticalPathDuration(tasks)).toBe(60);
  });

  it('sequential chain: duration equals sum', () => {
    const tasks = [st('a', 30), st('b', 45, ['a'])];
    expect(getCriticalPathDuration(tasks)).toBe(75);
  });

  it('CPM is always ≤ serial sum (accounting for parallelism)', () => {
    const tasks = [st('a', 60, []), st('b', 45, []), st('c', 30, [])];
    const cpm = getCriticalPathDuration(tasks);
    const serial = tasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
    expect(cpm).toBeLessThanOrEqual(serial);
  });
});
