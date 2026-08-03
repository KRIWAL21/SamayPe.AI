import { NextResponse } from 'next/server';
import { getTasks, updateTask } from '@/lib/storage';
import { rescheduleTaskWithAI } from '@/lib/gemini';
import { calculateRisk } from '@/lib/riskEngine';
import { logger, generateRequestId } from '@/lib/logger';

export async function POST(req: Request) {
  const requestId = generateRequestId();
  const userId = req.headers.get('x-user-id') ?? 'demo-user';

  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const tasks = await getTasks(userId);
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Call Gemini 2.5 Flash to reschedule
    const { recommendation, newDeadline } = await rescheduleTaskWithAI(task);

    const updatedTask = {
      ...task,
      deadline: newDeadline,
      aiRecommendation: recommendation,
      updatedAt: new Date().toISOString()
    };

    // Recalculate risk with new deadline
    const risk = calculateRisk(updatedTask);
    updatedTask.riskScore = risk.score;
    updatedTask.riskLevel = risk.level;

    await updateTask(updatedTask);

    logger.info('Task rescheduled', { requestId, userId, taskId, route: '/api/reschedule' });
    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Reschedule error', { requestId, userId, error: msg, route: '/api/reschedule' });
    return NextResponse.json({ error: 'Failed to reschedule task' }, { status: 500 });
  }
}
