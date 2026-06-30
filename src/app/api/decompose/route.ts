import { NextResponse } from 'next/server';
import { decomposeTask } from '@/lib/gemini';
import { calculateRisk } from '@/lib/riskEngine';
import { addTask } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 });
    }

    // Decompose via Gemini Function Calling
    const decomposedTask = await decomposeTask(userInput);

    // Calculate initial risk
    const fullTask = {
      ...decomposedTask,
      id: `task-${Date.now()}`,
      status: 'TODO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as any;

    const risk = calculateRisk(fullTask);
    fullTask.riskScore = risk.score;
    fullTask.riskLevel = risk.level;
    fullTask.aiRecommendation = risk.recommendation;

    // Permanently save to storage
    addTask(fullTask);

    return NextResponse.json({ success: true, task: fullTask });
  } catch (error: any) {
    console.error('Task decomposition error:', error);
    return NextResponse.json({ error: error.message || 'Decomposition failed' }, { status: 500 });
  }
}
