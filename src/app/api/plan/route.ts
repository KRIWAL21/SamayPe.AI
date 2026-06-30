import { NextResponse } from 'next/server';
import { generateWeeklyPlanWithAI } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { categories = [], intensity = 'sprint' } = await req.json();

    if (!categories || categories.length === 0) {
      return NextResponse.json({ error: 'Categories required' }, { status: 400 });
    }

    const schedule = await generateWeeklyPlanWithAI(categories, intensity);

    return NextResponse.json({ success: true, schedule });
  } catch (error: any) {
    console.error('Plan generation error:', error);
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}
