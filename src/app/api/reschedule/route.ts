import { NextResponse } from 'next/server';
import { getTasks, updateTask } from '@/lib/storage';
import { rescheduleTaskWithAI } from '@/lib/gemini';
import { calculateRisk } from '@/lib/riskEngine';

export async function POST(req: Request) {
  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const tasks = getTasks();
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

    updateTask(updatedTask);

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error: any) {
    console.error('Reschedule error:', error);
    return NextResponse.json({ error: 'Failed to reschedule task' }, { status: 500 });
  }
}
