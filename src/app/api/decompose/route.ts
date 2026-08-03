import { NextResponse } from 'next/server';
import { decomposeTask } from '@/lib/gemini';
import { calculateRisk } from '@/lib/riskEngine';
import { addTask } from '@/lib/storage';
import { DecomposeSchema } from '@/lib/schemas';
import { logger, generateRequestId } from '@/lib/logger';

export async function POST(req: Request) {
  const requestId = generateRequestId();
  // userId comes from the JWT-verified header set by middleware — never from the request body
  const userId = req.headers.get('x-user-id') ?? 'demo-user';

  try {
    // ── Validate input with Zod ──────────────────────────────────────────────
    const body = await req.json();
    const parsed = DecomposeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { userInput } = parsed.data;

    logger.info('Decompose request received', { requestId, userId, route: '/api/decompose' });

    // ── Decompose via Gemini Function Calling ────────────────────────────────
    const decomposedTask = await decomposeTask(userInput);

    // ── Enrich with risk assessment ──────────────────────────────────────────
    const fullTask = {
      ...decomposedTask,
      id: `task-${Date.now()}`,
      userId, // sourced from verified JWT, not request body
      status: 'TODO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any;

    const risk = calculateRisk(fullTask);
    fullTask.riskScore = risk.score;
    fullTask.riskLevel = risk.level;
    fullTask.aiRecommendation = risk.recommendation;

    // ── Persist to MongoDB ───────────────────────────────────────────────────
    await addTask(fullTask);

    logger.info('Task decomposed and saved', {
      requestId,
      userId,
      taskId: fullTask.id,
      subtaskCount: fullTask.subtasks?.length ?? 0,
      route: '/api/decompose',
    });

    return NextResponse.json({ success: true, task: fullTask });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Decompose failed', { requestId, userId, error: msg, route: '/api/decompose' });
    return NextResponse.json({ error: msg || 'Decomposition failed' }, { status: 500 });
  }
}
