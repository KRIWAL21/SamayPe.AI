import { NextResponse } from 'next/server';
import { getTasks, addTask, updateTask, deleteTask } from '@/lib/storage';
import { CreateTaskSchema, UpdateTaskSchema } from '@/lib/schemas';
import { detectCycle } from '@/lib/dependencyGraph';
import { logger, generateRequestId } from '@/lib/logger';

/** Extract the verified userId injected by middleware. Falls back to demo-user only in dev. */
function getUserId(req: Request): string {
  const uid = req.headers.get('x-user-id');
  if (uid) return uid;
  // Should never reach here in production (middleware blocks unauthenticated requests)
  return 'demo-user';
}

export async function GET(req: Request) {
  const requestId = generateRequestId();
  const userId = getUserId(req);
  const start = Date.now();

  try {
    const tasks = await getTasks(userId);
    logger.info('GET /api/tasks', { requestId, userId, latencyMs: Date.now() - start, count: tasks.length });
    return NextResponse.json({ success: true, tasks });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('GET /api/tasks failed', { requestId, userId, error: msg });
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const requestId = generateRequestId();
  const userId = getUserId(req);

  try {
    const body = await req.json();

    // ── Validate with Zod ────────────────────────────────────────────────────
    const parsed = CreateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // ── Cycle detection if subtasks have dependencies ────────────────────────
    if (data.subtasks && data.subtasks.length > 0) {
      const subtasksForCheck = data.subtasks.map(st => ({
        ...st,
        id: st.id ?? `sub-${Date.now()}-${Math.random()}`,
        completed: st.completed ?? false,
      }));
      const cycleError = detectCycle(subtasksForCheck as any);
      if (cycleError) {
        return NextResponse.json({ error: cycleError }, { status: 422 });
      }
    }

    // ── Build the task — always use verified userId from JWT ─────────────────
    const newTask = {
      ...data,
      id: data.id || `task-${Date.now()}`,
      userId, // overwrite any client-supplied userId
      subtasks: (data.subtasks ?? []).map((st, idx) => ({
        ...st,
        id: st.id || `sub-${Date.now()}-${idx}`,
        completed: st.completed ?? false,
      })),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addTask(newTask as any);

    logger.info('POST /api/tasks', { requestId, userId, taskId: newTask.id });
    return NextResponse.json({ success: true, task: newTask });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('POST /api/tasks failed', { requestId, userId, error: msg });
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const requestId = generateRequestId();
  const userId = getUserId(req);

  try {
    const body = await req.json();

    // ── Validate with Zod ────────────────────────────────────────────────────
    const parsed = UpdateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // ── Cycle detection on update ────────────────────────────────────────────
    if (data.subtasks && data.subtasks.length > 0) {
      const cycleError = detectCycle(data.subtasks as any);
      if (cycleError) {
        return NextResponse.json({ error: cycleError }, { status: 422 });
      }
    }

    const updated = await updateTask({
      ...data,
      userId, // ensure ownership
      updatedAt: new Date().toISOString(),
    } as any);

    logger.info('PUT /api/tasks', { requestId, userId, taskId: data.id });
    return NextResponse.json({ success: true, task: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('PUT /api/tasks failed', { requestId, userId, error: msg });
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const requestId = generateRequestId();
  const userId = getUserId(req);

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    await deleteTask(id);

    logger.info('DELETE /api/tasks', { requestId, userId, taskId: id });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('DELETE /api/tasks failed', { requestId, userId, error: msg });
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
