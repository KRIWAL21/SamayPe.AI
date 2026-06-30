import { NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/gemini';
import { getTasks } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const tasks = getTasks();
    const aiResponse = await chatWithAI(message, tasks);

    return NextResponse.json({ success: true, reply: aiResponse });
  } catch (error: any) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI chat response' }, { status: 500 });
  }
}
