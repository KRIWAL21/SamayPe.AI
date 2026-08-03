/**
 * Dependency-Aware Scheduling Algorithms for SamayPe.AI
 *
 * Three pure graph algorithms operating on SubTask dependency graphs:
 *
 * 1. Cycle Detection  — DFS three-colour marking              O(V+E)
 * 2. Topological Sort — Kahn's algorithm (in-degree + BFS)    O(V+E)
 * 3. Critical Path    — CPM forward + backward pass           O(V+E)
 *
 * All functions are pure (no I/O, no state) → easy to unit test.
 */

import { SubTask } from './types';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CPMSubTask extends SubTask {
  earliestStart: number;   // minutes from project start
  earliestFinish: number;
  latestStart: number;
  latestFinish: number;
  slack: number;           // 0 means on the critical path
  isCriticalPath: boolean;
}

// ── 1. Cycle Detection (DFS three-colour marking) ─────────────────────────────

type Color = 'WHITE' | 'GRAY' | 'BLACK';

/**
 * Detects cycles in the subtask dependency graph using DFS three-colour marking.
 *
 * Colour semantics:
 *   WHITE → not yet visited
 *   GRAY  → currently in the DFS stack (a back edge to GRAY = cycle)
 *   BLACK → fully explored
 *
 * @returns null if no cycle, or a human-readable description of the cycle edge.
 * Complexity: O(V + E)
 */
export function detectCycle(subtasks: SubTask[]): string | null {
  const color: Record<string, Color> = {};
  const parent: Record<string, string> = {};

  // Initialise all nodes as WHITE
  for (const st of subtasks) {
    color[st.id] = 'WHITE';
  }

  const idToTitle: Record<string, string> = {};
  for (const st of subtasks) idToTitle[st.id] = st.title;

  function dfs(nodeId: string): string | null {
    color[nodeId] = 'GRAY';

    const node = subtasks.find(st => st.id === nodeId);
    if (!node) return null;

    for (const depId of (node.dependsOn ?? [])) {
      if (!color[depId]) {
        // depId references an unknown subtask — safe to ignore
        continue;
      }
      if (color[depId] === 'GRAY') {
        // Back edge found → cycle
        const a = idToTitle[nodeId] ?? nodeId;
        const b = idToTitle[depId] ?? depId;
        return `Circular dependency: "${a}" → "${b}" forms a cycle`;
      }
      if (color[depId] === 'WHITE') {
        parent[depId] = nodeId;
        const result = dfs(depId);
        if (result) return result;
      }
    }

    color[nodeId] = 'BLACK';
    return null;
  }

  for (const st of subtasks) {
    if (color[st.id] === 'WHITE') {
      const result = dfs(st.id);
      if (result) return result;
    }
  }

  return null; // no cycle
}

// ── 2. Topological Sort (Kahn's Algorithm) ────────────────────────────────────

/**
 * Returns subtasks in a valid execution order (all dependencies before dependents).
 * Uses Kahn's algorithm: in-degree counting + BFS queue.
 *
 * Assumes no cycles (call detectCycle first).
 * Subtasks with no dependsOn are scheduled first.
 *
 * Complexity: O(V + E)
 */
export function topologicalSort(subtasks: SubTask[]): SubTask[] {
  if (subtasks.length === 0) return [];

  const idMap = new Map<string, SubTask>();
  for (const st of subtasks) idMap.set(st.id, st);

  // Build adjacency list (dependency → dependents that need it)
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>(); // node → list of nodes that depend on node

  for (const st of subtasks) {
    if (!inDegree.has(st.id)) inDegree.set(st.id, 0);
    if (!dependents.has(st.id)) dependents.set(st.id, []);

    for (const depId of (st.dependsOn ?? [])) {
      if (!idMap.has(depId)) continue; // skip unknown deps
      inDegree.set(st.id, (inDegree.get(st.id) ?? 0) + 1);
      if (!dependents.has(depId)) dependents.set(depId, []);
      dependents.get(depId)!.push(st.id);
    }
  }

  // Queue starts with all nodes that have in-degree 0
  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const sorted: SubTask[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = idMap.get(nodeId);
    if (node) sorted.push(node);

    for (const neighbourId of (dependents.get(nodeId) ?? [])) {
      const newDeg = (inDegree.get(neighbourId) ?? 1) - 1;
      inDegree.set(neighbourId, newDeg);
      if (newDeg === 0) queue.push(neighbourId);
    }
  }

  // If sorted.length < subtasks.length, graph has a cycle — return original order as safety fallback
  if (sorted.length < subtasks.length) return subtasks;

  return sorted;
}

// ── 3. Critical Path Method (CPM) ─────────────────────────────────────────────

/**
 * Computes the Critical Path for a set of subtasks.
 *
 * Algorithm:
 *   Forward pass: ES[i] = max(EF of all predecessors); EF[i] = ES[i] + duration[i]
 *   Backward pass: LF[i] = min(LS of all successors);  LS[i] = LF[i] - duration[i]
 *   Slack[i] = LS[i] - ES[i]  (0 → on critical path)
 *
 * @returns Annotated subtasks with CPM fields + isCriticalPath flag.
 * Complexity: O(V + E)
 */
export function computeCriticalPath(subtasks: SubTask[]): CPMSubTask[] {
  if (subtasks.length === 0) return [];

  // Work only on uncompleted subtasks for scheduling purposes
  const sorted = topologicalSort(subtasks);

  const idMap = new Map<string, SubTask>();
  for (const st of sorted) idMap.set(st.id, st);

  const es = new Map<string, number>(); // earliest start
  const ef = new Map<string, number>(); // earliest finish
  const ls = new Map<string, number>(); // latest start
  const lf = new Map<string, number>(); // latest finish

  // ── Forward pass ──
  for (const st of sorted) {
    let maxPredEF = 0;
    for (const depId of (st.dependsOn ?? [])) {
      const predEF = ef.get(depId) ?? 0;
      if (predEF > maxPredEF) maxPredEF = predEF;
    }
    const estStart = maxPredEF;
    es.set(st.id, estStart);
    ef.set(st.id, estStart + st.estimatedMinutes);
  }

  // Project duration = max EF across all tasks
  const projectDuration = Math.max(...Array.from(ef.values()), 0);

  // Build reverse adjacency (node → predecessors that depend on it i.e. successors)
  const successors = new Map<string, string[]>();
  for (const st of sorted) {
    if (!successors.has(st.id)) successors.set(st.id, []);
    for (const depId of (st.dependsOn ?? [])) {
      if (!successors.has(depId)) successors.set(depId, []);
      successors.get(depId)!.push(st.id);
    }
  }

  // ── Backward pass (reverse topological order) ──
  for (const st of [...sorted].reverse()) {
    const sucList = successors.get(st.id) ?? [];
    if (sucList.length === 0) {
      // Sink node (no successors) — LF = project duration
      lf.set(st.id, projectDuration);
    } else {
      const minSuccLS = Math.min(...sucList.map(sid => ls.get(sid) ?? projectDuration));
      lf.set(st.id, minSuccLS);
    }
    ls.set(st.id, (lf.get(st.id) ?? 0) - st.estimatedMinutes);
  }

  // ── Annotate ──
  return sorted.map(st => {
    const slack = (ls.get(st.id) ?? 0) - (es.get(st.id) ?? 0);
    return {
      ...st,
      earliestStart: es.get(st.id) ?? 0,
      earliestFinish: ef.get(st.id) ?? st.estimatedMinutes,
      latestStart: ls.get(st.id) ?? 0,
      latestFinish: lf.get(st.id) ?? st.estimatedMinutes,
      slack,
      isCriticalPath: slack === 0,
    } as CPMSubTask;
  });
}

// ── 4. Critical Path Duration (for Risk Engine) ───────────────────────────────

/**
 * Returns the minimum project completion time in MINUTES, accounting for parallelism.
 *
 * This is the true minimum — tasks on parallel branches run concurrently.
 * Compare to: sum of all minutes (serial assumption, always an overestimate).
 *
 * Complexity: O(V + E)
 */
export function getCriticalPathDuration(subtasks: SubTask[]): number {
  if (subtasks.length === 0) return 0;

  const uncompletedSubtasks = subtasks.filter(st => !st.completed);
  if (uncompletedSubtasks.length === 0) return 0;

  // If no subtask has a dependsOn field at all, fall back to serial sum (backward compat)
  const hasDepGraph = uncompletedSubtasks.some(st => st.dependsOn !== undefined);
  if (!hasDepGraph) {
    return uncompletedSubtasks.reduce((acc, st) => acc + st.estimatedMinutes, 0);
  }

  const annotated = computeCriticalPath(uncompletedSubtasks);
  return Math.max(...annotated.map(st => st.earliestFinish), 0);
}
